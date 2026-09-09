import type { Metadata } from 'next';
import { Header, Footer } from '@/components/shell';
import { StoreProvider } from '@/components/store-provider';
import { siteOrigin } from '@/lib/site-origin';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: siteOrigin(),
  alternates: { canonical: './' },
  title: { default: 'AUREL HOUSE — A small house by the sea.', template: '%s — AUREL HOUSE' },
  description: 'Twelve rooms. Days without hurry. Explore a fictional Mediterranean boutique house and a browser-only booking demonstration.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'AUREL HOUSE — A small house by the sea.',
    description: 'Twelve rooms. Days without hurry. A fictional boutique hotel portfolio demonstration.',
    siteName: 'AUREL HOUSE',
    type: 'website',
    locale: 'en_US',
    url: './',
    images: [{
      url: '/images/social-preview.jpg',
      width: 1200,
      height: 630,
      type: 'image/jpeg',
      alt: 'AUREL HOUSE — Twelve rooms. Days without hurry. A limestone house, pool and Mediterranean sea; a portfolio demonstration.',
    }],
  },
  // Next derives title, description and image from each route's Open Graph data.
  twitter: { card: 'summary_large_image' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><StoreProvider><Header /><main id="main">{children}</main><Footer /></StoreProvider></body></html>; }
