import type { Metadata } from 'next';
import { CatalogueHero } from '@/components/properties/catalogue-hero';
import { PropertyFilters } from '@/components/properties/filters';
import { FilterPanel } from '@/components/properties/filter-panel';
import { PropertyGrid } from '@/components/properties/property-grid';
import { PropertyDisplay } from '@/components/properties/property-display';
import { SectionHeading } from '@/components/site/section-heading';
import { getProperties,normalizeSearchParams } from '@/lib/data';
import { EmptyAlert } from '@/components/site/empty-alert';
export const metadata:Metadata={title:'Property to Rent in Dublin',description:'Explore homes available to rent across Dublin through City Properties.'};
export default async function LettingsPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const params=normalizeSearchParams(await searchParams);const {data,error}=await getProperties({listing:'rent',filters:params});return <><CatalogueHero label="Lettings - Dublin" title="Property to Rent" description="Explore homes available to rent across Dublin." image="/images/dublin-interior.webp"/><section className="catalogue wrap"><FilterPanel><PropertyFilters searchParams={params} listing="rent"/></FilterPanel><div className="catalogue-list-head"><SectionHeading eyebrow="Lettings" title={`${data.length} ${data.length===1?'property':'properties'}`}><p>Homes currently available to rent.</p></SectionHeading></div>{error?<div className="empty-inline">Listings are temporarily unavailable. <a href="tel:+35314595941">Call 01 459 5941</a></div>:data.length?<PropertyDisplay initial={params.view}><PropertyGrid properties={data}/></PropertyDisplay>:<EmptyAlert interest="residential lettings"/>}</section></>}





