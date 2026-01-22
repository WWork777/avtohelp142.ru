import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Декодируем pathname для проверки
  const decodedPath = decodeURIComponent(pathname);

  // Обработка кириллического пути /цены/ (как в закодированном, так и в декодированном виде)
  if (
    pathname === '/цены' || 
    pathname === '/цены/' ||
    decodedPath === '/цены' ||
    decodedPath === '/цены/' ||
    pathname.startsWith('/%D1%86%D0%B5%D0%BD%D1%8B') ||
    pathname.startsWith('/%D1%86%D0%B5%D0%BD%D1%8B/')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/ceny';
    // Сохраняем оригинальный URL в заголовке для SEO
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Обрабатываем как закодированные, так и незакодированные пути
    '/цены/:path*',
    '/%D1%86%D0%B5%D0%BD%D1%8B/:path*',
  ],
};

