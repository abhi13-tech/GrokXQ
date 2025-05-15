import { TestGenerator } from "@/components/testing/test-generator"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function TestingPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Test Generator" text="Generate comprehensive tests for your code." />
      <div className="grid gap-8">
        <TestGenerator />
      </div>
    </DashboardShell>
  )
}
