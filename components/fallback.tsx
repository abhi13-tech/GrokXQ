export function Fallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Loading...</h2>
        <p className="text-muted-foreground">Please wait while we set things up.</p>
      </div>
    </div>
  )
}
