import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const assets = [
  ["deployment-assets/hero-golden-hour.webp.b64", "public/hero-golden-hour.webp"],
  ["deployment-assets/icon-192.png.b64", "public/icons/icon-192.png"],
  ["deployment-assets/icon-512.png.b64", "public/icons/icon-512.png"],
  ["deployment-assets/apple-touch-icon.png.b64", "public/icons/apple-touch-icon.png"],
];

await Promise.all(assets.map(async ([source, destination]) => {
  const outputPath = resolve(destination);
  const encoded = await readFile(resolve(source), "utf8");
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, Buffer.from(encoded.replace(/\s/g, ""), "base64"));
}));
