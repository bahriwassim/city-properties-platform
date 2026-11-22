'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PropertyImage } from '@/types/database';

export function PropertyGallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const thumbnails = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  const list = images || [];
  const multiple = list.length > 1;

  const move = useCallback((delta: number) => {
    setIndex((current) => (current + delta + list.length) % list.length);
  }, [list.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false);
      if (event.key === 'ArrowRight' && multiple) move(1);
      if (event.key === 'ArrowLeft' && multiple) move(-1);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxOpen, multiple, move]);

  useEffect(() => {
    thumbnails.current?.querySelector<HTMLButtonElement>(`[data-index="${index}"]`)?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [index]);

  if (!list.length) return <div className="gallery-placeholder"><span>Property photography to follow</span></div>;

  return <>
    <section className="property-gallery" aria-label={`${title} photos`}>
      <div className="gallery-main" onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => {
        const start = touchStart.current;
        const end = event.changedTouches[0]?.clientX;
        if (multiple && start !== null && end !== undefined && Math.abs(start - end) > 45) move(start > end ? 1 : -1);
        touchStart.current = null;
      }}>
        <button className="gallery-image-trigger" type="button" onClick={() => setLightboxOpen(true)} aria-label={`Open photo ${index + 1} of ${list.length} for ${title}`}>
          <Image key={list[index].id} src={list[index].large_url || list[index].image_url} alt={list[index].alt || title} fill priority sizes="(max-width: 760px) 100vw, 92vw" />
        </button>
        {multiple && <>
          <button className="gallery-prev" type="button" onClick={() => move(-1)} aria-label="Previous photo">←</button>
          <button className="gallery-next" type="button" onClick={() => move(1)} aria-label="Next photo">→</button>
        </>}
        <button className="gallery-open" type="button" onClick={() => setLightboxOpen(true)} aria-label="View photos full screen">View photos <span aria-hidden="true">⤢</span></button>
        <span className="gallery-count">{String(index + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}</span>
      </div>
      {multiple && <div className="gallery-thumb-carousel">
        <button className="gallery-thumb-arrow" type="button" onClick={() => thumbnails.current?.scrollBy({ left: -280, behavior: 'smooth' })} aria-label="Scroll photos left">←</button>
        <div className="gallery-thumbs" ref={thumbnails} aria-label="Choose a photo">
          {list.map((image, photoIndex) => <button data-index={photoIndex} key={image.id} className={photoIndex === index ? 'active' : ''} onClick={() => setIndex(photoIndex)} aria-label={`Show photo ${photoIndex + 1}`} aria-current={photoIndex === index ? 'true' : undefined}>
            <Image src={image.image_url} alt="" fill sizes="100px" />
          </button>)}
        </div>
        <button className="gallery-thumb-arrow" type="button" onClick={() => thumbnails.current?.scrollBy({ left: 280, behavior: 'smooth' })} aria-label="Scroll photos right">→</button>
      </div>}
    </section>

    {lightboxOpen && <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${title} photo gallery`} onClick={() => setLightboxOpen(false)}>
      <button className="lightbox-close" type="button" onClick={() => setLightboxOpen(false)} aria-label="Close photo gallery">×</button>
      <div className="lightbox-content" onClick={(event) => event.stopPropagation()}>
        <div className="lightbox-photo" onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => {
          const start = touchStart.current;
          const end = event.changedTouches[0]?.clientX;
          if (multiple && start !== null && end !== undefined && Math.abs(start - end) > 45) move(start > end ? 1 : -1);
          touchStart.current = null;
        }}>
          <Image key={list[index].id} src={list[index].large_url || list[index].image_url} alt={list[index].alt || title} fill sizes="100vw" priority />
          {multiple && <>
            <button className="lightbox-prev" type="button" onClick={() => move(-1)} aria-label="Previous photo">←</button>
            <button className="lightbox-next" type="button" onClick={() => move(1)} aria-label="Next photo">→</button>
          </>}
        </div>
        <div className="lightbox-footer"><span>{title}</span><span>{index + 1} / {list.length}</span></div>
        {multiple && <div className="lightbox-thumbs" aria-label="Choose a photo">{list.map((image, photoIndex) => <button key={image.id} onClick={() => setIndex(photoIndex)} className={photoIndex === index ? 'active' : ''} aria-label={`Show photo ${photoIndex + 1}`} aria-current={photoIndex === index ? 'true' : undefined}><Image src={image.image_url} alt="" fill sizes="90px" /></button>)}</div>}
      </div>
    </div>}
  </>;
}
