import { createClient } from '@/lib/supabase/server';
import type { Property, ListingType } from '@/types/database';
import { LISTINGS } from '@/data/listings';

export const demoImage = '/property-placeholder.svg';

export function normalizeSearchParams(values:Record<string,string|string[]|undefined>){return Object.fromEntries(Object.entries(values).map(([key,value])=>[key,Array.isArray(value)?value[0]:value])) as Record<string,string|undefined>}

function filterSeedListings(options:{listing?:ListingType;featured?:boolean;limit?:number;filters?:Record<string,string|undefined>}={}){const f=options.filters??{};let rows=LISTINGS.filter((p)=>{if(!p.published||p.status==='draft'||p.status==='off_market')return false;if(options.listing&&p.listing_type!==options.listing)return false;if(options.featured&&!p.featured)return false;if(f.location&&!`${p.title} ${p.city||''} ${p.county||''}`.toLowerCase().includes(f.location.toLowerCase()))return false;if(f.type&&p.property_type!==f.type)return false;if(f.bedrooms&&(!p.bedrooms||p.bedrooms<Number(f.bedrooms)))return false;if(f.bathrooms&&(!p.bathrooms||p.bathrooms<Number(f.bathrooms)))return false;if(f.min_price&&(!p.price||p.price<Number(f.min_price)))return false;if(f.max_price&&(!p.price||p.price>Number(f.max_price)))return false;if(f.reference&&!p.property_reference?.toLowerCase().includes(f.reference.toLowerCase()))return false;if(f.ber&&p.ber_rating!==f.ber)return false;if(f.status&&p.status!==f.status)return false;if(f.min_area&&(!p.floor_area||p.floor_area<Number(f.min_area)))return false;if(f.max_area&&(!p.floor_area||p.floor_area>Number(f.max_area)))return false;return true});if(f.sort==='price_asc')rows=rows.sort((a,b)=>(a.price??Number.MAX_SAFE_INTEGER)-(b.price??Number.MAX_SAFE_INTEGER));else if(f.sort==='price_desc')rows=rows.sort((a,b)=>(b.price??-1)-(a.price??-1));if(options.limit)rows=rows.slice(0,options.limit);return rows}

async function signPropertyImages(supabase:any,rows:any[]){return Promise.all(rows.map(async row=>{const images=await Promise.all((row.property_images||[]).map(async (image:any)=>{const {data}=await supabase.storage.from('property-images').createSignedUrl(image.storage_path,3600);return {...image,image_url:data?.signedUrl||''}}));return {...row,property_images:images}}))}

export async function getProperties(options: { listing?: ListingType; featured?: boolean; limit?: number; filters?: Record<string, string | undefined>; admin?: boolean; includeImages?: boolean } = {}) {
  const supabase: any = await createClient();
  if (!supabase) return { data: filterSeedListings(options) as Property[], error: null };
  const columns='id,slug,title,short_description,description,property_type,listing_type,status,price,price_label,city,county,bedrooms,bathrooms,floor_area,floor_area_unit,property_reference,ber_rating,parking,available_from,featured,new_home,demo_data,published,development_id,created_at,updated_at';
  let query = supabase.from('properties').select(options.admin?'*'+(options.includeImages===false?'':',property_images(*)'):columns+(options.includeImages===false?'':',property_images(*)')).order('created_at', { ascending: false });
  if (!options.admin) query = query.eq('published', true).neq('status', 'draft').neq('status', 'off_market').neq('demo_data',true);
  if (options.listing) query = query.eq('listing_type', options.listing);
  if (options.featured) query = query.eq('featured', true);
  const f = options.filters ?? {};
  if (f.location) { const location=f.location.replace(/[(),]/g,' ').trim(); if(location)query=query.or('city.ilike.%'+location+'%,county.ilike.%'+location+'%'); }
  if (f.type) query = query.eq('property_type', f.type as never);
  if (f.bedrooms && Number.isFinite(Number(f.bedrooms))) query = query.gte('bedrooms', Number(f.bedrooms));
  if (f.bathrooms && Number.isFinite(Number(f.bathrooms))) query = query.gte('bathrooms', Number(f.bathrooms));
  if (f.min_price && Number.isFinite(Number(f.min_price))) query = query.gte('price', Number(f.min_price));
  if (f.max_price && Number.isFinite(Number(f.max_price))) query = query.lte('price', Number(f.max_price));
  if (f.reference) query = query.ilike('property_reference', `%${f.reference}%`);
  if (f.ber) query = query.eq('ber_rating', f.ber);
  if (f.available_from) query = query.lte('available_from', f.available_from);
  if (f.status) query = query.eq('status', f.status as never);
  if (f.min_area && Number.isFinite(Number(f.min_area))) query = query.gte('floor_area',Number(f.min_area));
  if (f.max_area && Number.isFinite(Number(f.max_area))) query = query.lte('floor_area',Number(f.max_area));
  if (f.sort === 'price_asc') query = query.order('price', { ascending: true });
  if (f.sort === 'price_desc') query = query.order('price', { ascending: false });
  if (options.limit) query = query.limit(options.limit);
  const { data, error } = await query;
  const signed=await signPropertyImages(supabase,data??[]);
  const seeds=filterSeedListings(options);const existing=new Set(signed.map((p:any)=>p.slug));const combined=[...seeds.filter((p)=>!existing.has(p.slug)),...signed] as Property[];
  return { data: options.limit?combined.slice(0,options.limit):combined, error: combined.length?null:error?.message??null };
}

