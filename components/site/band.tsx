import type { ReactNode } from 'react';
import { ScrollReveal } from '@/components/site/scroll-reveal';
export function Band({tone='grey-100',children,className=''}:{tone:'grey-100'|'grey-200'|'navy';children:ReactNode;className?:string}){return <section className={`site-band site-band--${tone} ${className}`}><div className="wrap"><ScrollReveal>{children}</ScrollReveal></div></section>}
