import path from "node:path";
import sharp from "sharp";

/**
 * Recorta o fundo branco da foto do Golden (Docs/golden.jpg) e gera um PNG com
 * transparência, para o cão aparecer solto sobre o azul da seção.
 *
 * O recorte é por preenchimento a partir das bordas: só o branco conectado à
 * borda vira transparente. Assim, qualquer região clara cercada pelo cão (um
 * reflexo no pelo, por exemplo) é preservada.
 */

/** O fundo é branco puro; o pelo mais claro do cão fica bem abaixo disso. */
function ehFundo(r: number, g: number, b: number) {
  const claro = r > 240 && g > 240 && b > 240;
  const semCor = Math.max(r, g, b) - Math.min(r, g, b) < 15;
  return claro && semCor;
}

async function main() {
  const origem = path.resolve("Docs/golden.jpg");
  const destino = path.resolve("public/hero-golden.png");

  const { data, info } = await sharp(origem)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const visitado = new Uint8Array(width * height);
  const fila: number[] = [];

  const enfileirar = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = y * width + x;
    if (visitado[p]) return;
    const i = p * channels;
    if (!ehFundo(data[i], data[i + 1], data[i + 2])) return;
    visitado[p] = 1;
    fila.push(x, y);
  };

  for (let x = 0; x < width; x++) {
    enfileirar(x, 0);
    enfileirar(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    enfileirar(0, y);
    enfileirar(width - 1, y);
  }

  while (fila.length) {
    const y = fila.pop()!;
    const x = fila.pop()!;
    data[(y * width + x) * channels + 3] = 0;
    enfileirar(x + 1, y);
    enfileirar(x - 1, y);
    enfileirar(x, y + 1);
    enfileirar(x, y - 1);
  }

  const info2 = await sharp(data, { raw: { width, height, channels } })
    .trim({ threshold: 1 })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(destino);

  console.log(
    `public/hero-golden.png gerado (${info2.width}x${info2.height}, ${Math.round(info2.size / 1024)}KB)`
  );
}

main();
