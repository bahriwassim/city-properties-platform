import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/site/page-header';
import { PAGE_HEADERS } from '@/data/page-headers';
import { ValuationCTA } from '@/components/site/valuation-cta';
import { getDevelopments } from '@/lib/data';
import { SectionHeading } from '@/components/site/section-heading';
import { EmptyAlert } from '@/components/site/empty-alert';

export const metadata:Metadata={title:'New Homes in Dublin',description:'Discover new residential developments across Dublin with City Properties.'};
export default async function NewHomesPage(){const {data,error}=await getDevelopments();return <><PageHeader eyebrow="New homes · Dublin" title={'A new chapter\nstarts here'} accentWord="here" intro="Discover new residential developments across Dublin." secondaryCta={{label:'Request a valuation',href:'/valuation?type=sell'}} {...PAGE_HEADERS.newHomes}/><section className="catalogue wrap"><SectionHeading eyebrow="New homes" title="Developments"><p>Explore available developments and enquire with City Properties.</p></SectionHeading>{error?<div className="empty-inline">Developments are temporarily unavailable. <a href="tel:+35314595941">Call 01 459 5941</a><ValuationCTA location="new-homes-load-error" type="sell">Thinking of selling or letting? Request a valuation</ValuationCTA></div>:data.length?<><div className="development-list">{data.map(d=><Link key={d.id} href={`/new-homes/${d.slug}`}><span>{d.location}{d.demo_data&&<b className="demo-inline-tag">DEMO / SAMPLE</b>}</span><h3>{d.name}</h3><span>{d.availability||'Explore development'} ↗</span></Link>)}</div><div className="listing-valuation-link"><ValuationCTA location="new-homes-listings" type="sell">Thinking of selling or letting? Request a valuation</ValuationCTA></div></>:<EmptyAlert interest="new homes"/>}</section></>}

