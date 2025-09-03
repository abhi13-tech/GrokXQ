import { NextResponse } from "next/server"

// Sample activities data for the stateless app
const sampleActivities = [
  {
    id: "1",
    user_id: "default-user",
    activity_type: "code_generation",
    description: "Generated React authentication component",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    user_id: "default-user",
    activity_type: "code_review",
    description: "Reviewed API implementation code",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    user_id: "default-user",
    activity_type: "test_generation",
    description: "Generated unit tests for user service",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    user_id: "default-user",
    activity_type: "prompt_generation",
    description: "Created prompt for database schema design",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export async function POST(request: Request) {
  try {
    const { userId, limit = 5, fromDate } = await request.json()

    // Filter activities based on the request parameters
    let filteredActivities = [...sampleActivities]

    if (fromDate) {
      filteredActivities = filteredActivities.filter((activity) => new Date(activity.created_at) >= new Date(fromDate))
    }

    // Sort by created_at in descending order
    filteredActivities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    // Apply limit
    filteredActivities = filteredActivities.slice(0, limit)

    return NextResponse.json({ data: filteredActivities })
  } catch (error) {
    console.error("Exception in activities API:", error)
    return NextResponse.json({ error: { message: "An unexpected error occurred" } }, { status: 500 })
  }
}
