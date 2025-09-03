"use client"

import { useEffect, useState } from "react"
import { detectBrowser } from "@/lib/browser-compatibility"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { X } from "lucide-react"

export function BrowserWarning() {
  const [showWarning, setShowWarning] = useState(false)
  const [browser, setBrowser] = useState("")

  useEffect(() => {
    const detectedBrowser = detectBrowser()
    setBrowser(detectedBrowser)

    // Show warning for IE or very old browsers
    if (detectedBrowser === "ie" || (detectedBrowser === "unknown" && !("fetch" in window))) {
      setShowWarning(true)
    }

    // Check if localStorage is available (private browsing mode in Safari can disable it)
    try {
      localStorage.setItem("browser_test", "test")
      localStorage.removeItem("browser_test")
    } catch (e) {
      setShowWarning(true)
    }
  }, [])

  if (!showWarning) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert className="bg-yellow-900/90 border-yellow-600 text-white">
        <AlertTitle className="flex items-center justify-between">
          Browser Compatibility Warning
          <button onClick={() => setShowWarning(false)} className="text-white hover:text-yellow-200">
            <X size={18} />
          </button>
        </AlertTitle>
        <AlertDescription>
          {browser === "ie" ? (
            <p>
              You are using Internet Explorer which is not fully supported. Please use a modern browser like Chrome,
              Firefox, Safari, or Edge for the best experience.
            </p>
          ) : (
            <p>
              Your browser may have limited functionality. For the best experience, please use a modern browser with
              JavaScript enabled and cookies allowed.
            </p>
          )}
        </AlertDescription>
      </Alert>
    </div>
  )
}
