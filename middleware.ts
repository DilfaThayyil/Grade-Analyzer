import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })

    const isLoginPage = request.nextUrl.pathname.startsWith('/login')
    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')

    if (!token && isDashboard) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (token && isLoginPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
}
