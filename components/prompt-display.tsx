"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface PromptDisplayProps {
  prompt: string
}

export function PromptDisplay({ prompt }: PromptDisplayProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Prompt</CardTitle>
        <CardDescription>Use this prompt with your favorite AI model</CardDescription>
      </CardHeader>
      <CardContent>
        {prompt ? (
          <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">{prompt}</div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">Your generated prompt will appear here</div>
        )}
      </CardContent>
      {prompt && (
        <CardFooter>
          <Button variant="outline" className="ml-auto" onClick={copyToClipboard} disabled={copied}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
