import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ROOMS, getRoom } from '@/lib/catalog';
import { Gallery } from '@/components/gallery';
import { RoomHeading, RoomInformation } from '@/components/rooms';
import { TextLink } from '@/components/editorial';
export function generateStaticParams() { return ROOMS.map(({ slug }) => ({ slug })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const room = getRoom((await params).slug); return { title: room?.name ?? 'Room not found', description: room?.short, openGraph: { title: room?.name, description: room?.short, images: room ? [{ url: `/images/${room.slug}-1.webp` }] : [] } }; }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const room = getRoom((await params).slug); if (!room) notFound(); return <><RoomHeading slug={room.slug} /><div className="wrap room-gallery-wrap"><Gallery photos={room.gallery} room /></div><RoomInformation slug={room.slug} /><div className="room-next wrap"><h2>A different outlook?</h2><TextLink href="/rooms/">Explore all four rooms</TextLink></div></>; }
