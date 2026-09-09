import { PageIntro, StoryCards } from '@/components/editorial';
import { EXPERIENCES } from '@/lib/content';
export const metadata = { title: 'Along the coast', description: 'A coastal walk, a ceramics afternoon and a table at dusk: three fictional experiences around Aurel House.' };
export default function Page() { return <div className="wrap content-index"><PageIntro title="Go a little further. Take a little longer." text="Small encounters with the coast and the things made here. No long itinerary. Just a few good ways to spend a day." /><StoryCards stories={EXPERIENCES} base="experiences" /><p className="concept-note">These are fictional editorial offerings. Inquiries are saved locally; no activity or operator is booked.</p></div>; }
