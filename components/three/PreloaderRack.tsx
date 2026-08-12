"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePlateGeometry, usePlateMaterials, usePlatePhotoTexture } from "./plate";

const ARCH_COUNT = 6;
const ARCH_GAP = 0.32;
const ARCH_WIDTH = 0.92;
const ARCH_HEIGHT = 0.4;
const ARCH_TUBE_RADIUS = 0.04;
const PLATE_RADIUS = 0.4;
const PLATE_DEPTH = 0.19;
const RACK_COLOR = "#18181a";

// Curva explícita (não torus) para o arco — evita ambiguidade de orientação:
// começa num pé (z negativo), sobe até o topo, desce no outro pé (z positivo).
function createArchGeometry() {
  const points: THREE.Vector3[] = [];
  const segments = 24;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = Math.PI * t;
    const z = -Math.cos(angle) * (ARCH_WIDTH / 2);
    const y = Math.sin(angle) * ARCH_HEIGHT;
    points.push(new THREE.Vector3(0, y, z));
  }
  const curve = new THREE.CatmullRomCurve3(points);
  return new THREE.TubeGeometry(curve, segments, ARCH_TUBE_RADIUS, 8, false);
}

function Rack() {
  const archGeometry = useMemo(() => createArchGeometry(), []);
  const railLength = (ARCH_COUNT - 1) * ARCH_GAP + 0.5;

  return (
    <group>
      {Array.from({ length: ARCH_COUNT }, (_, i) => {
        const x = (i - (ARCH_COUNT - 1) / 2) * ARCH_GAP;
        return (
          <mesh key={i} position={[x, 0, 0]} geometry={archGeometry}>
            <meshStandardMaterial color={RACK_COLOR} metalness={0.5} roughness={0.55} />
          </mesh>
        );
      })}
      {[-ARCH_WIDTH / 2, ARCH_WIDTH / 2].map((z) => (
        <mesh key={z} position={[0, -0.06, z]}>
          <boxGeometry args={[railLength, 0.1, 0.1]} />
          <meshStandardMaterial color={RACK_COLOR} metalness={0.5} roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

function Plate({
  x,
  loaded,
  geometry,
  materials,
}: {
  x: number;
  loaded: boolean;
  geometry: THREE.BufferGeometry;
  materials: THREE.Material[];
}) {
  const ref = useRef<THREE.Mesh>(null);
  const scale = useRef(0.001);

  useFrame(() => {
    if (!ref.current) return;
    const target = loaded ? 1 : 0.001;
    scale.current = THREE.MathUtils.lerp(scale.current, target, 0.18);
    ref.current.scale.setScalar(scale.current);
  });

  return (
    <mesh
      ref={ref}
      position={[x, PLATE_RADIUS, 0]}
      geometry={geometry}
      material={materials}
      rotation={[0, Math.PI / 2, 0]}
    />
  );
}

function Rig({ percent }: { percent: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const geometry = usePlateGeometry(PLATE_RADIUS, PLATE_RADIUS * 0.36, PLATE_DEPTH);
  const faceTexture = usePlatePhotoTexture("/textures/plate-5kg.png");
  const materials = usePlateMaterials(faceTexture);

  const slotCount = ARCH_COUNT - 1;
  const loadedSlots = Math.min(
    slotCount,
    Math.floor(percent / (100 / slotCount)),
  );

  useFrame(() => {
    if (!groupRef.current) return;
    const targetY = 0.55 + (1 - percent / 100) * 0.25;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      0.05,
    );
  });

  if (!faceTexture) return null;

  return (
    <group ref={groupRef} rotation={[0.12, 0.55, 0]} position={[0, -0.25, 0]}>
      <Rack />
      {Array.from({ length: slotCount }, (_, i) => {
        const x = (i - (slotCount - 1) / 2) * ARCH_GAP;
        return (
          <Plate
            key={i}
            x={x}
            loaded={i < loadedSlots}
            geometry={geometry}
            materials={materials}
          />
        );
      })}
    </group>
  );
}

export default function PreloaderRack({ percent }: { percent: number }) {
  return (
    <div className="h-[28vh] w-[82vw] max-w-xl">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0.22, 2.9], fov: 34 }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 4, 5]} intensity={1.3} color="#fff8ec" />
        <pointLight position={[-3, -1, 3]} intensity={0.4} color="#cfd8e6" />
        <Rig percent={percent} />
      </Canvas>
    </div>
  );
}
