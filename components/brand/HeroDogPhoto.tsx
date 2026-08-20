import Image from "next/image";
import { BuildingWatermark } from "@/components/brand/BuildingWatermark";

type Props = { className?: string };

/** Foto de destaque do Golden Retriever, usada na home e na tela "Como funciona". */
export function HeroDogPhoto({ className }: Props) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <BuildingWatermark className="pointer-events-none absolute right-2 bottom-2 h-24 w-24 text-white" />
      <Image
        src="/hero-golden.jpg"
        alt="Golden Retriever idoso atendido pelo projeto"
        width={512}
        height={512}
        priority
        className="mx-auto aspect-square w-56 rounded-full border-4 border-white object-cover shadow-lg"
      />
    </div>
  );
}
