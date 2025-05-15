import { CodeReviewForm } from "@/components/code-review/code-review-form"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function CodeReviewPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Code Review" text="Get AI-powered feedback on your code." />
      <div className="grid gap-8">
        <CodeReviewForm />
      </div>
    </DashboardShell>
  )
}
