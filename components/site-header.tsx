"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { MainNav } from "@/components/main-nav"

export function SiteHeader() {
  const [isMobile, setIsMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("resize", checkScreenSize)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-md supports-[backdrop-filter]:bg-minimal-dark/60 ${
        scrolled ? "minimal-glass shadow-minimal-shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-md bg-minimal-accent1 flex items-center justify-center text-white font-bold">
              GX
            </div>
            <span className="font-bold text-xl hidden md:inline-block minimal-gradient-text">GrokXQ</span>
          </Link>
        </div>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden ml-auto mr-2 border border-minimal-accent3/20">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80vw] sm:w-[350px] minimal-glass border-minimal-accent3/20">
              <div className="grid gap-2 py-6">
                <Link href="/" className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <div className="w-8 h-8 rounded-md bg-minimal-accent1 flex items-center justify-center text-white font-bold mr-2">
                    GX
                  </div>
                  <span className="minimal-gradient-text">GrokXQ</span>
                </Link>
                <nav className="grid gap-2">
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-minimal-light/20 transition-all"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/code-generation"
                    className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-minimal-light/20 transition-all"
                  >
                    Code Generation
                  </Link>
                  <Link
                    href="/code-review"
                    className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-minimal-light/20 transition-all"
                  >
                    Code Review
                  </Link>
                  <Link
                    href="/testing"
                    className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-minimal-light/20 transition-all"
                  >
                    Testing
                  </Link>
                  <Link
                    href="/documentation"
                    className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-minimal-light/20 transition-all"
                  >
                    Documentation
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <MainNav />
        )}

        <div className="ml-auto flex items-center space-x-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
