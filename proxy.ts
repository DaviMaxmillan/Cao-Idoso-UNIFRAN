import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import type { SessionData } from "@/lib/auth";

/**
 * Rotas administrativas que não exigem sessão. O matcher cobre todo o
 * /api/admin/* de propósito: assim uma rota nova nasce protegida, em vez de
 * depender de alguém lembrar de adicioná-la a uma lista.
 */
const ROTAS_PUBLICAS = ["/admin/login", "/api/admin/login", "/api/admin/logout"];

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const session = await getIronSession<SessionData>(request, response, {
    password: process.env.SESSION_SECRET as string,
    cookieName: "cao-idoso-admin-session",
  });

  const { pathname } = request.nextUrl;
  const rotaPublica = ROTAS_PUBLICAS.includes(pathname);

  if (!session.adminId && !rotaPublica) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (session.adminId && pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
