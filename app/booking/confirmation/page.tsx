import { Suspense } from 'react';
import { ReservationView } from '@/components/stays';
export const metadata = { title: 'Your local confirmation', description: 'A browser-only Aurel House reservation confirmation. No payment is taken and no real room is reserved.' };
export default function Page() { return <Suspense fallback={<div className="loading-state">Opening your local confirmation…</div>}><ReservationView confirmation /></Suspense>; }
