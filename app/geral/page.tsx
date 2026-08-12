import Link from "next/link";

export default function Geral() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-bone px-6 py-24 text-center text-carbon">
      <span className="font-display text-sm tracking-[0.2em] text-bronze">
        03 — SAÚDE &amp; QUALIDADE DE VIDA
      </span>
      <h1 className="max-w-2xl font-display text-4xl font-extrabold uppercase leading-tight md:text-6xl">
        Página em construção
      </h1>
      <p className="max-w-md text-iron">
        Aqui vai a página para quem quer começar (ou voltar) a treinar com
        segurança, ganhando saúde, mobilidade e autoestima.
      </p>
      <Link
        href="/"
        className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.15em] text-bronze transition-transform duration-200 hover:scale-110"
      >
        &larr; Voltar ao início
      </Link>
    </main>
  );
}
