import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['fr', 'ht', 'en'],
  defaultLocale: 'fr'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(fr|ht|en)/:path*']
};
