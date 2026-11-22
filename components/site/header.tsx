'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowIcon } from '@/components/site/arrow-icon';

const links = [['Home','/'],['Residential','/residential'],['Commercial','/commercial'],['Lettings','/lettings'],['New homes','/new-homes'],['Contact us','/contact']];

export function Header({telephone='01 459 5941'}:{telephone?:string}) {
  const [scrolled,setScrolled]=useState(false); const [hidden,setHidden]=useState(false); const [open,setOpen]=useState(false); const pathname=usePathname();
  const previousY=useRef(0);
  useEffect(()=>{const fn=()=>{const y=window.scrollY;setScrolled(y>80);if(y<80||open)setHidden(false);else if(y>previousY.current+4)setHidden(true);else if(y<previousY.current-4)setHidden(false);previousY.current=y};fn();window.addEventListener('scroll',fn,{passive:true});return()=>window.removeEventListener('scroll',fn)},[open]);
  useEffect(()=>setOpen(false),[pathname]);
  useEffect(()=>{document.body.classList.toggle('menu-is-open',open);return()=>document.body.classList.remove('menu-is-open')},[open]);
  const phoneHref='tel:'+telephone.replace(/[^+0-9]/g,'');
  return <header className={`site-header ${scrolled?'is-scrolled':''} ${hidden?'is-hidden':''} ${open?'menu-open':''}`}><div className="header-inner wrap"><Link href="/" className="brand" aria-label="City Properties home"><Image className="brand-logo" src="/city-properties-logo.png" alt="City Properties" width={200} height={276} priority/></Link><nav className="desktop-nav" aria-label="Main navigation">{links.map(([label,href])=><Link key={href} href={href} className={pathname===href?'current':''}>{label}</Link>)}</nav><div className="header-actions"><a href={phoneHref} className="header-phone">{telephone}</a><Link href="/contact" className="header-cta">Enquire <ArrowIcon/></Link><button className="menu-button" aria-expanded={open} aria-label={open?'Close menu':'Open menu'} onClick={()=>setOpen(!open)}><i/><i/></button></div></div><div className="mobile-menu" aria-hidden={!open}><nav aria-label="Mobile navigation">{links.slice(1).map(([label,href],index)=><Link style={{'--i':index} as React.CSSProperties} key={href} href={href}>{label}<ArrowIcon/></Link>)}<Link className="mobile-enquire" href="/contact">Enquire with City Properties <ArrowIcon/></Link><a className="mobile-phone" href={phoneHref}>{telephone}</a></nav></div></header>;
}



