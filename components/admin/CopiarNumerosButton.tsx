"use client";

import { useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  numeros: string[];
  className?: string;
};

/**
 * Não existe integração com o WhatsApp: o botão copia os números autorizados
 * para a equipe colar na lista de transmissão do próprio aparelho.
 */
export function CopiarNumerosButton({ numeros, className }: Props) {
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState(false);

  async function copiar() {
    setErro(false);
    try {
      await navigator.clipboard.writeText(numeros.join("\n"));
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      setErro(true);
    }
  }

  if (numeros.length === 0) {
    return (
      <Button disabled className={className}>
        <MessageCircle className="h-4 w-4" /> Nenhum número autorizado
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        onClick={copiar}
        className={`bg-brand-blue hover:bg-brand-blue/90 ${className ?? ""}`}
      >
        {copiado ? (
          <>
            <Check className="h-4 w-4" /> {numeros.length} números copiados
          </>
        ) : (
          <>
            <MessageCircle className="h-4 w-4" /> Copiar lista para WhatsApp
          </>
        )}
      </Button>
      {erro && (
        <p className="text-xs text-destructive">
          O navegador bloqueou a cópia. Selecione os números na aba Envios.
        </p>
      )}
    </div>
  );
}
