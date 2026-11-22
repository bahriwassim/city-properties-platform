import Link from 'next/link';
import Image from 'next/image';
import { ArrowIcon } from '@/components/site/arrow-icon';
import { ValuationCTABanner } from '@/components/site/valuation-cta';

export function Footer({settings}:{settings:{telephone:string;email:string;offices:{address:string}[];company_description:string;social_links?:Record<string,string>}}){const socials=Object.entries(settings.social_links||{}).filter(([,url])=>Boolean(url));return <><ValuationCTABanner location="site-footer"/><footer className="site-footer"><div className="wrap"><div className="footer-main"><div className="footer-intro"><Link href="/" className="footer-brand" aria-label="City Properties home"><Image src="/city-properties-logo.png" alt="City Properties" width={200} height={276}/></Link><p>{settings.company_description}</p><small>PSRA Licence No: 001363</small>{socials.map(([label,url])=><a key={label} href={url} target="_blank" rel="noreferrer">{label} <ArrowIcon/></a>)}</div><div><h2>Discover</h2><Link href="/residential">Residential</Link><Link href="/commercial">Commercial</Link><Link href="/lettings">Lettings</Link><Link href="/new-homes">New homes</Link><Link data-cta="footer-discover" href="/valuation">Valuation</Link><Link href="/contact">Contact us</Link></div><div><h2>Visit</h2>{settings.offices.map((office,i)=><address key={i}>{office.address}</address>)}</div><div><h2>Get in touch</h2><a href="tel:+35314595941">{settings.telephone}</a><a href={'mailto:'+settings.email}>{settings.email}</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} City Properties</span><span>City Properties · Dublin</span><div><Link href="/privacy-policy">Privacy policy</Link><Link href="/cookie-policy">Cookie policy</Link><Link href="/terms">Terms</Link></div></div></div></footer></>}







