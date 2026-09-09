import { JOURNAL } from '@/lib/content';
import { StoryArticle } from '@/components/editorial';
import { notFound } from 'next/navigation';
export const dynamicParams = false;
export function generateStaticParams() { return JOURNAL.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const story = JOURNAL.find(item => item.slug === slug); return { title: story?.title, description: story?.subtitle, openGraph: { title: story?.title, description: story?.subtitle, images: story ? [{ url: `/images/${story.image}.webp` }] : [] } }; }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const story = JOURNAL.find(item => item.slug === slug); if (!story) notFound(); return <StoryArticle story={story} base="journal" />; }
