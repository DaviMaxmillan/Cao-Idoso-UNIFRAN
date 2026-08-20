import "dotenv/config";
import { db } from "@/lib/db";

/**
 * Apaga todos os cadastros (cães e tutores), mantendo os usuários admin.
 * Serve para zerar os dados de teste antes do evento. Exige confirmação
 * explícita para não rodar por engano.
 */
async function main() {
  if (process.argv[2] !== "--confirmar") {
    console.error(
      "Isto apaga TODOS os cadastros de cães e tutores (os admins são mantidos).\n" +
        "Se tem certeza, rode: npm run db:limpar -- --confirmar"
    );
    process.exit(1);
  }

  const caes = await db.cao.deleteMany();
  const tutores = await db.tutor.deleteMany();

  console.log(
    `Removidos ${caes.count} cães e ${tutores.count} tutores.\n` +
      "Atenção: a numeração das carteirinhas NÃO reinicia — a próxima " +
      "continua de onde parou. Para reiniciar em 001, rode também:\n" +
      '  ALTER SEQUENCE "Cao_numeroSequencial_seq" RESTART WITH 1;'
  );

  await db.$disconnect();
}

main();
