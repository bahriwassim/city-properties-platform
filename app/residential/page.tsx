import type { Metadata } from 'next';
import { CatalogueHero } from '@/components/properties/catalogue-hero';
import { PropertyFilters } from '@/components/properties/filters';
import { FilterPanel } from '@/components/properties/filter-panel';
import { PropertyGrid } from '@/components/properties/property-grid';
import { PropertyDisplay } from '@/components/properties/property-display';
import { SectionHeading } from '@/components/site/section-heading';
import { getProperties,normalizeSearchParams } from '@/lib/data';
export const metadata:Metadata={title:'Residential Property for Sale in Dublin',description:'Discover homes for sale across Dublin with City Properties.'};
export default async function ResidentialPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const params=normalizeSearchParams(await searchParams);const {data,error}=await getProperties({listing:'sale',filters:params});return <><CatalogueHero label="Residential - Dublin" title="Residential Property" description="Discover homes for sale across Dublin." image="/images/dublin-georgian.webp"/><section className="catalogue wrap"><FilterPanel><PropertyFilters searchParams={params} listing="sale"/></FilterPanel><div className="catalogue-list-head"><SectionHeading eyebrow="Residential property" title={`${data.length} ${data.length===1?'property':'properties'}`}><p>Find a home that works for you.</p></SectionHeading></div>{error?<div className="empty-state"><h3>Unable to load properties.</h3><p>{error}</p><p>Please try again shortly or contact our team.</p></div>:<PropertyDisplay initial={params.view}><PropertyGrid properties={data} empty="No homes currently match your search."/></PropertyDisplay>}</section></>}






