export type Testimonial = { quote: string; clientName: string; area: string; date?: string; approved: true; photo?: string };
export type PressItem = { title: string; source: string; url: string; date: string };
export type TeamMember = { name: string; role: string; photo: string; bio?: string; phone?: string; email?: string };
export type AdviceItem = { title: string; category: string; summary: string; url: string };
export type Office = { name: string; area: string; address: string; phone: string; directionsUrl: string };

export const siteContent = {
  testimonials: { published: false, items: [] as Testimonial[] },
  press: { published: false, items: [] as PressItem[] },
  team: { published: false, items: [] as TeamMember[] },
  advice: { published: false, items: [] as AdviceItem[] },
  responseTime: { published: false, value: '' as string },
  offices: { published: true, items: [
    { name: 'Lower Hatch Street', area: 'Dublin 2', address: '12 Lower Hatch St, Dublin 2', phone: '01 459 5941', directionsUrl: 'https://maps.google.com/?q=12+Lower+Hatch+Street+Dublin+2' },
    { name: 'Citywest', area: 'Dublin 24', address: 'Citywest Business Centre, Citywest, Co Dublin', phone: '01 459 5941', directionsUrl: 'https://maps.google.com/?q=Citywest+Business+Centre+Dublin' },
    { name: 'Botanic Court', area: 'Dublin 9', address: 'Botanic Court, Botanic Road, Glasnevin, Dublin 9', phone: '01 459 5941', directionsUrl: 'https://maps.google.com/?q=Botanic+Court+Botanic+Road+Glasnevin+Dublin+9' },
  ] as Office[] },
};

const forbidden = /\[|placeholder|to be supplied|TODO/i;
function complete(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0 && !forbidden.test(value);
  if (Array.isArray(value)) return value.every(complete);
  if (value && typeof value === 'object') return Object.values(value).every(complete);
  return value !== undefined && value !== null;
}

export function getPublishedItems<K extends 'testimonials' | 'press' | 'team' | 'advice' | 'offices'>(section: K): (typeof siteContent)[K]['items'] {
  const content = siteContent[section] as { published: boolean; items: unknown[] };
  const hasRequiredFields = (item: unknown) => {
    if (!item || typeof item !== 'object') return false;
    const value = item as Record<string, unknown>;
    if (section === 'testimonials') return ['quote', 'clientName', 'area'].every((key) => typeof value[key] === 'string' && Boolean((value[key] as string).trim()));
    if (section === 'press') return ['title', 'source', 'url', 'date'].every((key) => typeof value[key] === 'string' && Boolean((value[key] as string).trim()));
    if (section === 'team') return ['name', 'role', 'photo'].every((key) => typeof value[key] === 'string' && Boolean((value[key] as string).trim()));
    if (section === 'advice') return ['title', 'category', 'summary', 'url'].every((key) => typeof value[key] === 'string' && Boolean((value[key] as string).trim()));
    return ['name', 'area', 'address', 'phone', 'directionsUrl'].every((key) => typeof value[key] === 'string' && Boolean((value[key] as string).trim()));
  };
  const valid = content.published && content.items.length > 0 && content.items.every((item) =>
    hasRequiredFields(item) && complete(item) && (section !== 'testimonials' || (item as Testimonial).approved === true) &&
    (section !== 'team' || (item as TeamMember).photo.startsWith('/images/team/')) &&
    (section !== 'testimonials' || !(item as Testimonial).photo || (item as Testimonial).photo!.startsWith('/images/team/')),
  );
  if (!valid && content.items.length && process.env.NODE_ENV !== 'production') {
    console.warn(`[site-content] ${section} hidden: publish it only with complete, approved, non-placeholder content.`);
  }
  return (valid ? content.items : []) as (typeof siteContent)[K]['items'];
}
