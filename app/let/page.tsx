import Link from 'next/link';
import { PageHeader } from '@/components/site/page-header';
import { ValuationCTA } from '@/components/site/valuation-cta';
import { PAGE_HEADERS } from '@/data/page-headers';
import { copy } from '@/data/copy';

export const metadata={title:'Letting your property | City Properties',description:copy.let.intro};
export default function LetPage(){return <><PageHeader eyebrow={copy.let.eyebrow} title={copy.let.title} intro={copy.let.intro} secondaryCta={{label:copy.let.tenantsCta,href:'/lettings'}} {...PAGE_HEADERS.lettings}/><section className="section wrap let-options"><article><span className="eyebrow">{copy.let.landlordsEyebrow}</span><h2>{copy.let.landlordsTitle}</h2><p>{copy.let.landlordsText}</p><ValuationCTA variant="primary" location="let-landlords" type="let">{copy.let.landlordsCta}</ValuationCTA></article><article><span className="eyebrow">{copy.let.tenantsEyebrow}</span><h2>{copy.let.tenantsTitle}</h2><p>{copy.let.tenantsText}</p><Link className="button button-outline" href="/lettings">{copy.let.tenantsCta}</Link></article></section><section className="section why-section"><div className="wrap"><span className="eyebrow">{copy.let.valueEyebrow}</span><div className="why-grid">{copy.let.value.map(([title,text])=><article key={title}><span className="why-icon" aria-hidden="true">⌂</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section><section className="let-link-cards wrap">{copy.let.links.map(([title,href])=><Link key={title} href={href}>{title}<span>↗</span></Link>)}</section></>}
