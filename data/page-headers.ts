export type PageHeaderAsset = { image: string; imageAlt: string; focalPoint?: { x: number; y: number } };

export const PAGE_HEADERS: Record<string, PageHeaderAsset> = {
  residential: { image: '/images/page-headers/georgian-exterior.webp', imageAlt: 'Georgian red-brick homes on a leafy Dublin street', focalPoint: { x: 52, y: 48 } },
  sell: { image: '/images/page-headers/georgian-exterior.webp', imageAlt: 'Red-brick Georgian homes on a Dublin street', focalPoint: { x: 52, y: 48 } },
  commercial: { image: '/images/commercial-office-exterior.webp', imageAlt: 'Glass office building exterior with urban reflections', focalPoint: { x: 50, y: 48 } },
  lettings: { image: '/images/page-headers/georgian-exterior.webp', imageAlt: 'Georgian homes in Dublin', focalPoint: { x: 55, y: 48 } },
  newHomes: { image: '/images/page-headers/valuation-key-handover.webp', imageAlt: 'Keys being handed over outside a home', focalPoint: { x: 50, y: 45 } },
  contact: { image: '/images/page-headers/valuation-handshake.webp', imageAlt: 'A handshake after a property discussion', focalPoint: { x: 50, y: 45 } },
  valuation: { image: '/images/page-headers/valuation-handshake.webp', imageAlt: 'Handshake after a property valuation', focalPoint: { x: 52, y: 48 } },
  valuationLifestyle: { image: '/images/page-headers/valuation-key-handover.webp', imageAlt: 'Keys being handed over after a property sale', focalPoint: { x: 52, y: 45 } },
  privacy: { image: '/images/page-headers/georgian-exterior.webp', imageAlt: 'Dublin Georgian architecture', focalPoint: { x: 52, y: 48 } },
  cookies: { image: '/images/page-headers/georgian-exterior.webp', imageAlt: 'Dublin Georgian architecture', focalPoint: { x: 52, y: 48 } },
  terms: { image: '/images/page-headers/georgian-exterior.webp', imageAlt: 'Dublin Georgian architecture', focalPoint: { x: 52, y: 48 } },
};
