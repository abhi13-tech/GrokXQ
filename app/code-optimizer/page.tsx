import { CodeOptimizer } from "@/components/code-optimizer"

export default function CodeOptimizerPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl mb-4">
            AI Code Optimizer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Improve your code's performance, readability, and quality with AI
          </p>
        </div>
        <CodeOptimizer />
      </div>
    </div>
  )
}
