import { Suspense } from 'react';
import { BookingFlow } from '@/components/booking';
import { BookingLoading } from '@/components/booking-loading';
export const metadata = { title: 'Make a little time', description: 'Choose dates, a room and thoughtful extras in the Aurel House browser-only booking demonstration.' };
export default function Page() { return <Suspense fallback={<BookingLoading />}><BookingFlow /></Suspense>; }
