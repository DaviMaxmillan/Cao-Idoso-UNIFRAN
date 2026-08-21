import { formatNumeroCarteirinha } from "@/lib/numero";
import type { Cadastro } from "@/lib/cadastros";

/** Monta as props da carteirinha a partir do cadastro, num lugar só. */
export function toCarteirinhaProps(cao: Cadastro) {
  return {
    nome: cao.nome,
    idadeAnos: cao.idadeAnos,
    raca: cao.raca,
    pesoKg: cao.pesoKg.toString(),
    sexo: cao.sexo === "MACHO" ? "Macho" : "Fêmea",
    castrado: cao.castrado,
    tutorNome: cao.tutor.nomeCompleto,
    numero: formatNumeroCarteirinha(cao.numeroSequencial),
    geradaEm: cao.createdAt.toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    }),
    fotoUrl: `/api/imagens/${cao.id}`,
  };
}
