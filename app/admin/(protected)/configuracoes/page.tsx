import { requireAdmin } from "@/lib/auth";
import { POLICY_VERSION } from "@/lib/policy";
import { TrocarSenhaForm } from "@/components/admin/TrocarSenhaForm";

export default async function AdminConfiguracoesPage() {
  const session = await requireAdmin();
  const anoEvento = process.env.EVENT_YEAR ?? "2026";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-navy">Configurações</h2>
        <p className="text-sm text-muted-foreground">
          Conta de acesso e informações desta edição.
        </p>
      </div>

      <section className="rounded-xl border bg-white p-6">
        <h3 className="mb-1 font-bold text-brand-navy">Trocar senha</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Usuário conectado: <strong>{session.adminUsername}</strong>
        </p>
        <TrocarSenhaForm />
      </section>

      <section className="rounded-xl border bg-white p-6">
        <h3 className="mb-3 font-bold text-brand-navy">Sobre esta edição</h3>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Ano das carteirinhas</dt>
            <dd className="font-medium text-brand-navy">{anoEvento}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">
              Versão da política de privacidade
            </dt>
            <dd className="font-medium text-brand-navy">{POLICY_VERSION}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-muted-foreground">
          O ano das carteirinhas vem da variável de ambiente EVENT_YEAR e é
          fixo de propósito: mudar o ano do servidor não deve renumerar
          carteirinhas já emitidas.
        </p>
      </section>
    </div>
  );
}
