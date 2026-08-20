import { PawPrint, MessageCircle, MessageCircleOff, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  totalCaes: number;
  totalAutorizados: number;
  totalEnviados: number;
};

export function SummaryCards({
  totalCaes,
  totalAutorizados,
  totalEnviados,
}: Props) {
  const items = [
    {
      icon: PawPrint,
      label: "Cães cadastrados",
      value: totalCaes,
    },
    {
      icon: MessageCircle,
      label: "Autorizaram as dicas mensais",
      value: totalAutorizados,
    },
    {
      icon: MessageCircleOff,
      label: "Não autorizaram — não enviar",
      value: totalCaes - totalAutorizados,
    },
    {
      icon: Send,
      label: "Carteirinhas enviadas",
      value: `${totalEnviados}/${totalCaes}`,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ icon: Icon, label, value }) => (
        <Card key={label}>
          <CardContent className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold text-brand-navy">{value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
