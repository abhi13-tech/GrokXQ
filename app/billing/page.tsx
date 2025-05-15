import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function BillingPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Billing" text="Manage your subscription and payment methods." />
      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Our billing system is currently under development. Please check back later to manage your subscription.
          </p>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
