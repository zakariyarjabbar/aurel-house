import { PageIntro } from '@/components/editorial';
import { MyStays } from '@/components/stays';
export const metadata = { title: 'My stay', description: 'View and manage demo reservations saved in this browser, without a sign-in.' };
export default function Page() { return <div className="wrap"><PageIntro title="Your time, at the house." text="Your upcoming stays, quiet memories, and the practical details. Everything here belongs to this browser’s demonstration." /><MyStays /></div>; }
