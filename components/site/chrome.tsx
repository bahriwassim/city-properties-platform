'use client';

import { usePathname } from 'next/navigation';
export function SiteChrome({children,header,footer}:{children:React.ReactNode;header:React.ReactNode;footer:React.ReactNode}){const pathname=usePathname();const admin=pathname.startsWith('/admin');return <>{!admin&&header}<main>{children}</main>{!admin&&footer}</>}

