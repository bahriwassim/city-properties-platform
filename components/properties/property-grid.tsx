import type { Property } from '@/types/database';
import { PropertyCard } from './property-card';
import { ScrollReveal } from '@/components/site/scroll-reveal';
import { ArrowIcon } from '@/components/site/arrow-icon';
import { ValuationCTA } from '@/components/site/valuation-cta';

export function PropertyGrid({properties,empty='No properties currently available in this category.'}:{properties:Property[];empty?:string}){
 if(!properties.length)return <div className="empty-state"><span className="eyebrow">City Properties</span><h3>{empty}</h3><p>Speak with our team and we can help with your property search.</p><a className="button" href="/contact">Contact our team <ArrowIcon/></a><ValuationCTA location="empty-property-grid" type="sell">Thinking of selling or letting? Request a valuation</ValuationCTA></div>;
 const type=properties[0].listing_type==='rent'?'let':'sell';const topic=properties[0].listing_type==='commercial'?'commercial':undefined;
 return <><div className="property-grid">{properties.map((p,index)=><ScrollReveal key={p.id} delay={Math.min(index,4)*65}><PropertyCard property={p}/></ScrollReveal>)}</div><div className="listing-valuation-link"><ValuationCTA location={`listing-grid-${properties[0].listing_type}`} type={type} topic={topic}>Thinking of selling or letting? Request a valuation</ValuationCTA></div></>;
}



