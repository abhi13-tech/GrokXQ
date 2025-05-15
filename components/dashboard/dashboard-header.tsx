"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: ReactNode
}

export function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  return (
    <motion.div
      className="flex items-center justify-between px-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid gap-1">
        <motion.h1
          className="text-3xl font-bold tracking-tight future-gradient-text"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {heading}
        </motion.h1>
        {text && (
          <motion.p
            className="text-future-muted-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {text}
          </motion.p>
        )}
      </div>
      {children}
    </motion.div>
  )
}
