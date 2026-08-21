import { PublicShell } from "@/components/layout/PublicShell";
import { POLICY_VERSION } from "@/lib/policy";

export default function PrivacidadePage() {
  return (
    <PublicShell backHref="/cadastro" heading="Política de Privacidade">
      <div className="mx-auto max-w-sm space-y-4 pb-4">
        <div className="space-y-4 rounded-2xl bg-white p-5 text-sm text-foreground">
          <p className="text-xs text-muted-foreground">
            Versão {POLICY_VERSION}
          </p>

          <section>
            <h3 className="mb-1 font-bold text-brand-navy">
              O que coletamos
            </h3>
            <p>
              Seu nome completo, número de WhatsApp e, se você informar,
              e-mail. Também coletamos os dados do seu cão (nome, idade,
              raça, sexo, peso e se é castrado) e uma foto dele para montar a
              carteirinha digital.
            </p>
          </section>

          <section>
            <h3 className="mb-1 font-bold text-brand-navy">
              Para que usamos
            </h3>
            <p>
              Para gerar a Carteira Digital do Cão Idoso e enviá-la para o
              seu WhatsApp. Além disso, caso você autorize, para enviar dicas
              de cuidado e bem-estar para cães idosos e comunicações do
              projeto pelo mesmo número. Não usamos seus dados para nenhuma
              outra finalidade.
            </p>
          </section>

          <section>
            <h3 className="mb-1 font-bold text-brand-navy">
              Quem tem acesso
            </h3>
            <p>
              Seus dados são acessados apenas pela equipe do Projeto Cão
              Idoso, vinculado ao PPG Ciência Animal / Medicina Veterinária
              da UNIFRAN, responsável pelo tratamento dessas informações.
            </p>
          </section>

          <section>
            <h3 className="mb-1 font-bold text-brand-navy">
              Seus direitos
            </h3>
            <p>
              Você pode pedir para consultar, corrigir ou excluir seus dados,
              e pode revogar a autorização de receber mensagens pelo
              WhatsApp a qualquer momento, sem afetar a validade da sua
              carteirinha. Para isso, entre em contato com a equipe do
              Projeto Cão Idoso pelos canais oficiais do Hospital
              Veterinário da UNIFRAN.
            </p>
          </section>

          <section>
            <h3 className="mb-1 font-bold text-brand-navy">
              Armazenamento
            </h3>
            <p>
              Os dados ficam armazenados em banco de dados com acesso
              restrito à equipe do projeto, pelo tempo necessário para as
              finalidades descritas acima.
            </p>
          </section>
        </div>
      </div>
    </PublicShell>
  );
}
