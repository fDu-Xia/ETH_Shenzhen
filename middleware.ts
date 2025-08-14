import { NextRequest, NextResponse } from 'next/server'

const locales = ['en', 'zh']
const defaultLocale = 'zh'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Check if the pathname has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Check if this is a known route that should be redirected to locale structure
  const knownRoutes = ['/profile', '/publish', '/explore', '/content']
  const shouldRedirect = knownRoutes.some(route => pathname.startsWith(route))

  if (shouldRedirect) {
    // Redirect to default locale
    const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url)
    return NextResponse.redirect(newUrl)
  }

  // For root path, redirect to default locale
  if (pathname === '/') {
    const newUrl = new URL(`/${defaultLocale}`, request.url)
    return NextResponse.redirect(newUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
}
