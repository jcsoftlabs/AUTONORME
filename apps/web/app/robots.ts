import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/compte/', '/api/', '/_next/'],
    },
    sitemap: 'https://autonorme.com/sitemap.xml',
  };
}
