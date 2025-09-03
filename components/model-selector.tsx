"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Zap } from "lucide-react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

/* ------------------------------------------------------------------ */
/* Types & sample model catalogue                                     */
/* ------------------------------------------------------------------ */
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
    description: "Fast, lightweight model for everyday tasks",
    tags: ["fast", "efficient"],
  },
  {
    id: "groq-llama-3.1-70b-instant",
    name: "Llama 3.1 70B Instant",
    provider: "groq",
    description: "Large-scale model with stronger reasoning",
    tags: ["powerful", "reasoning"],
  },
  {
    id: "groq-mixtral-8x7b-32768",
    name: "Mixtral 8×7B",
    provider: "groq",
    description: "Mixture-of-experts with balanced capabilities",
    tags: ["balanced", "versatile"],
  },
  {
    id: "xai-grok-1",
    name: "Grok-1",
    provider: "xai",
    description: "Grok’s base model focused on creativity",
    tags: ["creative", "reasoning"],
  },
]

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
interface ModelSelectorProps {
  value?: string
  onChange?: (v: string) => void
  onBlur?: () => void
  name?: string // kept so react-hook-form can attach it if necessary
}

export function ModelSelector({ value = models[0].id, onChange, onBlur }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)

  const current = models.find((m) => m.id === value) ?? models[0]

  const handleSelect = (id: string) => {
    onChange?.(id)
    setOpen(false)
    onBlur?.()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          onBlur={onBlur}
          className="w-full justify-between bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
        >
          <div className="flex items-center">
            <div
              className={cn(
                "mr-2 h-5 w-5 rounded-full flex items-center justify-center",
                current.provider === "groq" ? "bg-blue-500" : "bg-purple-500",
              )}
            >
              <Zap className="h-3 w-3 text-white" />
            </div>
            {current.name}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0 bg-slate-800 border-slate-700 text-slate-200">
        <Command className="bg-transparent">
          <CommandInput
            placeholder="Search models..."
            className="border-slate-700 focus:ring-blue-500 text-slate-200"
          />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>

            <CommandGroup>
              {models.map((m) => (
                <CommandItem key={m.id} value={m.id} onSelect={() => handleSelect(m.id)} className="hover:bg-slate-700">
                  <div className="flex items-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={cn(
                        "mr-2 h-5 w-5 rounded-full flex items-center justify-center",
                        m.provider === "groq" ? "bg-blue-500" : "bg-purple-500",
                      )}
                    >
                      <Zap className="h-3 w-3 text-white" />
                    </motion.div>
                    <Check className={cn("mr-2 h-4 w-4 text-blue-500", value === m.id ? "opacity-100" : "opacity-0")} />
                  </div>

                  <div className="flex flex-col">
                    <span>{m.name}</span>
                    <span className="text-xs text-slate-400">{m.description}</span>

                    {m.tags && (
                      <div className="mt-1 flex gap-1">
                        {m.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="h-4 px-1 py-0 text-xs bg-slate-700/50 border-slate-600 text-slate-300"
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
