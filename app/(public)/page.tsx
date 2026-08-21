import Link from "next/link";
import { IdCard } from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { HeroDogPhoto } from "@/components/brand/HeroDogPhoto";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <PublicShell comLogoUnifran>
      <div className="mx-auto max-w-sm pt-2">
        <HeroDogPhoto />

        <div className="rounded-3xl bg-white p-6 text-center shadow-xl">
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
              <IdCard className="h-5 w-5" />
            </span>
            <h2 className="text-left text-lg font-bold text-brand-navy">
              Carteira Digital
              <br />
              do Cão Idoso
            </h2>
          </div>
          <p className="mb-5 text-sm text-muted-foreground">
            Crie a carteirinha do seu cão e receba dicas de cuidados e
            bem-estar do Projeto Cão Idoso pelo{" "}
            <span className="font-semibold text-brand-blue">WhatsApp</span>.
          </p>
          <Button
            render={<Link href="/cadastro" />}
            nativeButton={false}
            size="lg"
            className="w-full rounded-full bg-brand-blue text-base hover:bg-brand-blue/90"
          >
            Criar a carteirinha do meu cão
          </Button>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/como-funciona"
            className="text-sm font-medium text-white underline underline-offset-4"
          >
            Saiba como funciona
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
