import {NextRequest, NextResponse} from 'next/server';
import createMiddleware from 'next-intl/middleware';

const nextIntlMiddleware = createMiddleware({
  locales: ['fr', 'ht', 'en'],
  defaultLocale: 'fr',
  localeDetection: false,
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/fr', request.url));
  }

  const forcedLocaleMatch = pathname.match(/^\/(ht|en)(\/.*)?$/);
  if (forcedLocaleMatch) {
    const redirected = request.nextUrl.clone();
    redirected.pathname = `/fr${forcedLocaleMatch[2] ?? ''}`;
    return NextResponse.redirect(redirected);
  }

  return nextIntlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(fr|ht|en)/:path*']
};
