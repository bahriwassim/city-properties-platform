import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/supabase/admin';
import { PropertyEditor } from '@/components/admin/property-editor';
import { ImageUploader } from '@/components/admin/image-uploader';
import type { Property } from '@/types/database';
export default async function EditPropertyPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{error?:string;success?:string}>}){const {id}=await params;const [{supabase},qs]=await Promise.all([requireAdmin(),searchParams]);const {data,error}=await supabase.from('properties').select('*,property_features(feature),property_images(*),property_private_locations(*)').eq('id',id).single();if(error||!data)notFound();const privateRows=(data as any).property_private_locations;const privateLocation=Array.isArray(privateRows)?(privateRows[0]||{}):(privateRows||{});Object.assign(data as any,privateLocation);const imageRows=await Promise.all(((data as any).property_images||[]).map(async(i:any)=>{const {data:signed}=await supabase.storage.from('property-images').createSignedUrl(i.storage_path,3600);return {...i,image_url:signed?.signedUrl||''}}));const media={...(data as any),property_images:imageRows};const {data:developments}=await supabase.from('developments').select('id,name,location').eq('demo_data',false).order('name');return <><div className="admin-page-head"><div><span className="eyebrow">Property management - {(data as any).property_reference||'No reference'}</span><h1>Edit property</h1><p>{(data as any).title}</p></div><div className="admin-head-actions"><Link className="admin-back" href="/admin/properties">- All properties</Link>{(data as any).published&&<Link className="button button-small" href={(data as any).listing_type==='commercial'?'/commercial/'+(data as any).slug:(data as any).listing_type==='rent'?'/lettings/'+(data as any).slug:'/residential/'+(data as any).slug} target="_blank">Preview -—</Link>}</div></div>{qs.error&&<div className="admin-alert">Could not save. Check the fields and make sure the property slug and reference are unique.</div>}{qs.success&&<div className="admin-success">Property saved successfully.</div>}<PropertyEditor property={media as Property} developments={developments||[]}/><section className="admin-section"><div className="admin-section-head"><div><span className="eyebrow">Property media</span><h2>Photography</h2></div></div><ImageUploader propertyId={(data as any).id} initial={imageRows}/></section></>}






