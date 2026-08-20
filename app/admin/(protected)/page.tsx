import Link from "next/link";
import { FileSpreadsheet } from "lucide-react";
import { formatWhatsapp } from "@/lib/telefone";
import { listarCadastros, resumo, toRegistrationRow } from "@/lib/cadastros";
import { SummaryCards } from "@/components/admin/SummaryCards";
import { RegistrationsTable } from "@/components/admin/RegistrationsTable";
import { CopiarNumerosButton } from "@/components/admin/CopiarNumerosButton";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const cadastros = await listarCadastros();
  const { totalCaes, totalAutorizados, totalEnviados } = resumo(cadastros);

  const numerosAutorizados = cadastros
    .filter((c) => c.tutor.autorizaWhatsapp)
    .map((c) => formatWhatsapp(c.tutor.whatsapp));

  const ultimos = cadastros.slice(0, 5).map(toRegistrationRow);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-brand-navy">Painel</h2>
        <div className="flex items-center gap-3">
          <Button
            render={<a href="/api/admin/export" />}
            nativeButton={false}
            variant="outline"
          >
            <FileSpreadsheet className="h-4 w-4" /> Exportar para Excel
          </Button>
          <CopiarNumerosButton numeros={numerosAutorizados} />
        </div>
      </div>

      <SummaryCards
        totalCaes={totalCaes}
        totalAutorizados={totalAutorizados}
        totalEnviados={totalEnviados}
      />

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-brand-navy">
            Últimos cadastros
          </h3>
          <Link
            href="/admin/cadastros"
            className="text-sm font-medium text-brand-blue underline underline-offset-4"
          >
            Ver todos
          </Link>
        </div>
        <RegistrationsTable rows={ultimos} busca={false} />
      </div>
    </div>
  );
}
