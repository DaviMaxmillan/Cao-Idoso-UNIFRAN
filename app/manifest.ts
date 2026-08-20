import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cão Idoso UNIFRAN",
    short_name: "Cão Idoso",
    description:
      "Carteira Digital do Cão Idoso — projeto de extensão da UNIFRAN.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b1f45",
    theme_color: "#0b1f45",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
