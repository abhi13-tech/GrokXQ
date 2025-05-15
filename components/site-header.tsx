"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ChevronRight, Sparkles, Zap, Code, GitBranch, FileText } from 'lucide-react'
import { useState, useEffect } from "react"
import { UserNav } from "@/components/user-nav"
import { motion, AnimatePresence } from "framer-motion"

export function SiteHeader() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [visible, setVisible] = useState(true)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Determine if we've scrolled down or up
      if (currentScrollY > lastScrollY) {
        setVisible(false)
      } else {
        setVisible(true)
      }

      // Set scrolled state for styling
      if (currentScrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      setLastScrollY(currentScrollY)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("resize", checkScreenSize)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [lastScrollY])

  const mainNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      active: pathname === "/dashboard",
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      title: "Code Generation",
      href: "/code-generation",
      active: pathname === "/code-generation",
      icon: <Code className="h-4 w-4" />,
    },
    {
      title: "Code Review",
      href: "/code-review",
      active: pathname === "/code-review",
      icon: <GitBranch className="h-4 w-4" />,
    },
    {
      title: "Testing",
      href: "/testing",
      active: pathname === "/testing",
      icon: <Zap className="h-4 w-4" />,
    },
    {
      title: "Documentation",
      href: "/documentation",
      active: pathname === "/documentation",
      icon: <FileText className="h-4 w-4" />,
    },
  ]

  const toolsNavItems = [
    {
      title: "Prompt Generator",
      href: "/tools/prompt-generator",
      description: "Create powerful AI prompts for your projects",
      icon: "✨",
    },
    {
      title: "Code Optimizer",
      href: "/tools/code-optimizer",
      description: "Improve your code's performance and readability",
      icon: "⚡",
    },
    {
      title: "Debugging Assistant",
      href: "/tools/debugging",
      description: "Get help identifying and fixing bugs in your code",
      icon: "🔍",
    },
    {
      title: "API Generator",
      href: "/tools/api-generator",
      description: "Generate API endpoints and documentation",
      icon: "🔄",
    },
  ]

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-md supports-[backdrop-filter]:bg-minimal-dark/60",
        scrolled ? "minimal-glass shadow-minimal-shadow-sm" : "bg-transparent",
        visible ? "translate-y-0" : "-translate-y-full",
      )}
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              className="w-8 h-8 rounded-md bg-minimal-accent1 flex items-center justify-center text-white font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              GX
            </motion.div>
            <motion.span
              className="font-bold text-xl hidden md:inline-block minimal-gradient-text"
              whileHover={{ scale: 1.02 }}
            >
              GrokXQ
            </motion.span>
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
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-minimal-light/20 transition-all",
                      item.active ? "bg-minimal-light/30" : "transparent",
                    )}
                  >
                    <motion.div className="mr-2">{item.icon}</motion.div>
                    {item.title}
                    {item.active && (
                      <motion.div className="ml-auto">
                        <ChevronRight className="h-4 w-4 text-minimal-accent1" />
                      </motion.div>
                    )}
                  </Link>
                ))}
                <div className="mt-4 pt-4 border-t border-minimal-border">
                  <div className="text-sm font-medium mb-2 text-minimal-muted-foreground">Tools</div>
                  {toolsNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-minimal-light/20 transition-colors"
                    >
                      <span className="mr-2 text-lg">{item.icon}</span>
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {mainNavItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        item.active ? "bg-minimal-light/30" : "",
                        "transition-all duration-200 group",
                      )}
                      onMouseEnter={() => setHoveredItem(item.title)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <span className="mr-2 inline-block">{item.icon}</span>
                      {item.title}
                      <AnimatePresence>
                        {hoveredItem === item.title && (
                          <motion.span
                            className="absolute bottom-0 left-0 h-px bg-minimal-accent1 w-0"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            exit={{ width: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </AnimatePresence>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className="group border border-minimal-accent3/20"
                  onMouseEnter={() => setHoveredItem("Tools")}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  Tools
                  <span className="ml-1 inline-block">⚙️</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] minimal-glass">
                    {toolsNavItems.map((item) => (
                      <motion.li key={item.href} whileHover={{ scale: 1.02 }} className="rounded-md">
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-minimal-light/20 hover:text-foreground focus:bg-minimal-light/20 focus:text-foreground border border-minimal-accent3/10"
                          >
                            <div className="text-sm font-medium leading-none flex items-center">
                              <span className="mr-2 text-lg">{item.icon}</span>
                              {item.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-minimal-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </motion.li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}

        <div className="ml-auto flex items-center space-x-2">
          <UserNav />
          <ModeToggle />
        </div>
      </div>
    </motion.header>
  )
}
