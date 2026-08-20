import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const NAVY = "#0b1f45";

function iconSvg(size: number) {
  const pad = size * 0.22;
  const inner = size - pad * 2;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="${NAVY}" />
  <g transform="translate(${pad}, ${pad})" stroke="#ffffff" stroke-width="${inner * 0.05}" fill="none">
    <ellipse cx="${inner * 0.28}" cy="${inner * 0.24}" rx="${inner * 0.08}" ry="${inner * 0.11}" />
    <ellipse cx="${inner * 0.5}" cy="${inner * 0.18}" rx="${inner * 0.08}" ry="${inner * 0.11}" />
    <ellipse cx="${inner * 0.72}" cy="${inner * 0.24}" rx="${inner * 0.08}" ry="${inner * 0.11}" />
    <path
      d="M ${inner * 0.5} ${inner * 0.78}
         C ${inner * 0.26} ${inner * 0.62}, ${inner * 0.16} ${inner * 0.48}, ${inner * 0.16} ${inner * 0.34}
         C ${inner * 0.16} ${inner * 0.24}, ${inner * 0.24} ${inner * 0.18}, ${inner * 0.33} ${inner * 0.22}
         C ${inner * 0.41} ${inner * 0.25}, ${inner * 0.47} ${inner * 0.33}, ${inner * 0.5} ${inner * 0.4}
         C ${inner * 0.53} ${inner * 0.33}, ${inner * 0.59} ${inner * 0.25}, ${inner * 0.67} ${inner * 0.22}
         C ${inner * 0.76} ${inner * 0.18}, ${inner * 0.84} ${inner * 0.24}, ${inner * 0.84} ${inner * 0.34}
         C ${inner * 0.84} ${inner * 0.48}, ${inner * 0.74} ${inner * 0.62}, ${inner * 0.5} ${inner * 0.78} Z"
      stroke-linejoin="round"
    />
  </g>
</svg>`;
}

async function main() {
  const outDir = path.resolve("public/icons");
  await mkdir(outDir, { recursive: true });

  const targets: { file: string; size: number }[] = [
    { file: "icon-192.png", size: 192 },
    { file: "icon-512.png", size: 512 },
    { file: "apple-touch-icon.png", size: 180 },
  ];

  for (const { file, size } of targets) {
    const svg = Buffer.from(iconSvg(size));
    const png = await sharp(svg).png().toBuffer();
    await writeFile(path.join(outDir, file), png);
    console.log(`gerado ${file} (${size}x${size})`);
  }

  // convenção do App Router: app/icon.png vira automaticamente o favicon
  const faviconSvg = Buffer.from(iconSvg(192));
  const favicon = await sharp(faviconSvg).png().toBuffer();
  await writeFile(path.resolve("app/icon.png"), favicon);
  console.log("app/icon.png atualizado");
}

main();
