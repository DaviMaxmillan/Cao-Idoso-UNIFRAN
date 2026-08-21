"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type RegistrationRow = {
  id: string;
  numero: string;
  nomeCao: string;
  racaIdade: string;
  nomeTutor: string;
  whatsapp: string;
  autorizaWhatsapp: boolean;
  castrado: boolean;
};

export function RegistrationsTable({
  rows,
  busca: comBusca = true,
}: {
  rows: RegistrationRow[];
  busca?: boolean;
}) {
  const [termoBusca, setTermoBusca] = useState("");

  const filtradas = useMemo(() => {
    const termo = termoBusca.trim().toLowerCase();
    if (!termo) return rows;
    return rows.filter(
      (row) =>
        row.nomeCao.toLowerCase().includes(termo) ||
        row.nomeTutor.toLowerCase().includes(termo)
    );
  }, [rows, termoBusca]);

  return (
    <div className="space-y-4">
      {comBusca && (
        <div className="relative max-w-sm">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome do cão ou tutor..."
            className="pl-9"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº</TableHead>
              <TableHead>Cão</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Castrado</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Carteirinha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtradas.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="text-muted-foreground">
                  {row.numero}
                </TableCell>
                <TableCell>
                  <p className="font-medium">{row.nomeCao}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.racaIdade}
                  </p>
                </TableCell>
                <TableCell>{row.nomeTutor}</TableCell>
                <TableCell>{row.whatsapp}</TableCell>
                <TableCell>{row.castrado ? "Sim" : "Não"}</TableCell>
                <TableCell>
                  {row.autorizaWhatsapp ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      Autorizado
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      Não contatar
                    </Badge>
                  )}
                </TableCell>
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
            {filtradas.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  Nenhum cadastro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
