import Image from "next/image";
import { PawHeartLogo } from "@/components/brand/PawHeartLogo";
import { BuildingWatermark } from "@/components/brand/BuildingWatermark";

type Props = {
  nome: string;
  fotoUrl: string;
};

/** Miniatura da carteirinha exibida na tela de confirmação. */
export function CarteirinhaMini({ nome, fotoUrl }: Props) {
  return (
    <div className="mx-auto flex h-28 w-64 overflow-hidden rounded-2xl bg-white shadow-lg">
      <div className="relative w-24 shrink-0 bg-brand-blue-deep">
        <Image
          src={fotoUrl}
          alt={`Foto de ${nome}`}
          width={192}
          height={192}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="relative flex flex-1 items-center gap-2 px-3">
        <BuildingWatermark className="pointer-events-none absolute right-1 bottom-1 h-14 w-14 text-brand-blue-deep" />
        <PawHeartLogo className="relative z-10 h-7 w-7 shrink-0 text-brand-blue" />
        <span className="relative z-10 text-xs font-bold leading-tight text-brand-navy">
          Cão Idoso
          <br />
          UNIFRAN
        </span>
      </div>
    </div>
  );
}
