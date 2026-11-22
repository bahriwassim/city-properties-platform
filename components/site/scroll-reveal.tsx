'use client';

import { useEffect,useRef,useState } from 'react';
export function ScrollReveal({children,delay=0}:{children:React.ReactNode;delay?:number}){const element=useRef<HTMLDivElement>(null);const [visible,setVisible]=useState(false);useEffect(()=>{if(!element.current)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches){setVisible(true);return}const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setVisible(true);observer.disconnect()}},{threshold:.12});observer.observe(element.current);return()=>observer.disconnect()},[]);return <div ref={element} className={'scroll-reveal '+(visible?'is-visible':'')} style={{transitionDelay:delay+'ms'}}>{children}</div>}
