import { FileSpreadsheet } from "lucide-react";
import { db } from "@/lib/db";
import { formatNumeroCarteirinha } from "@/lib/numero";
import { formatWhatsapp } from "@/lib/telefone";
import { SummaryCards } from "@/components/admin/SummaryCards";
import { RegistrationsTable, type RegistrationRow } from "@/components/admin/RegistrationsTable";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const caes = await db.cao.findMany({
    orderBy: { numeroSequencial: "desc" },
    include: { tutor: true },
  });

  const totalCaes = caes.length;
  const totalAutorizados = caes.filter((c) => c.tutor.autorizaWhatsapp).length;

  const rows: RegistrationRow[] = caes.map((cao) => ({
    id: cao.id,
    numero: formatNumeroCarteirinha(cao.numeroSequencial),
    nomeCao: cao.nome,
    racaIdade: `${cao.raca} • ${cao.idadeAnos} anos`,
    nomeTutor: cao.tutor.nomeCompleto,
    whatsapp: formatWhatsapp(cao.tutor.whatsapp),
    autorizaWhatsapp: cao.tutor.autorizaWhatsapp,
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-brand-navy">Painel</h1>
        <Button
          render={<a href="/api/admin/export" />}
          nativeButton={false}
          className="bg-brand-blue hover:bg-brand-blue/90"
        >
          <FileSpreadsheet className="h-4 w-4" /> Exportar para Excel
        </Button>
      </div>

      <SummaryCards totalCaes={totalCaes} totalAutorizados={totalAutorizados} />

      <div>
        <h2 className="mb-3 text-lg font-bold text-brand-navy">Cadastros</h2>
        <RegistrationsTable rows={rows} />
      </div>
    </div>
  );
}
