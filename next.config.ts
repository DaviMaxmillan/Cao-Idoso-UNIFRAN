import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Em desenvolvimento o Next só serve os recursos internos (/_next/*) para a
  // origem em que subiu — localhost. Testar pelo celular usa o IP da máquina na
  // rede, então os scripts eram bloqueados e a página chegava sem JavaScript:
  // os campos apareciam, mas nenhum botão respondia. Libera as faixas de IP
  // privado usadas por redes locais. Não tem efeito em produção.
  // Um "*" cobre só um trecho entre pontos, por isso o IP vai com quatro.
  allowedDevOrigins: ["10.*.*.*", "192.168.*.*", "172.*.*.*", "*.local"],
};

export default withSerwist(nextConfig);
