"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Code, FileCode, GitBranch, MessageSquare, Play, Zap } from "lucide-react"
import { motion } from "framer-motion"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      name: "Prompt Generator",
      href: "/",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
      active: pathname === "/",
    },
    {
      name: "Code Generation",
      href: "/code-generation",
      icon: <FileCode className="mr-2 h-4 w-4" />,
      active: pathname === "/code-generation",
    },
    {
      name: "Code Review",
      href: "/code-review",
      icon: <Code className="mr-2 h-4 w-4" />,
      active: pathname === "/code-review",
    },
    {
      name: "Code Optimizer",
      href: "/code-optimizer",
      icon: <Zap className="mr-2 h-4 w-4" />,
      active: pathname === "/code-optimizer",
    },
    {
      name: "Testing",
      href: "/testing",
      icon: <Play className="mr-2 h-4 w-4" />,
      active: pathname === "/testing",
    },
    {
      name: "Development",
      href: "/development",
      icon: <GitBranch className="mr-2 h-4 w-4" />,
      active: pathname === "/development",
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="flex items-center space-x-2">
        <motion.div
          className="w-8 h-8 rounded-md bg-minimal-accent1 flex items-center justify-center text-white font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          GX
        </motion.div>
        <span className="font-bold text-xl minimal-gradient-text">GrokXQ</span>
      </Link>
      <div className="ml-10 flex items-center space-x-4 lg:space-x-6">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-minimal-accent1",
              route.active ? "text-minimal-accent1" : "text-minimal-muted-foreground",
            )}
          >
            {route.icon}
            {route.name}
          </Link>
        ))}
      </div>
    </nav>
  )
}
