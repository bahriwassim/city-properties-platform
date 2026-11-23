'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HeroSearch } from '@/components/site/hero-search';
import { ArrowIcon } from '@/components/site/arrow-icon';
import { ValuationCTA } from '@/components/site/valuation-cta';
import { copy } from '@/data/copy';

const heroImages = [
  { src: '/images/dublin-georgian.webp', alt: 'Red brick Georgian townhouse on a leafy Dublin street' },
  { src: '/images/dublin-interior.webp', alt: 'Sunlit period home interior with tall sash windows' },
];

export function Hero() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const interval = window.setInterval(() => setActiveImage((current) => (current + 1) % heroImages.length), 9000);
    return () => window.clearInterval(interval);
  }, []);

  return <section className="home-hero">
    <div className="hero-visual" aria-label="City Properties Dublin homes">
      {heroImages.map((image, index) => <Image key={image.src} src={image.src} alt={image.alt} fill priority={index === 0} sizes="100vw" className={`hero-image ${activeImage === index ? 'is-active' : ''}`} />)}
    </div>
    <div className="hero-tint" />
    <div className="hero-shade" />
    <div className="hero-copy wrap">
      <span className="eyebrow">City Properties · Dublin</span>
      <h1>{copy.home.heroBefore}<em>{copy.home.heroAccent}</em><br/>{copy.home.heroSecondLine}</h1>
      <p>{copy.home.heroIntro}</p>
      <div className="hero-actions"><Link className="button button-navy" href="/residential">{copy.home.searchProperties} <ArrowIcon /></Link><ValuationCTA variant="secondary" location="homepage-hero">{copy.home.valuationLink}</ValuationCTA></div>
    </div>
    <HeroSearch />
  </section>;
}
