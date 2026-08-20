"use client";

import { useState, type RefObject } from "react";
import { toPng } from "html-to-image";
import { Download, Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  cardRef: RefObject<HTMLDivElement | null>;
  fileName: string;
};

const TIMEOUT_GERACAO_MS = 15000;

class GeracaoTravadaError extends Error {}

function mensagemDeErro(err: unknown, acao: string) {
  if (err instanceof GeracaoTravadaError) {
    return "A geração demorou demais. Mantenha esta tela aberta e tente novamente.";
  }
  return `Não foi possível ${acao} carteirinha.`;
}

export function SaveShareButtons({ cardRef, fileName }: Props) {
  const [salvando, setSalvando] = useState(false);
  const [compartilhando, setCompartilhando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function gerarImagem() {
    if (!cardRef.current) return null;

    // html-to-image resolve dentro de um requestAnimationFrame, que não dispara
    // enquanto a aba está em segundo plano. Sem esse limite, sair do navegador no
    // meio da geração deixaria o botão travado no spinner para sempre.
    const dataUrl = await Promise.race([
      toPng(cardRef.current, { pixelRatio: 2, cacheBust: true }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new GeracaoTravadaError()), TIMEOUT_GERACAO_MS)
      ),
    ]);

    const res = await fetch(dataUrl);
    return res.blob();
  }

  async function handleSalvar() {
    setErro(null);
    setSalvando(true);
    try {
      const blob = await gerarImagem();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setErro(mensagemDeErro(err, "gerar a imagem da"));
    } finally {
      setSalvando(false);
    }
  }

  async function handleCompartilhar() {
    setErro(null);
    setCompartilhando(true);
    try {
      const blob = await gerarImagem();
      if (!blob) return;
      const file = new File([blob], fileName, { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Carteira Digital do Cão Idoso",
        });
      } else {
        // Fallback: navegador não suporta compartilhar arquivo — baixa a imagem
        // e deixa o tutor anexar manualmente no WhatsApp.
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        setErro(
          "Seu navegador não permite compartilhar direto. A imagem foi baixada — anexe ela no WhatsApp."
        );
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setErro(mensagemDeErro(err, "compartilhar a"));
    } finally {
      setCompartilhando(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handleSalvar}
        disabled={salvando}
        size="lg"
        className="w-full rounded-full bg-brand-blue text-base hover:bg-brand-blue/90"
      >
        {salvando ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Download className="h-5 w-5" /> Salvar no celular
          </>
        )}
      </Button>
      <Button
        onClick={handleCompartilhar}
        disabled={compartilhando}
        variant="outline"
        size="lg"
        className="w-full rounded-full border-brand-blue text-base text-brand-blue hover:bg-brand-blue-light"
      >
        {compartilhando ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Share2 className="h-5 w-5" /> Compartilhar no WhatsApp
          </>
        )}
      </Button>
      {erro && <p className="text-center text-sm text-white">{erro}</p>}
    </div>
  );
}
