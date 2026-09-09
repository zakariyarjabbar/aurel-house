import { Suspense } from 'react';
import { ReservationView } from '@/components/stays';
export const metadata = { title: 'Your stay details', description: 'Change or cancel an eligible browser-only demo stay and review its accepted price.' };
export default function Page() { return <Suspense fallback={<div className="loading-state">Opening your local stay…</div>}><ReservationView /></Suspense>; }
