// Build-time metadata only; no browser storage or runtime service is involved.
export function siteOrigin(env: Record<string, string | undefined> = process.env): URL {
  const configured = env.NEXT_PUBLIC_SITE_URL?.trim();
  const deployment = env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || env.VERCEL_URL?.trim();
  const value = configured || (deployment ? `https://${deployment}` : 'http://localhost:3001');
  let url: URL;
  try { url = new URL(value); } catch {
    throw new Error('Set NEXT_PUBLIC_SITE_URL to a full public http:// or https:// URL.');
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('The site URL must use HTTP or HTTPS without embedded credentials.');
  }
  return new URL(url.origin);
}
