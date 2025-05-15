import { toast } from "@/hooks/use-toast"

// Error types
export type ApiError = {
  status: number
  message: string
  code?: string
}

export type ValidationError = {
  field: string
  message: string
}

// Error handler class
export class ErrorHandler {
  // Handle API errors
  static handleApiError(error: unknown): ApiError {
    console.error("API Error:", error)

    if (typeof error === "object" && error !== null && "status" in error && "message" in error) {
      const apiError = error as ApiError
      toast({
        title: `Error ${apiError.status}`,
        description: apiError.message,
        variant: "destructive",
      })
      return apiError
    }

    // Default error
    const defaultError: ApiError = {
      status: 500,
      message: "An unexpected error occurred. Please try again later.",
    }

    toast({
      title: "Error",
      description: defaultError.message,
      variant: "destructive",
    })

    return defaultError
  }

  // Handle validation errors
  static handleValidationErrors(errors: ValidationError[]): void {
    errors.forEach((error) => {
      toast({
        title: `Validation Error: ${error.field}`,
        description: error.message,
        variant: "destructive",
      })
    })
  }

  // Handle authentication errors
  static handleAuthError(error: unknown): void {
    console.error("Auth Error:", error)

    let message = "Authentication failed. Please sign in again."

    if (typeof error === "object" && error !== null && "message" in error) {
      message = (error as { message: string }).message
    }

    toast({
      title: "Authentication Error",
      description: message,
      variant: "destructive",
    })
  }

  // Handle network errors
  static handleNetworkError(): void {
    toast({
      title: "Network Error",
      description: "Unable to connect to the server. Please check your internet connection and try again.",
      variant: "destructive",
    })
  }

  // Log errors to monitoring service
  static logError(error: unknown, context?: Record<string, any>): void {
    console.error("Error logged:", error, context)
    // In a production environment, you would send this to a monitoring service like Sentry
    // Example: Sentry.captureException(error, { extra: context })
  }
}
