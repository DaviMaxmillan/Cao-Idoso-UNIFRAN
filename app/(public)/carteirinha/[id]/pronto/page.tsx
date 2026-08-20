import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { db } from "@/lib/db";
import { PublicShell } from "@/components/layout/PublicShell";
import { CarteirinhaMini } from "@/components/carteirinha/CarteirinhaMini";
import { Button } from "@/components/ui/button";

export default async function CarteirinhaProntaPage({
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

  const autorizou = cao.tutor.autorizaWhatsapp;

  return (
    <PublicShell backHref={`/carteirinha/${cao.id}`}>
      <div className="mx-auto max-w-sm space-y-6 pt-2">
        <div className="text-center text-white">
          <CheckCircle2 className="mx-auto h-12 w-12" />
          <h2 className="mt-2 text-3xl font-extrabold">Tudo certo!</h2>
          <p className="mt-1 text-sm text-white/90">
            A carteirinha digital do seu cão foi criada com sucesso.
          </p>
        </div>

        <CarteirinhaMini nome={cao.nome} fotoUrl={`/api/imagens/${cao.id}`} />

        <div className="rounded-2xl bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-brand-blue" />
            <p className="font-bold text-brand-navy">
              Acompanhamento pelo WhatsApp
            </p>
          </div>
          <ul className="space-y-2 text-sm text-foreground">
            {autorizou ? (
              <>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                  Você receberá dicas mensais sobre cães idosos
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                  As mensagens serão enviadas para o número cadastrado
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                  Você poderá sair da lista quando quiser
                </li>
              </>
            ) : (
              <li className="text-muted-foreground">
                Você optou por não receber as dicas mensais. Se mudar de ideia,
                fale com a equipe do projeto no dia do evento.
              </li>
            )}
          </ul>

          <Button
            render={<Link href="/" />}
            nativeButton={false}
            size="lg"
            className="mt-5 w-full rounded-full bg-brand-blue text-base hover:bg-brand-blue/90"
          >
            Concluir
          </Button>

          <Link
            href={`/carteirinha/${cao.id}`}
            className="mt-3 block text-center text-sm font-medium text-brand-blue underline underline-offset-4"
          >
            Ver minha carteirinha
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
