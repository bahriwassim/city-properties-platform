'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HeroSearch } from '@/components/site/hero-search';
import { ArrowIcon } from '@/components/site/arrow-icon';
import { ValuationCTA } from '@/components/site/valuation-cta';

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
      <h1><span>Your property.</span><br /><em>Our perspective.</em></h1>
      <p>Residential, commercial and lettings property, guided by local knowledge.</p>
      <div className="hero-actions"><Link className="button button-light" href="/residential">Explore properties <ArrowIcon /></Link><ValuationCTA variant="secondary" location="homepage-hero">Request a valuation</ValuationCTA></div>
    </div>
    <HeroSearch />
  </section>;
}
