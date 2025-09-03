// Offline data service for when Supabase is unreachable

// Types
export interface OfflineUser {
  id: string
  email: string
  full_name?: string | null
  avatar_url?: string | null
  created_at: string
}

export interface OfflineActivity {
  id: string
  user_id: string
  type: string
  description: string
  created_at: string
}

export interface OfflinePrompt {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
}

export interface OfflineMetric {
  id: string
  user_id: string
  type: string
  value: number
  created_at: string
}

export interface OfflineInsight {
  id: string
  user_id: string
  title: string
  description: string
  created_at: string
}

// Storage keys
const OFFLINE_USER_KEY = "offline_user"
const OFFLINE_ACTIVITIES_KEY = "offline_activities"
const OFFLINE_PROMPTS_KEY = "offline_prompts"
const OFFLINE_METRICS_KEY = "offline_metrics"
const OFFLINE_INSIGHTS_KEY = "offline_insights"

// Helper functions
function saveToLocalStorage(key: string, value: any): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error)
  }
}

function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error)
    return defaultValue
  }
}

function generateId(): string {
  return "offline_" + Math.random().toString(36).substring(2, 15)
}

// User functions
export function saveOfflineUser(user: OfflineUser): void {
  saveToLocalStorage(OFFLINE_USER_KEY, user)
}

export function getOfflineUser(): OfflineUser | null {
  return getFromLocalStorage<OfflineUser | null>(OFFLINE_USER_KEY, null)
}

export function clearOfflineUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(OFFLINE_USER_KEY)
}

// Activities functions
export function getOfflineActivities(): OfflineActivity[] {
  return getFromLocalStorage<OfflineActivity[]>(OFFLINE_ACTIVITIES_KEY, [])
}

export function addOfflineActivity(activity: Omit<OfflineActivity, "id" | "created_at">): OfflineActivity {
  const activities = getOfflineActivities()
  const newActivity: OfflineActivity = {
    ...activity,
    id: generateId(),
    created_at: new Date().toISOString(),
  }
  activities.unshift(newActivity)
  saveToLocalStorage(OFFLINE_ACTIVITIES_KEY, activities)
  return newActivity
}

// Prompts functions
export function getOfflinePrompts(): OfflinePrompt[] {
  return getFromLocalStorage<OfflinePrompt[]>(OFFLINE_PROMPTS_KEY, [])
}

export function addOfflinePrompt(prompt: Omit<OfflinePrompt, "id" | "created_at">): OfflinePrompt {
  const prompts = getOfflinePrompts()
  const newPrompt: OfflinePrompt = {
    ...prompt,
    id: generateId(),
    created_at: new Date().toISOString(),
  }
  prompts.unshift(newPrompt)
  saveToLocalStorage(OFFLINE_PROMPTS_KEY, prompts)
  return newPrompt
}

// Metrics functions
export function getOfflineMetrics(): OfflineMetric[] {
  return getFromLocalStorage<OfflineMetric[]>(OFFLINE_METRICS_KEY, [])
}

export function addOfflineMetric(metric: Omit<OfflineMetric, "id" | "created_at">): OfflineMetric {
  const metrics = getOfflineMetrics()
  const newMetric: OfflineMetric = {
    ...metric,
    id: generateId(),
    created_at: new Date().toISOString(),
  }
  metrics.unshift(newMetric)
  saveToLocalStorage(OFFLINE_METRICS_KEY, metrics)
  return newMetric
}

// Insights functions
export function getOfflineInsights(): OfflineInsight[] {
  return getFromLocalStorage<OfflineInsight[]>(OFFLINE_INSIGHTS_KEY, [])
}

export function addOfflineInsight(insight: Omit<OfflineInsight, "id" | "created_at">): OfflineInsight {
  const insights = getOfflineInsights()
  const newInsight: OfflineInsight = {
    ...insight,
    id: generateId(),
    created_at: new Date().toISOString(),
  }
  insights.unshift(newInsight)
  saveToLocalStorage(OFFLINE_INSIGHTS_KEY, insights)
  return newInsight
}

// Initialize with sample data
export function initializeOfflineData(userId: string): void {
  const activities = getOfflineActivities()
  const prompts = getOfflinePrompts()
  const metrics = getOfflineMetrics()
  const insights = getOfflineInsights()

  if (activities.length === 0) {
    addOfflineActivity({
      user_id: userId,
      type: "prompt_generation",
      description: "Generated a prompt for React component",
    })
    addOfflineActivity({
      user_id: userId,
      type: "code_review",
      description: "Reviewed JavaScript code",
    })
    addOfflineActivity({
      user_id: userId,
      type: "code_optimization",
      description: "Optimized Python algorithm",
    })
  }

  if (prompts.length === 0) {
    addOfflinePrompt({
      user_id: userId,
      title: "React Component",
      content: "Create a responsive navigation bar with dropdown menus",
    })
    addOfflinePrompt({
      user_id: userId,
      title: "API Documentation",
      content: "Generate documentation for a REST API with authentication",
    })
  }

  if (metrics.length === 0) {
    addOfflineMetric({
      user_id: userId,
      type: "prompts_generated",
      value: 12,
    })
    addOfflineMetric({
      user_id: userId,
      type: "code_reviews",
      value: 5,
    })
    addOfflineMetric({
      user_id: userId,
      type: "optimizations",
      value: 3,
    })
  }

  if (insights.length === 0) {
    addOfflineInsight({
      user_id: userId,
      title: "Prompt Efficiency",
      description: "Your prompts are 25% more efficient than average",
    })
    addOfflineInsight({
      user_id: userId,
      title: "Code Quality",
      description: "Your code reviews have improved code quality by 30%",
    })
  }
}

// Clear all offline data
export function clearAllOfflineData(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(OFFLINE_USER_KEY)
  localStorage.removeItem(OFFLINE_ACTIVITIES_KEY)
  localStorage.removeItem(OFFLINE_PROMPTS_KEY)
  localStorage.removeItem(OFFLINE_METRICS_KEY)
  localStorage.removeItem(OFFLINE_INSIGHTS_KEY)
}
