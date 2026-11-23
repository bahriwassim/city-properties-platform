import { PageHeader } from '@/components/site/page-header';
import { ValuationCTA } from '@/components/site/valuation-cta';
import { PAGE_HEADERS } from '@/data/page-headers';
import { copy } from '@/data/copy';

export const metadata={title:'Selling your property | City Properties',description:copy.sell.intro};
export default function SellPage(){return <><PageHeader eyebrow={copy.sell.eyebrow} title={copy.sell.title} intro={copy.sell.intro} secondaryCta={{label:copy.sell.cta,href:'/valuation?type=sell'}} {...PAGE_HEADERS.residential}/><section className="section wrap process-section"><span className="eyebrow">{copy.sell.processEyebrow}</span><div className="process-grid">{copy.sell.steps.map(([title,text],i)=><article key={title}><small>0{i+1}</small><h2>{title}</h2><p>{text}</p></article>)}</div></section><section className="cta-band"><div className="wrap cta-content"><span className="eyebrow">{copy.sell.whyEyebrow}</span><h2>{copy.sell.whyTitle}</h2><p>{copy.sell.whyText}</p><ValuationCTA variant="primary" location="sell-page" type="sell">{copy.sell.cta}</ValuationCTA></div></section></>}
