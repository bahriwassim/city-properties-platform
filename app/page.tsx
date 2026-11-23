import Link from 'next/link';
import Image from 'next/image';
import { Hero } from '@/components/site/hero';
import { PropertyGrid } from '@/components/properties/property-grid';
import { getProperties } from '@/lib/data';
import { MortgageHelper } from '@/components/site/home-tools';
import { siteContent } from '@/data/site-content';
import { ValuationShortForm } from '@/components/site/valuation-short-form';
import { ValuationCTA } from '@/components/site/valuation-cta';
import { Band } from '@/components/site/band';
import { copy } from '@/data/copy';

export default async function HomePage(){
 const [featured,sale,commercial]=await Promise.all([getProperties({featured:true,limit:4}),getProperties({listing:'sale',limit:3}),getProperties({listing:'commercial',limit:3})]);
 const offices=siteContent.offices.items;
 const schema={'@context':'https://schema.org','@type':'RealEstateAgent',name:'City Properties',url:'https://cityproperties.ie',telephone:'+35314595941',email:'info@cityproperties.ie',identifier:{'@type':'PropertyValue',name:'PSRA Licence No',value:'001363'},areaServed:{'@type':'City',name:'Dublin'}};
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/><Hero/>
 <Band tone="grey-100" className="quick-links-band"><div className="quick-links-grid">{copy.quickLinks.map(([label,description,href])=><Link href={href} key={label}><small>{label}</small><span>{description}</span><b aria-hidden="true">↗</b></Link>)}</div></Band>
 <section className="section wrap featured-section featured-listings"><div className="section-row"><div><span className="eyebrow">Featured</span><h2 className="section-title">{copy.home.featuredTitle}</h2><p className="section-subtitle">{copy.home.featuredIntro}</p></div><Link className="text-link" href="/residential">View all properties <span>↗</span></Link></div>{featured.data.length?<PropertyGrid properties={featured.data}/>:<p className="empty-inline">No properties in this category right now.</p>}</section>
 <section className="section wrap listing-category-section"><div className="section-row"><div><span className="eyebrow">Residential</span><h2 className="section-title">{copy.home.residentialTitle}</h2><p className="section-subtitle">{copy.home.residentialIntro}</p></div><Link className="text-link" href="/residential">Browse homes <span>↗</span></Link></div>{sale.data.length?<PropertyGrid properties={sale.data}/>:<p className="empty-inline">No properties in this category right now.</p>}</section>
 <Band tone="grey-200" className="residential-commercial-band"><p>Residential, lettings and commercial property across Dublin.</p><Link className="text-link" href="/commercial">Explore our services <span>↗</span></Link></Band>
 <section className="commercial-teaser"><div className="commercial-picture"><Image src="/images/commercial-office-exterior.webp" alt="Glass office building facade with urban reflections" fill sizes="(max-width:760px) 100vw, 55vw"/></div><div className="commercial-info"><span className="eyebrow">Commercial</span><h2>{copy.home.commercialTitle}</h2><p>{copy.home.commercialIntro}</p><Link className="button button-outline" href="/commercial">View commercial property <span>↗</span></Link></div></section>
 <section className="cta-band"><div className="wrap cta-content"><span className="eyebrow">For property owners</span><h2>{copy.home.ownerTitle}</h2><p>{copy.home.ownerIntro}</p><ValuationCTA variant="primary" location="homepage-owner"/></div></section>
 <section className="section wrap why-section"><span className="eyebrow">Why City Properties</span><div className="why-grid">{copy.why.map(([title,description],index)=><article key={title}><svg className="why-icon" viewBox="0 0 32 32" aria-hidden="true"><path d={['M4 14 16 4l12 10M7 12v16h18V12M12 28v-9h8v9','M5 27V9h22v18M3 27h26M10 14h4m4 0h4m-12 6h4m4 0h4M11 9V5h10v4','M16 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM6 28c0-5 4-9 10-9s10 4 10 9M4 13h3m18 0h3','M6 16h20M16 6v20M9 9l14 14m0-14L9 23'][index]}/></svg><h3>{title}</h3><p>{description}</p></article>)}</div></section>
 <Band tone="grey-100" className="office-band"><div className="office-band-grid">{offices.map(office=><article key={office.name}><strong>{office.name}</strong><address>{office.address}</address></article>)}</div><p className="psra-line">PSRA Licence No: 001363</p></Band>
 <section className="valuation-section"><div className="wrap valuation-banner"><div><span className="eyebrow">For property owners</span><h2>{copy.home.valuationTitle}</h2><p>{copy.home.valuationIntro}</p></div><ValuationShortForm/></div></section>
 <MortgageHelper/>
 <section className="offices-section section wrap"><div className="section-row"><div><span className="eyebrow">Visit us</span><h2 className="section-title">Our offices</h2></div><Link className="text-link" href="/contact">Contact us <span>↗</span></Link></div><div className="office-card-grid">{offices.map((office,index)=>{const photo=['/images/dublin-georgian.webp','/images/dublin-interior.webp','/images/commercial-office-exterior.webp'][index%3];return <article className="office-card" key={office.name}><div className="office-photo"><Image src={photo} alt="Dublin property and streetscape mood image" fill sizes="(max-width:760px) 92vw, 33vw" loading="lazy"/></div><span className="eyebrow">Dublin</span><h3>{office.name}</h3><address>{office.address}</address><a className="text-link" href={office.directionsUrl} target="_blank" rel="noreferrer">Get directions <span>↗</span></a></article>})}</div></section>
 <Band tone="navy" className="final-cta-band"><div><h2>{copy.home.finalTitle}</h2><p>{copy.home.finalIntro}</p></div><div className="final-cta-actions"><ValuationCTA variant="primary" location="homepage-final"/><Link className="text-link light-link" href="/contact">Contact us <span>↗</span></Link></div></Band>
 </>;
}
