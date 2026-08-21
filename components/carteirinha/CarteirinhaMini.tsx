import Image from "next/image";
import { PawHeartLogo } from "@/components/brand/PawHeartLogo";
import { PawIcon } from "@/components/brand/PawIcon";

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
        <PawIcon className="pointer-events-none absolute top-2 right-2 h-4 w-4 text-brand-red" />
        <PawHeartLogo className="h-7 w-7 shrink-0 text-brand-blue" />
        <span className="text-xs font-bold leading-tight text-brand-navy">
          Carteira Digital
          <br />
          Cão Idoso
        </span>
      </div>
    </div>
  );
}
