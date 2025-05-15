"use client"

import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-minimal-border py-8 md:py-12 relative overflow-hidden minimal-glass">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-2 relative z-10">
        <div className="space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-minimal-accent1 flex items-center justify-center text-white font-bold">
              GX
            </div>
            <span className="font-bold text-xl minimal-gradient-text">GrokXQ</span>
          </Link>
          <p className="text-sm text-minimal-muted-foreground max-w-xs">
            Comprehensive AI-powered development suite for modern developers. Build better software, faster.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 minimal-gradient-text">Products</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/code-generation"
                className="text-sm text-minimal-muted-foreground hover:text-minimal-accent1 transition-colors flex items-center group"
              >
                <span>Code Generation</span>
              </Link>
            </li>
            <li>
              <Link
                href="/code-review"
                className="text-sm text-minimal-muted-foreground hover:text-minimal-accent1 transition-colors flex items-center group"
              >
                <span>Code Review</span>
              </Link>
            </li>
            <li>
              <Link
                href="/testing"
                className="text-sm text-minimal-muted-foreground hover:text-minimal-accent1 transition-colors flex items-center group"
              >
                <span>Testing</span>
              </Link>
            </li>
          </ul>
        </div>
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
    </footer>
  )
}
