'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function Preloader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const firstVisit = useRef(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const initial = firstVisit.current;
    firstVisit.current = false;
    if (initial && sessionStorage.getItem('cp-visited')) return;
    if (initial) sessionStorage.setItem('cp-visited', '1');

    setLeaving(false);
    setVisible(true);
    const showTimer = window.setTimeout(() => setLeaving(true), initial ? 880 : 360);
    const removeTimer = window.setTimeout(() => setVisible(false), initial ? 1280 : 760);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(removeTimer);
    };
  }, [pathname]);

  if (!visible) return null;
  return <div className={`preloader ${leaving ? 'is-leaving' : ''}`} role="status" aria-label="Loading City Properties">
    <div className="preloader-content">
      <Image className="preloader-logo" src="/city-properties-logo.png" alt="City Properties" width={200} height={276} priority />
      <span className="preloader-caption">A considered perspective on property</span>
      <div className="preloader-track" aria-hidden="true"><i /></div>
    </div>
  </div>;
}
