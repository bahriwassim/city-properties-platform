'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOutAction } from '@/app/actions';
const items=[['Overview','/admin/dashboard'],['Properties','/admin/properties'],['Developments','/admin/developments'],['Enquiries','/admin/inquiries'],['Settings','/admin/settings']];
export function AdminNav(){const pathname=usePathname();return <aside className="admin-sidebar"><Link href="/admin/dashboard" className="admin-brand"><span>CITY</span>PROPERTIES<small>ADMINISTRATION</small></Link><nav>{items.map(([label,href])=><Link key={href} href={href} className={pathname===href||pathname.startsWith(href+'/')?'active':''}><span className="admin-nav-dot"/>{label}</Link>)}</nav><div className="admin-sidebar-foot"><Link href="/" target="_blank">View website ↗</Link><form action={signOutAction}><button>Sign out <span>↗</span></button></form></div></aside>}

