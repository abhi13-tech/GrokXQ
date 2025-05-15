import { DevelopmentWorkflow } from "@/components/development/development-workflow"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function DevelopmentPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Development Workflow" text="Manage your development process from code to deployment." />
      <div className="grid gap-8">
        <DevelopmentWorkflow />
      </div>
    </DashboardShell>
  )
}
