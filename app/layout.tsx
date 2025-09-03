import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, Orbitron } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import { DefaultProvider } from "@/contexts/default-context"
import { ErrorBoundary } from "@/components/error-boundary"
import { Fallback } from "@/components/fallback"

// Configure the fonts
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
})

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "GrokXQ Development Suite",
  description: "Comprehensive AI-powered development suite for modern developers",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-minimal-dark text-white antialiased ${spaceGrotesk.variable} ${orbitron.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <DefaultProvider>
            <ErrorBoundary>
              <div className="relative flex min-h-screen flex-col">
                <div
                  className="fixed inset-0 bg-minimal-grid opacity-5 pointer-events-none z-0"
                  style={{ backgroundSize: "30px 30px" }}
                ></div>
                <SiteHeader />
                <div className="flex-1 relative z-10">
                  <Suspense fallback={<Fallback />}>{children}</Suspense>
                </div>
                <SiteFooter />
              </div>
              <Toaster />
            </ErrorBoundary>
          </DefaultProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
