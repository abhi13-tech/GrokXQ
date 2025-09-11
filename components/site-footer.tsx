"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Github, Twitter, Linkedin, ArrowUpRight } from "lucide-react"

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
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
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
      className="border-t border-minimal-border py-8 md:py-12 relative overflow-hidden minimal-glass"
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4 relative z-10">
        <motion.div className="space-y-4" variants={itemVariants}>
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
          <p className="text-sm text-minimal-muted-foreground max-w-xs">
            Comprehensive AI-powered development suite for modern developers. Build better software, faster.
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold mb-4 minimal-gradient-text">Products</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/code-generation"
                className="text-sm text-minimal-muted-foreground hover:text-minimal-accent1 transition-colors flex items-center group"
              >
                <span>Code Generation</span>
                <motion.span
                  className="ml-1 opacity-0 group-hover:opacity-100"
                  initial={{ x: -5 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowUpRight className="h-3 w-3" />
                </motion.span>
              </Link>
            </li>
            <li>
              <Link
                href="/code-review"
                className="text-sm text-minimal-muted-foreground hover:text-minimal-accent1 transition-colors flex items-center group"
              >
                <span>Code Review</span>
                <motion.span
                  className="ml-1 opacity-0 group-hover:opacity-100"
                  initial={{ x: -5 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowUpRight className="h-3 w-3" />
                </motion.span>
              </Link>
            </li>
            <li>
              <Link
                href="/testing"
                className="text-sm text-minimal-muted-foreground hover:text-minimal-accent1 transition-colors flex items-center group"
              >
                <span>Testing</span>
                <motion.span
                  className="ml-1 opacity-0 group-hover:opacity-100"
                  initial={{ x: -5 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowUpRight className="h-3 w-3" />
                </motion.span>
              </Link>
            </li>
          </ul>
        </motion.div>
      </div>

      <div className="container mt-8 pt-8 border-t border-minimal-border">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-center text-sm text-minimal-muted-foreground mb-4 md:mb-0">
            Built with AI. Powered by{" "}
            <Link
              href="https://groq.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 hover:text-minimal-accent1 transition-colors"
            >
              Groq
            </Link>{" "}
            and{" "}
            <Link
              href="https://grok.x.ai"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 hover:text-minimal-accent1 transition-colors"
            >
              Grok
            </Link>
            . GrokXQ © 2025.
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
