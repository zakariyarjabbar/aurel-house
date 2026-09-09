import Link from 'next/link';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { Photo } from './photo';
import type { Story } from '@/lib/content';
export function TextLink({ href, children }: { href: string; children: React.ReactNode }) { return <Link href={href} className="text-link">{children}<ArrowUpRight size={18} /></Link>; }
export function PageIntro({ title, text, children }: { title: string; text: string; children?: React.ReactNode }) { return <div className="page-intro"><h1>{title}</h1><div><p>{text}</p>{children}</div></div>; }
export function StoryCards({ stories, base }: { stories: Story[]; base: string }) { return <div className="story-grid">{stories.map(story => <article key={story.slug}><Link href={`/${base}/${story.slug}/`} className="image-link"><Photo id={story.image} sizes="(max-width:700px) 100vw, 33vw" /><span className="image-arrow"><ArrowUpRight size={22} /></span></Link><p className="small story-meta">{story.subtitle}</p><h3><Link href={`/${base}/${story.slug}/`}>{story.title}</Link></h3><p className="small">{story.detail}</p></article>)}</div>; }
export function StoryArticle({ story, base }: { story: Story; base: 'experiences' | 'journal' }) { return <>
  <div className="article-heading wrap"><Link className="back-link" href={`/${base}/`}>All {base} <ArrowRight size={16} /></Link><h1>{story.title}</h1><p>{story.subtitle} <span aria-hidden="true"> / </span> {story.detail}</p></div>
  <Photo id={story.image} className="article-hero" priority sizes="100vw" />
  <article className="article-body"><p className="article-lead">{story.paragraphs[0]}</p>{story.paragraphs.slice(1).map(p => <p key={p}>{p}</p>)}{story.sections.map(section => <section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}{base === 'experiences' ? <TextLink href={`/contact/?subject=${encodeURIComponent(story.subtitle)}`}>Ask about this experience</TextLink> : <TextLink href="/rooms/">Find your place at the house</TextLink>}</article>
  <div className="article-end wrap"><p>AUREL HOUSE</p><span>A small house by the sea.</span></div>
  </>; }
