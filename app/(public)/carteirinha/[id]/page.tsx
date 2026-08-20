import { notFound } from "next/navigation";
import Link from "next/link";
import { Info } from "lucide-react";
import { db } from "@/lib/db";
import { formatNumeroCarteirinha } from "@/lib/numero";
import { PublicShell } from "@/components/layout/PublicShell";
import { CarteirinhaCardWithActions } from "@/components/carteirinha/CarteirinhaCardWithActions";

export default async function CarteirinhaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cao = await db.cao.findUnique({
    where: { id },
    include: { tutor: true },
  });

  if (!cao) notFound();

  return (
    <PublicShell backHref="/" heading="Carteirinha pronta">
      <div className="mx-auto max-w-sm space-y-6 pt-2">
        <CarteirinhaCardWithActions
          nome={cao.nome}
          idadeAnos={cao.idadeAnos}
          raca={cao.raca}
          pesoKg={cao.pesoKg.toString()}
          tutorNome={cao.tutor.nomeCompleto}
          numero={formatNumeroCarteirinha(cao.numeroSequencial)}
          fotoUrl={`/api/imagens/${cao.id}`}
        />

        <div className="flex items-start gap-2 rounded-2xl bg-white/10 p-4 text-sm text-white">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Você também receberá esta carteirinha no WhatsApp cadastrado.
          </p>
        </div>

        <Link
          href={`/carteirinha/${cao.id}/pronto`}
          className="block text-center text-sm font-medium text-white underline underline-offset-4"
        >
          Continuar
        </Link>
      </div>
    </PublicShell>
  );
}
