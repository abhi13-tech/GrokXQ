"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface MainNavProps {
  children?: React.ReactNode
}

export function MainNav({ children }: MainNavProps) {
  const pathname = usePathname()

  return (
    <div className="flex gap-6 md:gap-10">
      {children}

      <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
        <Link
          href="/dashboard"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/dashboard" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/code-generation"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/code-generation" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Code Generation
        </Link>
        <Link
          href="/code-review"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/code-review" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Code Review
        </Link>
        <Link
          href="/testing"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/testing" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Testing
        </Link>
        <Link
          href="/documentation"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/documentation" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Documentation
        </Link>
      </nav>
    </div>
  )
}
