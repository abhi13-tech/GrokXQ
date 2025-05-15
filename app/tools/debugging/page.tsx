import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebuggingPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Debugging Assistant" text="Get help identifying and fixing bugs in your code." />
      <Card>
        <CardHeader>
          <CardTitle>Debugging Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Our debugging assistant is currently under development. Please check back later for this feature.
          </p>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
