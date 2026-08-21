import Link from "next/link";
import { ClipboardList, IdCard, MessageCircle, Heart } from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { HeroDogPhoto } from "@/components/brand/HeroDogPhoto";
import { Button } from "@/components/ui/button";

const passos = [
  {
    icon: ClipboardList,
    titulo: "1. Cadastre você e seu cão",
    texto: "Informe seus dados e os do seu cão idoso de forma rápida e simples.",
  },
  {
    icon: IdCard,
    titulo: "2. Gere a carteirinha digital",
    texto: "Sua carteirinha digital personalizada ficará pronta na hora.",
  },
  {
    icon: MessageCircle,
    titulo: "3. Receba dicas no WhatsApp",
    texto:
      "Você poderá receber dicas e informações do Projeto Cão Idoso pelo WhatsApp.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <PublicShell backHref="/" heading="Como funciona">
      <div className="mx-auto max-w-sm space-y-6 pt-2">
        <HeroDogPhoto />

        <div className="space-y-3">
          {passos.map(({ icon: Icon, titulo, texto }) => (
            <div key={titulo} className="flex gap-3 rounded-2xl bg-white p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-brand-navy">{titulo}</p>
                <p className="text-sm text-muted-foreground">{texto}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 text-sm text-white">
          <Heart className="mt-0.5 h-4 w-4 shrink-0" />
          <p>É gratuito e você pode sair da lista quando quiser.</p>
        </div>

        <Button
          render={<Link href="/cadastro" />}
          nativeButton={false}
          size="lg"
          className="w-full rounded-full bg-white text-base text-brand-blue hover:bg-white/90"
        >
          Criar a carteirinha do meu cão
        </Button>
      </div>
    </PublicShell>
  );
}
