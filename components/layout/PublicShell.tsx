import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PawHeartLogo } from "@/components/brand/PawHeartLogo";
import { UnifranLogo } from "@/components/brand/UnifranLogo";
import { DotPattern } from "@/components/brand/DotPattern";
import { WaveDivider } from "@/components/brand/WaveDivider";
import { SiteFooter } from "@/components/layout/SiteFooter";

type Props = {
  backHref?: string;
  heading?: string;
  /** Exibe o logo institucional da UNIFRAN no topo branco (usado na home). */
  comLogoUnifran?: boolean;
  children: React.ReactNode;
};

/** Moldura compartilhada pelas telas públicas: topo branco com logo, curva azul, rodapé. */
export function PublicShell({
  backHref,
  heading,
  comLogoUnifran = false,
  children,
}: Props) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="relative overflow-hidden bg-white px-6 pt-10 pb-2 text-center">
        <DotPattern className="pointer-events-none absolute top-6 right-4 h-16 w-16 text-brand-blue-light" />
        {comLogoUnifran && (
          <UnifranLogo
            decorativo
            className="pointer-events-none absolute top-12 left-3 w-52 opacity-15"
          />
        )}
        {backHref && (
          <Link
            href={backHref}
            className="absolute top-8 left-4 text-brand-blue"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
        )}
        <div className="relative z-10">
          <PawHeartLogo className="mx-auto h-14 w-14 text-brand-blue" />
          <h1 className="mt-2 text-2xl font-extrabold leading-tight text-brand-navy">
            Cão Idoso
            <br />
            UNIFRAN
          </h1>
          <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-brand-blue" />
        </div>
        {heading && (
          <h2 className="mt-4 text-3xl font-extrabold text-brand-navy">{heading}</h2>
        )}
      </header>
      <WaveDivider className="-mt-px h-10 w-full" />
      <main className="flex-1 bg-brand-blue-deep px-4 pb-10">{children}</main>
      <SiteFooter />
    </div>
  );
}
