import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DeploymentManager } from "@/components/deployment/deployment-manager"

export default function DeploymentPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Deployment" text="Deploy and manage your applications across different environments." />
      <div className="grid gap-8">
        <DeploymentManager />
      </div>
    </DashboardShell>
  )
}
