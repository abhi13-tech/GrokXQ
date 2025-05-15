"use client"

import { useState, useRef } from "react"
import { Check, Copy, Download, Share } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface PromptDisplayProps {
  prompt: string
}

export function PromptDisplay({ prompt }: PromptDisplayProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const promptRef = useRef<HTMLDivElement>(null)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast({
        title: "Copied to clipboard",
        description: "The prompt has been copied to your clipboard",
      })
    } catch (err) {
      console.error("Failed to copy text: ", err)
      toast({
        title: "Failed to copy",
        description: "Could not copy the prompt to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadPrompt = () => {
    try {
      const element = document.createElement("a")
      const file = new Blob([prompt], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = "prompt.txt"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      toast({
        title: "Downloaded prompt",
        description: "The prompt has been downloaded as a text file",
      })
    } catch (err) {
      console.error("Failed to download text: ", err)
      toast({
        title: "Failed to download",
        description: "Could not download the prompt",
        variant: "destructive",
      })
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg dark:from-slate-950 dark:to-slate-900">
        <CardHeader className="bg-black/20 backdrop-blur-sm">
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Generated Prompt
          </CardTitle>
          <CardDescription className="text-slate-300">Use this prompt with your favorite AI model</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {prompt ? (
            <motion.div
              className="bg-slate-800/50 p-4 rounded-md whitespace-pre-wrap text-slate-200 border border-slate-700 shadow-inner"
              ref={promptRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {prompt}
            </motion.div>
          ) : (
            <div className="text-center py-16 text-slate-400 bg-slate-800/30 rounded-md border border-dashed border-slate-700">
              Your generated prompt will appear here
            </div>
          )}
        </CardContent>
        {prompt && (
          <CardFooter className="bg-black/20 backdrop-blur-sm px-6 py-4 flex flex-wrap gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
              onClick={downloadPrompt}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
              onClick={() => {
                toast({
                  title: "Share feature coming soon",
                  description: "This feature will be available in a future update",
                })
              }}
            >
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              className="bg-blue-600/20 border-blue-500/50 text-blue-400 hover:bg-blue-600/30 hover:text-blue-300 transition-all ml-auto"
              onClick={copyToClipboard}
              disabled={copied}
            >
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
    </motion.div>
  )
}
