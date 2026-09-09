import { Suspense } from 'react';
import { PageIntro } from '@/components/editorial';
import { InquiryForm } from '@/components/inquiry';
import { LocationMap } from '@/components/location';
export const metadata = { title: 'A note to the house', description: 'Save a fictional stay, dining, experience or group inquiry in this browser-only demonstration.' };
export default function Page() { return <div className="wrap"><PageIntro title="A conversation starts here." text="A stay, a table, a question about the house. There is room for a note before there is a plan." /><section className="contact-layout"><div><LocationMap /><h3>Somewhere along the coast.</h3><p>A fictional Mediterranean setting.<br />No real street address or hotel operator.</p><p className="small muted">hello@aurel-house.example<br />Illustrative contact only; no email is delivered.<br />Hotel calendar: Europe/Athens · Prices: USD</p></div><Suspense fallback={<p>Preparing your local inquiry…</p>}><InquiryForm /></Suspense></section></div>; }
