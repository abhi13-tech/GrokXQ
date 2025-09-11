"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface DashboardShellProps {
  children: ReactNode
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <motion.div
      className="flex-1 space-y-8 p-4 md:p-8 pt-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex items-center justify-between space-y-2" variants={itemVariants}>
        <div />
      </motion.div>
      <motion.div variants={itemVariants}>{children}</motion.div>
    </motion.div>
  )
}
