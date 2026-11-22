'use client';

import { useEffect, useState } from 'react';

export function Preloader() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem('cp-visited') || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setVisible(true);
    const timer = window.setTimeout(() => { setVisible(false); sessionStorage.setItem('cp-visited', '1'); }, 900);
    return () => window.clearTimeout(timer);
  }, []);
  if (!visible) return null;
  return <div className="preloader" role="status" aria-label="Loading City Properties"><div className="preloader-mark"><span>CITY</span><span>PROPERTIES</span></div><div className="preloader-track"><i /></div></div>;
}

