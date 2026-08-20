import { requireAdmin } from "@/lib/auth";
import { PawHeartLogo } from "@/components/brand/PawHeartLogo";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="min-h-dvh bg-muted/30">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div className="flex items-center gap-2">
          <PawHeartLogo className="h-8 w-8 text-brand-blue" />
          <div>
            <p className="text-sm font-bold text-brand-navy leading-tight">
              Cão Idoso UNIFRAN
            </p>
            <p className="text-xs text-muted-foreground leading-tight">
              Administração
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {session.adminUsername}
          </span>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
