import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getDevelopments } from '@/lib/data';
import { SectionHeading } from '@/components/site/section-heading';
import { EmptyAlert } from '@/components/site/empty-alert';

export const metadata:Metadata={title:'New Homes in Dublin',description:'Discover new residential developments across Dublin with City Properties.'};
export default async function NewHomesPage(){const {data,error}=await getDevelopments();return <><section className="catalogue-hero"><Image src="/images/dublin-interior.webp" alt="Bright Georgian home interior" fill priority sizes="100vw"/><div className="catalogue-shade"/><div className="wrap catalogue-hero-copy"><span className="eyebrow">New homes · Dublin</span><h1>A new chapter<br/>starts here.</h1><p>Discover new residential developments across Dublin.</p></div></section><section className="catalogue wrap"><SectionHeading eyebrow="New homes" title="Developments"><p>Explore available developments and enquire with City Properties.</p></SectionHeading>{error?<div className="empty-inline">Developments are temporarily unavailable. <a href="tel:+35314595941">Call 01 459 5941</a></div>:data.length?<div className="development-list">{data.map(d=><Link key={d.id} href={`/new-homes/${d.slug}`}><span>{d.location}{d.demo_data&&<b className="demo-inline-tag">DEMO / SAMPLE</b>}</span><h3>{d.name}</h3><span>{d.availability||'Explore development'} ↗</span></Link>)}</div>:<EmptyAlert interest="new homes"/>}</section></>}

