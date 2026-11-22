import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProperty } from '@/lib/data';
import { PropertyDetail } from '@/components/properties/detail';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const {data}=await getProperty(slug);if(!data)return {title:'Commercial property not found'};return {title:`${data.title} | Commercial Property Dublin`,description:data.short_description||`${data.title}, ${data.city||'Dublin'}. Contact City Properties for more details.`,alternates:{canonical:`/commercial/${slug}`}}}
export default async function CommercialPropertyPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const {data}=await getProperty(slug);if(!data||data.listing_type!=='commercial')notFound();return <PropertyDetail property={data}/>}

