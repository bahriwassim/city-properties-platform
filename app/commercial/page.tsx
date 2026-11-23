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
import { copy } from '@/data/copy';
export const metadata:Metadata={title:'Commercial Property in Dublin',description:'Explore office, retail, industrial and investment property in Dublin with City Properties.'};
export default async function CommercialPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const params=normalizeSearchParams(await searchParams);const {data,error}=await getProperties({listing:'commercial',filters:params});return <><PageHeader eyebrow="Commercial · Dublin" title={'Commercial\nproperty'} accentWord="property" intro={copy.home.commercialIntro} secondaryCta={{label:'Request a valuation',href:'/valuation?type=sell&topic=commercial'}} {...PAGE_HEADERS.commercial}/><section className="catalogue wrap"><FilterPanel><PropertyFilters searchParams={params} listing="commercial"/></FilterPanel><div className="catalogue-list-head"><SectionHeading eyebrow="Commercial property" title="Commercial property"><p>{copy.home.commercialIntro}</p></SectionHeading></div>{error?<div className="empty-state"><h3>Properties are unavailable just now.</h3><p>Please try again or contact our team.</p><ValuationCTA location="commercial-load-error" type="sell" topic="commercial">Request a valuation</ValuationCTA></div>:<PropertyDisplay initial={params.view}><PropertyGrid properties={data} empty="No properties in this category right now."/></PropertyDisplay>}</section></>}






