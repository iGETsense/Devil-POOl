import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Protect Admin Routes
    if (path.startsWith("/admin-88y12d")) {

        // Allow access to login page
        if (path === "/admin-88y12d/login") {
            // If already logged in, redirect to dashboard
            const token = request.cookies.get("admin_session")?.value
            if (token) {
                return NextResponse.redirect(new URL("/admin-88y12d/dashboard", request.url))
            }
            return NextResponse.next()
        }

        // Check for session cookie
        const token = request.cookies.get("admin_session")?.value

        if (!token) {
            // Redirect to login if no token
            return NextResponse.redirect(new URL("/admin-88y12d/login", request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/admin-88y12d/:path*",
    ],
}
