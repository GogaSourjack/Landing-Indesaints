import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const photos = [
  ["baixo", "1xp1-8gmgy_l3ZVUfutXWsZlHS_ctbQxM"],
  ["banda", "1214_0v57l0JuCzQN136LjB7zFLoFazHv"],
  ["guitarra", "18on5etjqASwiGIivn7TTMwG4nNBp5mw5"],
  ["setlist-chao", "16EYWTYuque8m-sLx3HCl4oHKfmHGj3hb"],
  ["bateria", "1a4L4etmcHB-1zGPcwazGGHEbJtNGbZ3z"],
  ["pose", "1TF4yNIVGmpfOaGwKodmCIiBs14lAYxGQ"],
  ["tartarugas", "1m7XMqL0RM5hxVP7IwxDy1aNraxNuxiia"],
  ["dedos", "1YQNlcCmA_D6BIlnrNR8Frrh-w0RhLBcw"],
];

await mkdir("public/media", { recursive: true });
await mkdir("public/press", { recursive: true });

const meta = [];

for (const [name, id] of photos) {
  const res = await fetch(`https://drive.google.com/thumbnail?id=${id}&sz=w1600`, {
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`${name} ${res.status}`);
  const input = Buffer.from(await res.arrayBuffer());
  const image = sharp(input).rotate();
  const info = await image.metadata();
  await image.webp({ quality: 76 }).toFile(`public/media/${name}.webp`);
  meta.push({ name, width: info.width, height: info.height, bytes: input.length });
  console.log(name, info.width, info.height, input.length);
}

await writeFile("src/content/photo-meta.json", JSON.stringify(meta, null, 2));

const pdf = await fetch(
  "https://drive.google.com/uc?export=download&id=1xenNacAHAmtEeGl9jgThp0YBwF8oZjD_",
  { redirect: "follow" },
);
const pdfBuf = Buffer.from(await pdf.arrayBuffer());
const head = pdfBuf.subarray(0, 5).toString();
console.log("pdf", pdf.status, pdf.headers.get("content-type"), head, pdfBuf.length);
if (head.startsWith("%PDF")) {
  await writeFile("public/press/press-release.pdf", pdfBuf);
} else {
  console.log(pdfBuf.subarray(0, 240).toString());
}
