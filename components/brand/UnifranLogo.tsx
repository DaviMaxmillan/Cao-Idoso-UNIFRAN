import Image from "next/image";

type Props = { className?: string };

/**
 * Logo institucional da UNIFRAN. O texto do logo é azul escuro, então ele é
 * feito para as áreas brancas do layout — sobre o azul das seções ficaria
 * ilegível.
 */
export function UnifranLogo({ className }: Props) {
  return (
    <Image
      src="/logo-unifran.png"
      alt="UNIFRAN — Universidade de Franca"
      width={480}
      height={146}
      className={`h-auto ${className ?? ""}`}
    />
  );
}
