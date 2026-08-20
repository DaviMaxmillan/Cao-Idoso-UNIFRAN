"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type EnvioRow = {
  id: string;
  numero: string;
  nomeCao: string;
  nomeTutor: string;
  whatsapp: string;
  enviadaEm: string | null;
};

export function EnviosTable({ rows }: { rows: EnvioRow[] }) {
  const router = useRouter();
  const [pendente, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  async function alternar(caoId: string, enviada: boolean) {
    setErro(null);
    try {
      const res = await fetch("/api/admin/envios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caoId, enviada }),
      });
      if (!res.ok) throw new Error();
      startTransition(() => router.refresh());
    } catch {
      setErro("Não foi possível salvar. Tente novamente.");
    }
  }

  return (
    <div className="space-y-3">
      {erro && <p className="text-sm text-destructive">{erro}</p>}
      <div className="overflow-x-auto rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Enviada</TableHead>
              <TableHead>Nº</TableHead>
              <TableHead>Cão</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Carteirinha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} data-pendente={pendente || undefined}>
                <TableCell>
                  <input
                    type="checkbox"
                    className="size-5 accent-brand-blue"
                    checked={row.enviadaEm !== null}
                    onChange={(e) => alternar(row.id, e.target.checked)}
                    aria-label={`Marcar carteirinha de ${row.nomeCao} como enviada`}
                  />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {row.numero}
                </TableCell>
                <TableCell className="font-medium">{row.nomeCao}</TableCell>
                <TableCell>{row.nomeTutor}</TableCell>
                <TableCell>{row.whatsapp}</TableCell>
                <TableCell>
                  <Link
                    href={`/carteirinha/${row.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-brand-blue underline underline-offset-4"
                  >
                    Abrir <ExternalLink className="h-3 w-3" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  Nenhum cadastro ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
