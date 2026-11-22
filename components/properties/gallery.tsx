'use client';

import Image from 'next/image';
import { useEffect,useState } from 'react';
import type { PropertyImage } from '@/types/database';

export function PropertyGallery({images,title}:{images:PropertyImage[];title:string}){
 const [index,setIndex]=useState(0); const [full,setFull]=useState(false); const list=images.length?images:[];const move=(delta:number)=>setIndex(i=>(i+delta+list.length)%list.length);
 useEffect(()=>{if(!full)return;const key=(event:KeyboardEvent)=>{if(event.key==='Escape')setFull(false);if(event.key==='ArrowRight')move(1);if(event.key==='ArrowLeft')move(-1)};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[full,list.length]);
 if(!list.length)return <div className="gallery-placeholder"><span>Property photography to follow</span></div>;
 const multiple=list.length>1;
 return <><div className={`property-gallery ${full?'gallery-fullscreen':''}`}><div className="gallery-main" role={full?'dialog':'region'} aria-modal={full||undefined} aria-label={full?`${title} photo viewer`:`${title} property photos`} tabIndex={0} onKeyDown={e=>{if(e.key==='ArrowRight')move(1);if(e.key==='ArrowLeft')move(-1);if(e.key==='Escape')setFull(false)}} onTouchStart={e=>{(window as unknown as {touchX?:number}).touchX=e.touches[0].clientX}} onTouchEnd={e=>{const x=(window as unknown as {touchX?:number}).touchX;if(multiple&&x!==undefined&&Math.abs(x-e.changedTouches[0].clientX)>50)move(x>e.changedTouches[0].clientX?1:-1)}}><Image key={list[index].id} src={list[index].image_url} alt={list[index].alt||title} fill priority sizes="(max-width: 760px) 100vw, 92vw"/>{multiple&&<><button className="gallery-full" onClick={()=>setFull(!full)} aria-label={full?'Exit fullscreen':'View fullscreen'}>{full?'Close':'Expand'} ⤢</button><button className="gallery-prev" onClick={()=>move(-1)} aria-label="Previous image">←</button><button className="gallery-next" onClick={()=>move(1)} aria-label="Next image">→</button><span className="gallery-count">{String(index+1).padStart(2,'0')} / {String(list.length).padStart(2,'0')}</span></>}</div>{multiple&&<div className="gallery-thumbs">{list.map((img,i)=><button key={img.id} className={i===index?'active':''} onClick={()=>setIndex(i)} aria-label={`View image ${i+1}`}><Image src={img.image_url} alt="" fill sizes="120px"/></button>)}</div>}</div>{full&&<button className="gallery-backdrop" aria-label="Close fullscreen gallery" onClick={()=>setFull(false)}/>}</>;
}


