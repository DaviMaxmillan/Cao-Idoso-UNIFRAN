import { FileSpreadsheet } from "lucide-react";
import { listarCadastros, toRegistrationRow } from "@/lib/cadastros";
import { RegistrationsTable } from "@/components/admin/RegistrationsTable";
import { Button } from "@/components/ui/button";

export default async function AdminCadastrosPage() {
  const cadastros = await listarCadastros();
  const rows = cadastros.map(toRegistrationRow);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">Cadastros</h2>
          <p className="text-sm text-muted-foreground">
            {rows.length} {rows.length === 1 ? "cão cadastrado" : "cães cadastrados"}
          </p>
        </div>
        <Button
          render={<a href="/api/admin/export" />}
          nativeButton={false}
          className="bg-brand-blue hover:bg-brand-blue/90"
        >
          <FileSpreadsheet className="h-4 w-4" /> Exportar para Excel
        </Button>
      </div>

      <RegistrationsTable rows={rows} />
    </div>
  );
}
