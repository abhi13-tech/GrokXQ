"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

export type Model = {
  id: string
  name: string
  provider: "groq" | "xai"
  description: string
}

export const models: Model[] = [
  {
    id: "groq-llama-3.1-8b-instant",
    name: "Llama 3.1 8B Instant",
    provider: "groq",
    description: "Fast and efficient language model for text generation",
  },
  {
    id: "groq-llama-3.1-70b-instant",
    name: "Llama 3.1 70B Instant",
    provider: "groq",
    description: "Powerful language model with strong reasoning capabilities",
  },
  {
    id: "groq-mixtral-8x7b-32768",
    name: "Mixtral 8x7B",
    provider: "groq",
    description: "Mixture of experts model with strong performance",
  },
  {
    id: "xai-grok-1",
    name: "Grok-1",
    provider: "xai",
    description: "Grok's base model with strong reasoning capabilities",
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
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedModelDetails.name}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search models..." />
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
                >
                  <Check className={cn("mr-2 h-4 w-4", value === model.id ? "opacity-100" : "opacity-0")} />
                  <div className="flex flex-col">
                    <span>{model.name}</span>
                    <span className="text-xs text-muted-foreground">{model.description}</span>
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
