import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProperty } from '@/lib/data';
import { PropertyDetail } from '@/components/properties/detail';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const {data}=await getProperty(slug);if(!data)return {title:'Rental property not found'};return {title:`${data.title} to Rent in ${data.city||'Dublin'}`,description:data.short_description||`${data.title}, ${data.city||'Dublin'}. Arrange a viewing with City Properties.`,alternates:{canonical:`/lettings/${slug}`}}}
export default async function RentalPropertyPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const {data}=await getProperty(slug);if(!data||data.listing_type!=='rent')notFound();return <PropertyDetail property={data}/>}

