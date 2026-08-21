/**
 * Roda antes das migrations e falha cedo com uma mensagem que diz o que fazer.
 * O erro do Prisma (P1001) só informa que não alcançou o banco, sem indicar que
 * a causa quase sempre é a variável apontando para o lugar errado.
 *
 * Imprime apenas host, porta e nome do banco — nunca usuário ou senha.
 */
const url = process.env.DATABASE_URL;

function erro(mensagem) {
  console.error("\n[banco] " + mensagem + "\n");
  process.exit(1);
}

if (!url) {
  erro(
    "DATABASE_URL não está definida.\n" +
      "No Railway, crie-a no serviço da APLICAÇÃO (não no do banco) com o valor:\n" +
      "    ${{Postgres.DATABASE_URL}}\n" +
      "trocando 'Postgres' pelo nome do serviço do banco no seu projeto."
  );
}

if (url.includes("${{")) {
  erro(
    "DATABASE_URL chegou como texto sem ser resolvido: " +
      url +
      "\nIsso acontece quando o nome do serviço na referência não existe.\n" +
      "Confira o nome exato do serviço do banco no Railway e use-o na referência."
  );
}

let host;
let banco;
try {
  const u = new URL(url);
  host = u.hostname;
  banco = u.pathname.replace("/", "") || "(sem nome)";
} catch {
  erro("DATABASE_URL não é uma URL válida. Verifique o valor da variável.");
}

if (host === "localhost" || host === "127.0.0.1") {
  erro(
    `DATABASE_URL aponta para "${host}", que é a própria máquina da aplicação —\n` +
      "e não há banco rodando lá. Esse é o valor de exemplo do .env.example.\n\n" +
      "No Railway, o banco é outro serviço. No serviço da APLICAÇÃO, em Variables,\n" +
      "troque o valor de DATABASE_URL por uma referência:\n" +
      "    ${{Postgres.DATABASE_URL}}\n" +
      "usando o nome exato que o serviço do banco tem no seu projeto."
  );
}

console.log(`[banco] conectando em ${host} (base: ${banco})`);
