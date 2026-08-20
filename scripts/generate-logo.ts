import path from "node:path";
import sharp from "sharp";

/**
 * Prepara o logo institucional para uso no app: remove a margem transparente
 * que sobra no arquivo original e reduz para um tamanho adequado à tela.
 */
async function main() {
  const origem = path.resolve("Docs/Logo Unifran.png");
  const destino = path.resolve("public/logo-unifran.png");

  const info = await sharp(origem)
    .trim()
    .resize({ width: 480, withoutEnlargement: true })
    .png()
    .toFile(destino);

  console.log(
    `public/logo-unifran.png gerado (${info.width}x${info.height}, ${Math.round(info.size / 1024)}KB)`
  );
}

main();
