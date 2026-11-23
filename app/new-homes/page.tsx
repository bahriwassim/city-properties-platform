import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/site/page-header';
import { PAGE_HEADERS } from '@/data/page-headers';
import { ValuationCTA } from '@/components/site/valuation-cta';
import { getDevelopments } from '@/lib/data';
import { SectionHeading } from '@/components/site/section-heading';
import { EmptyAlert } from '@/components/site/empty-alert';

export const metadata:Metadata={title:'New Homes in Dublin',description:'Discover new residential developments across Dublin with City Properties.'};
export default async function NewHomesPage(){const {data,error}=await getDevelopments();return <><PageHeader eyebrow="New homes · Dublin" title={'New homes\nin Dublin'} accentWord="Dublin" intro="Explore current residential developments across Dublin." secondaryCta={{label:'Request a valuation',href:'/valuation?type=sell'}} {...PAGE_HEADERS.newHomes}/><section className="catalogue wrap"><SectionHeading eyebrow="New homes" title="Developments"><p>Find details of current developments and available homes.</p></SectionHeading>{error?<div className="empty-inline">Developments are unavailable just now. <ValuationCTA location="new-homes-load-error" type="sell">Contact our team</ValuationCTA></div>:data.length?<><div className="development-list">{data.map(d=><Link key={d.id} href={`/new-homes/${d.slug}`}><span>{d.location}{d.demo_data&&<b className="demo-inline-tag">Demonstration listing</b>}</span><h3>{d.name}</h3><span>{d.availability||'View development'} ↗</span></Link>)}</div><div className="listing-valuation-link"><ValuationCTA location="new-homes-listings" type="sell">Request a valuation</ValuationCTA></div></>:<EmptyAlert interest="new homes"/>}</section></>}

