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
export const metadata:Metadata={title:'Residential Property for Sale in Dublin',description:'Discover homes for sale across Dublin with City Properties.'};
export default async function ResidentialPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const params=normalizeSearchParams(await searchParams);const {data,error}=await getProperties({listing:'sale',filters:params});return <><PageHeader eyebrow="Residential · Dublin" title={'Residential\nproperty'} accentWord="property" intro="Discover homes for sale across Dublin." secondaryCta={{label:'Request a valuation',href:'/valuation?type=sell'}} {...PAGE_HEADERS.residential}/><section className="catalogue wrap"><FilterPanel><PropertyFilters searchParams={params} listing="sale"/></FilterPanel><div className="catalogue-list-head"><SectionHeading eyebrow="Residential property" title={`${data.length} ${data.length===1?'property':'properties'}`}><p>Find a home that works for you.</p></SectionHeading></div>{error?<div className="empty-state"><h3>Unable to load properties.</h3><p>{error}</p><p>Please try again shortly or contact our team.</p><ValuationCTA location="residential-load-error" type="sell">Thinking of selling or letting? Request a valuation</ValuationCTA></div>:<PropertyDisplay initial={params.view}><PropertyGrid properties={data} empty="No homes currently match your search."/></PropertyDisplay>}</section></>}






