'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowIcon } from '@/components/site/arrow-icon';

type CTAProps = { variant?: 'primary' | 'secondary' | 'inline'; location: string; type?: 'sell' | 'let'; topic?: string; href?: string; children?: React.ReactNode; className?: string };
function valuationHref(type?: 'sell' | 'let', topic?: string) {
  const query = new URLSearchParams(); if (type) query.set('type', type); if (topic) query.set('topic', topic);
  return `/valuation${query.size ? `?${query.toString()}` : ''}`;
}

export function ValuationCTA({ variant = 'inline', location, type, topic, href, children = 'Request a valuation', className = '' }: CTAProps) {
  return <Link href={href || valuationHref(type, topic)} data-cta={location} className={`valuation-cta valuation-cta--${variant} ${className}`.trim()}>{children}<ArrowIcon/></Link>;
}

export function ValuationCTABanner({ location = 'footer', title = 'Considering a sale or letting?', description = 'Talk with City Properties about your next step.', type }: { location?: string; title?: string; description?: string; type?: 'sell' | 'let' }) {
  return <section className="valuation-cta-band"><div className="wrap valuation-cta-band-inner"><span className="eyebrow">For property owners</span><h2>{title}</h2><p>{description}</p><ValuationCTA variant="primary" location={location} type={type}>Request a valuation</ValuationCTA></div></section>;
}

export function MobileValuationBar() {
  const pathname = usePathname(); const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => {
      const keyboardOpen = Boolean(window.visualViewport && window.visualViewport.height < window.innerHeight - 120);
      const focus = document.activeElement;
      const editing = focus instanceof HTMLElement && (focus.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(focus.tagName));
      const show = pathname !== '/valuation' && window.innerWidth <= 760 && window.scrollY > 300 && !keyboardOpen && !editing;
      setVisible(show); document.body.classList.toggle('has-mobile-valuation-bar', show);
    };
    update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update); window.visualViewport?.addEventListener('resize', update); document.addEventListener('focusin', update); document.addEventListener('focusout', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); window.visualViewport?.removeEventListener('resize', update); document.removeEventListener('focusin', update); document.removeEventListener('focusout', update); document.body.classList.remove('has-mobile-valuation-bar'); };
  }, [pathname]);
  if (!visible) return null;
  return <nav className="mobile-valuation-bar" aria-label="Contact City Properties"><a data-cta="mobile-call" href="tel:+35314595941">Call</a><ValuationCTA variant="primary" location="mobile-sticky">Request valuation</ValuationCTA></nav>;
}
