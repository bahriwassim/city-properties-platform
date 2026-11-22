import type { Metadata } from 'next';
import { PageHeader } from '@/components/site/page-header';
import { PAGE_HEADERS } from '@/data/page-headers';
import { ValuationCTA } from '@/components/site/valuation-cta';
import { PropertyFilters } from '@/components/properties/filters';
import { FilterPanel } from '@/components/properties/filter-panel';
import { PropertyGrid } from '@/components/properties/property-grid';
import { PropertyDisplay } from '@/components/properties/property-display';
import { SectionHeading } from '@/components/site/section-heading';
import { getProperties,normalizeSearchParams } from '@/lib/data';
export const metadata:Metadata={title:'Commercial Property in Dublin',description:'Explore office, retail, industrial and investment property in Dublin with City Properties.'};
export default async function CommercialPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const params=normalizeSearchParams(await searchParams);const {data,error}=await getProperties({listing:'commercial',filters:params});return <><PageHeader eyebrow="Commercial · Dublin" title={'Commercial\nproperty'} accentWord="property" intro="Space for business, carefully considered. Explore commercial property across Dublin." secondaryCta={{label:'Request a valuation',href:'/valuation?type=sell&topic=commercial'}} {...PAGE_HEADERS.commercial}/><section className="commercial-category-band"><div className="wrap">{['Office','Retail','Industrial','Investment','Mixed use'].map(x=><span key={x}>{x}</span>)}</div></section><section className="catalogue wrap"><FilterPanel><PropertyFilters searchParams={params} listing="commercial"/></FilterPanel><div className="catalogue-list-head"><SectionHeading eyebrow="Commercial property" title={`${data.length} ${data.length===1?'opportunity':'opportunities'}`}><p>Commercial spaces and property opportunities across Dublin.</p></SectionHeading></div>{error?<div className="empty-state"><h3>Unable to load properties.</h3><p>{error}</p><ValuationCTA location="commercial-load-error" type="sell" topic="commercial">Thinking of selling or letting? Request a valuation</ValuationCTA></div>:<PropertyDisplay initial={params.view}><PropertyGrid properties={data} empty="No commercial properties currently match your search."/></PropertyDisplay>}</section></>}






