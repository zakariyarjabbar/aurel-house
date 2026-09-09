'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Emblem } from './identity';
import { DISCLOSURE } from '@/lib/catalog';
const links = [['The house', '/the-house/'], ['Our rooms', '/rooms/'], ['At the table', '/dining/'], ['The coast', '/experiences/']];
export function Header() {
  const path = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Aurel House home"><span>AUREL HOUSE</span><small>A SMALL HOUSE BY THE SEA</small></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(([label, href]) => <Link aria-current={path === href ? 'page' : undefined} key={href} href={href}>{label}</Link>)}</nav>
      <div className="header-actions"><Link href="/book/" className="button header-book">Find your stay <ArrowUpRight size={16} /></Link><button className="icon-button mobile-menu" onClick={() => dialog.current?.showModal()} aria-label="Open navigation"><Menu size={23} /></button></div>
    </header>
    <dialog className="navigation-dialog" ref={dialog} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="dialog-top"><Emblem /><button className="icon-button" aria-label="Close navigation" onClick={() => dialog.current?.close()}><X /></button></div>
      <nav aria-label="Mobile navigation">{[...links, ['Gallery', '/gallery/'], ['Journal', '/journal/'], ['My stay', '/my-stay/'], ['Contact', '/contact/']].map(([label, href]) => <Link key={href} href={href} onClick={() => dialog.current?.close()}>{label}<ArrowUpRight size={20} /></Link>)}</nav>
      <p className="small">Twelve rooms. A little closer to the sea.</p>
    </dialog>
  </>;
}
export function Footer() {
  return <footer className="site-footer"><div className="footer-top"><div><Emblem /><h2>A small house.<br />A slower kind of stay.</h2><Link className="text-link light" href="/book/">Find your room <ArrowUpRight size={18} /></Link></div><div className="footer-links"><div><span>Come closer</span><Link href="/rooms/">Our rooms</Link><Link href="/the-house/">The house</Link><Link href="/dining/">At the table</Link><Link href="/experiences/">The coast</Link><Link href="/gallery/">Gallery</Link></div><div><span>A few useful things</span><Link href="/journal/">Journal</Link><Link href="/contact/">Contact</Link><Link href="/faq/">Questions & answers</Link><Link href="/policies/">Stay policies</Link><Link href="/my-stay/">My stay</Link></div></div></div><div className="footer-brand" aria-hidden="true">AUREL HOUSE</div><div className="footer-bottom"><p>{DISCLOSURE}</p><div><Link href="/demo/">About this demo</Link><Link href="/admin/">Explore hotel dashboard <ArrowUpRight size={13} /></Link></div></div></footer>;
}
