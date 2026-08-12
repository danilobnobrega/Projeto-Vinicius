"use client";

import { useState } from "react";
import Preloader from "./Preloader";
import Gate from "./Gate";

// Variável em memória (não sessionStorage): reseta sozinha num refresh
// completo (recarrega o JS do zero), mas persiste numa navegação interna
// entre páginas (o mesmo JS continua rodando), então só toca uma vez por
// "boot" real da aplicação, não uma vez por sessão do navegador.
let hasPlayedIntro = false;

export default function HomeShell() {
  const [loading, setLoading] = useState(!hasPlayedIntro);

  function handleFinish() {
    hasPlayedIntro = true;
    setLoading(false);
  }

  const ready = !loading;

  return (
    <div className="relative flex-1 bg-carbon">
      {loading && <Preloader onFinish={handleFinish} />}
      <Gate ready={ready} />
    </div>
  );
}
