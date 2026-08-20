import Image from "next/image";
import { PawHeartLogo } from "@/components/brand/PawHeartLogo";
import { BuildingWatermark } from "@/components/brand/BuildingWatermark";

type Props = {
  nome: string;
  idadeAnos: number;
  raca: string;
  pesoKg: string;
  tutorNome: string;
  numero: string;
  fotoUrl: string;
};

export function CarteirinhaCard({
  nome,
  idadeAnos,
  raca,
  pesoKg,
  tutorNome,
  numero,
  fotoUrl,
}: Props) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
      <div className="flex items-center gap-2 px-5 pt-5">
        <PawHeartLogo className="h-6 w-6 text-brand-blue" />
        <span className="text-sm font-bold leading-tight text-brand-navy">
          Carteira Digital
          <br />
          Cão Idoso
        </span>
      </div>

      <div className="relative mt-4 flex min-h-52 items-end overflow-hidden bg-brand-blue-deep px-5 pt-6 pb-4 text-white">
        <BuildingWatermark className="pointer-events-none absolute top-2 right-2 h-20 w-20 text-white" />
        <div className="relative z-10 max-w-[58%] space-y-1 text-sm">
          <p className="text-2xl font-extrabold break-words">{nome}</p>
          <p>{idadeAnos} anos</p>
          <p className="break-words">{raca}</p>
          <p>{pesoKg} kg</p>
          <p className="break-words">Tutor(a): {tutorNome}</p>
          <p className="font-semibold">Cão Idoso nº {numero}</p>
        </div>
        <Image
          src={fotoUrl}
          alt={`Foto de ${nome}`}
          width={240}
          height={240}
          className="pointer-events-none absolute right-0 bottom-0 h-44 w-40 rounded-tl-3xl object-cover"
        />
      </div>

      <div className="flex items-center gap-2 px-5 py-4">
        <PawHeartLogo className="h-6 w-6 text-brand-blue" />
        <span className="text-sm font-bold leading-tight text-brand-navy">
          Cão Idoso
          <br />
          UNIFRAN
        </span>
      </div>
    </div>
  );
}
