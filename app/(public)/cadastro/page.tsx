import { PublicShell } from "@/components/layout/PublicShell";
import { CadastroForm } from "@/components/cadastro/CadastroForm";

export default function CadastroPage() {
  return (
    <PublicShell backHref="/">
      <div className="mx-auto max-w-sm pt-4">
        <CadastroForm />
      </div>
    </PublicShell>
  );
}
