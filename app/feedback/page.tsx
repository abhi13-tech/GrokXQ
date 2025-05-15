import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FeedbackPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Feedback" text="Share your thoughts and suggestions." />
      <Card>
        <CardHeader>
          <CardTitle>Feedback Form</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Our feedback system is currently under development. Please check back later to share your thoughts.
          </p>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
