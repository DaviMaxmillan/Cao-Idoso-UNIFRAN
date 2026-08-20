import path from "node:path";
import sharp from "sharp";

/**
 * Extrai o Golden Retriever do mockup original (Docs/1.jpeg) e recorta o fundo,
 * gerando um PNG com transparência — assim o cão aparece "solto" sobre o azul,
 * como no layout aprovado, em vez de dentro de uma moldura.
 *
 * O recorte é feito por preenchimento a partir das bordas: só o fundo conectado
 * à borda vira transparente, então o pelo claro do focinho e do peito (que é
 * quase branco) é preservado por estar cercado pelo resto do cão.
 */
const RECORTE = { left: 368, top: 472, width: 408, height: 388 };

/**
 * O pelo do Golden é sempre alaranjado — o canal vermelho fica bem acima do
 * azul. Tanto o fundo azul quanto a curva branca (e a transição serrilhada
 * entre os dois) têm azul próximo ou acima do vermelho, o que separa os dois
 * casos sem depender de um limiar de brilho.
 */
function ehFundo(r: number, g: number, b: number) {
  return b >= r - 15;
}

async function main() {
  const origem = path.resolve("Docs/1.jpeg");
  const destino = path.resolve("public/hero-golden.png");

  const { data, info } = await sharp(origem)
    .extract(RECORTE)
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

  // A borda de baixo é toda peito do cão (a foto é cortada ali), e esse pelo é
  // quase branco. Semear a partir dela comeria o peito, então ficam só o topo
  // e as laterais.
  for (let x = 0; x < width; x++) enfileirar(x, 0);
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

  // 560px cobre com folga os 256px em que a imagem é exibida, mesmo em telas
  // 2x; a paleta reduz o arquivo sem perda perceptível neste tamanho.
  const info2 = await sharp(data, { raw: { width, height, channels } })
    .trim({ threshold: 1 })
    .resize({ width: 560 })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(destino);

  console.log(
    `public/hero-golden.png gerado (${info2.width}x${info2.height}, ${Math.round(info2.size / 1024)}KB)`
  );
}

main();
