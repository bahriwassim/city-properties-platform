import Image from 'next/image';
import Link from 'next/link';
import { ArrowIcon } from '@/components/site/arrow-icon';
import { Band } from '@/components/site/band';
import { ValuationCTA } from '@/components/site/valuation-cta';
import { copy } from '@/data/copy';

export function Footer({settings}:{settings:{telephone:string;email:string;offices:{address:string}[];company_description:string;social_links?:Record<string,string>}}){
  const socials=Object.entries(settings.social_links||{}).filter(([,url])=>Boolean(url));
  return <>
    <Band tone="grey-200" className="footer-request-band"><ValuationCTA variant="inline" location="site-footer">Request a valuation</ValuationCTA></Band>
    <footer className="site-footer"><div className="wrap">
      <div className="footer-main">
        <div className="footer-intro">
          <Link href="/" className="footer-brand" aria-label="City Properties home"><Image className="footer-logo" src="/city-properties-logo.png" alt="City Properties" width={110} height={128}/></Link>
          <p>{copy.footer.intro}</p>
          <small>PSRA Licence No: 001363</small>
          {socials.map(([label,url])=><a key={label} href={url} target="_blank" rel="noreferrer">{label} <ArrowIcon/></a>)}
        </div>
        <div><h2>{copy.footer.discover}</h2>{copy.navigation.links.map(([label,href])=><Link data-cta={label==='Valuation'?'footer-discover':undefined} key={href} href={href}>{label}</Link>)}<Link href="/new-homes">{copy.navigation.newHomes}</Link></div>
        <div><h2>{copy.footer.visit}</h2>{settings.offices.map((office,i)=><address key={i}>{office.address}</address>)}</div>
        <div><h2>{copy.footer.getInTouch}</h2><a href="tel:+35314595941">{settings.telephone}</a><a href={'mailto:'+settings.email}>{settings.email}</a></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} {copy.footer.city}</span><span>{copy.footer.city} · Dublin</span><div><Link href="/privacy-policy">{copy.footer.privacy}</Link><Link href="/cookie-policy">{copy.footer.cookies}</Link><Link href="/terms">{copy.footer.terms}</Link></div></div>
    </div></footer>
  </>;
}
