import Image from 'next/image';
export function CatalogueHero({label,title,description,image}:{label:string;title:string;description:string;image:string}){return <section className="catalogue-hero"><Image src={image} alt="" fill priority sizes="100vw"/><div className="catalogue-shade"/><div className="wrap catalogue-hero-copy"><span className="eyebrow">{label}</span><h1>{title}</h1><p>{description}</p></div></section>}

