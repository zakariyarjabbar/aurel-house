import type { Metadata } from 'next';
import { Header, Footer } from '@/components/shell';
import { StoreProvider } from '@/components/store-provider';
import './globals.css';
export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'), alternates: { canonical: './' }, title: { default: 'AUREL HOUSE — A small house by the sea.', template: '%s — AUREL HOUSE' }, description: 'Twelve rooms. Days without hurry. Explore a fictional Mediterranean boutique house and a browser-only booking demonstration.', robots: { index: false, follow: false }, openGraph: { title: 'AUREL HOUSE — A small house by the sea.', description: 'Twelve rooms. Days without hurry. A fictional boutique hotel portfolio demonstration.', images: [{ url: '/images/social-preview.jpg', width: 1200, height: 630 }] } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><StoreProvider><Header /><main id="main">{children}</main><Footer /></StoreProvider></body></html>; }
