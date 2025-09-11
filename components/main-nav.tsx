"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/code-generation",
      label: "Code Generation",
      active: pathname === "/code-generation",
    },
    {
      href: "/code-review",
      label: "Code Review",
      active: pathname === "/code-review",
    },
    {
      href: "/testing",
      label: "Testing",
      active: pathname === "/testing",
    },
    {
      href: "/documentation",
      label: "Documentation",
      active: pathname === "/documentation",
    },
  ]

  return (
    <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-primary" : "text-muted-foreground",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
