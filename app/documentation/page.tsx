"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { DocViewer } from "@/components/documentation/doc-viewer"
import { DocNavigation } from "@/components/documentation/doc-navigation"

export default function DocumentationPage() {
  const [activeDoc, setActiveDoc] = useState("overview")

  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tighter mb-6 minimal-gradient-text">Documentation</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <DocNavigation activeDoc={activeDoc} setActiveDoc={setActiveDoc} />
        </div>

        <div className="md:col-span-3">
          <Card className="border border-minimal-accent3/10">
            <CardContent className="p-6">
              <DocViewer docId={activeDoc} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
