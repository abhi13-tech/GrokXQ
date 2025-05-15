import { CodeGenerationForm } from "@/components/code-generation/code-generation-form"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function CodeGenerationPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Code Generation" text="Generate high-quality code with AI assistance." />
      <div className="grid gap-8">
        <CodeGenerationForm />
      </div>
    </DashboardShell>
  )
}
