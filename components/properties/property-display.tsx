'use client';

import { useState } from 'react';
export function PropertyDisplay({children,initial='grid'}:{children:React.ReactNode;initial?:string}){const [view,setView]=useState(initial==='list'?'list':'grid');function choose(value:'grid'|'list'){setView(value);const url=new URL(window.location.href);url.searchParams.set('view',value);window.history.replaceState(null,'',url)}return <div className={'property-display view-'+view}><div className="display-toggle" role="group" aria-label="Property display"><button aria-pressed={view==='grid'} onClick={()=>choose('grid')}>Grid</button><button aria-pressed={view==='list'} onClick={()=>choose('list')}>List</button></div>{children}</div>}

