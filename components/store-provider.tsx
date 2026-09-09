'use client';
import { useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { browserStore, STORAGE_KEY } from '@/lib/storage';
export function useHouse() { return useSyncExternalStore(browserStore.subscribe, browserStore.getSnapshot, browserStore.getServerSnapshot); }
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useHouse();
  useEffect(() => { browserStore.initialize(); const sync = (event: StorageEvent) => { if (event.key === STORAGE_KEY || event.key === null) browserStore.synchronize(); }; window.addEventListener('storage', sync); return () => window.removeEventListener('storage', sync); }, []);
  return <>{snapshot.warning && <aside className="storage-warning" role="status"><p>{snapshot.warning}</p><Link href="/demo/">Demo help</Link>{!snapshot.temporary && <button className="text-button" onClick={browserStore.useTemporary}>Use temporary-session mode</button>}</aside>}{children}</>;
}
