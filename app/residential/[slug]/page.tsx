import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProperty } from '@/lib/data';
import { PropertyDetail } from '@/components/properties/detail';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const {data}=await getProperty(slug);if(!data)return {title:'Property not found'};return {title:`${data.title} for Sale in ${data.city||'Dublin'}`,description:data.short_description||`${data.title}, ${data.city||'Dublin'}. View property details and arrange a viewing with City Properties.`,openGraph:{images:data.property_images?.[0]?.image_url?[data.property_images[0].image_url]:[]},alternates:{canonical:`/residential/${slug}`}}}
export default async function ResidentialPropertyPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const {data}=await getProperty(slug);if(!data||data.listing_type!=='sale')notFound();return <PropertyDetail property={data}/>}

