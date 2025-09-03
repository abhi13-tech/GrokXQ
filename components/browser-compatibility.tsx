"use client"

import { useEffect } from "react"
import { applyBrowserFixes, loadPolyfills } from "@/lib/browser-compatibility"

export function BrowserCompatibility() {
  useEffect(() => {
    // Apply browser-specific fixes
    applyBrowserFixes()

    // Load polyfills if needed
    loadPolyfills().catch((err) => {
      console.error("Failed to load polyfills:", err)
    })
  }, [])

  // This component doesn't render anything
  return null
}
