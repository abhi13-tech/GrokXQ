"use client"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  height?: string
  readOnly?: boolean
}

export function CodeEditor({ value, onChange, language, height = "300px", readOnly = false }: CodeEditorProps) {
  return (
    <div className="border rounded-md overflow-hidden">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 font-mono text-sm resize-none focus:outline-none bg-background"
        style={{ height }}
        placeholder="Paste or type your code here..."
        readOnly={readOnly}
      />
    </div>
  )
}
