import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { formatNumeroCarteirinha } from "@/lib/numero";
import { PublicShell } from "@/components/layout/PublicShell";
import { CarteirinhaCard } from "@/components/carteirinha/CarteirinhaCard";

export default async function VerificacaoCarteirinhaPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const cao = await db.cao.findUnique({
    where: { verificationToken: token },
    include: { tutor: true },
  });

  if (!cao) notFound();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const qrDataUrl = await QRCode.toDataURL(`${appUrl}/c/${cao.verificationToken}`, {
    margin: 1,
    width: 240,
  });

  return (
    <PublicShell heading="Carteirinha verificada">
      <div className="mx-auto max-w-sm space-y-4 pt-2">
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-white">
          <ShieldCheck className="h-5 w-5" />
          Cadastro oficial do Projeto Cão Idoso UNIFRAN
        </div>
        <CarteirinhaCard
          nome={cao.nome}
          idadeAnos={cao.idadeAnos}
          raca={cao.raca}
          pesoKg={cao.pesoKg.toString()}
          tutorNome={cao.tutor.nomeCompleto}
          numero={formatNumeroCarteirinha(cao.numeroSequencial)}
          fotoUrl={`/api/imagens/${cao.id}`}
          qrDataUrl={qrDataUrl}
        />
      </div>
    </PublicShell>
  );
}
