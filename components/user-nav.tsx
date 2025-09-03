import { useDefault } from "@/contexts/default-context"

export function UserNav() {
  const { user } = useDefault()

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">G</div>
    </div>
  )
}
