import type { Metadata } from "next";
import Image from "next/image";
import { Manrope } from "next/font/google";
import localFont from "next/font/local";
import CustomCursor from "@/components/CustomCursor";
import { CursorVisibilityProvider } from "@/components/CursorVisibility";
import "./globals.css";

// Hospedada localmente: o Google trocou o hash desse arquivo no CDN deles e
// a versão instalada do Next ainda aponta pro hash antigo (404 permanente),
// então buscamos direto do próprio projeto em vez de depender do Google.
const display = localFont({
  src: "../public/fonts/big-shoulders-latin-var.woff2",
  variable: "--font-display",
  weight: "600 900",
  style: "normal",
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
});

export const metadata: Metadata = {
  title: "Método Raiz — Preparação Física",
  description:
    "Consultoria online de preparação física com método baseado em peso livre, para atletas de alto rendimento, praticantes recreativos e quem busca mais saúde e qualidade de vida.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bone text-carbon font-sans">
        <div className="grain" aria-hidden="true" />
        <Image
          src="/images/vg-mark.png"
          alt="Vinicius Gonçalves"
          width={450}
          height={324}
          className="pointer-events-none fixed top-4 right-4 z-40 h-8 w-auto mix-blend-difference md:top-5 md:right-5 md:h-9"
          priority
        />
        <CursorVisibilityProvider>
          <CustomCursor />
          {children}
        </CursorVisibilityProvider>
      </body>
    </html>
  );
}
