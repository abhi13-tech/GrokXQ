/**
 * Browser compatibility utilities
 */

// Detect browser type
export const detectBrowser = (): string => {
  if (typeof window === "undefined") return "server"

  const userAgent = window.navigator.userAgent

  if (userAgent.indexOf("Chrome") > -1) return "chrome"
  if (userAgent.indexOf("Safari") > -1) return "safari"
  if (userAgent.indexOf("Firefox") > -1) return "firefox"
  if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) return "ie"
  if (userAgent.indexOf("Edge") > -1) return "edge"

  return "unknown"
}

// Check if browser supports a specific feature
export const supportsFeature = (feature: string): boolean => {
  if (typeof window === "undefined") return false

  switch (feature) {
    case "clipboard":
      return !!navigator.clipboard
    case "share":
      return !!navigator.share
    case "webp":
      const canvas = document.createElement("canvas")
      if (canvas.getContext && canvas.getContext("2d")) {
        return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0
      }
      return false
    case "touch":
      return "ontouchstart" in window || navigator.maxTouchPoints > 0
    case "intersection-observer":
      return "IntersectionObserver" in window
    default:
      return false
  }
}

// Apply browser-specific fixes
export const applyBrowserFixes = (): void => {
  if (typeof window === "undefined") return

  const browser = detectBrowser()

  // Fix for iOS vh units
  if (browser === "safari" && /iPhone|iPod|iPad/.test(navigator.userAgent)) {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty("--vh", `${vh}px`)

    window.addEventListener("resize", () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty("--vh", `${vh}px`)
    })
  }

  // Fix for older browsers that don't support focus-visible
  if (!("focusVisible" in document.documentElement.style)) {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        document.body.classList.add("using-keyboard")
      }
    })

    document.addEventListener("mousedown", () => {
      document.body.classList.remove("using-keyboard")
    })
  }
}

// Load polyfills as needed
export const loadPolyfills = async (): Promise<void> => {
  if (typeof window === "undefined") return

  const polyfills: Promise<any>[] = []

  // Intersection Observer polyfill
  if (!("IntersectionObserver" in window)) {
    polyfills.push(import("intersection-observer"))
  }

  // Fetch polyfill
  if (!("fetch" in window)) {
    polyfills.push(import("whatwg-fetch"))
  }

  // Promise polyfill
  if (!("Promise" in window)) {
    polyfills.push(import("promise-polyfill/src/polyfill"))
  }

  await Promise.all(polyfills)
}
