import { createServerClient } from "@/lib/supabase"

type ActivityType =
  | "prompt_generation"
  | "code_generation"
  | "code_review"
  | "test_generation"
  | "deployment"
  | "login"
  | "signup"
  | "project_creation"

export async function logActivity(
  userId: string,
  activityType: ActivityType,
  description: string,
  projectId?: string,
  metadata?: any,
) {
  const supabase = createServerClient()

  try {
    const { error } = await supabase.from("activity_logs").insert({
      user_id: userId,
      activity_type: activityType,
      description,
      project_id: projectId || null,
      metadata: metadata || null,
    })

    if (error) {
      console.error("Error logging activity:", error)
    }
  } catch (error) {
    console.error("Error logging activity:", error)
  }
}
