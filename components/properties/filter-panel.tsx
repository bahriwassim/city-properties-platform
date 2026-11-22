'use client';

import { useEffect,useState } from 'react';
export function FilterPanel({children}:{children:React.ReactNode}){const [open,setOpen]=useState(false);useEffect(()=>{document.body.classList.toggle('filters-open',open);return()=>document.body.classList.remove('filters-open')},[open]);return <div className={'filter-panel '+(open?'filter-open':'')}><button className="mobile-filter-trigger" onClick={()=>setOpen(true)}>Filters & search <span>＋</span></button><div className="filter-panel-content"><div className="mobile-filter-heading"><span className="eyebrow">Refine search</span><button onClick={()=>setOpen(false)} aria-label="Close filters">×</button></div>{children}</div>{open&&<button className="filter-scrim" onClick={()=>setOpen(false)} aria-label="Close filter panel"/>}</div>}

