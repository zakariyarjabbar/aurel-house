import { PageIntro, TextLink } from '@/components/editorial';
import { FAQS } from '@/lib/content';
export const metadata = { title: 'Questions & answers', description: 'Useful information about stays, room outlooks, children, breakfast and this fictional browser-only demo.' };
export default function Page() { return <div className="wrap"><PageIntro title="A few useful things." text="The practical details, so you can get on with imagining your stay." /><div className="faq-layout"><div><p>Still something on your mind?</p><TextLink href="/contact/">Write us a local note</TextLink></div><div className="faq-list">{FAQS.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></div>; }
