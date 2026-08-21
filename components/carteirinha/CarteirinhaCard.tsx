import { Calendar, Dog, Scale, Scissors, VenusAndMars } from "lucide-react";
import { PawIcon } from "@/components/brand/PawIcon";

type Props = {
  nome: string;
  idadeAnos: number;
  raca: string;
  pesoKg: string;
  sexo: string;
  castrado: boolean;
  tutorNome: string;
  numero: string;
  geradaEm: string;
  fotoUrl: string;
};

export function CarteirinhaCard({
  nome,
  idadeAnos,
  raca,
  pesoKg,
  sexo,
  castrado,
  tutorNome,
  numero,
  geradaEm,
  fotoUrl,
}: Props) {
  const linhas = [
    { icone: Calendar, rotulo: "Idade", valor: `${idadeAnos} anos` },
    { icone: Scale, rotulo: "Peso", valor: `${pesoKg} kg` },
    { icone: Dog, rotulo: "Raça / SRD", valor: raca },
    { icone: VenusAndMars, rotulo: "Sexo", valor: sexo },
    { icone: Scissors, rotulo: "Castrado", valor: castrado ? "Sim" : "Não" },
  ];

  return (
    <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-3xl bg-brand-blue-deep shadow-xl">
      <div className="relative p-4 pb-6">
        <PawIcon className="absolute top-6 right-6 z-10 h-8 w-8 text-brand-red drop-shadow" />
        {/*
          <img> puro, e não next/image, de propósito: este cartão é rasterizado
          para virar o arquivo que o tutor salva. O next/image serve a foto por
          /_next/image e com srcset, e no Safari a imagem não era embutida na
          captura — a carteirinha salva saía sem o cão. Aqui a origem é uma URL
          direta e única.

          O quadrado é a mesma proporção do recorte feito pelo tutor, então a
          foto preenche sem distorcer nem sobrar fundo.
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fotoUrl}
          alt={`Foto de ${nome}`}
          width={340}
          height={340}
          className="aspect-square w-full rounded-2xl object-cover"
        />
      </div>

      <div className="rounded-t-[2rem] bg-white px-5 pt-5 pb-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-2xl font-extrabold text-brand-navy">
            {nome}
          </p>
          <span className="shrink-0 rounded-full bg-brand-blue-light px-3 py-1 text-[0.65rem] font-bold tracking-wide text-brand-blue">
            CÃO IDOSO
          </span>
        </div>

        <dl className="divide-y divide-border text-sm">
          {linhas.map(({ icone: Icone, rotulo, valor }) => (
            <div key={rotulo} className="flex items-center gap-3 py-2">
              <Icone className="h-4 w-4 shrink-0 text-brand-blue" />
              <dt className="w-24 shrink-0 text-muted-foreground">{rotulo}</dt>
              <dd className="min-w-0 flex-1 truncate font-medium text-brand-navy">
                {valor}
              </dd>
            </div>
          ))}
          <div className="flex items-center gap-3 py-2">
            <PawIcon className="h-4 w-4 shrink-0 text-brand-blue" />
            <dt className="w-24 shrink-0 text-muted-foreground">Tutor(a)</dt>
            <dd className="min-w-0 flex-1 truncate font-medium text-brand-navy">
              {tutorNome}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex items-center justify-center gap-2 px-5 pb-4 text-[0.7rem] text-white/85">
        <Calendar className="h-3.5 w-3.5" />
        Cão Idoso nº {numero} • gerada em {geradaEm}
      </div>
    </div>
  );
}
