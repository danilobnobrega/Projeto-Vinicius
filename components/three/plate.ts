import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

// O gerador de UV padrão do Three.js usa as coordenadas locais (x,y) cruas
// como UV, sem normalizar para 0-1 — como nossa forma vai de -raio a +raio,
// metade da superfície cairia em UV negativo (travado na borda da textura).
// Este gerador remapeia corretamente para o quadrado 0-1 da imagem.
function createPlateUVGenerator(radius: number) {
  const toUV = (x: number, y: number) =>
    new THREE.Vector2((x + radius) / (2 * radius), (y + radius) / (2 * radius));

  return {
    generateTopUV(
      _geometry: THREE.BufferGeometry,
      vertices: number[],
      indexA: number,
      indexB: number,
      indexC: number,
    ) {
      return [
        toUV(vertices[indexA * 3], vertices[indexA * 3 + 1]),
        toUV(vertices[indexB * 3], vertices[indexB * 3 + 1]),
        toUV(vertices[indexC * 3], vertices[indexC * 3 + 1]),
      ];
    },
    generateSideWallUV(
      _geometry: THREE.BufferGeometry,
      _vertices: number[],
      _indexA: number,
      _indexB: number,
      _indexC: number,
      _indexD: number,
    ) {
      return [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(1, 0),
        new THREE.Vector2(1, 1),
        new THREE.Vector2(0, 1),
      ];
    },
  };
}

export function usePlateGeometry(
  outerRadius = 0.78,
  innerRadius = 0.28,
  depth = 0.26,
) {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.035,
      bevelSegments: 4,
      curveSegments: 48,
      UVGenerator: createPlateUVGenerator(outerRadius),
    });
    geometry.center();
    return geometry;
  }, [outerRadius, innerRadius, depth]);
}

export function usePlatePhotoTexture(url: string) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let disposed = false;
    loader.load(url, (loaded) => {
      if (disposed) return;
      loaded.colorSpace = THREE.SRGBColorSpace;
      setTexture(loaded);
    });
    return () => {
      disposed = true;
    };
  }, [url]);

  return texture;
}

export function usePlateMaterials(faceTexture: THREE.Texture | null) {
  return useMemo(
    () => [
      new THREE.MeshStandardMaterial({
        map: faceTexture,
        metalness: 0.15,
        roughness: 0.55,
      }),
      new THREE.MeshStandardMaterial({
        color: "#a8a8a4",
        metalness: 0.2,
        roughness: 0.5,
      }),
    ],
    [faceTexture],
  );
}
