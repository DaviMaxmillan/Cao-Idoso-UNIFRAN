import Image from "next/image";

type Props = {
  className?: string;
  /** Marca d'água: sai da árvore de acessibilidade por ser puro enfeite. */
  decorativo?: boolean;
};

/**
 * Logo institucional da UNIFRAN. O texto do logo é azul escuro, então ele é
 * feito para as áreas brancas do layout — sobre o azul das seções ficaria
 * ilegível.
 */
export function UnifranLogo({ className, decorativo = false }: Props) {
  return (
    <Image
      src="/logo-unifran.png"
      alt={decorativo ? "" : "UNIFRAN — Universidade de Franca"}
      aria-hidden={decorativo || undefined}
      width={480}
      height={146}
      className={`h-auto ${className ?? ""}`}
    />
  );
}
