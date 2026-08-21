import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildCadastrosWorkbook } from "@/lib/excel";

export async function GET() {
  const caes = await db.cao.findMany({
    orderBy: { numeroSequencial: "asc" },
    include: { tutor: true },
  });

  const buffer = await buildCadastrosWorkbook(
    caes.map((cao) => ({
      numeroSequencial: cao.numeroSequencial,
      nomeCao: cao.nome,
      raca: cao.raca,
      idadeAnos: cao.idadeAnos,
      sexo: cao.sexo,
      pesoKg: Number(cao.pesoKg),
      castrado: cao.castrado,
      nomeTutor: cao.tutor.nomeCompleto,
      whatsapp: cao.tutor.whatsapp,
      email: cao.tutor.email,
      autorizaWhatsapp: cao.tutor.autorizaWhatsapp,
      createdAt: cao.createdAt,
    }))
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="cao-idoso-cadastros.xlsx"`,
    },
  });
}
