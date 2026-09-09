import { Gallery } from '@/components/gallery';
import { PageIntro } from '@/components/editorial';
import { ALL_PHOTOS } from '@/lib/catalog';
export const metadata = { title: 'A closer look', description: 'An illustrated photographic gallery of Aurel House: rooms, courtyard, pool, table and coast.' };
export default function Page() { return <div className="wrap"><PageIntro title="A closer look." text="A window, a shadow, a place at the table. A few glimpses of life at our imagined house." /><Gallery photos={ALL_PHOTOS} /></div>; }
