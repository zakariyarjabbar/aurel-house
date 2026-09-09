import { EXPERIENCES } from '@/lib/content';
import { StoryArticle } from '@/components/editorial';
import { notFound } from 'next/navigation';
export const dynamicParams = false;
export function generateStaticParams() { return EXPERIENCES.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const found = EXPERIENCES.find(item => item.slug === slug); return { title: found?.title, description: found?.subtitle, openGraph: { title: found?.title, description: found?.subtitle, images: found ? [{ url: `/images/${found.image}.webp` }] : [] } }; }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const found = EXPERIENCES.find(item => item.slug === slug); if (!found) notFound(); return <StoryArticle story={found} base="experiences" />; }
