"use client"
import { Toggle } from "@/components/ui/toggle"
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Code, LinkIcon } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  // Simple rich text editor using contentEditable
  // In a real app, this would use TipTap or ReactQuill
  return (
    <div className="border rounded-md overflow-hidden bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <div className="flex flex-wrap items-center gap-1 p-1 bg-muted/50 border-b">
        <Toggle size="sm" aria-label="Toggle bold">
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" aria-label="Toggle italic">
          <Italic className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-4 bg-border mx-1" />
        <Toggle size="sm" aria-label="Heading 1">
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" aria-label="Heading 2">
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-4 bg-border mx-1" />
        <Toggle size="sm" aria-label="Toggle bullet list">
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" aria-label="Toggle numbered list">
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-4 bg-border mx-1" />
        <Toggle size="sm" aria-label="Toggle blockquote">
          <Quote className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" aria-label="Toggle code">
          <Code className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" aria-label="Toggle link">
          <LinkIcon className="h-4 w-4" />
        </Toggle>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[150px] p-3 resize-y focus:outline-none bg-transparent"
      />
    </div>
  )
}
