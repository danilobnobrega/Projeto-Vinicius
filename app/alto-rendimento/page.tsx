import Reveal from "@/components/landing/Reveal";
import MagneticLink from "@/components/landing/MagneticLink";
import ScrollBarbell from "@/components/three/ScrollBarbell";

const NAV_LINKS = [
  { href: "#metodo", label: "Sobre" },
  { href: "#como-funciona", label: "Método" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#planos", label: "Planos" },
];

const STEPS = [
  {
    n: "01",
    title: "Avaliação inicial",
    desc: "Diagnóstico biomecânico, histórico de treino e mapeamento do seu calendário de competições.",
  },
  {
    n: "02",
    title: "Periodização personalizada",
    desc: "Planejamento de blocos de treino desenhado para o seu pico de forma na data certa.",
  },
  {
    n: "03",
    title: "Acompanhamento semanal",
    desc: "Ajustes de carga e volume a distância, toda semana, com base na sua resposta real ao treino.",
  },
  {
    n: "04",
    title: "Análise técnica por vídeo",
    desc: "Correções de execução frame a frame, focadas em performance e segurança nos levantamentos.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Bati meu recorde pessoal no total depois de 6 meses de acompanhamento. A periodização fez toda a diferença na minha preparação pro nacional.",
    role: "Powerlifter competitivo, categoria -83kg",
  },
  {
    quote:
      "Nunca tinha treinado com tanta clareza sobre o porquê de cada carga. Os ajustes semanais evitaram uma lesão que já tinha me tirado de duas temporadas.",
    role: "Atleta de levantamento de peso olímpico",
  },
  {
    quote:
      "A análise de vídeo corrigiu um erro técnico que eu carregava há anos. Ganho de força real, não só número na planilha.",
    role: "Powerlifter competitivo, categoria -93kg",
  },
];

export default function AltoRendimento() {
  return (
    <main className="flex-1 bg-bone text-carbon">
      <header className="sticky top-0 z-30 border-b border-carbon/10 bg-bone/95 pr-20 backdrop-blur md:pr-24">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="font-display text-lg font-extrabold uppercase tracking-tight">
            Método Raiz
          </span>
          <ul className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.15em] text-iron md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="transition-colors hover:text-bronze"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <MagneticLink
            href="#planos"
            className="inline-block rounded-full bg-carbon px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-bone"
          >
            Aplicar agora
          </MagneticLink>
        </nav>
      </header>

      <ScrollBarbell
        sections={["#metodo", "#como-funciona", "#depoimentos", "#planos"]}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-carbon px-6 py-28 text-bone md:py-36">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="font-display text-sm tracking-[0.3em] text-bronze-bright">
            CONSULTORIA ONLINE — ALTO RENDIMENTO
          </span>
          <h1 className="mt-6 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight md:text-7xl">
            Treine como quem
            <br />
            já chegou no topo.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-bone/70">
            Preparação física online para atletas competitivos, guiada por um
            campeão mundial de powerlifting. Periodização real, ajuste fino
            de carga e foco total no seu próximo recorde.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticLink
              href="#planos"
              className="inline-block rounded-full bg-bronze-bright px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-carbon"
            >
              Candidatar-se à consultoria
            </MagneticLink>
            <a
              href="#como-funciona"
              className="text-sm font-semibold uppercase tracking-[0.15em] text-bone/70 transition-colors hover:text-bone"
            >
              Ver como funciona &darr;
            </a>
          </div>
        </div>

        <dl className="relative z-10 mx-auto mt-20 grid max-w-3xl grid-cols-1 gap-8 border-t border-bone/10 pt-10 text-center sm:grid-cols-3">
          <div>
            <dt className="font-display text-3xl font-extrabold text-bronze-bright">
              Campeão Mundial
            </dt>
            <dd className="mt-1 text-xs uppercase tracking-[0.15em] text-bone/50">
              Powerlifting
            </dd>
          </div>
          <div>
            <dt className="font-display text-3xl font-extrabold text-bronze-bright">
              10+ anos
            </dt>
            <dd className="mt-1 text-xs uppercase tracking-[0.15em] text-bone/50">
              De experiência em treinamento de força
            </dd>
          </div>
          <div>
            <dt className="font-display text-3xl font-extrabold text-bronze-bright">
              100% remoto
            </dt>
            <dd className="mt-1 text-xs uppercase tracking-[0.15em] text-bone/50">
              Acompanhamento à distância
            </dd>
          </div>
        </dl>
      </section>

      {/* MÉTODO / SOBRE */}
      <section id="metodo" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto grid max-w-5xl items-start gap-12 md:grid-cols-2">
          <Reveal>
            <span className="font-display text-sm tracking-[0.2em] text-bronze">
              O MÉTODO
            </span>
            <h2 className="mt-4 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight md:text-5xl">
              Raiz é sobre
              <br />
              fundamento, não atalho.
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="space-y-5 text-iron">
            <p>
              Método Raiz nasceu da experiência de Vinicius Gonçalves,
              campeão mundial de powerlifting, como resposta a um problema
              comum entre atletas competitivos: treino genérico não sustenta
              performance de alto nível por muito tempo.
            </p>
            <p>
              O trabalho é construído sobre peso livre, biomecânica
              individual e periodização real — cada bloco de treino é
              desenhado em função do seu calendário de competições, não de um
              template pronto.
            </p>
            <p>
              Nada aqui é genérico. Cada carga, cada semana de deload, cada
              ajuste técnico existe porque foi pensado especificamente para
              o seu corpo e o seu objetivo.
            </p>
          </Reveal>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section
        id="como-funciona"
        className="scroll-mt-24 bg-bone-dim px-6 py-24"
      >
        <div className="mx-auto max-w-5xl">
          <Reveal className="text-center">
            <span className="font-display text-sm tracking-[0.2em] text-bronze">
              COMO FUNCIONA
            </span>
            <h2 className="mt-4 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight md:text-5xl">
              Do diagnóstico ao pódio
            </h2>
          </Reveal>

          <ol className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-4">
            {STEPS.map((step, i) => (
              <li key={step.n}>
                <Reveal delay={i * 0.1}>
                  <span className="font-display text-4xl font-extrabold text-bronze/40">
                    {step.n}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold uppercase tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-iron">{step.desc}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section
        id="depoimentos"
        className="scroll-mt-24 bg-carbon px-6 py-24 text-bone"
      >
        <div className="mx-auto max-w-5xl">
          <Reveal className="text-center">
            <span className="font-display text-sm tracking-[0.2em] text-bronze-bright">
              PROVA SOCIAL
            </span>
            <h2 className="mt-4 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight md:text-5xl">
              Resultado de quem compete
            </h2>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.role} delay={i * 0.1}>
                <blockquote className="rounded-2xl border border-bone/10 bg-bone/5 p-6">
                  <p className="text-sm text-bone/80">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="mt-4 text-xs uppercase tracking-[0.1em] text-bronze-bright">
                    {t.role}
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PLANOS / CTA */}
      <section id="planos" className="scroll-mt-24 px-6 py-24">
        <Reveal className="mx-auto max-w-4xl text-center">
          <span className="font-display text-sm tracking-[0.2em] text-bronze">
            PLANOS
          </span>
          <h2 className="mt-4 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight md:text-5xl">
            Vagas limitadas por ciclo
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-iron">
            Pra manter o acompanhamento individualizado, cada ciclo de
            consultoria aceita um número limitado de atletas.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <Reveal>
            <div className="rounded-2xl border border-carbon/10 p-8">
              <h3 className="font-display text-xl font-bold uppercase tracking-tight">
                Consultoria Individual
              </h3>
              <p className="mt-2 text-sm text-iron">
                Periodização e acompanhamento semanal completo.
              </p>
              <p className="mt-6 font-display text-3xl font-extrabold">
                A partir de R$ 000/mês
              </p>
              <MagneticLink
                href="#"
                className="mt-6 block w-full rounded-full bg-carbon px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.15em] text-bone"
              >
                Aplicar para vaga
              </MagneticLink>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border-2 border-bronze-bright bg-carbon p-8 text-bone">
              <h3 className="font-display text-xl font-bold uppercase tracking-tight">
                Consultoria + Análise de Vídeo
              </h3>
              <p className="mt-2 text-sm text-bone/70">
                Tudo do plano individual, com correção técnica semanal por
                vídeo.
              </p>
              <p className="mt-6 font-display text-3xl font-extrabold text-bronze-bright">
                A partir de R$ 000/mês
              </p>
              <MagneticLink
                href="#"
                className="mt-6 block w-full rounded-full bg-bronze-bright px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.15em] text-carbon"
              >
                Aplicar para vaga
              </MagneticLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer id="rodape" className="bg-carbon px-6 py-10 text-bone/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs uppercase tracking-[0.15em] sm:flex-row">
          <span>Método Raiz — Vinicius Gonçalves</span>
          <span>&copy; 2026. Todos os direitos reservados.</span>
        </div>
      </footer>
    </main>
  );
}
