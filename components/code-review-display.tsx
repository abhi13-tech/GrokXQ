"use client"

import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"

interface CodeReviewDisplayProps {
  review: string
}

export function CodeReviewDisplay({ review }: CodeReviewDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="prose dark:prose-invert max-w-none"
    >
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <motion.h2
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-xl font-bold text-slate-100 mt-6 mb-3"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <motion.h3
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="text-lg font-bold text-slate-200 mt-5 mb-2"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="text-slate-300 mb-4"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="list-disc pl-6 mb-4 text-slate-300"
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <motion.li
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-1"
              {...props}
            />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "")
            return !inline && match ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-md overflow-hidden my-4"
              >
                <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" className="rounded-md" {...props}>
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </motion.div>
            ) : (
              <code className="bg-slate-800 text-blue-300 px-1 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            )
          },
        }}
      >
        {review}
      </ReactMarkdown>
    </motion.div>
  )
}
