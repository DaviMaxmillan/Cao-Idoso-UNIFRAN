import { Info } from "lucide-react";
import { listarCadastros, resumo } from "@/lib/cadastros";
import { formatNumeroCarteirinha } from "@/lib/numero";
import { formatWhatsapp } from "@/lib/telefone";
import { EnviosTable, type EnvioRow } from "@/components/admin/EnviosTable";
import { CopiarNumerosButton } from "@/components/admin/CopiarNumerosButton";

export default async function AdminEnviosPage() {
  const cadastros = await listarCadastros();
  const { totalCaes, totalAutorizados, totalEnviados } = resumo(cadastros);

  const numerosAutorizados = cadastros
    .filter((c) => c.tutor.autorizaWhatsapp)
    .map((c) => formatWhatsapp(c.tutor.whatsapp));

  const rows: EnvioRow[] = cadastros.map((cao) => ({
    id: cao.id,
    numero: formatNumeroCarteirinha(cao.numeroSequencial),
    nomeCao: cao.nome,
    nomeTutor: cao.tutor.nomeCompleto,
    whatsapp: formatWhatsapp(cao.tutor.whatsapp),
    enviadaEm: cao.carteirinhaEnviadaEm
      ? cao.carteirinhaEnviadaEm.toISOString()
      : null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">Envios</h2>
          <p className="text-sm text-muted-foreground">
            {totalEnviados} de {totalCaes} carteirinhas marcadas como enviadas.
          </p>
        </div>
        <CopiarNumerosButton numeros={numerosAutorizados} />
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-brand-blue/20 bg-brand-blue-light p-4 text-sm text-brand-navy">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
        <div className="space-y-1">
          <p>
            O sistema não envia mensagens. Use “Copiar lista para WhatsApp” para
            montar a lista de transmissão das dicas mensais — ela inclui apenas{" "}
            {totalAutorizados === 1
              ? "o único tutor que autorizou"
              : `os ${totalAutorizados} tutores que autorizaram`}
            .
          </p>
          <p>
            A carteirinha, essa sim, vai para todos os tutores. Marque abaixo
            conforme forem enviadas, para a equipe não repetir nem esquecer
            ninguém.
          </p>
        </div>
      </div>

      <EnviosTable rows={rows} />
    </div>
  );
}
