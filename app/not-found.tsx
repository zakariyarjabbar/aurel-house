import Link from 'next/link';
import { Emblem } from '@/components/identity';
export default function NotFound() { return <div className="empty-page wrap"><Emblem /><p className="small">404 · A path less traveled</p><h1>This way leads<br /><em>back to the house.</em></h1><p>We could not find that page. The courtyard is still here.</p><Link className="button" href="/">Back to the house</Link></div>; }
