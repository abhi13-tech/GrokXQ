"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"

interface DocViewerProps {
  docId: string
}

const docMapping: Record<string, string> = {
  overview: "/docs/README.md",
  architecture: "/docs/ARCHITECTURE.md",
  components: "/docs/COMPONENTS.md",
  api: "/docs/API.md",
  database: "/docs/DATABASE.md",
  testing: "/docs/TESTING.md",
}

export function DocViewer({ docId }: DocViewerProps) {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true)
      setError(null)

      try {
        const docPath = docMapping[docId] || docMapping.overview
        const response = await fetch(docPath)

        if (!response.ok) {
          throw new Error(`Failed to load documentation: ${response.status}`)
        }

        const text = await response.text()
        setContent(text)
      } catch (err) {
        console.error("Error loading documentation:", err)
        setError("Failed to load documentation. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchDoc()
  }, [docId])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    )
  }

  if (error) {
    return <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">{error}</div>
  }

  return (
    <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "")
            return !inline && match ? (
              <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
        }}
      >
        {content || ""}
      </ReactMarkdown>
    </div>
  )
}