export async function getProperty(slug: string, admin = false) {
  const seeded=LISTINGS.find((property)=>property.slug===slug);if(seeded&&!admin)return {data:seeded.published&&seeded.status!=='draft'&&seeded.status!=='off_market'?seeded as Property:null,error:null};
  const supabase: any = await createClient();
  if (!supabase) return { data: null as Property | null, error: 'Supabase is not configured.' };
  const publicColumns='id,slug,title,short_description,description,property_type,listing_type,status,price,price_label,city,county,bedrooms,bathrooms,floor_area,floor_area_unit,property_reference,ber_rating,parking,available_from,featured,new_home,demo_data,published,development_id,created_at,updated_at,property_images(*),property_features(feature)';
  let query = supabase.from('properties').select(admin?'*,property_images(*),property_features(feature),property_private_locations(*)':publicColumns).eq('slug', slug).single();
  if (!admin) query = query.eq('published', true).neq('status', 'draft').neq('status', 'off_market') as typeof query;
  const { data, error } = await query;
  if(!data)return {data:null as Property|null,error:error?.message??null};
  const [signed]=await signPropertyImages(supabase,[data]);
  if(!admin){const {data:location}=await supabase.rpc('public_property_location',{property_uuid:data.id});if(location?.[0])Object.assign(signed,location[0]);}
  return { data: signed as Property, error: error?.message ?? null };
}

export async function getDevelopments(): Promise<{ data: any[]; error: string | null }> {
  const supabase: any = await createClient();
  if (!supabase) return { data: [], error: null };
  const { data, error } = await supabase.from('developments').select('*').eq('published', true).neq('demo_data',true).order('created_at', { ascending: false });
  return { data: data ?? [], error: error?.message ?? null };
}

export async function getDevelopment(slug: string) {
  const supabase: any = await createClient();
  if (!supabase) return { data: null, error: 'Supabase is not configured.' };
  const { data, error } = await supabase.from('developments').select('*').eq('slug', slug).eq('published', true).neq('demo_data',true).single();
  return { data, error: error?.message ?? null };
}

type SiteSettings = { telephone: string; email: string; offices: { address: string }[]; social_links: Record<string, string>; company_description: string; default_seo_title: string; default_seo_description: string };

export async function getSiteSettings(): Promise<SiteSettings> {
  const fallback: { telephone: string; email: string; offices: { address: string }[]; social_links: Record<string, string>; company_description: string; default_seo_title: string; default_seo_description: string } = { telephone: '01 459 5941', email: 'info@cityproperties.ie', offices: [{address:'12 Lower Hatch St, Dublin 2'},{address:'Citywest Business Centre, Citywest, Co Dublin'},{address:'Botanic Court, Botanic Road, Glasnevin, Dublin 9'}], social_links: {}, company_description:'Residential and commercial property services across Dublin.', default_seo_title:'City Properties | Dublin Property, Considered', default_seo_description:'Residential, commercial and lettings property services across Dublin.' };
  const supabase: any = await createClient();
  if (!supabase) return fallback;
  const {data,error}=await supabase.from('site_settings').select('*').eq('id',true).maybeSingle();
  return error||!data?fallback:{...fallback,...data,telephone:fallback.telephone,email:fallback.email,offices:fallback.offices};
}








