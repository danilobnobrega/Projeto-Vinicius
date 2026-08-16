"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PLATE_COLOR = "#c79b63";
const BAR_COLOR = "#241f17";

export function Barbell() {
  return (
    <>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 2.2, 16]} />
        <meshStandardMaterial color={BAR_COLOR} metalness={0.6} roughness={0.4} />
      </mesh>
      {[-0.95, -0.78, 0.78, 0.95].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.42, 0.42, 0.14, 32]} />
          <meshStandardMaterial color={PLATE_COLOR} metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </>
  );
}

function Kettlebell() {
  return (
    <>
      <mesh position={[0, -0.25, 0]}>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshStandardMaterial color={PLATE_COLOR} metalness={0.75} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <torusGeometry args={[0.36, 0.1, 16, 32]} />
        <meshStandardMaterial color={BAR_COLOR} metalness={0.6} roughness={0.4} />
      </mesh>
    </>
  );
}

function Dumbbell() {
  return (
    <>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 1.1, 16]} />
        <meshStandardMaterial color={BAR_COLOR} metalness={0.6} roughness={0.4} />
      </mesh>
      {[-0.62, 0.62].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.5, 0.5, 0.34, 32]} />
          <meshStandardMaterial color={PLATE_COLOR} metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </>
  );
}

const EQUIPMENT = {
  barbell: Barbell,
  kettlebell: Kettlebell,
  dumbbell: Dumbbell,
} as const;

export type EquipmentType = keyof typeof EQUIPMENT;

// Pose de repouso (totalmente "apresentada") de cada objeto.
const REST_ROTATION: [number, number, number] = [0.12, 0.5, 0];
// Rotação extra somada na entrada/saída — o objeto "gira para dentro/fora" a partir daqui.
const ENTRY_ROTATION_Y = Math.PI * 0.85;
const IDLE_SCALE = 0.55;
const ACTIVE_SCALE = 1;

function Rig({
  hovered,
  children,
}: {
  hovered: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const progress = useRef(0);

  useFrame(() => {
    if (!ref.current) return;
    const target = hovered ? 1 : 0;
    progress.current = THREE.MathUtils.lerp(progress.current, target, 0.08);

    const p = progress.current;
    ref.current.rotation.set(
      REST_ROTATION[0],
      REST_ROTATION[1] + ENTRY_ROTATION_Y * (1 - p),
      REST_ROTATION[2],
    );
    const scale = THREE.MathUtils.lerp(IDLE_SCALE, ACTIVE_SCALE, p);
    ref.current.scale.setScalar(scale);
  });

  return <group ref={ref}>{children}</group>;
}

export default function CardObject3D({
  type,
  hovered,
  className,
}: {
  type: EquipmentType;
  hovered: boolean;
  className?: string;
}) {
  const Equipment = EQUIPMENT[type];

  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 5], fov: 35 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} />
        <pointLight position={[-3, -1, 2]} intensity={0.5} color="#c79b63" />
        <Rig hovered={hovered}>
          <Equipment />
        </Rig>
      </Canvas>
    </div>
  );
}
