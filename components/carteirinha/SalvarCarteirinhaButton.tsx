"use client";

import { useState, type RefObject } from "react";
import { toJpeg } from "html-to-image";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  cardRef: RefObject<HTMLDivElement | null>;
  fileName: string;
};

const TIMEOUT_GERACAO_MS = 15000;

class GeracaoTravadaError extends Error {}

const OPCOES = {
  pixelRatio: 2,
  quality: 0.92,
  cacheBust: true,
  backgroundColor: "#033583",
} as const;

/** Espera cada foto do cartão estar realmente decodificada e pronta para pintar. */
async function aguardarImagens(alvo: HTMLElement) {
  const imagens = Array.from(alvo.querySelectorAll("img"));
  await Promise.all(
    imagens.map(async (img) => {
      try {
        if (!img.complete) {
          await new Promise((resolve) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
          });
        }
        await img.decode?.();
      } catch {
        // uma foto que falhe não pode impedir a geração do resto do cartão
      }
    })
  );
}

/**
 * Gera a imagem do cartão.
 *
 * A captura roda duas vezes de propósito: no Safari, a primeira passada sai sem
 * as fotos, porque elas ainda não foram carregadas no clone que a biblioteca
 * monta — era esse o motivo de a carteirinha salva no iPhone vir sem o cão. A
 * segunda passada já encontra tudo no lugar. Nos demais navegadores o resultado
 * é o mesmo; só custa uma renderização a mais de um cartão pequeno.
 */
async function gerarImagem(alvo: HTMLElement) {
  await aguardarImagens(alvo);
  await toJpeg(alvo, OPCOES);
  return toJpeg(alvo, OPCOES);
}

export function SalvarCarteirinhaButton({ cardRef, fileName }: Props) {
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSalvar() {
    const alvo = cardRef.current;
    if (!alvo) return;
    setErro(null);
    setSalvando(true);
    try {
      // html-to-image resolve dentro de um requestAnimationFrame, que não dispara
      // enquanto a aba está em segundo plano. Sem esse limite, sair do navegador no
      // meio da geração deixaria o botão travado no spinner para sempre.
      //
      // JPEG: a carteirinha vai para a galeria do celular e é enviada pelo
      // WhatsApp, onde imagem aparece direto na conversa. O cartão não tem
      // transparência, então não há perda em relação ao PNG — e o arquivo fica
      // bem menor.
      const dataUrl = await Promise.race([
        gerarImagem(alvo),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new GeracaoTravadaError()), TIMEOUT_GERACAO_MS)
        ),
      ]);

      const blob = await (await fetch(dataUrl)).blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setErro(
        err instanceof GeracaoTravadaError
          ? "A geração demorou demais. Mantenha esta tela aberta e tente novamente."
          : "Não foi possível gerar a carteirinha."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="space-y-2">
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
      {erro && <p className="text-center text-sm text-white">{erro}</p>}
    </div>
  );
}
