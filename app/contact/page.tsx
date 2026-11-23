import type { Metadata } from 'next';
import { ContactForm } from '@/components/site/contact-form';
import { PageHeader } from '@/components/site/page-header';
import { PAGE_HEADERS } from '@/data/page-headers';
import { getSiteSettings } from '@/lib/data';
import { copy } from '@/data/copy';

export const metadata: Metadata = { title: 'Contact City Properties Dublin', description: copy.home.contactIntro };
export default async function ContactPage() {
  const settings = await getSiteSettings();
  return <><PageHeader title={copy.home.contactTitle} eyebrow="City Properties · Dublin" intro={copy.home.contactIntro} secondaryCta={{label:'Request a valuation',href:'/valuation'}} {...PAGE_HEADERS.contact} />
    <section className="contact-page wrap"><div className="contact-intro"><div className="contact-quick"><a href="tel:+35314595941"><small>Telephone</small>{settings.telephone}</a><a href={'mailto:'+settings.email}><small>Email</small>{settings.email}</a><p><small>PSRA Licence No.</small>001363</p></div></div><div className="contact-panel"><span className="eyebrow">Send an enquiry</span><ContactForm/></div><div className="contact-offices"><h2>Our offices</h2><div>{settings.offices.map((office,index)=><p key={index}>{office.address}</p>)}</div></div></section>
  </>;
}
