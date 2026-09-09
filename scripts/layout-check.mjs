// Supplementary layout checks for editable copy and enlarged text.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base = process.env.AUREL_PREVIEW_URL || 'http://127.0.0.1:3001';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ reducedMotion: 'reduce' });
const page = await context.newPage();
await page.clock.setFixedTime(new Date('2026-09-09T09:00:00Z'));
const checks = [];
async function check(name, fn) {
  try { await fn(); checks.push({ name, passed: true }); console.log(`PASS ${name}`); }
  catch (error) { checks.push({ name, passed: false, error: error.message }); console.log(`FAIL ${name}: ${error.message}`); }
}
const goto = route => page.goto(base + route, { waitUntil: 'networkidle' });
await page.setViewportSize({ width: 390, height: 844 });
await goto('/admin/');
await page.getByRole('button', { name: 'Rooms & rates', exact: true }).click();
const longName = 'Courtyard Room with a Quiet Reading Corner and a Window onto the Olive-Shaded Courtyard';
await page.getByLabel('Room name', { exact: true }).first().fill(longName);
await page.locator('.room-editor').first().getByRole('button', { name: 'Save local room changes' }).click();
for (const route of ['/', '/rooms/', '/rooms/courtyard-room/', '/book/']) {
  await check(`long edited room name at 390px: ${route}`, async () => {
    await goto(route);
    if (route === '/book/') {
      await page.getByRole('button', { name: 'Try sample dates', exact: true }).click();
      await page.getByRole('button', { name: 'Continue', exact: true }).click();
    }
    await page.getByText(longName, { exact: true }).first().waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  });
}
// Enlarge computed body/control text, preserving display headings. This is a
// deterministic stress check, not a claim of native browser zoom conformance.
for (const route of ['/contact/', '/faq/', '/policies/', '/book/']) {
  await check(`200% body/control text at 390px: ${route}`, async () => {
    await goto(route);
    await page.evaluate(() => {
      const nodes = [...document.querySelectorAll('p, label, input, select, textarea, button, .text-link, .field-error, .small')];
      const sizes = nodes.map(node => parseFloat(getComputedStyle(node).fontSize));
      nodes.forEach((node, i) => node.style.fontSize = `${sizes[i] * 2}px`);
    });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  });
}
await fs.writeFile('docs/layout-results.json', JSON.stringify({ viewport: '390x844', browser: browser.version(), checks }, null, 2));
await browser.close();
if (checks.some(check => !check.passed)) process.exitCode = 1;
