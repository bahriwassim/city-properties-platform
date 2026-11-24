'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ValuationCTA } from '@/components/site/valuation-cta';
import { copy } from '@/data/copy';

const links = [
  ['Sell', '/sell'],
  ['Rent', '/let'],
  ['Valuations', '/valuation'],
  ['Commercial', '/commercial'],
  ['Contact', '/contact'],
] as const;

export function Header() {
  const [scrolled,setScrolled]=useState(false);
  const [hidden,setHidden]=useState(false);
  const [open,setOpen]=useState(false);
  const pathname=usePathname();
  const previousY=useRef(0);

  useEffect(()=>{
    const onScroll=()=>{
      const y=window.scrollY;
      setScrolled(y>80);
      if(y<80||open)setHidden(false);
      else if(y>previousY.current+4)setHidden(true);
      else if(y<previousY.current-4)setHidden(false);
      previousY.current=y;
    };
    onScroll();
    window.addEventListener('scroll',onScroll,{passive:true});
    return()=>window.removeEventListener('scroll',onScroll);
  },[open]);
  useEffect(()=>setOpen(false),[pathname]);
  useEffect(()=>{
    document.body.classList.toggle('menu-is-open',open);
    return()=>document.body.classList.remove('menu-is-open');
  },[open]);

  return <header className={`site-header ${scrolled?'is-scrolled':''} ${hidden?'is-hidden':''} ${open?'menu-open':''}`}>
    <div className="header-inner wrap">
      <Link href="/" className="brand" aria-label="City Properties home">
        <Image className="brand-logo" src="/city-properties-logo.png" alt="City Properties" width={70} height={82} priority />
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(([label,href])=><Link key={href} href={href} className={pathname===href?'current':''}>{label}</Link>)}
      </nav>
      <button className="menu-button" aria-expanded={open} aria-label={open?'Close menu':'Open menu'} onClick={()=>setOpen(!open)}><i/><i/></button>
    </div>
    <div className="mobile-menu" aria-hidden={!open}>
      <nav aria-label="Mobile navigation">
        {links.map(([label,href],index)=><Link key={href} style={{'--i':index} as React.CSSProperties} href={href}>{label}</Link>)}
        <ValuationCTA variant="primary" location="mobile-menu">{copy.home.valuationLink}</ValuationCTA>
      </nav>
    </div>
  </header>;
}
