"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { FileText, Book, Database, Code, Server, Beaker } from "lucide-react"

interface DocNavigationProps {
  activeDoc: string
  setActiveDoc: (doc: string) => void
}

const docs = [
  {
    id: "overview",
    title: "Overview",
    icon: <Book className="h-4 w-4 mr-2" />,
  },
  {
    id: "architecture",
    title: "Architecture",
    icon: <Code className="h-4 w-4 mr-2" />,
  },
  {
    id: "components",
    title: "Components",
    icon: <FileText className="h-4 w-4 mr-2" />,
  },
  {
    id: "api",
    title: "API Reference",
    icon: <Server className="h-4 w-4 mr-2" />,
  },
  {
    id: "database",
    title: "Database",
    icon: <Database className="h-4 w-4 mr-2" />,
  },
  {
    id: "testing",
    title: "Testing",
    icon: <Beaker className="h-4 w-4 mr-2" />,
  },
]

export function DocNavigation({ activeDoc, setActiveDoc }: DocNavigationProps) {
  return (
    <Card className="border border-minimal-accent3/10">
      <div className="p-4">
        <h3 className="font-medium mb-4">Documentation</h3>
        <div className="space-y-1">
          {docs.map((doc) => (
            <Button
              key={doc.id}
              variant="ghost"
              className={cn(
                "w-full justify-start text-sm",
                activeDoc === doc.id
                  ? "bg-minimal-light/30 text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setActiveDoc(doc.id)}
            >
              {doc.icon}
              {doc.title}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  )
}
