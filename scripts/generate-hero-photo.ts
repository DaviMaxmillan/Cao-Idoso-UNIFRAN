import path from "node:path";
import sharp from "sharp";

/**
 * Extrai o Golden Retriever do mockup original (Docs/1.jpeg) para usar como foto
 * de destaque. É um recorte do próprio material da cliente, então serve de
 * provisório fiel ao layout aprovado — veja a pendência no README sobre
 * substituir por uma foto em alta e com licença confirmada.
 */
const RECORTE = { left: 390, top: 505, width: 365, height: 365 };

async function main() {
  const origem = path.resolve("Docs/1.jpeg");
  const destino = path.resolve("public/hero-golden.jpg");

  await sharp(origem)
    .extract(RECORTE)
    .resize(512, 512, { fit: "cover" })
    .jpeg({ quality: 88 })
    .toFile(destino);

  console.log("public/hero-golden.jpg gerado a partir de Docs/1.jpeg");
}

main();
