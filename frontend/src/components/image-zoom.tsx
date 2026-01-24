"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface ImageZoomProps {
  src: string | null
  isOpen: boolean
  onClose: () => void
  alt?: string
}

export function ImageZoom({ src, isOpen, onClose, alt }: ImageZoomProps) {
  if (!src) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent shadow-none flex items-center justify-center">
        <DialogTitle className="sr-only">Phóng to hình ảnh</DialogTitle>
        <div className="relative group">
          <img
            src={src || "/placeholder.svg"}
            alt={alt || "Phóng to ảnh"}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 bg-white text-black p-2 rounded-full shadow-lg hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
