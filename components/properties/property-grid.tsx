import type { Property } from '@/types/database';
import { PropertyCard } from './property-card';
import { ScrollReveal } from '@/components/site/scroll-reveal';
import { ArrowIcon } from '@/components/site/arrow-icon';

export function PropertyGrid({properties,empty='No properties currently available in this category.'}:{properties:Property[];empty?:string}){
 if(!properties.length)return <div className="empty-state"><span className="eyebrow">City Properties</span><h3>{empty}</h3><p>Speak with our team and we can help with your property search.</p><a className="button" href="/contact">Contact our team <ArrowIcon/></a></div>;
 return <div className="property-grid">{properties.map((p,index)=><ScrollReveal key={p.id} delay={Math.min(index,4)*65}><PropertyCard property={p}/></ScrollReveal>)}</div>;
}



