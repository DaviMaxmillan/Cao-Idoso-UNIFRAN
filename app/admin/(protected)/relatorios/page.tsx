import { listarCadastros, resumo } from "@/lib/cadastros";
import { BarraDistribuicao } from "@/components/admin/BarraDistribuicao";

const FAIXAS = [
  { label: "Até 8 anos", min: 0, max: 8 },
  { label: "9 a 11 anos", min: 9, max: 11 },
  { label: "12 a 14 anos", min: 12, max: 14 },
  { label: "15 anos ou mais", min: 15, max: Infinity },
];

export default async function AdminRelatoriosPage() {
  const cadastros = await listarCadastros();
  const { totalCaes, totalAutorizados } = resumo(cadastros);

  const porSexo = [
    {
      label: "Fêmeas",
      valor: cadastros.filter((c) => c.sexo === "FEMEA").length,
    },
    {
      label: "Machos",
      valor: cadastros.filter((c) => c.sexo === "MACHO").length,
    },
  ];

  const porFaixaEtaria = FAIXAS.map(({ label, min, max }) => ({
    label,
    valor: cadastros.filter((c) => c.idadeAnos >= min && c.idadeAnos <= max)
      .length,
  }));

  // agrupa ignorando maiúsculas/acentuação de digitação, mas exibe a grafia
  // como o tutor escreveu — normalizar quebraria siglas como "SRD"
  const contagemRacas = new Map<string, { label: string; valor: number }>();
  for (const cao of cadastros) {
    const label = cao.raca.trim();
    const chave = label.toLowerCase();
    const atual = contagemRacas.get(chave);
    contagemRacas.set(chave, {
      label: atual?.label ?? label,
      valor: (atual?.valor ?? 0) + 1,
    });
  }
  const porRaca = [...contagemRacas.values()]
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 8);

  const porAutorizacao = [
    { label: "Autorizaram o contato", valor: totalAutorizados },
    { label: "Não autorizaram", valor: totalCaes - totalAutorizados },
  ];

  const castrados = cadastros.filter((c) => c.castrado).length;
  const porCastracao = [
    { label: "Castrados", valor: castrados },
    { label: "Não castrados", valor: totalCaes - castrados },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-navy">Relatórios</h2>
        <p className="text-sm text-muted-foreground">
          Perfil dos {totalCaes} cães cadastrados nesta edição.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarraDistribuicao titulo="Por faixa etária" itens={porFaixaEtaria} />
        <BarraDistribuicao titulo="Por sexo" itens={porSexo} />
        <BarraDistribuicao titulo="Castração" itens={porCastracao} />
        <BarraDistribuicao
          titulo="Raças mais frequentes"
          itens={porRaca}
          vazio="Nenhum cão cadastrado ainda."
        />
        <BarraDistribuicao
          titulo="Autorização de contato pelo WhatsApp"
          itens={porAutorizacao}
        />
      </div>
    </div>
  );
}
