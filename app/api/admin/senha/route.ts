import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const { senhaAtual, novaSenha } = await request.json();

  if (typeof senhaAtual !== "string" || typeof novaSenha !== "string") {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  if (novaSenha.length < 8) {
    return NextResponse.json(
      { error: "A nova senha precisa ter pelo menos 8 caracteres." },
      { status: 400 }
    );
  }

  const session = await getSession();
  const admin = await db.adminUser.findUnique({
    where: { id: session.adminId },
  });

  if (!admin || !(await bcrypt.compare(senhaAtual, admin.passwordHash))) {
    return NextResponse.json(
      { error: "Senha atual incorreta." },
      { status: 401 }
    );
  }

  await db.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash: await bcrypt.hash(novaSenha, 12) },
  });

  return NextResponse.json({ ok: true });
}
