'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PropertyImage } from '@/types/database';

export function PropertyGallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const thumbnails = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  const list = images || [];
  const multiple = list.length > 1;

  const move = useCallback((delta: number) => {
    if (!list.length) return;
    setIndex((current) => (current + delta + list.length) % list.length);
  }, [list.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false);
      if (event.key === 'ArrowRight' && multiple) move(1);
      if (event.key === 'ArrowLeft' && multiple) move(-1);
      if (event.key === 'Tab' && dialog.current) {
        const focusable = [...dialog.current.querySelectorAll<HTMLElement>('button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])')];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxOpen, multiple, move]);

  useEffect(() => {
    thumbnails.current?.querySelector<HTMLButtonElement>(`[data-index="${index}"]`)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    if (!lightboxOpen || list.length < 2) return;
    for (const offset of [-1, 1]) {
      const image = new window.Image();
      image.src = list[(index + offset + list.length) % list.length].large_url || list[(index + offset + list.length) % list.length].image_url;
    }
  }, [index, lightboxOpen, list]);

  if (!list.length) return <div className="gallery-placeholder"><span>Property photography to follow</span></div>;

  const openAt = (photoIndex: number) => { setIndex(photoIndex); setLightboxOpen(true); };
  const swipeHandlers = {
    onTouchStart: (event: React.TouchEvent) => { touchStart.current = event.touches[0]?.clientX ?? null; },
    onTouchEnd: (event: React.TouchEvent) => {
      const start = touchStart.current;
      const end = event.changedTouches[0]?.clientX;
      if (multiple && start !== null && end !== undefined && Math.abs(start - end) > 45) move(start > end ? 1 : -1);
      touchStart.current = null;
    },
  };
  const naturalImage = (photo: PropertyImage, priority = false) => <Image
    src={photo.large_url || photo.image_url}
    alt={photo.alt || title}
    width={photo.width || 960}
    height={photo.height || 640}
    sizes="(max-width: 760px) 100vw, (max-width: 1320px) 65vw, 860px"
    quality={82}
    priority={priority}
    placeholder={photo.blurDataURL ? 'blur' : 'empty'}
    blurDataURL={photo.blurDataURL}
  />;

  return <>
    <section className="property-gallery" aria-label={`${title} photos`}>
      <div className="gallery-mosaic">
        <button type="button" className="gallery-mosaic-lead" onClick={() => openAt(0)} aria-label={`Open photo 1 of ${list.length}`}>
          {naturalImage(list[0], true)}
        </button>
        <div className="gallery-mosaic-side">
          {list.slice(1, 5).map((photo, photoIndex) => <button type="button" key={photo.id} onClick={() => openAt(photoIndex + 1)} aria-label={`Open photo ${photoIndex + 2} of ${list.length}`}>
            <Image src={photo.image_url} alt={photo.alt || title} fill sizes="(max-width: 1320px) 30vw, 400px" quality={82} placeholder={photo.blurDataURL ? 'blur' : 'empty'} blurDataURL={photo.blurDataURL} />
            {photoIndex === 3 && <span className="gallery-view-all">View all {list.length} photos <b aria-hidden="true">↗</b></span>}
          </button>)}
        </div>
      </div>

      <div className="gallery-mobile" {...swipeHandlers}>
        <button type="button" className="gallery-mobile-image" onClick={() => openAt(index)} aria-label={`Open photo ${index + 1} of ${list.length}`}>
          {naturalImage(list[index], index === 0)}
        </button>
        <span className="gallery-count">{index + 1} / {list.length}</span>
      </div>
    </section>

    {lightboxOpen && <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${title} photo gallery`} ref={dialog} onClick={() => setLightboxOpen(false)}>
      <button ref={closeButton} className="lightbox-close" type="button" onClick={() => setLightboxOpen(false)} aria-label="Close photo gallery">×</button>
      <div className="lightbox-content" onClick={(event) => event.stopPropagation()}>
        <div className="lightbox-photo" {...swipeHandlers}>
          {naturalImage(list[index])}
          {multiple && <>
            <button className="lightbox-prev" type="button" onClick={() => move(-1)} aria-label="Previous photo">←</button>
            <button className="lightbox-next" type="button" onClick={() => move(1)} aria-label="Next photo">→</button>
          </>}
        </div>
        <div className="lightbox-footer"><span>{list[index].alt || title}{list[index].communal ? ' · Communal area' : ''}</span><span>{index + 1} / {list.length}</span></div>
        {multiple && <div className="lightbox-thumbs" ref={thumbnails} aria-label="Choose a photo">{list.map((photo, photoIndex) => <button data-index={photoIndex} key={photo.id} onClick={() => setIndex(photoIndex)} className={photoIndex === index ? 'active' : ''} aria-label={`Show photo ${photoIndex + 1}`} aria-current={photoIndex === index ? 'true' : undefined}><Image src={photo.image_url} alt="" fill sizes="96px" quality={80} /></button>)}</div>}
      </div>
    </div>}
  </>;
}
