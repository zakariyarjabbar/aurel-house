import { PageIntro, StoryCards } from '@/components/editorial';
import { JOURNAL } from '@/lib/content';
export const metadata = { title: 'Notes from the house', description: 'Three short stories about light, the breakfast table and the art of staying put.' };
export default function Page() { return <div className="wrap content-index"><PageIntro title="Notes from the house." text="On light, on ordinary pleasures, on finding a different rhythm. A few things we have been thinking about." /><StoryCards stories={JOURNAL} base="journal" /><p className="concept-note">Original editorial stories from an imagined house.</p></div>; }
