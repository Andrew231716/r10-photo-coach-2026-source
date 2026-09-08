import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "R10 Photo Coach",
    short_name: "R10 Coach",
    description: "Scuola fotografica interattiva dedicata alla Canon EOS R10.",
    start_url: "/",
    display: "standalone",
    background_color: "#070809",
    theme_color: "#070809",
    orientation: "any",
    icons: [
      { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
