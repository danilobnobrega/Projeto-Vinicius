"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  usePlateGeometry,
  usePlateMaterials,
  usePlatePhotoTexture,
} from "./plate";

const PLATE_RADIUS = 0.38;
const PLATE_DEPTH = 0.16;
// Meio da barra (cabo) fica vazio — as anilhas começam a partir daqui,
// grudadas umas nas outras, sem vão entre elas.
const HANDLE_HALF_LENGTH = 0.55;
const SLEEVE_RADIUS = 0.085;

// Textura real da barra (foto), repetida ao redor da circunferência —
// vende o brilho cromado e o serrilhado de verdade em vez de cor lisa.
function useBarTexture(url: string, repeatX: number, repeatY: number) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let disposed = false;
    loader.load(url, (loaded) => {
      if (disposed) return;
      loaded.wrapS = THREE.RepeatWrapping;
      loaded.wrapT = THREE.RepeatWrapping;
      loaded.repeat.set(repeatX, repeatY);
      loaded.colorSpace = THREE.SRGBColorSpace;
      setTexture(loaded);
    });
    return () => {
      disposed = true;
    };
  }, [url, repeatX, repeatY]);

  return texture;
}

function BarbellShaft({ plateCount }: { plateCount: number }) {
  const chromeMap = useBarTexture("/textures/bar-chrome.png", 4, 1);
  const knurlMap = useBarTexture("/textures/bar-knurl.png", 4, 2);

  const sleeveLength = plateCount * PLATE_DEPTH + 0.1;
  const sleeveCenter = HANDLE_HALF_LENGTH + sleeveLength / 2 - 0.05;

  // CylinderGeometry tem 3 grupos de material: [0] lateral, [1] e [2] as
  // tampas redondas nas pontas. Sem isso, as tampas pegam um pedaço
  // qualquer (às vezes escuro) da textura da lateral, em vez de ficarem
  // lisas — por isso as tampas usam uma cor sólida clara, sem textura.
  const sleeveMaterials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({
        map: chromeMap,
        color: chromeMap ? "#ffffff" : "#c7c7c2",
        metalness: 0.9,
        roughness: 0.15,
      }),
      new THREE.MeshStandardMaterial({
        color: "#d8d8d4",
        metalness: 0.9,
        roughness: 0.15,
      }),
      new THREE.MeshStandardMaterial({
        color: "#d8d8d4",
        metalness: 0.9,
        roughness: 0.15,
      }),
    ],
    [chromeMap],
  );

  return (
    <>
      {/* cabo central — serrilhado real, onde se pega a barra */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, HANDLE_HALF_LENGTH * 2, 24]} />
        <meshStandardMaterial
          map={knurlMap}
          color={knurlMap ? "#ffffff" : "#2a2620"}
          metalness={0.6}
          roughness={0.55}
        />
      </mesh>
      {/* mangas — cromo real, onde as anilhas encaixam */}
      {[-sleeveCenter, sleeveCenter].map((x) => (
        <mesh
          key={x}
          position={[x, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          material={sleeveMaterials}
        >
          <cylinderGeometry
            args={[SLEEVE_RADIUS, SLEEVE_RADIUS, sleeveLength, 24]}
          />
        </mesh>
      ))}
    </>
  );
}

// Presilha real: some quando a barra está vazia, sempre encosta na anilha
// mais externa já carregada, e só chega na ponta quando estiver completa.
function Collar({ targetX, visible }: { targetX: number; visible: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const x = useRef(targetX);
  const scale = useRef(0.001);

  useFrame((_, delta) => {
    if (!ref.current) return;
    // damp (não lerp por frame fixo): reação rápida e igual em qualquer
    // taxa de quadros — antes, a 0.15/frame, a anilha levava ~300ms+ pra
    // "crescer" depois do gatilho, o que parecia atraso de timing.
    x.current = THREE.MathUtils.damp(x.current, targetX, 20, delta);
    ref.current.position.x = x.current;
    const targetScale = visible ? 1 : 0.001;
    scale.current = THREE.MathUtils.damp(scale.current, targetScale, 20, delta);
    ref.current.scale.setScalar(scale.current);
  });

  return (
    <group ref={ref}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.06, 24]} />
        <meshStandardMaterial color="#1c1a16" metalness={0.6} roughness={0.4} />
      </mesh>
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

  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = loaded ? 1 : 0.001;
    scale.current = THREE.MathUtils.damp(scale.current, target, 20, delta);
    ref.current.scale.setScalar(scale.current);
  });

  return (
    <mesh
      ref={ref}
      position={[x, 0, 0]}
      geometry={geometry}
      material={materials}
      rotation={[0, Math.PI / 2, 0]}
    />
  );
}

