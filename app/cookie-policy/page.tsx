import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | City Properties',
  description: 'Information about cookies and similar technologies on the City Properties website.',
};

export default function CookiePolicyPage() {
  return <main className="legal-page wrap">
    <header className="legal-heading"><span className="eyebrow">City Properties · Dublin</span><h1>Cookie policy</h1><p>A clear note about cookies and essential website storage.</p></header>
    <article className="legal-copy">
      <p>Cookies are small files saved by a website in your browser. Similar technologies can store preferences or support sign-in sessions.</p>
      <h2>Essential website functions</h2><p>This website may use strictly necessary storage to support secure administrator sign-in and core site functions. These technologies are not used to build advertising profiles.</p>
      <h2>Analytics and marketing</h2><p>No analytics or advertising cookies are intentionally enabled by this website’s current implementation. If City Properties adds optional analytics, embedded media or advertising tools, this policy and the consent controls will be updated before those technologies are used.</p>
      <h2>Managing cookies</h2><p>You can review or delete cookies through your browser settings. Blocking essential cookies may affect sign-in or other functions that depend on them.</p>
      <h2>Contact</h2><p>Questions about cookies can be sent to <a href="mailto:info@cityproperties.ie">info@cityproperties.ie</a>.</p>
      <p className="legal-note">The cookies used can depend on production configuration and third-party services. City Properties should review this page whenever those services change.</p>
    </article>
  </main>;
}
