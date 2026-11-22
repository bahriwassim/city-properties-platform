'use client';

import { usePathname } from 'next/navigation';
import { AdminNav } from './admin-nav';

export function AdminFrame({children}:{children:React.ReactNode}){const pathname=usePathname();const isLogin=pathname==='/admin/login'||pathname.startsWith('/admin/forgot-password')||pathname.startsWith('/admin/reset-password');if(isLogin)return <>{children}</>;return <div className="admin-layout"><AdminNav/><div className="admin-main"><header className="admin-topbar"><span>City Properties <b>/</b> Administration</span><a href="mailto:info@cityproperties.ie">Support ↗</a></header><div className="admin-content">{children}</div></div></div>}