function Rig({
  progressRef,
  plateCount,
}: {
  progressRef: { current: number };
  plateCount: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const geometry = usePlateGeometry(PLATE_RADIUS, PLATE_RADIUS * 0.36, PLATE_DEPTH);
  const faceTexture = usePlatePhotoTexture("/textures/plate-5kg.png");
  const materials = usePlateMaterials(faceTexture);
  const [loadedSlots, setLoadedSlots] = useState(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const slots = Math.min(
      plateCount,
      Math.floor(progressRef.current * plateCount + 0.0001),
    );
    if (slots !== loadedSlots) setLoadedSlots(slots);

    const targetY = 0.4 + progressRef.current * 0.5;
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetY,
      3,
      delta,
    );
  });

  if (!faceTexture) return null;

  const collarX = HANDLE_HALF_LENGTH + loadedSlots * PLATE_DEPTH + 0.03;

  return (
    <group ref={groupRef} rotation={[0.1, 0.4, 0]}>
      <BarbellShaft plateCount={plateCount} />
      {Array.from({ length: plateCount }, (_, i) => {
        const dist = HANDLE_HALF_LENGTH + PLATE_DEPTH / 2 + i * PLATE_DEPTH;
        const loaded = i < loadedSlots;
        return (
          <group key={i}>
            <Plate
              x={-dist}
              loaded={loaded}
              geometry={geometry}
              materials={materials}
            />
            <Plate
              x={dist}
              loaded={loaded}
              geometry={geometry}
              materials={materials}
            />
          </group>
        );
      })}
      <Collar targetX={-collarX} visible={loadedSlots > 0} />
      <Collar targetX={collarX} visible={loadedSlots > 0} />
    </group>
  );
}

export default function ScrollBarbell({ sections }: { sections: string[] }) {
  const progressRef = useRef(0);
  const triggersRef = useRef<number[]>([]);

  useEffect(() => {
    // A anilha entra pouco depois da seção começar a aparecer — não no
    // primeiro pixel dela (isso parece prematuro, quase imperceptível),
    // mas depois de uma fatia pequena (15% da altura da janela) já estar
    // visível no rodapé da tela. O mesmo raciocínio evita o rodapé de
    // verdade: seu "começa a aparecer" (sem a fatia extra) é o teto, nunca
    // o fim absoluto da página. O clamp anda de trás pra frente, reservando
    // uma folga mínima entre seções, pra nunca fazer duas colapsarem no
    // mesmo ponto — mas com essa convenção a folga entre gatilhos naturais
    // já é a altura real de cada seção, então isso quase nunca precisa agir.
    function computeTriggers() {
      const innerHeight = window.innerHeight;
      const PEEK_BUFFER = innerHeight * 0.1;
      const footer = document.querySelector<HTMLElement>("#rodape");
      const ceilingLimit = footer
        ? Math.max(footer.offsetTop - innerHeight, 0)
        : Math.max(document.documentElement.scrollHeight - innerHeight, 0);
      const MIN_GAP = 24;
      const natural = sections.map((selector) => {
        const el = document.querySelector<HTMLElement>(selector);
        return el ? Math.max(el.offsetTop - innerHeight + PEEK_BUFFER, 0) : Infinity;
      });
      const triggers = new Array<number>(natural.length);
      let ceiling = ceilingLimit;
      for (let i = natural.length - 1; i >= 0; i--) {
        triggers[i] = Math.min(natural[i], ceiling);
        ceiling = triggers[i] - MIN_GAP;
      }
      triggersRef.current = triggers;
    }

    function updateProgress() {
      const count = triggersRef.current.filter((t) => window.scrollY >= t).length;
      progressRef.current = count / sections.length;
    }

    function handleResize() {
      computeTriggers();
      updateProgress();
    }

    computeTriggers();
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", handleResize);

    // Recalcula sempre que o conteúdo da página mudar de altura por
    // qualquer motivo (troca de fonte, imagem carregando, etc.) — não só
    // quando a janela é redimensionada. Sem isso, os offsetTop ficavam
    // "congelados" no valor do primeiro cálculo, mesmo que o layout real
    // mudasse depois.
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, [sections]);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-20 hidden h-28 w-52 md:block">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 4.6], fov: 32 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={1.3} color="#fff8ec" />
        <pointLight position={[-3, -1, 3]} intensity={0.4} color="#cfd8e6" />
        <Rig progressRef={progressRef} plateCount={sections.length} />
      </Canvas>
    </div>
  );
}
