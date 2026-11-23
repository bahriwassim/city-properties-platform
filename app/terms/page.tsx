import type { Metadata } from 'next';
import { PageHeader } from '@/components/site/page-header';
import { PAGE_HEADERS } from '@/data/page-headers';
export const metadata: Metadata = { title: 'Terms of Use | City Properties', description: 'Terms for using the City Properties website and its property information.' };
export default function TermsPage() { return <><PageHeader eyebrow="City Properties Â· Dublin" title={'Terms of\nuse'} accentWord="use" intro="Conditions for using information on this website." {...PAGE_HEADERS.terms}/><main className="legal-page wrap"><article className="legal-copy">
  <h2>Website information</h2><p>Property information is provided for general guidance and may change. Availability, price, measurements, descriptions and other details should be confirmed directly with City Properties before you rely on them or make a decision.</p>
  <h2>Demonstration listings</h2><p>Any listing marked â€œDEMO / SAMPLEâ€ is fictional demonstration content. It is not a real property offered by City Properties and must not be relied on as a current listing.</p>
  <h2>Use of this website</h2><p>You may use this website for personal property research and to contact City Properties. Do not misuse the website, interfere with its operation, attempt unauthorised access or copy its content for commercial use without permission.</p>
  <h2>Third-party services and links</h2><p>Links or embedded services operated by others are provided for convenience. City Properties does not control third-party websites or their content and privacy practices.</p>
  <h2>Contact</h2><p>For questions about these terms, contact <a href="mailto:info@cityproperties.ie">info@cityproperties.ie</a>. City Properties, 12 Lower Hatch St, Dublin 2. PSRA Licence No: 001363.</p>
  <p className="legal-note">These website terms are informational and should be reviewed for City Propertiesâ€™ intended production use before launch.</p>
</article></main></>; }


