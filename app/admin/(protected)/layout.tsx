import { UserCircle2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-dvh bg-muted/30">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white px-8 py-4">
          <h1 className="text-xl font-bold text-brand-navy">
            Cão Idoso UNIFRAN — Administração
          </h1>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserCircle2 className="h-5 w-5" />
              {session.adminUsername}
            </span>
            <LogoutButton />
          </div>
        </header>

        <main className="flex-1 px-8 py-8">{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
