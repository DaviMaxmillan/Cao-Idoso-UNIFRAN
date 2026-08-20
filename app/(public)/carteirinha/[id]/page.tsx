import { notFound } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const qrDataUrl = await QRCode.toDataURL(
    `${appUrl}/c/${cao.verificationToken}`,
    { margin: 1, width: 240 }
  );

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
          qrDataUrl={qrDataUrl}
        />

        <div className="flex items-start gap-2 rounded-2xl bg-white/10 p-4 text-sm text-white">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Salve a imagem no seu celular — ela é a sua carteirinha. O QR code
            permite conferir o cadastro a qualquer momento.
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
