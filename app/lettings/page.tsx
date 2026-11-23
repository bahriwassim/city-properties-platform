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
import { EmptyAlert } from '@/components/site/empty-alert';
export const metadata:Metadata={title:'Homes to Rent | City Properties Dublin',description:'Search homes to rent across Dublin with City Properties.'};
export default async function LettingsPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const params=normalizeSearchParams(await searchParams);const {data,error}=await getProperties({listing:'rent',filters:params});return <><PageHeader eyebrow="Homes to rent · Dublin" title={'Homes to\nrent'} accentWord="rent" intro="Search homes currently available to rent across Dublin." secondaryCta={{label:'Request a letting valuation',href:'/valuation?type=let'}} {...PAGE_HEADERS.lettings}/><section className="catalogue wrap"><FilterPanel><PropertyFilters searchParams={params} listing="rent"/></FilterPanel><div className="catalogue-list-head"><SectionHeading eyebrow="Lettings" title="Available rentals"><p>Search homes currently available to rent across Dublin.</p></SectionHeading></div>{error?<div className="empty-inline">Rentals are unavailable just now. <ValuationCTA location="lettings-load-error" type="let">Contact our team</ValuationCTA></div>:data.length?<PropertyDisplay initial={params.view}><PropertyGrid properties={data}/></PropertyDisplay>:<EmptyAlert interest="residential lettings"/>}</section></>}





