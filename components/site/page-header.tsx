'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { ValuationCTA } from '@/components/site/valuation-cta';

type Props = {
  title: string; eyebrow: string; intro?: string; image: string; imageAlt: string;
  focalPoint?: { x: number; y: number }; accentWord?: string; tall?: boolean;
  primaryCta?: { label: string; href: string }; secondaryCta?: { label: string; href: string };
  valuationLayout?: boolean; children?: React.ReactNode;
};

export function PageHeader({ title, eyebrow, intro, image, imageAlt, focalPoint = { x: 50, y: 50 }, accentWord, tall = false, primaryCta, secondaryCta, valuationLayout = false, children }: Props) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = root.current?.getBoundingClientRect();
        if (!box) return;
        const progress = Math.max(-1, Math.min(1, (window.innerHeight / 2 - (box.top + box.height / 2)) / window.innerHeight));
        root.current?.style.setProperty('--page-header-parallax', `${progress * 30}px`);
      });
    };
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); };
  }, []);
  const lines = title.split('\n');
  return <header ref={root} className={`page-header${tall ? ' page-header--tall' : ''}${valuationLayout ? ' page-header--valuation' : ''}`}>
    <div className="page-header-image"><Image src={image} alt={imageAlt} fill priority quality={82} sizes="100vw" placeholder="blur" blurDataURL="data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAACwAwCdASoYABAAPyV8tFGuJ6UisAgBwCSJZQC7ABhlp49liCVYAADpIBJyG7UOJXEDhx6iWqGIGhhozm6qxYJ3a7e1vev4a5XJJnJh07ctS7/Mf6f6gw5dcH280kgKqqlVlbd4AAA=" style={{ objectPosition: `${focalPoint.x}% ${focalPoint.y}%` }} /></div>
    <div className="page-header-tint" /><div className="page-header-gradient" />
    <div className="page-header-content wrap"><span className="page-header-eyebrow">{eyebrow}</span>
      <h1>{lines.map((line, index) => <span className="page-header-title-line" key={`${line}-${index}`} style={{ '--line-index': index } as React.CSSProperties}>{line.split(' ').map((word, wordIndex) => <span key={`${word}-${wordIndex}`}>{word === accentWord ? <em>{word}</em> : word}{wordIndex < line.split(' ').length - 1 ? ' ' : ''}</span>)}</span>)}</h1>
      {intro && <p>{intro}</p>}
      {(primaryCta || secondaryCta) && <div className="page-header-actions">{primaryCta && <ValuationCTA variant="primary" location="page-header-primary" href={primaryCta.href}>{primaryCta.label}</ValuationCTA>}{secondaryCta && <ValuationCTA variant="secondary" location="page-header-secondary" href={secondaryCta.href}>{secondaryCta.label}</ValuationCTA>}</div>}
      {children}
    </div>
  </header>;
}
