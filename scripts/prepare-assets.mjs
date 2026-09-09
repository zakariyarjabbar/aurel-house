import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const source = process.argv[2] || '/private/tmp/aurel-assets';
await fs.mkdir('public/images', { recursive: true });
await fs.mkdir('public/fonts', { recursive: true });
await fs.mkdir('assets/source', { recursive: true });
const files = (await fs.readdir(source)).filter(file => /\.(png|jpg|jpeg)$/.test(file));
for (const file of files) {
  const id = path.parse(file).name;
  const input = path.join(source, file);
  await sharp(input).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 87 }).toFile(`public/images/${id}.webp`);
  await sharp(input).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 84 }).toFile(`public/images/${id}-800.webp`);
  await sharp(input).resize({ width: 480, withoutEnlargement: true }).webp({ quality: 81 }).toFile(`public/images/${id}-480.webp`);
}
for (const font of ['bodoni-moda', 'dm-sans']) {
  const directory = `node_modules/@fontsource-variable/${font}`;
  const names = await fs.readdir(`${directory}/files`);
  const name = names.find(value => value === `${font}-latin-wght-normal.woff2`) || names.find(value => value.includes('-latin-') && value.endsWith('-normal.woff2'));
  if (!name) throw new Error(`Font file missing: ${font}`);
  await fs.copyFile(`${directory}/files/${name}`, `public/fonts/${font}.woff2`);
  await fs.copyFile(`${directory}/LICENSE`, `public/fonts/${font}-LICENSE.txt`);
}
try { await fs.copyFile(`${source}/manifest.json`, 'assets/source/manifest.json'); } catch { /* generation can still be in progress */ }
console.log(`Prepared ${files.length} images in three responsive widths; two licensed local fonts.`);
