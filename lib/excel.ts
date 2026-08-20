import ExcelJS from "exceljs";
import { formatNumeroCarteirinha } from "@/lib/numero";
import { formatWhatsapp } from "@/lib/telefone";

type CadastroRow = {
  numeroSequencial: number;
  nomeCao: string;
  raca: string;
  idadeAnos: number;
  sexo: string;
  pesoKg: number;
  nomeTutor: string;
  whatsapp: string;
  email: string | null;
  autorizaWhatsapp: boolean;
  createdAt: Date;
};

export async function buildCadastrosWorkbook(rows: CadastroRow[]) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Cadastros");

  sheet.columns = [
    { header: "Nº Carteirinha", key: "numero", width: 16 },
    { header: "Cão", key: "nomeCao", width: 20 },
    { header: "Raça", key: "raca", width: 18 },
    { header: "Idade (anos)", key: "idadeAnos", width: 14 },
    { header: "Sexo", key: "sexo", width: 10 },
    { header: "Peso (kg)", key: "pesoKg", width: 12 },
    { header: "Tutor", key: "nomeTutor", width: 26 },
    { header: "WhatsApp", key: "whatsapp", width: 18 },
    { header: "E-mail", key: "email", width: 26 },
    { header: "Autorizou dicas mensais", key: "autoriza", width: 22 },
    { header: "Cadastrado em", key: "createdAt", width: 20 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const row of rows) {
    sheet.addRow({
      numero: formatNumeroCarteirinha(row.numeroSequencial),
      nomeCao: row.nomeCao,
      raca: row.raca,
      idadeAnos: row.idadeAnos,
      sexo: row.sexo === "MACHO" ? "Macho" : "Fêmea",
      pesoKg: row.pesoKg,
      nomeTutor: row.nomeTutor,
      whatsapp: formatWhatsapp(row.whatsapp),
      email: row.email ?? "",
      autoriza: row.autorizaWhatsapp ? "Sim" : "Não",
      createdAt: row.createdAt.toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      }),
    });
  }

  return workbook.xlsx.writeBuffer();
}
