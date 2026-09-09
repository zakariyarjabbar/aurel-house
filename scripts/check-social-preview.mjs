// Inspect crawler-visible static HTML, without executing application JavaScript.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const origin = new URL(process.env.AUREL_METADATA_ORIGIN || 'http://localhost:3001').origin;
const { routes } = JSON.parse(await fs.readFile('docs/browser-results.json', 'utf8'));
let home;
for (const route of routes) {
  const html = await fs.readFile(path.join('out', route, 'index.html'), 'utf8');
  const head = html.split('</head>')[0];
  const tags = new Map();
  for (const tag of head.match(/<meta\s[^>]*>/g) || []) {
    const attrs = Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(match => [match[1], match[2]]));
    tags.set(attrs.property || attrs.name, attrs.content);
  }
  assert.equal(tags.get('twitter:card'), 'summary_large_image', route);
  assert.equal(tags.get('twitter:title'), tags.get('og:title'), `${route}: route-specific title`);
  assert.equal(tags.get('twitter:image'), tags.get('og:image'), `${route}: matching social images`);
  assert.ok(tags.get('robots')?.includes('noindex'), route);
  const image = new URL(tags.get('og:image'));
  assert.equal(image.origin, origin, `${route}: public image origin`);
  assert.ok((await fs.stat(path.join('out', image.pathname))).isFile(), `${route}: exported image`);
  const canonical = head.match(/<link rel="canonical" href="([^"]+)"/);
  assert.ok(canonical, `${route}: canonical link`);
  assert.equal(new URL(canonical[1]).origin, origin, route);
  assert.equal(new URL(canonical[1]).pathname.replace(/\/$/, ''), route.replace(/\/$/, ''), `${route}: canonical path`);
  if (route === '/') home = tags;
}
assert.equal(home.get('og:image:width'), '1200');
assert.equal(home.get('og:image:height'), '630');
assert.equal(home.get('og:image:type'), 'image/jpeg');
assert.ok(home.get('og:image:alt')?.includes('AUREL HOUSE'));
assert.equal(home.get('og:type'), 'website');
assert.equal(home.get('og:site_name'), 'AUREL HOUSE');
assert.equal(new URL(home.get('og:url')).origin, origin);
const image = await sharp('out/images/social-preview.jpg').metadata();
assert.equal(image.width, 1200);
assert.equal(image.height, 630);
assert.equal(image.format, 'jpeg');
console.log(`PASS ${routes.length} exported routes: public image URLs, matching Open Graph/Twitter cards, canonical paths, noindex and a valid 1200×630 JPEG (${origin}).`);
