'use client';

export default function GlobalError({reset}:{error:Error&{digest?:string};reset:()=>void}){return <section className="not-found wrap"><span className="eyebrow">City Properties · Dublin</span><h1>We couldn’t load this page.</h1><p>Please try again, or contact our team by phone or email.</p><button className="button" onClick={()=>reset()}>Try again <span>↗</span></button></section>}
