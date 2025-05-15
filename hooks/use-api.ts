"use client"

import { useState, useCallback } from "react"
import { ErrorHandler, type ApiError } from "@/lib/error-handler"

interface ApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: ApiError) => void
  onSettled?: () => void
}

interface ApiState<T> {
  data: T | null
  isLoading: boolean
  error: ApiError | null
}

export function useApi<T = any>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  })

  const execute = useCallback(async <R = T>(apiCall: () => Promise<R>, options?: ApiOptions<R>): Promise<R | null> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const data = await apiCall()

      setState((prev) => ({ ...prev, data: data as unknown as T, isLoading: false }))
      options?.onSuccess?.(data)

      return data
    } catch (error) {
      const apiError = ErrorHandler.handleApiError(error)
      setState((prev) => ({ ...prev, error: apiError, isLoading: false }))
      options?.onError?.(apiError)
      return null
    } finally {
      options?.onSettled?.()
    }
  }, [])

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}
