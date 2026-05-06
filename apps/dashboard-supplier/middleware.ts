import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['fr', 'ht', 'en'],
  defaultLocale: 'fr'
});

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /static, /favicon.ico, /public (static files)
  matcher: ['/((?!api|_next|static|favicon.ico|public).*)']
};
