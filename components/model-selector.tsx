"use client"

import { Check, ChevronsUpDown, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export type Model = {
  id: string
  name: string
  provider: "groq" | "xai"
  description: string
  tags?: string[]
}

export const models: Model[] = [
  {
    id: "groq-llama-3.1-8b-instant",
    name: "Llama 3.1 8B Instant",
    provider: "groq",
    description: "Fast and efficient language model for text generation",
    tags: ["fast", "efficient"],
  },
  {
    id: "groq-llama-3.1-70b-instant",
    name: "Llama 3.1 70B Instant",
    provider: "groq",
    description: "Powerful language model with strong reasoning capabilities",
    tags: ["powerful", "reasoning"],
  },
  {
    id: "groq-mixtral-8x7b-32768",
    name: "Mixtral 8x7B",
    provider: "groq",
    description: "Mixture of experts model with strong performance",
    tags: ["versatile", "balanced"],
  },
  {
    id: "xai-grok-1",
    name: "Grok-1",
    provider: "xai",
    description: "Grok's base model with strong reasoning capabilities",
    tags: ["creative", "reasoning"],
  },
]

interface ModelSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)

  const selectedModelDetails = models.find((model) => model.id === value) || models[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
        >
          <div className="flex items-center">
            {selectedModelDetails.provider === "groq" ? (
              <div className="w-5 h-5 mr-2 rounded-full bg-blue-500 flex items-center justify-center">
                <Zap className="h-3 w-3 text-white" />
              </div>
            ) : (
              <div className="w-5 h-5 mr-2 rounded-full bg-purple-500 flex items-center justify-center">
                <Zap className="h-3 w-3 text-white" />
              </div>
            )}
            {selectedModelDetails.name}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-slate-800 border-slate-700 text-slate-200">
        <Command className="bg-transparent">
          <CommandInput
            placeholder="Search models..."
            className="border-slate-700 focus:ring-blue-500 text-slate-200"
          />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            <CommandGroup>
              {models.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => {
                    onChange(model.id)
                    setOpen(false)
                  }}
                  className="hover:bg-slate-700"
                >
                  <div className="flex items-center">
                    {model.provider === "groq" ? (
                      <motion.div
                        className="w-5 h-5 mr-2 rounded-full bg-blue-500 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Zap className="h-3 w-3 text-white" />
                      </motion.div>
                    ) : (
                      <motion.div
                        className="w-5 h-5 mr-2 rounded-full bg-purple-500 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Zap className="h-3 w-3 text-white" />
                      </motion.div>
                    )}
                    <Check
                      className={cn("mr-2 h-4 w-4 text-blue-500", value === model.id ? "opacity-100" : "opacity-0")}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span>{model.name}</span>
                    <span className="text-xs text-slate-400">{model.description}</span>
                    {model.tags && (
                      <div className="flex gap-1 mt-1">
                        {model.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs py-0 px-1 h-4 bg-slate-700/50 border-slate-600 text-slate-300"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
