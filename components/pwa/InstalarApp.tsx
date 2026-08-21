"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Evento do Chrome/Edge que permite abrir a instalação nativa. Não existe nos
 * tipos padrão do DOM porque não é um padrão da web.
 */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const CHAVE_DISPENSADO = "cao-idoso:instalacao-dispensada";

function jaInstalado() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // Safari no iOS usa uma propriedade própria
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function ehIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

/**
 * Convite para instalar o app na tela de início.
 *
 * Não é possível abrir a instalação sozinho ao carregar a página: o Chrome só
 * aceita `prompt()` em resposta a um toque, e o iOS não expõe API nenhuma —
 * lá o único caminho é ensinar o gesto. Por isso a faixa aparece com um botão
 * no Android e com a instrução no iPhone.
 */
export function InstalarApp() {
  const [eventoInstalacao, setEventoInstalacao] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [mostrarIos, setMostrarIos] = useState(false);
  const [oculto, setOculto] = useState(true);

  useEffect(() => {
    if (jaInstalado()) return;
    if (localStorage.getItem(CHAVE_DISPENSADO)) return;

    if (ehIos()) {
      // Aparece um instante depois para não competir com o carregamento da
      // página — e evita alterar estado direto no efeito.
      const t = setTimeout(() => {
        setMostrarIos(true);
        setOculto(false);
      }, 1200);
      return () => clearTimeout(t);
    }

    function aoPoderInstalar(e: Event) {
      // Sem isto o Chrome mostra a própria faixa, fora do visual do app.
      e.preventDefault();
      // A escolha é relida aqui, e não só na montagem: se o evento disparar de
      // novo depois de dispensado, a faixa não pode reaparecer.
      if (localStorage.getItem(CHAVE_DISPENSADO)) return;
      setEventoInstalacao(e as BeforeInstallPromptEvent);
      setOculto(false);
    }

    function aoInstalar() {
      setOculto(true);
    }

    window.addEventListener("beforeinstallprompt", aoPoderInstalar);
    window.addEventListener("appinstalled", aoInstalar);
    return () => {
      window.removeEventListener("beforeinstallprompt", aoPoderInstalar);
      window.removeEventListener("appinstalled", aoInstalar);
    };
  }, []);

  function dispensar() {
    setOculto(true);
    localStorage.setItem(CHAVE_DISPENSADO, "1");
  }

  async function instalar() {
    if (!eventoInstalacao) return;
    await eventoInstalacao.prompt();
    await eventoInstalacao.userChoice;
    setEventoInstalacao(null);
    setOculto(true);
  }

  if (oculto) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-brand-navy px-4 py-3 text-white shadow-2xl">
      <div className="mx-auto flex max-w-sm items-center gap-3">
        <div className="min-w-0 flex-1 text-sm">
          {mostrarIos ? (
            <p>
              Para instalar: toque em{" "}
              <Share className="inline h-4 w-4 align-text-bottom" /> e escolha{" "}
              <strong>Adicionar à Tela de Início</strong>.
            </p>
          ) : (
            <p>Instale o Cão Idoso na tela de início do seu celular.</p>
          )}
        </div>

        {!mostrarIos && (
          <Button
            onClick={instalar}
            size="sm"
            className="shrink-0 rounded-full bg-brand-blue hover:bg-brand-blue/90"
          >
            <Download className="h-4 w-4" /> Instalar
          </Button>
        )}

        <button
          type="button"
          onClick={dispensar}
          aria-label="Dispensar"
          className="shrink-0 rounded-full p-2 text-white/70 hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
