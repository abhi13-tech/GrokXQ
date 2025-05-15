import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HelpPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Help & Support" text="Get assistance with using the platform." />
      <Card>
        <CardHeader>
          <CardTitle>Help Center</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Our help center is currently under construction. Please check back later for support resources.
          </p>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
