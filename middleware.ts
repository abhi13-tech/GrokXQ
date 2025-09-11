import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  console.log("[Middleware] Processing request for path:", req.nextUrl.pathname)

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Check if the user is authenticated
    const isAuthenticated = !!session
    console.log("[Middleware] Authentication status:", isAuthenticated ? "Authenticated" : "Not authenticated")

    // Define protected routes
    const protectedRoutes = [
      "/dashboard",
      "/code-generation",
      "/code-review",
      "/code-optimizer",
      "/testing",
      "/development",
      "/profile",
    ]

    // Define auth routes
    const authRoutes = ["/sign-in", "/sign-up", "/reset-password"]

    // Define test routes that should be accessible regardless of auth state
    const testRoutes = ["/auth-test"]

    const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
    const isAuthRoute = authRoutes.some((route) => req.nextUrl.pathname === route)
    const isTestRoute = testRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

    console.log(
      "[Middleware] Route type:",
      isProtectedRoute ? "Protected" : isAuthRoute ? "Auth" : isTestRoute ? "Test" : "Public",
    )

    // Allow access to test routes regardless of auth state
    if (isTestRoute) {
      console.log("[Middleware] Allowing access to test route")
      return res
    }

    // Redirect to sign-in if accessing a protected route without authentication
    if (isProtectedRoute && !isAuthenticated) {
      console.log("[Middleware] Redirecting to sign-in from protected route")
      const redirectUrl = new URL("/sign-in", req.url)
      redirectUrl.searchParams.set("redirect", req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Redirect to dashboard if accessing auth routes while authenticated
    if (isAuthRoute && isAuthenticated) {
      console.log("[Middleware] Redirecting to dashboard from auth route")
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    console.log("[Middleware] Allowing request to proceed")
    return res
  } catch (error) {
    console.error("[Middleware] Error processing request:", error)
    // In case of error, allow the request to proceed
    // The client-side auth context will handle authentication state
    return res
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
}
