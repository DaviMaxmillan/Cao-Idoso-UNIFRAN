import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { listarCadastros } from "@/lib/cadastros";
import { formatNumeroCarteirinha } from "@/lib/numero";
import { Badge } from "@/components/ui/badge";

export default async function AdminCarteirinhasPage() {
  const cadastros = await listarCadastros();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-navy">Carteirinhas</h2>
        <p className="text-sm text-muted-foreground">
          Abra a carteirinha e use “Salvar no celular” para baixar a imagem que
          será enviada ao tutor pelo WhatsApp.
        </p>
      </div>

      {cadastros.length === 0 ? (
        <p className="rounded-lg border bg-white p-8 text-center text-muted-foreground">
          Nenhuma carteirinha gerada ainda.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cadastros.map((cao) => (
            <li
              key={cao.id}
              className="flex items-center gap-4 rounded-xl border bg-white p-4"
            >
              <Image
                src={`/api/imagens/${cao.id}`}
                alt={`Foto de ${cao.nome}`}
                width={112}
                height={112}
                className="h-16 w-16 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-brand-navy">
                  {cao.nome}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  nº {formatNumeroCarteirinha(cao.numeroSequencial)} •{" "}
                  {cao.tutor.nomeCompleto}
                </p>
                {cao.carteirinhaEnviadaEm ? (
                  <Badge className="mt-1 bg-green-100 text-green-700 hover:bg-green-100">
                    Enviada
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="mt-1">
                    Não enviada
                  </Badge>
                )}
              </div>
              <Link
                href={`/carteirinha/${cao.id}`}
                target="_blank"
                className="inline-flex shrink-0 items-center gap-1 text-sm text-brand-blue underline underline-offset-4"
              >
                Abrir <ExternalLink className="h-3 w-3" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
