'use client';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react';
import { Photo } from './photo';
import type { Photo as PhotoType } from '@/lib/catalog';
export function Gallery({ photos, room = false }: { photos: PhotoType[]; room?: boolean }) {
  const [category, setCategory] = useState('All'); const [index, setIndex] = useState(0); const dialog = useRef<HTMLDialogElement>(null);
  const categories = ['All', ...new Set(photos.map(p => p.category))];
  const visible = category === 'All' ? photos : photos.filter(p => p.category === category);
  const selected = visible[index] ?? visible[0];
  const move = (delta: number) => setIndex(current => (current + delta + visible.length) % visible.length);
  return <div className={room ? 'room-gallery' : 'curated-gallery'}>{!room && <div className="filter-row" aria-label="Gallery categories">{categories.map(item => <button key={item} aria-pressed={item === category} onClick={() => { setCategory(item); setIndex(0); }}>{item}</button>)}</div>}<div className={room ? 'room-gallery-grid' : 'gallery-grid'}>{visible.map((photo, i) => <button className="gallery-item" key={photo.id} onClick={() => { setIndex(i); dialog.current?.showModal(); }} aria-label={`Enlarge image ${i + 1}: ${photo.caption}`}><Photo id={photo.id} priority={room && i === 0} sizes={room ? '(max-width:700px) 100vw, 65vw' : '(max-width:700px) 100vw, 33vw'} /><span className="gallery-enlarge"><Expand size={17} />{room && i === 0 ? 'Explore the room' : 'Enlarge'}</span>{!room && <span className="gallery-caption">{photo.caption}</span>}</button>)}</div><dialog className="lightbox" ref={dialog} onKeyDown={event => { if (event.key === 'ArrowRight') { event.preventDefault(); move(1); } if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); } }} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><div className="lightbox-inner"><div className="dialog-top"><span>{index + 1} / {visible.length}</span><button className="icon-button" onClick={() => dialog.current?.close()} aria-label="Close image viewer"><X /></button></div><Photo id={selected.id} sizes="95vw" /><div className="lightbox-bottom"><button aria-label="Previous image" className="icon-button" onClick={() => move(-1)}><ArrowLeft /></button><p aria-live="polite">{selected.caption}</p><button aria-label="Next image" className="icon-button" onClick={() => move(1)}><ArrowRight /></button></div></div></dialog></div>;
}
