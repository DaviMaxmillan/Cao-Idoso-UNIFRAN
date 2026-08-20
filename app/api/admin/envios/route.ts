import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const { caoId, enviada } = await request.json();

  if (typeof caoId !== "string" || typeof enviada !== "boolean") {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const cao = await db.cao.update({
    where: { id: caoId },
    data: { carteirinhaEnviadaEm: enviada ? new Date() : null },
    select: { id: true, carteirinhaEnviadaEm: true },
  });

  return NextResponse.json(cao);
}
