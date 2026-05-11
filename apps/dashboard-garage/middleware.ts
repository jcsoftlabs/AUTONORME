import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['fr', 'ht', 'en'],
  defaultLocale: 'fr'
});

export const config = {
  matcher: ['/((?!api|_next|static|favicon.ico|public).*)']
};
