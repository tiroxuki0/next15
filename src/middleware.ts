import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Các route cần xác thực
const PROTECTED_ROUTES = ['/profile', '/settings', '/dashboard']

export function middleware(request: NextRequest) {
  // Lấy pathname từ request URL
  const { pathname } = request.nextUrl

  // Chuẩn hóa pathname
  const normalizedPath =
    pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname

  // Kiểm tra route hiện tại
  const isProtectedRoute = PROTECTED_ROUTES.some(
    route => normalizedPath === route || normalizedPath.startsWith(`${route}/`)
  )

  // Nếu không phải protected route, cho phép truy cập
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // ★ QUAN TRỌNG: Kiểm tra cookie token (cần thay đổi tên nếu bạn sử dụng tên khác)
  const token = request.cookies.get('token')?.value

  // Nếu không có token và đang truy cập protected route
  if (!token) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('callbackUrl', pathname)

    return NextResponse.redirect(redirectUrl)
  }

  // Có token, cho phép truy cập
  return NextResponse.next()
}

// Cấu hình matcher chỉ cho protected routes
export const config = {
  matcher: [
    '/profile',
    '/profile/:path*',
    '/settings',
    '/settings/:path*',
    '/dashboard',
    '/dashboard/:path*'
  ]
}
