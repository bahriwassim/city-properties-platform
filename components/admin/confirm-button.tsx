'use client';

export function ConfirmButton({children,question,className}:{children:React.ReactNode;question:string;className?:string}){return <button className={className} onClick={e=>{if(!confirm(question))e.preventDefault()}}>{children}</button>}

