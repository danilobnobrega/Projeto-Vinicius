"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCursorVisibility } from "./CursorVisibility";
import PreloaderRack from "./three/PreloaderRack";

const EASE_EXPO: [number, number, number, number] = [0.76, 0, 0.24, 1];
const DURATION_MS = 3200;

// Duas fases com velocidades bem distintas (não uma curva suave): os
// primeiros 80% (4 anilhas) passam rápido nos primeiros 45% do tempo, e os
// últimos 20% (a 5ª anilha) se estendem pelo resto do tempo, bem mais lento.
const FAST_PHASE_T = 0.45;
const FAST_PHASE_PERCENT = 80;

function twoPhasePercent(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 100;
  if (t < FAST_PHASE_T) {
    return (t / FAST_PHASE_T) * FAST_PHASE_PERCENT;
  }
  const slowT = (t - FAST_PHASE_T) / (1 - FAST_PHASE_T);
  return FAST_PHASE_PERCENT + slowT * (100 - FAST_PHASE_PERCENT);
}

// Pequeno atraso pra troca do número acompanhar o instante em que a anilha
// termina de encaixar visualmente, não o instante em que o valor real muda.
const DISPLAY_DELAY_MS = 180;
// O suporte aparece sozinho (vazio) antes de a contagem começar — precisa
// ficar igual ao RACK_ENTRANCE_MS em components/three/PreloaderRack.tsx.
const RACK_ENTRANCE_MS = 500;

export default function Preloader({ onFinish }: { onFinish: () => void }) {
  const { setSuppressed } = useCursorVisibility();
  const [percent, setPercent] = useState(0);
  const [displayPercent, setDisplayPercent] = useState(0);
  const [showPercent, setShowPercent] = useState(false);
  const [exiting, setExiting] = useState(false);

  useLayoutEffect(() => {
    setSuppressed(true);
    return () => setSuppressed(false);
  }, [setSuppressed]);

  useEffect(() => {
    let rafId: number;
    let start = 0;
    let milestone = 0;
    const pendingTimeouts: number[] = [];

    function tick(now: number) {
      const t = Math.min((now - start) / DURATION_MS, 1);
      const newPercent = Math.round(twoPhasePercent(t));

      setPercent(newPercent);

      if (newPercent < FAST_PHASE_PERCENT) {
        setDisplayPercent(newPercent);
      } else {
        const target = newPercent >= 100 ? 100 : FAST_PHASE_PERCENT;
        if (target !== milestone) {
          milestone = target;
          pendingTimeouts.push(
            window.setTimeout(
              () => setDisplayPercent(target),
              DISPLAY_DELAY_MS,
            ),
          );
        }
      }

      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setExiting(true), 300);
      }
    }

    // espera o suporte terminar de aparecer (sozinho, vazio) antes de
    // começar a contar — a contagem nasce junto com o suporte, não antes.
    const startTimeout = window.setTimeout(() => {
      setShowPercent(true);
      start = performance.now();
      rafId = requestAnimationFrame(tick);
    }, RACK_ENTRANCE_MS);

    return () => {
      window.clearTimeout(startTimeout);
      cancelAnimationFrame(rafId);
      pendingTimeouts.forEach(window.clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const timeout = window.setTimeout(onFinish, 900);
    return () => window.clearTimeout(timeout);
  }, [exiting, onFinish]);

  return (
    <motion.div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden bg-carbon text-bone"
      animate={exiting ? { y: "-100%" } : { y: "0%" }}
      transition={{ duration: 0.9, ease: EASE_EXPO }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,_var(--color-bone)_0%,_transparent_70%)]" />
      </div>

      <PreloaderRack percent={percent} />

      <motion.span
        className="mt-2 font-display text-sm tracking-[0.3em] tabular-nums text-bone/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: showPercent ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {String(displayPercent).padStart(2, "0")}%
      </motion.span>
    </motion.div>
  );
}
