type Item = { label: string; valor: number };

type Props = {
  titulo: string;
  itens: Item[];
  vazio?: string;
};

export function BarraDistribuicao({ titulo, itens, vazio }: Props) {
  const maior = Math.max(...itens.map((i) => i.valor), 1);
  const total = itens.reduce((soma, i) => soma + i.valor, 0);

  return (
    <div className="rounded-xl border bg-white p-5">
      <h3 className="mb-4 font-bold text-brand-navy">{titulo}</h3>
      {total === 0 ? (
        <p className="text-sm text-muted-foreground">
          {vazio ?? "Sem dados ainda."}
        </p>
      ) : (
        <ul className="space-y-3">
          {itens.map(({ label, valor }) => (
            <li key={label}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-foreground">{label}</span>
                <span className="font-medium text-brand-navy">{valor}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-brand-blue"
                  style={{ width: `${(valor / maior) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
