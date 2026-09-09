import Image from 'next/image';
import { ALL_PHOTOS } from '@/lib/catalog';
export function Photo({ id, className = '', priority = false, sizes = '(max-width: 700px) 100vw, 60vw', alt }: { id: string; className?: string; priority?: boolean; sizes?: string; alt?: string }) {
  const asset = ALL_PHOTOS.find(photo => photo.id === id);
  return <picture className={`photo ${className}`}>
    <source type="image/webp" srcSet={`/images/${id}-480.webp 480w, /images/${id}-800.webp 800w, /images/${id}.webp 1536w`} sizes={sizes} />
    <Image src={`/images/${id}.webp`} alt={alt ?? asset?.alt ?? ''} width={1536} height={1024} priority={priority} loading={priority ? 'eager' : 'lazy'} unoptimized />
  </picture>;
}
