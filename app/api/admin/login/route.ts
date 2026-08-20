import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Informe usuário e senha." },
      { status: 400 }
    );
  }

  const admin = await db.adminUser.findUnique({ where: { username } });
  const valid = admin
    ? await bcrypt.compare(password, admin.passwordHash)
    : false;

  if (!admin || !valid) {
    return NextResponse.json(
      { error: "Usuário ou senha inválidos." },
      { status: 401 }
    );
  }

  const session = await getSession();
  session.adminId = admin.id;
  session.adminUsername = admin.username;
  await session.save();

  return NextResponse.json({ ok: true });
}
