import type { Metadata } from 'next';
import { PageIntro } from '@/components/editorial';
import { RoomIndex } from '@/components/rooms';
import { SearchStrip } from '@/components/search';
export const metadata: Metadata = { title: 'Our rooms', description: 'Four ways to feel at home. Compare the courtyard, terrace, studio and suite at fictional Aurel House.' };
export default function Page() { return <><div className="wrap"><PageIntro title="Your own little somewhere." text="Four kinds of room. Twelve places to pause. Each shaped by its light, its outlook, and the simple pleasure of feeling at home." /></div><SearchStrip /><div className="wrap"><RoomIndex /></div></>; }
