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
      // JPEG, não PNG: o PNG entra no PDF sem perda e passava de 8MB, inviável
      // para mandar no WhatsApp. O cartão não tem transparência, então a troca
      // não muda o resultado visível.
      const dataUrl = await Promise.race([
        toJpeg(alvo, {
          pixelRatio: 2,
          quality: 0.92,
          cacheBust: true,
          backgroundColor: "#033583",
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new GeracaoTravadaError()), TIMEOUT_GERACAO_MS)
        ),
      ]);

      const { jsPDF } = await import("jspdf");
      const largura = alvo.offsetWidth;
      const altura = alvo.offsetHeight;

      // Página do tamanho exato da carteirinha: sem margens sobrando nem
      // distorção, e já em retrato por causa da proporção do cartão.
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [largura, altura],
      });
      pdf.addImage(dataUrl, "JPEG", 0, 0, largura, altura);
      pdf.save(fileName);
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
