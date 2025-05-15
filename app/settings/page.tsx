"use client"

import { UserSettings } from "@/components/user/user-settings"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { motion } from "framer-motion"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings & Preferences"
        text="Manage your account settings and preferences"
        icon={<Settings className="h-6 w-6 mr-2" />}
      />

      <motion.div
        className="grid gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <UserSettings />
      </motion.div>
    </DashboardShell>
  )
}
