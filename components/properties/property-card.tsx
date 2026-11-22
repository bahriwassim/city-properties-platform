import Image from 'next/image';
import Link from 'next/link';
import type { Property } from '@/types/database';
import { demoImage } from '@/lib/data';
import { ArrowIcon } from '@/components/site/arrow-icon';

export function PropertyCard({property}:{property:Property}){
 const image=property.property_images?.find(x=>x.is_cover)?.image_url||property.property_images?.[0]?.image_url||demoImage;
 const route=property.listing_type==='commercial'?'/commercial':property.listing_type==='rent'?'/lettings':'/residential';
 const status=property.display_status|| (property.new_home?'New home':property.status==='under_offer'?'Under offer':property.status==='sale_agreed'?'Sale agreed':property.status==='sold'?'Sold':property.status==='let'?'Let':property.price_period?'To let':property.listing_type==='rent'?'To let':'For sale');
 const statusTone=['sale_agreed','sold','let'].includes(property.status)?'closed':property.listing_type==='rent'||property.price_period?'rent':'sale';
 const type=property.property_type==='industrial'?'Industrial Unit':property.property_type==='retail'?'Retail Unit':property.property_type.replace('_',' ').replace(/^./,letter=>letter.toUpperCase());
 const area=property.floor_area?`${property.floor_area} ${property.floor_area_unit}${property.floor_area_ft2?` · ${property.floor_area_ft2} ft²`:''}`:null;
 return <article className="property-card"><Link href={`${route}/${property.slug}`} className="property-media"><Image src={image} alt={property.property_images?.[0]?.alt||property.title} fill sizes="(max-width: 700px) 92vw, (max-width: 1100px) 45vw, 31vw"/><span className={`property-tag property-tag--${statusTone}`}>{status}</span>{property.demo_data&&<span className="demo-property-tag">DEMO / SAMPLE</span>}<span className="property-view">View property <ArrowIcon/></span></Link><div className="property-card-copy"><div className="property-state">{type}{property.property_reference&&<span>{property.property_reference}</span>}</div><h3><Link href={`${route}/${property.slug}`}>{property.title}</Link></h3><p>{[property.city,property.county].filter(Boolean).join(', ')}</p><div className="property-card-bottom"><strong>{property.price_label||(property.price?new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(property.price):'Price on application')}</strong><span>{[property.bedrooms&&`${property.bedrooms} bed`,area,property.ber_rating&&`BER ${property.ber_rating}`].filter(Boolean).join(' · ')}</span></div></div></article>
}






