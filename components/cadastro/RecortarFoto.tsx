"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Loader2, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  imagemUrl: string;
  onConfirmar: (recorte: Blob) => void;
  onCancelar: () => void;
};

const LADO_FINAL = 900; // quadrado gerado, com folga para telas 2x

/**
 * Recorta a foto do cão antes do envio: o tutor aproxima e reenquadra até o
 * cão ficar bem posicionado. Sem isto a carteirinha corta a foto pelo centro,
 * o que costuma decepar a cabeça do animal em fotos de corpo inteiro.
 */
export function RecortarFoto({ imagemUrl, onConfirmar, onCancelar }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [processando, setProcessando] = useState(false);

  const aoCompletar = useCallback((_: Area, areaEmPixels: Area) => {
    setArea(areaEmPixels);
  }, []);

  async function confirmar() {
    if (!area) return;
    setProcessando(true);
    try {
      const imagem = await carregarImagem(imagemUrl);
      const canvas = document.createElement("canvas");
      canvas.width = LADO_FINAL;
      canvas.height = LADO_FINAL;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(
        imagem,
        area.x,
        area.y,
        area.width,
        area.height,
        0,
        0,
        LADO_FINAL,
        LADO_FINAL
      );

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.9)
      );
      if (blob) onConfirmar(blob);
    } finally {
      setProcessando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-brand-navy/95 p-4">
      <p className="py-3 text-center text-sm font-medium text-white">
        Arraste para posicionar e use o zoom para enquadrar
      </p>

      <div className="relative flex-1 overflow-hidden rounded-2xl bg-black">
        <Cropper
          image={imagemUrl}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={aoCompletar}
        />
      </div>

      <label className="mt-4 flex items-center gap-3 text-white">
        <ZoomIn className="h-5 w-5 shrink-0" />
        <input
          type="range"
          min={1}
          max={4}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          aria-label="Aproximar a foto"
          className="h-2 w-full accent-brand-blue"
        />
      </label>

      <div className="mt-4 flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancelar}
          className="rounded-full"
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={confirmar}
          disabled={processando}
          size="lg"
          className="flex-1 rounded-full bg-brand-blue text-base hover:bg-brand-blue/90"
        >
          {processando ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Usar esta foto"
          )}
        </Button>
      </div>
    </div>
  );
}

function carregarImagem(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
