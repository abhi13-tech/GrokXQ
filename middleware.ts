import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the user is authenticated
  const isAuthenticated = !!session

  // Define protected routes
  const protectedRoutes = [
    "/dashboard",
    "/code-generation",
    "/code-review",
    "/code-optimizer",
    "/testing",
    "/development",
    "/deployment",
    "/profile",
  ]

  // Define auth routes
  const authRoutes = ["/sign-in", "/sign-up", "/reset-password"]

  // Define test routes that should be accessible regardless of auth state
  const testRoutes = ["/auth-test"]

  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => req.nextUrl.pathname === route)
  const isTestRoute = testRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Allow access to test routes regardless of auth state
  if (isTestRoute) {
    return res
  }

  // Redirect to sign-in if accessing a protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL("/sign-in", req.url)
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to dashboard if accessing auth routes while authenticated
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
}
