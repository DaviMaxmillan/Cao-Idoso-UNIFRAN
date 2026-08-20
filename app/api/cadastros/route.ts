import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cadastroSchema } from "@/lib/validation";
import { readAndValidateImage, InvalidImageError } from "@/lib/image";
import { POLICY_VERSION } from "@/lib/policy";

export async function POST(request: Request) {
  const formData = await request.formData();

  const raw = {
    nomeCompleto: formData.get("nomeCompleto"),
    whatsapp: formData.get("whatsapp"),
    email: formData.get("email"),
    autorizaWhatsapp: formData.get("autorizaWhatsapp") === "true",
    aceitouPoliticaPrivacidade:
      formData.get("aceitouPoliticaPrivacidade") === "true",
    nomeCao: formData.get("nomeCao"),
    idadeAnos: formData.get("idadeAnos"),
    raca: formData.get("raca"),
    sexo: formData.get("sexo"),
    pesoKg: formData.get("pesoKg"),
  };

  const parsed = cadastroSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const fotoEntry = formData.get("foto");
  if (!(fotoEntry instanceof File) || fotoEntry.size === 0) {
    return NextResponse.json(
      { error: "Adicione uma foto do seu cão." },
      { status: 400 }
    );
  }

  let foto;
  try {
    foto = await readAndValidateImage(fotoEntry);
  } catch (err) {
    if (err instanceof InvalidImageError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }

  const data = parsed.data;

  const cao = await db.$transaction(async (tx) => {
    const tutor = await tx.tutor.upsert({
      where: { whatsapp: data.whatsapp },
      update: {
        nomeCompleto: data.nomeCompleto,
        email: data.email || null,
        autorizaWhatsapp: data.autorizaWhatsapp,
        aceitouPoliticaPrivacidade: data.aceitouPoliticaPrivacidade,
        politicaAceitaEm: new Date(),
        politicaVersao: POLICY_VERSION,
      },
      create: {
        nomeCompleto: data.nomeCompleto,
        whatsapp: data.whatsapp,
        email: data.email || null,
        autorizaWhatsapp: data.autorizaWhatsapp,
        aceitouPoliticaPrivacidade: data.aceitouPoliticaPrivacidade,
        politicaAceitaEm: new Date(),
        politicaVersao: POLICY_VERSION,
      },
    });

    return tx.cao.create({
      data: {
        tutorId: tutor.id,
        nome: data.nomeCao,
        idadeAnos: data.idadeAnos,
        raca: data.raca,
        sexo: data.sexo,
        pesoKg: data.pesoKg,
        fotoBytes: new Uint8Array(foto.bytes),
        fotoMimeType: foto.mimeType,
      },
    });
  });

  return NextResponse.json({
    id: cao.id,
    verificationToken: cao.verificationToken,
  });
}
