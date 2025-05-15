"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Github, Twitter, Linkedin } from "lucide-react"

export function SiteFooter() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.5,
      },
    },
  }

  const socialLinks = [
    { icon: <Github className="h-5 w-5" />, href: "https://github.com", label: "GitHub" },
    { icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com", label: "Twitter" },
    { icon: <Linkedin className="h-5 w-5" />, href: "https://linkedin.com", label: "LinkedIn" },
  ]

  const footerLinks = [
    { title: "Privacy", href: "/privacy" },
    { title: "Terms", href: "/terms" },
    { title: "Contact", href: "/contact" },
    { title: "About", href: "/about" },
    { title: "Blog", href: "/blog" },
  ]

  return (
    <motion.footer
      className="border-t py-8 md:py-12"
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center text-white font-bold">
              GX
            </div>
            <span className="font-bold text-xl">GrokXQ</span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Comprehensive AI-powered development suite for modern developers. Build better software, faster.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Products</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/code-generation"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Code Generation
              </Link>
            </li>
            <li>
              <Link
                href="/code-review"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Code Review
              </Link>
            </li>
            <li>
              <Link href="/testing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Testing
              </Link>
            </li>
            <li>
              <Link
                href="/deployment"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Deployment
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Resources</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </Link>
            </li>
            <li>
              <Link href="/api" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                API Reference
              </Link>
            </li>
            <li>
              <Link href="/tutorials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Tutorials
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Connect</h3>
          <div className="flex space-x-4 mb-4">
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                aria-label={link.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Subscribe to our newsletter for updates</p>
          <div className="mt-2 flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 text-sm rounded-l-md border border-input bg-background w-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <motion.button
              className="bg-primary text-primary-foreground px-3 py-2 text-sm rounded-r-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </div>
        </div>
      </div>

      <div className="container mt-8 pt-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-center text-sm text-muted-foreground mb-4 md:mb-0">
            Built with AI. Powered by{" "}
            <Link
              href="https://groq.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
            >
              Groq
            </Link>{" "}
            and{" "}
            <Link
              href="https://grok.x.ai"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
            >
              Grok
            </Link>
            . GrokXQ © 2025.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {footerLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
