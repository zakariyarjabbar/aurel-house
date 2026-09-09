import test from 'node:test';
import assert from 'node:assert/strict';
import { siteOrigin } from '../lib/site-origin';

test('public metadata prefers the configured domain, then stable Vercel production domain', () => {
  const env = { NEXT_PUBLIC_SITE_URL: 'https://house.example/', VERCEL_PROJECT_PRODUCTION_URL: 'house.vercel.app', VERCEL_URL: 'house-preview.vercel.app' };
  assert.equal(siteOrigin(env).href, 'https://house.example/');
  assert.equal(siteOrigin({ ...env, NEXT_PUBLIC_SITE_URL: ' ' }).href, 'https://house.vercel.app/');
  assert.equal(siteOrigin({ VERCEL_URL: env.VERCEL_URL }).href, 'https://house-preview.vercel.app/');
  assert.equal(siteOrigin({}).href, 'http://localhost:3001/');
});

test('metadata origin strips paths and query strings before composing an image URL', () => {
  const origin = siteOrigin({ NEXT_PUBLIC_SITE_URL: ' https://house.example/rooms/?ref=demo#stay ' });
  assert.equal(new URL('/images/social-preview.jpg', origin).href, 'https://house.example/images/social-preview.jpg');
});

test('invalid or credential-bearing metadata URLs fail clearly rather than shipping unusable links', () => {
  for (const value of ['house.example', 'ftp://house.example', 'https://name:password@house.example']) {
    assert.throws(() => siteOrigin({ NEXT_PUBLIC_SITE_URL: value }), /site URL|NEXT_PUBLIC_SITE_URL/);
  }
});
