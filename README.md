# Cão Idoso UNIFRAN — Carteirinha Digital

PWA que gera a **Carteira Digital do Cão Idoso** para os tutores atendidos pelo projeto de extensão Cão Idoso da UNIFRAN (10ª edição, evento em 25/09/2026).

O tutor se cadastra pelo celular (dados dele + do cão + foto), o sistema gera a carteirinha personalizada com QR code, e ele salva a imagem no celular ou compartilha no WhatsApp. A equipe do projeto acompanha os cadastros por um painel administrativo e exporta a lista para Excel.

> O disparo mensal de dicas pelo WhatsApp é feito **manualmente pela equipe**, fora deste sistema. O app apenas registra a autorização do tutor e disponibiliza os telefones na exportação.

## Stack

Next.js 16 (App Router) · TypeScript · PostgreSQL + Prisma 7 · Tailwind + shadcn/ui · Serwist (PWA)

## Rodando localmente

```bash
npm install
```

Suba um Postgres local de desenvolvimento:

```bash
npx prisma dev -d --name cao-idoso
```

Copie `.env.example` para `.env` e preencha o `DATABASE_URL` com a URL que o comando acima imprimiu. Depois aplique o schema e crie um usuário admin:

```bash
npx prisma migrate deploy
```

```bash
npm run seed:admin -- admin suaSenhaAqui
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

- App público: http://localhost:3000
- Painel administrativo: http://localhost:3000/admin

## Variáveis de ambiente

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | String de conexão do PostgreSQL. |
| `SESSION_SECRET` | Segredo do cookie de sessão do admin (32+ caracteres aleatórios). |
| `NEXT_PUBLIC_APP_URL` | URL pública da aplicação, usada para montar o link do QR code. |
| `EVENT_YEAR` | Ano fixo exibido no número da carteirinha (ex.: `2026`). |

## Deploy no Railway

Dois recursos no projeto: o serviço da aplicação (build automático via Nixpacks) e o plugin **PostgreSQL**, que injeta `DATABASE_URL` automaticamente.

O `npm start` roda `prisma migrate deploy` antes do `next start`, então as migrations são aplicadas a cada deploy. Depois do primeiro deploy, crie o usuário administrador uma vez:

```bash
railway run npm run seed:admin -- admin suaSenhaAqui
```

## Estrutura

```
app/(public)      telas do tutor: home, como funciona, cadastro, carteirinha, verificação, privacidade
app/admin         login e painel da equipe do projeto
app/api           cadastro, imagens dos cães, login/logout e exportação Excel
components/       brand (logo, padrões), cadastro, carteirinha, admin, layout, ui (shadcn)
lib/              prisma client, sessão, validação, geração do número, exportação Excel
prisma/           schema e migrations
scripts/          seed do admin e geração dos ícones/placeholder
```

## Pendências

- **Foto de destaque** (`public/hero-golden.jpg`): hoje é um recorte do Golden Retriever que já aparecia no mockup `Docs/1.jpeg`, gerado por `scripts/generate-hero-photo.ts`. Serve para o layout ficar fiel ao aprovado, mas tem duas limitações: a resolução é baixa (a origem é o próprio JPEG do mockup) e a licença da imagem original não foi verificada. Antes do evento, vale substituir por uma foto de Golden em alta resolução e com uso autorizado — basta trocar o arquivo mantendo o nome.
