import Image from "next/image";

type Props = { className?: string };

/**
 * Golden Retriever recortado, sem moldura, sobre o azul da seção — como no
 * layout aprovado. A imagem encosta na base do bloco de propósito: a foto é
 * cortada na altura do peito, e o corte reto some ao encontrar o cartão branco
 * logo abaixo.
 */
export function HeroDogPhoto({ className }: Props) {
  return (
    <div className={`flex items-end justify-center ${className ?? ""}`}>
      <Image
        src="/hero-golden.png"
        alt="Golden Retriever idoso atendido pelo projeto"
        width={271}
        height={341}
        priority
        className="w-64 max-w-full"
      />
    </div>
  );
}
