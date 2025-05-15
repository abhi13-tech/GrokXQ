type PerformanceMetric = {
  name: string
  startTime: number
  endTime?: number
  duration?: number
}

export class PerformanceMonitor {
  private static metrics: Map<string, PerformanceMetric> = new Map()
  private static thresholds: Map<string, number> = new Map()

  // Start timing a specific operation
  static startMeasure(name: string): void {
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
    })
  }

  // End timing and calculate duration
  static endMeasure(name: string): number | undefined {
    const metric = this.metrics.get(name)

    if (!metric) {
      console.warn(`No performance metric found with name: ${name}`)
      return undefined
    }

    metric.endTime = performance.now()
    metric.duration = metric.endTime - metric.startTime

    // Check if the operation exceeded its threshold
    const threshold = this.thresholds.get(name)
    if (threshold && metric.duration > threshold) {
      console.warn(
        `Performance warning: ${name} took ${metric.duration.toFixed(2)}ms, exceeding threshold of ${threshold}ms`,
      )
    }

    return metric.duration
  }

  // Set performance threshold for a specific operation
  static setThreshold(name: string, thresholdMs: number): void {
    this.thresholds.set(name, thresholdMs)
  }

  // Get all performance metrics
  static getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values())
  }

  // Clear all metrics
  static clearMetrics(): void {
    this.metrics.clear()
  }

  // Log all metrics to console
  static logMetrics(): void {
    console.group("Performance Metrics")
    this.getMetrics().forEach((metric) => {
      if (metric.duration) {
        console.log(`${metric.name}: ${metric.duration.toFixed(2)}ms`)
      } else {
        console.log(`${metric.name}: Not completed`)
      }
    })
    console.groupEnd()
  }
}
