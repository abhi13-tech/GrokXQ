# Architecture Documentation

## Overview

The Groq Prompt Generator is built using a modern, component-based architecture that emphasizes modularity, reusability, and maintainability. This document outlines the high-level architecture of the application, key design patterns, and the interaction between different components.

## Application Structure

The application follows the Next.js App Router structure, which organizes code by features and routes:

\`\`\`
groq-prompt-generator/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── code-generation/  # Code generation feature
│   ├── code-review/      # Code review feature
│   ├── dashboard/        # Dashboard feature
│   ├── documentation/    # Documentation feature
│   ├── testing/          # Testing feature
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable components
│   ├── auth/             # Authentication components
│   ├── code-editor/      # Code editor components
│   ├── dashboard/        # Dashboard components
│   ├── documentation/    # Documentation components
│   ├── ui/               # UI components (shadcn/ui)
│   └── ...
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and libraries
├── public/               # Static assets
│   └── docs/             # Documentation markdown files
└── types/                # TypeScript type definitions
\`\`\`

## Key Design Patterns

### Component Composition

The application uses component composition to build complex UIs from smaller, reusable components. This approach enhances maintainability and promotes code reuse.

### Server Components vs. Client Components

Next.js 13+ introduces the concept of React Server Components. The application strategically uses:

- **Server Components**: For data fetching, database access, and rendering static content
- **Client Components**: For interactive elements, state management, and user interactions

### Data Flow

The application follows a unidirectional data flow pattern:

1. Data is fetched from APIs or the database using server components or API routes
2. Data is passed down to child components via props
3. User interactions trigger state updates or API calls
4. UI is updated based on the new state

### Authentication and Authorization

Authentication is handled using Supabase Auth, with a custom AuthContext provider that:

1. Manages user authentication state
2. Provides login, logout, and registration functionality
3. Handles session persistence
4. Protects routes that require authentication

## Technology Stack Details

### Frontend

- **Next.js**: React framework for server-rendered applications
- **React**: UI library for building component-based interfaces
- **TypeScript**: Typed superset of JavaScript for improved developer experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Reusable UI components built with Radix UI and Tailwind

### Backend

- **Next.js API Routes**: Serverless functions for API endpoints
- **Supabase**: Backend-as-a-Service for database and authentication
- **PostgreSQL**: Relational database for data storage

### AI Integration

- **Groq API**: Integration with Groq's large language models
- **XAI (Grok)**: Additional AI capabilities for specialized tasks

## Performance Considerations

The application implements several performance optimizations:

- **Code Splitting**: Automatic code splitting based on routes
- **Image Optimization**: Next.js Image component for optimized image loading
- **Incremental Static Regeneration**: For pages with dynamic but infrequently changing data
- **Memoization**: React.memo and useMemo for expensive computations
- **Lazy Loading**: Components and libraries are loaded only when needed

## Security Considerations

- **Authentication**: Secure authentication flow with Supabase
- **API Protection**: Protected API routes with authentication checks
- **Input Validation**: Validation of user inputs to prevent injection attacks
- **Environment Variables**: Sensitive information stored in environment variables
- **CORS**: Proper CORS configuration for API routes

## Deployment Architecture

The application is designed to be deployed on Vercel, taking advantage of:

- **Edge Network**: Global CDN for static assets
- **Serverless Functions**: For API routes
- **Preview Deployments**: For testing changes before production
- **Environment Variables**: Secure storage of sensitive information

## Future Architecture Considerations

- **Microservices**: Potential migration to a microservices architecture for specific features
- **WebSockets**: Real-time collaboration features
- **Caching Layer**: Redis or similar for improved performance
- **Analytics**: Integration with analytics platforms for usage insights
\`\`\`

Now, let's update the site header to include a link to the documentation:

\`\`\`typescriptreact file="components/site-header.tsx"
[v0-no-op-code-block-prefix]"use client"

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
