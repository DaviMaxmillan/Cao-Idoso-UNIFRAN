"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  IdCard,
  Send,
  BarChart3,
  Settings,
} from "lucide-react";
import { PawHeartLogo } from "@/components/brand/PawHeartLogo";
import { BuildingWatermark } from "@/components/brand/BuildingWatermark";
import { cn } from "@/lib/utils";

const itens = [
  { href: "/admin", label: "Painel", icon: LayoutGrid },
  { href: "/admin/cadastros", label: "Cadastros", icon: Users },
  { href: "/admin/carteirinhas", label: "Carteirinhas", icon: IdCard },
  { href: "/admin/envios", label: "Envios", icon: Send },
  { href: "/admin/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="relative flex w-60 shrink-0 flex-col overflow-hidden border-r bg-white">
      <div className="flex items-center gap-2 px-5 py-6">
        <PawHeartLogo className="h-9 w-9 shrink-0 text-brand-blue" />
        <span className="text-sm font-bold leading-tight text-brand-navy">
          Cão Idoso
          <br />
          UNIFRAN
        </span>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {itens.map(({ href, label, icon: Icon }) => {
          const ativo =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={ativo ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                ativo
                  ? "bg-brand-blue text-white"
                  : "text-brand-navy hover:bg-brand-blue-light"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <BuildingWatermark className="pointer-events-none absolute -bottom-4 left-2 h-40 w-40 text-brand-blue-deep/25" />
    </aside>
  );
}
