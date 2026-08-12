"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCursorVisibility } from "./CursorVisibility";
import {
  usePlateGeometry,
  usePlateMaterials,
  usePlatePhotoTexture,
} from "./three/plate";

// Escala a velocidade medida do mouse (px/ms) para radianos/segundo de giro.
const SPIN_SCALE = 3.2;
const MAX_SPIN_SPEED = 10;

function IronPlate({ velocityRef }: { velocityRef: { current: number } }) {
  const ref = useRef<THREE.Mesh>(null);
  const spinSpeed = useRef(0);
  const geometry = usePlateGeometry();
  const faceTexture = usePlatePhotoTexture("/textures/plate-5kg.png");

  useFrame((_, delta) => {
    if (!ref.current) return;
    // a velocidade medida decai com o tempo quando não há novos movimentos —
    // é isso que dá a sensação de desaceleração/inércia ao soltar o mouse.
    velocityRef.current *= Math.max(0, 1 - delta * 3.5);
    const targetSpin = Math.min(
      velocityRef.current * SPIN_SCALE,
      MAX_SPIN_SPEED,
    );
    spinSpeed.current = THREE.MathUtils.lerp(spinSpeed.current, targetSpin, 0.35);
    ref.current.rotation.y += spinSpeed.current * delta;
  });

  const materials = usePlateMaterials(faceTexture);

  if (!faceTexture) return null;

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      material={materials}
      rotation={[0.3, 0, 0]}
    />
  );
}

export default function CustomCursor() {
  const { suppressed } = useCursorVisibility();
  const [enabled, setEnabled] = useState(false);
  const [hidden, setHidden] = useState(true);
  const velocityRef = useRef(0);
  const lastMoveRef = useRef<{ x: number; y: number; t: number } | null>(
    null,
  );

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-none-custom");

    function handleMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);

      const now = performance.now();
      const last = lastMoveRef.current;
      if (last) {
        const dt = Math.max(now - last.t, 1);
        const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y);
        velocityRef.current = dist / dt;
      }
      lastMoveRef.current = { x: e.clientX, y: e.clientY, t: now };
    }
    function handleLeaveWindow() {
      setHidden(true);
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeaveWindow);
    return () => {
      document.documentElement.classList.remove("cursor-none-custom");
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeaveWindow);
    };
  }, [x, y]);

  if (!enabled || suppressed) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[1000]"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        opacity: hidden ? 0 : 1,
        width: 92,
        height: 92,
        filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.45))",
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 3.6], fov: 30 }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 3, 4]} intensity={1.3} color="#fff8ec" />
        <pointLight position={[-2, -1, 2]} intensity={0.4} color="#cfd8e6" />
        <IronPlate velocityRef={velocityRef} />
      </Canvas>
    </motion.div>
  );
}
