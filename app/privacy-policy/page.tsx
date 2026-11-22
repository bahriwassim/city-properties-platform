import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | City Properties',
  description: 'How City Properties handles personal information submitted through this website.',
};

export default function PrivacyPolicyPage() {
  return <main className="legal-page wrap">
    <header className="legal-heading"><span className="eyebrow">City Properties · Dublin</span><h1>Privacy policy</h1><p>How we handle information you share with us through this website.</p></header>
    <article className="legal-copy">
      <p>City Properties respects your privacy. This policy explains how information submitted through this website is used. It applies to enquiries about buying, renting, selling, letting, commercial property and new homes.</p>
      <h2>Information you provide</h2><p>When you contact us, we may receive your name, email address, telephone number, enquiry type, property reference and message. Viewing requests may also include your preferred date and time.</p>
      <h2>How we use your information</h2><p>We use these details to respond to your enquiry, discuss a property or service you asked about, and manage the related communication. We do not use enquiry details for unrelated marketing without an appropriate basis.</p>
      <h2>Storage and service providers</h2><p>Enquiry information is handled through the website’s database and hosting services so City Properties can receive and manage your request. Access is limited to authorised users who need the information to respond. We retain information only for as long as needed for the enquiry and any applicable legal obligations.</p>
      <h2>Your choices and rights</h2><p>You may ask to access, correct or delete personal information you have sent us, or raise a concern about its use. Some records may need to be retained where the law requires it.</p>
      <h2>Contact</h2><p>For privacy requests, contact City Properties at <a href="mailto:info@cityproperties.ie">info@cityproperties.ie</a> or 01 459 5941. Our listed office address is 12 Lower Hatch St, Dublin 2.</p>
      <p className="legal-note">This page describes the website’s intended enquiry handling. Before launch, City Properties should confirm its retention periods, service-provider details and any additional processing used in production.</p>
    </article>
  </main>;
}
