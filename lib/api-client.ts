import { ErrorHandler } from "@/lib/error-handler"
import { PerformanceMonitor } from "@/lib/performance-monitor"

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

interface RequestOptions {
  method?: RequestMethod
  headers?: Record<string, string>
  body?: any
  timeout?: number
  retries?: number
  retryDelay?: number
  cache?: RequestCache
}

export class ApiClient {
  private static baseUrl = "/api"
  private static defaultOptions: RequestOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 30000, // 30 seconds
    retries: 2,
    retryDelay: 1000, // 1 second
    cache: "no-cache",
  }

  // Set global base URL
  static setBaseUrl(url: string): void {
    this.baseUrl = url
  }

  // Set global default options
  static setDefaultOptions(options: Partial<RequestOptions>): void {
    this.defaultOptions = { ...this.defaultOptions, ...options }
  }

  // Main request method
  static async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`
    const mergedOptions: RequestOptions = {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...this.defaultOptions.headers,
        ...options.headers,
      },
    }

    // Start performance monitoring
    const perfKey = `api-${options.method || "GET"}-${endpoint}`
    PerformanceMonitor.startMeasure(perfKey)

    // Create abort controller for timeout
    const controller = new AbortController()
    const { signal } = controller

    // Set timeout
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, mergedOptions.timeout)

    try {
      // Prepare request options
      const fetchOptions: RequestInit = {
        method: mergedOptions.method || "GET",
        headers: mergedOptions.headers,
        signal,
        cache: mergedOptions.cache,
      }

      // Add body for non-GET requests
      if (mergedOptions.body && fetchOptions.method !== "GET") {
        fetchOptions.body = JSON.stringify(mergedOptions.body)
      }

      // Execute request with retry logic
      let response: Response | null = null
      let error: Error | null = null
      let retries = mergedOptions.retries || 0

      while (retries >= 0) {
        try {
          response = await fetch(url, fetchOptions)
          break
        } catch (err) {
          error = err as Error
          if (retries === 0) break

          // Wait before retry
          await new Promise((resolve) => setTimeout(resolve, mergedOptions.retryDelay))
          retries--
        }
      }

      // Handle network errors
      if (!response) {
        if (error?.name === "AbortError") {
          throw new Error(`Request timeout after ${mergedOptions.timeout}ms`)
        }
        throw error || new Error("Network request failed")
      }

      // Parse response
      let data: T
      const contentType = response.headers.get("content-type")

      if (contentType?.includes("application/json")) {
        data = await response.json()
      } else {
        data = (await response.text()) as unknown as T
      }

      // Handle error responses
      if (!response.ok) {
        throw {
          status: response.status,
          message:
            typeof data === "object" && data && "message" in data
              ? (data as any).message
              : `API error: ${response.statusText}`,
          data,
        }
      }

      return data
    } catch (error) {
      ErrorHandler.logError(error, { endpoint, options: mergedOptions })
      throw error
    } finally {
      clearTimeout(timeoutId)
      PerformanceMonitor.endMeasure(perfKey)
    }
  }

  // Convenience methods
  static async get<T = any>(endpoint: string, options: Omit<RequestOptions, "method" | "body"> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" })
  }

  static async post<T = any>(
    endpoint: string,
    body: any,
    options: Omit<RequestOptions, "method" | "body"> = {},
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "POST", body })
  }

  static async put<T = any>(
    endpoint: string,
    body: any,
    options: Omit<RequestOptions, "method" | "body"> = {},
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "PUT", body })
  }

  static async patch<T = any>(
    endpoint: string,
    body: any,
    options: Omit<RequestOptions, "method" | "body"> = {},
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body })
  }

  static async delete<T = any>(endpoint: string, options: Omit<RequestOptions, "method"> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }
}
