import Link from 'next/link';
import { ValuationCTA } from '@/components/site/valuation-cta';

export default function NotFound(){return <section className="not-found wrap"><span className="eyebrow">City Properties · Dublin</span><h1>This property could not be found.</h1><p>It may no longer be available, or the address may have changed.</p><Link className="button" href="/residential">Explore properties <span>↗</span></Link><ValuationCTA location="not-found" type="sell">Request a valuation</ValuationCTA></section>}
