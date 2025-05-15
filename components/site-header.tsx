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
import { Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { UserNav } from "@/components/user-nav"
import { motion } from "framer-motion"

export function SiteHeader() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [visible, setVisible] = useState(true)

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
    },
    {
      title: "Code Generation",
      href: "/code-generation",
      active: pathname === "/code-generation",
    },
    {
      title: "Code Review",
      href: "/code-review",
      active: pathname === "/code-review",
    },
    {
      title: "Testing",
      href: "/testing",
      active: pathname === "/testing",
    },
    {
      title: "Deployment",
      href: "/deployment",
      active: pathname === "/deployment",
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
        "sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60",
        scrolled ? "bg-background/95 shadow-sm" : "bg-background/50",
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
              className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center text-white font-bold"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              GX
            </motion.div>
            <span className="font-bold text-xl hidden md:inline-block group-hover:text-primary transition-colors">
              GrokXQ
            </span>
          </Link>
        </div>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden ml-auto mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80vw] sm:w-[350px]">
              <div className="grid gap-2 py-6">
                <Link href="/" className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center text-white font-bold mr-2">
                    GX
                  </div>
                  GrokXQ
                </Link>
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors",
                      item.active ? "bg-accent" : "transparent",
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm font-medium mb-2 text-muted-foreground">Tools</div>
                  {toolsNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                    >
                      <span className="mr-2">{item.icon}</span>
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
                        item.active ? "bg-accent" : "",
                        "transition-all duration-200 hover:scale-105",
                      )}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {toolsNavItems.map((item) => (
                      <motion.li
                        key={item.href}
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none flex items-center">
                              <span className="mr-2 text-lg">{item.icon}</span> {item.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
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
