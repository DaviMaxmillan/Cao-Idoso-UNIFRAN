import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const cao = await db.cao.findUnique({
    where: { id },
    select: { fotoBytes: true, fotoMimeType: true },
  });

  if (!cao) {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(cao.fotoBytes), {
    headers: {
      "Content-Type": cao.fotoMimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
