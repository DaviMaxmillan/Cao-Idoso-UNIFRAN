import { db } from "@/lib/db";
import { formatNumeroCarteirinha } from "@/lib/numero";
import { formatWhatsapp } from "@/lib/telefone";
import type { RegistrationRow } from "@/components/admin/RegistrationsTable";

/** Cadastros com tutor, do mais recente para o mais antigo. */
export function listarCadastros() {
  return db.cao.findMany({
    orderBy: { numeroSequencial: "desc" },
    include: { tutor: true },
  });
}

export type Cadastro = Awaited<ReturnType<typeof listarCadastros>>[number];

export function toRegistrationRow(cao: Cadastro): RegistrationRow {
  return {
    id: cao.id,
    numero: formatNumeroCarteirinha(cao.numeroSequencial),
    nomeCao: cao.nome,
    racaIdade: `${cao.raca} • ${cao.idadeAnos} anos`,
    nomeTutor: cao.tutor.nomeCompleto,
    whatsapp: formatWhatsapp(cao.tutor.whatsapp),
    autorizaWhatsapp: cao.tutor.autorizaWhatsapp,
    castrado: cao.castrado,
  };
}

export function resumo(cadastros: Cadastro[]) {
  const totalCaes = cadastros.length;
  const totalAutorizados = cadastros.filter(
    (c) => c.tutor.autorizaWhatsapp
  ).length;
  const totalEnviados = cadastros.filter((c) => c.carteirinhaEnviadaEm).length;

  return { totalCaes, totalAutorizados, totalEnviados };
}
