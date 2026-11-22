import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHeader } from '@/components/site/page-header';
import { ValuationForm } from '@/components/site/valuation-form';
import { ValuationCTA } from '@/components/site/valuation-cta';
import { PAGE_HEADERS } from '@/data/page-headers';
import { getPublishedItems, siteContent } from '@/data/site-content';

const pageTitle = 'Request a Property Valuation | City Properties Dublin';
const description = 'Request a complimentary, no-obligation property valuation from the City Properties team in Dublin.';
const staging = process.env.VERCEL_ENV === 'preview' || /staging|preview/i.test(process.env.NEXT_PUBLIC_SITE_URL || '');
export const metadata: Metadata = {
  title: { absolute: pageTitle }, description,
  robots: staging ? { index: false, follow: false } : { index: true, follow: true },
  openGraph: { title: pageTitle, description, url: 'https://cityproperties.ie/valuation', type: 'website', images: ['/images/page-headers/valuation-handshake.webp'] },
};

export default async function ValuationPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const type = typeof params.type === 'string' && params.type.toLowerCase() === 'let' ? 'Let' : 'Sell';
  const topic = typeof params.topic === 'string' ? params.topic.toLowerCase() : '';
  const initial = {
    lookingTo: type,
    name: typeof params.name === 'string' ? params.name.slice(0, 120) : '',
    email: typeof params.email === 'string' ? params.email.slice(0, 254) : '',
    telephone: typeof params.phone === 'string' ? params.phone.slice(0, 60) : '',
    message: topic === 'commercial' ? 'Commercial property valuation' : '',
  } as const;
  const offices = siteContent.offices.items;
  const advice = getPublishedItems('advice');
  const schema = [
    { '@context': 'https://schema.org', '@type': 'Organization', name: 'City Properties', url: 'https://cityproperties.ie', email: 'info@cityproperties.ie', telephone: '+35314595941', identifier: { '@type': 'PropertyValue', name: 'PSRA Licence No', value: '001363' } },
    { '@context': 'https://schema.org', '@type': 'WebPage', name: pageTitle, description, url: 'https://cityproperties.ie/valuation', isPartOf: { '@type': 'WebSite', name: 'City Properties', url: 'https://cityproperties.ie' } },
  ];
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <PageHeader title={'What is your\nproperty worth?'} accentWord="worth?" eyebrow="Free valuation" intro="Tell us about your property and one of our Dublin team will be in touch to arrange a valuation visit. It is free and there is no obligation." image={PAGE_HEADERS.valuation.image} imageAlt={PAGE_HEADERS.valuation.imageAlt} focalPoint={PAGE_HEADERS.valuation.focalPoint} tall valuationLayout>
      <ul className="valuation-points"><li>Free, no obligation</li><li>Three Dublin offices</li><li>Residential, commercial and lettings</li></ul>
      <div className="valuation-form-card"><ValuationForm initial={initial} offices={offices}/></div>
    </PageHeader>
    <main className="valuation-content">
      <section className="valuation-expect wrap" aria-labelledby="valuation-expect-title">
        <div className="valuation-expect-copy"><span className="eyebrow">Your valuation</span><h2 id="valuation-expect-title">Three simple steps</h2><ol>
          <li><span>01</span><div><h3>Submit your details</h3><p>Fill in the short form with your details and property address. It is free and there is no obligation.</p></div></li>
          <li><span>02</span><div><h3>We get in touch</h3><p>One of our team will contact you to discuss your property and arrange a convenient time to visit.</p>{siteContent.responseTime?.published && siteContent.responseTime.value && <p>{siteContent.responseTime.value}</p>}</div></li>
          <li><span>03</span><div><h3>Your valuation</h3><p>We visit your property and give you a clear view of its market value and your options.</p></div></li>
        </ol></div>
        <div className="valuation-lifestyle"><Image src={PAGE_HEADERS.valuationLifestyle.image} alt={PAGE_HEADERS.valuationLifestyle.imageAlt} fill sizes="(max-width: 760px) 92vw, 46vw" quality={82}/></div>
      </section>
      <section className="valuation-why"><div className="wrap"><span className="eyebrow">A local point of view</span><h2>Why City Properties</h2><div className="valuation-why-grid">
        <article><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 14 16 4l12 10M7 12v16h18V12M12 28v-9h8v9"/></svg><h3>Local knowledge</h3><p>Three offices across Dublin and a team that knows the area.</p></article>
        <article><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 27V9h22v18M3 27h26M10 14h4m4 0h4m-12 6h4m4 0h4M11 9V5h10v4"/></svg><h3>Sales, lettings and commercial</h3><p>One team for residential, commercial and lettings property.</p></article>
        <article><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4 27 9v7c0 7-5 11-11 13C10 27 5 23 5 16V9l11-5ZM11 16l3 3 7-7"/></svg><h3>Straightforward advice</h3><p>Clear, honest guidance from the first call to the final figure.</p></article>
      </div></div></section>
      <section className="valuation-commercial"><div className="wrap"><div><span className="eyebrow">Commercial property</span><h2>Own a commercial property?</h2><p>Speak to our team about a commercial valuation.</p><a className="valuation-commercial-phone" href="tel:+35314595941">Call 01 459 5941</a></div><ValuationCTA variant="primary" location="valuation-commercial-band" type="sell" topic="commercial">Request a commercial valuation</ValuationCTA></div></section>
      {advice.length > 0 && <section className="valuation-advice wrap"><span className="eyebrow">Property advice</span><h2>Guidance for your next move</h2><div className="valuation-advice-grid">{advice.map((item) => <a key={item.url} href={item.url}><span>{item.category}</span><h3>{item.title}</h3><p>{item.summary}</p></a>)}</div></section>}
      <section className="valuation-offices wrap" aria-labelledby="valuation-offices-title"><div className="section-row"><div><span className="eyebrow">City Properties · Dublin</span><h2 id="valuation-offices-title">Three Dublin offices</h2></div><p>PSRA Licence No. 001363</p></div><div className="valuation-office-grid">{offices.map((office) => <article className="valuation-office-card" key={office.name}><span className="eyebrow">{office.area}</span><h3>{office.name}</h3><address>{office.address}</address><a href={`tel:${office.phone.replace(/\D/g, '')}`}>{office.phone}</a><a className="text-link" href={office.directionsUrl} target="_blank" rel="noreferrer">Get directions <span>↗</span></a></article>)}</div></section>
    </main>
  </>;
}
