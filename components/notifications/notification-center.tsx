"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Check, Rocket, GitBranch, FileCode, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "info" | "success" | "warning" | "error"
  icon?: React.ReactNode
  action?: {
    text: string
    onClick: () => void
  }
}

// Sample notifications data
const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "Deployment Successful",
    message: "Your E-commerce App has been successfully deployed to production.",
    time: "2 hours ago",
    read: false,
    type: "success",
    icon: <Rocket className="h-5 w-5" />,
    action: {
      text: "View Deploy",
      onClick: () => console.log("View deployment"),
    },
  },
  {
    id: "2",
    title: "Pull Request Review",
    message: "Sarah Miller has requested your review on PR #42: Add cart functionality",
    time: "4 hours ago",
    read: false,
    type: "info",
    icon: <GitBranch className="h-5 w-5" />,
    action: {
      text: "Review PR",
      onClick: () => console.log("Review PR"),
    },
  },
  {
    id: "3",
    title: "Code Generation Complete",
    message: "Your requested code for user authentication has been generated.",
    time: "Yesterday",
    read: true,
    type: "info",
    icon: <FileCode className="h-5 w-5" />,
    action: {
      text: "View Code",
      onClick: () => console.log("View code"),
    },
  },
  {
    id: "4",
    title: "AI Model Update",
    message: "The GPT-4 model has been updated with improved capabilities.",
    time: "2 days ago",
    read: true,
    type: "info",
    icon: <AlertCircle className="h-5 w-5" />,
  },
]

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleDismiss = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const getIconColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "error":
        return "text-red-500"
      default:
        return "text-blue-500"
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-80 sm:w-96 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md z-50"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between border-b px-4 py-2">
              <h2 className="font-semibold">Notifications</h2>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={handleMarkAllRead}>
                    <Check className="mr-1 h-3 w-3" />
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-muted p-3">
                  <Bell className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">All caught up!</h3>
                <p className="text-sm text-muted-foreground">You have no notifications.</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="grid gap-1 p-1">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`relative flex gap-3 rounded-md p-3 text-sm transition-colors hover:bg-accent ${
                        notification.read ? "opacity-70" : "bg-accent/40"
                      }`}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-6 w-6 opacity-50 hover:opacity-100"
                        onClick={() => handleDismiss(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          notification.read ? "bg-muted" : "bg-accent"
                        }`}
                      >
                        <span className={getIconColor(notification.type)}>
                          {notification.icon || <Bell className="h-5 w-5" />}
                        </span>
                      </div>
                      <div className="flex-1 pr-7">
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-medium">{notification.title}</p>
                        </div>
                        <p className="text-muted-foreground leading-tight">{notification.message}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                          {notification.action && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => {
                                handleMarkAsRead(notification.id)
                                notification.action?.onClick()
                              }}
                            >
                              {notification.action.text}
                            </Button>
                          )}
                          {!notification.read && !notification.action && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
