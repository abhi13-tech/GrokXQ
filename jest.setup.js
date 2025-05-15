// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom"

// Mock next/router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: "/",
    query: {},
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}))

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
    li: ({ children, ...props }) => <li {...props}>{children}</li>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    h4: ({ children, ...props }) => <h4 {...props}>{children}</h4>,
    a: ({ children, ...props }) => <a {...props}>{children}</a>,
    button: ({ children, ...props }) => <button {...props}>{children}</a>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
  useScroll: () => ({ scrollYProgress: { current: 0 } }),
  useTransform: () => ({ current: 0 }),
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
  }),
}))

// Mock intersection observer
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe() {
    return null
  }
  unobserve() {
    return null
  }
  disconnect() {
    return null
  }
}

// Mock react-intersection-observer
jest.mock("react-intersection-observer", () => ({
  useInView: () => [null, true],
}))

// Suppress console errors during tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}
