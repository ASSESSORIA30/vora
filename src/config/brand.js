export const BRAND = {
  name: 'VORA',
  tagline: 'Concrete Living',
  descriptor: 'Arquitectura industrializada de hormigón',
  location: 'Catalunya · España',
  year: '2026',
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://vora-orpin-delta.vercel.app',
  leadEndpoint: '/api/contact',
  analytics: {
    ga4Id: import.meta.env.VITE_GA4_ID || '',
    googleAdsId: import.meta.env.VITE_GOOGLE_ADS_ID || '',
    metaPixelId: import.meta.env.VITE_META_PIXEL_ID || '',
  },
}
