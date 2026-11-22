'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { removePropertyImageAction } from '@/app/actions';
import type { PropertyImage } from '@/types/database';

async function optimize(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 2200 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Image optimization failed')), 'image/webp', 0.84));
}

export function ImageUploader({ propertyId, initial }: { propertyId: string; initial: PropertyImage[] }) {
  const [images, setImages] = useState([...initial].sort((a, b) => a.sort_order - b.sort_order));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError('');
    let nextOrder = images.length;
    let markCover = images.length === 0;
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) throw new Error('Choose an image file.');
        if (file.size > 20 * 1024 * 1024) throw new Error('Each image must be smaller than 20 MB.');
        const blob = await optimize(file);
        const path = `${propertyId}/${crypto.randomUUID()}.webp`;
        const { error: uploadError } = await supabase.storage.from('property-images').upload(path, blob, { contentType: 'image/webp', cacheControl: '31536000', upsert: false });
        if (uploadError) throw uploadError;
        const { data: signed } = await supabase.storage.from('property-images').createSignedUrl(path, 3600);
        const { data: row, error: insertError } = await supabase.from('property_images').insert({ property_id: propertyId, storage_path: path, image_url: path, alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '), sort_order: nextOrder++, is_cover: markCover }).select('*').single();
        if (insertError) throw insertError;
        setImages(old => [...old, { ...(row as PropertyImage), image_url: signed?.signedUrl || '' }]);
        markCover = false;
      }
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to upload images.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function reorder(index: number, delta: number) {
    const next = [...images];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
    await Promise.all(next.map((image, order) => supabase.from('property_images').update({ sort_order: order }).eq('id', image.id)));
    router.refresh();
  }

  async function setCover(id: string) {
    setBusy(true);
    await supabase.from('property_images').update({ is_cover: false }).eq('property_id', propertyId);
    const { error: updateError } = await supabase.from('property_images').update({ is_cover: true }).eq('id', id);
    if (updateError) setError(updateError.message);
    else {
      setImages(old => old.map(image => ({ ...image, is_cover: image.id === id })));
      router.refresh();
    }
    setBusy(false);
  }

  return <div className="image-uploader">
    <div className="upload-drop" onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); void upload(event.dataTransfer.files); }}>
      <span className="upload-symbol">+</span><b>Drop property photos here</b>
      <span>or choose images — JPEG, PNG or WebP — up to 20 MB each</span>
      <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}>{busy ? 'Uploading…' : 'Choose images'}</button>
      <input ref={inputRef} hidden type="file" accept="image/*" multiple onChange={event => void upload(event.target.files)} />
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    {images.length > 0 && <div className="uploaded-grid">{images.map((image, index) => <div className="uploaded-image" key={image.id} draggable onDragStart={event => event.dataTransfer.setData('text/plain', String(index))} onDragOver={event => event.preventDefault()} onDrop={event => {
      event.preventDefault();
      const from = Number(event.dataTransfer.getData('text/plain'));
      if (from !== index) void reorder(from, index > from ? index - from : -(from - index));
    }}>
      <Image src={image.image_url} alt={image.alt || ''} fill sizes="220px" />
      {image.is_cover && <span className="cover-tag">Cover image</span>}
      <div className="image-tool-row">
        <button type="button" onClick={() => void reorder(index, -1)} aria-label="Move image left" disabled={index === 0}>←</button>
        <button type="button" onClick={() => void setCover(image.id)} disabled={busy}>{image.is_cover ? 'Cover' : 'Set cover'}</button>
        <button type="button" onClick={() => void reorder(index, 1)} aria-label="Move image right" disabled={index === images.length - 1}>→</button>
        <form action={removePropertyImageAction} onSubmit={event => { if (!confirm('Remove this property image?')) event.preventDefault(); }}>
          <input type="hidden" name="id" value={image.id} /><input type="hidden" name="path" value={image.storage_path} /><input type="hidden" name="property_id" value={propertyId} />
          <button aria-label="Delete image">×</button>
        </form>
      </div>
    </div>)}</div>}
  </div>;
}
