"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import CardObject3D, { type EquipmentType } from "./three/CardObject3D";

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Persona = {
  slug: string;
  index: string;
  title: string[];
  descriptor: string;
  cta: string;
  object: EquipmentType;
};

const personas: Persona[] = [
  {
    slug: "/alto-rendimento",
    index: "01",
    title: ["Alto", "Rendimento"],
    descriptor:
      "Para quem compete e vive de resultado. Periodização, controle de carga e ajuste fino rumo ao pódio.",
    cta: "Treinar para vencer",
    object: "barbell",
  },
  {
    slug: "/recreativo",
    index: "02",
    title: ["Prática", "Recreativa"],
    descriptor:
      "Para quem já treina e quer evoluir com consistência — mais força, mais estrutura, sem se machucar.",
    cta: "Evoluir com método",
    object: "kettlebell",
  },
  {
    slug: "/geral",
    index: "03",
    title: ["Saúde &", "Qualidade de Vida"],
    descriptor:
      "Para quem quer começar (ou voltar) a treinar com segurança, ganhando saúde, mobilidade e autoestima.",
    cta: "Começar com confiança",
    object: "dumbbell",
  },
];

export default function Gate({ ready }: { ready: boolean }) {
  const [active, setActive] = useState<number | null>(null);
  const [magnet, setMagnet] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>, i: number) {
    // onMouseEnter não dispara se o cursor já estava sobre o card antes da
    // página carregar — o mousemove garante que o card ative mesmo assim.
    setActive((current) => (current === i ? current : i));
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setMagnet({ x: relX * 18, y: relY * 18 });
  }

  return (
    <section className="relative flex h-dvh w-full flex-col bg-carbon text-bone md:flex-row">
      {personas.map((persona, i) => {
        const isActive = active === i;
        const width =
          active === null ? 100 / 3 : isActive ? 52 : (100 - 52) / 2;

        return (
          <motion.div
            key={persona.slug}
            className="relative flex min-h-0 flex-1 overflow-hidden border-b border-bone/10 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
            style={{ flexBasis: "33.333%" }}
            animate={{ flexBasis: `${width}%` }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => {
              setActive(null);
              setMagnet({ x: 0, y: 0 });
            }}
          >
            <Link
              href={persona.slug}
              onMouseMove={(e) => handleMouseMove(e, i)}
              className="group flex h-full min-h-[34dvh] w-full flex-col justify-between p-6 md:min-h-0 md:p-10"
            >
              <div
                className="pointer-events-none absolute -right-6 -bottom-6 h-56 w-56 transition-opacity duration-500 md:h-72 md:w-72"
                style={{
                  opacity: isActive ? 0.9 : 0.32,
                  transform: isActive
                    ? `translate(${-magnet.x * 1.2}px, ${-magnet.y * 1.2}px)`
                    : undefined,
                }}
              >
                <CardObject3D
                  type={persona.object}
                  hovered={isActive}
                  className="h-full w-full"
                />
              </div>

              <motion.span
                className="font-display text-sm tracking-[0.2em] text-bronze-bright"
                initial={{ opacity: 0, y: 12 }}
                animate={ready ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.15 + i * 0.1 }}
              >
                {persona.index}
              </motion.span>

              <div>
                <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight md:text-5xl">
                  {persona.title.map((line, lineIdx) => (
                    <span
                      key={line}
                      className="block overflow-hidden pt-[0.18em] -mt-[0.18em]"
                    >
                      <motion.span
                        className="block"
                        initial={{ y: "115%" }}
                        animate={ready ? { y: "0%" } : {}}
                        transition={{
                          duration: 0.9,
                          ease: EASE_EXPO,
                          delay: 0.25 + i * 0.1 + lineIdx * 0.08,
                        }}
                      >
                        {line}
                      </motion.span>
                    </span>
                  ))}
                </h2>

                <p
                  className={`mt-4 max-w-[26ch] text-sm text-bone/70 transition-all duration-500 ${
                    isActive
                      ? "translate-y-0 opacity-100"
                      : "opacity-100 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                  }`}
                >
                  {persona.descriptor}
                </p>

                <span
                  className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-bronze-bright transition-transform duration-150 ease-out"
                  style={
                    isActive
                      ? { transform: `translate(${magnet.x}px, ${magnet.y}px)` }
                      : undefined
                  }
                >
                  {persona.cta}
                  <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </section>
  );
}
