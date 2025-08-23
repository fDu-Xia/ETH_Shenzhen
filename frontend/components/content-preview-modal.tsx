"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, Calendar, User } from "lucide-react"

interface ContentPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  content: {
    title: string
    summary: string
    content: string
    coverImage: string
    price: number
    tags: string[]
    category: string
  }
}

export function ContentPreviewModal({ isOpen, onClose, content }: ContentPreviewModalProps) {
  // Simple markdown to HTML converter
  const markdownToHtml = (markdown: string) => {
    return markdown
      .replace(/^# (.*$)/gim, "<h1 class='text-2xl font-bold mb-4'>$1</h1>")
      .replace(/^## (.*$)/gim, "<h2 class='text-xl font-bold mb-3'>$1</h2>")
      .replace(/^### (.*$)/gim, "<h3 class='text-lg font-bold mb-2'>$1</h3>")
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/<u>(.*)<\/u>/gim, "<u>$1</u>")
      .replace(/`(.*)`/gim, "<code class='bg-purple-600/20 px-1 rounded'>$1</code>")
      .replace(/^> (.*$)/gim, "<blockquote class='border-l-4 border-purple-500 pl-4 italic'>$1</blockquote>")
      .replace(/^- (.*$)/gim, "<li class='ml-4'>• $1</li>")
      .replace(/^\d+\. (.*$)/gim, "<li class='ml-4'>$1</li>")
      .replace(/\[([^\]]+)\]$$([^)]+)$$/gim, '<a href="$2" class="text-purple-400 hover:underline">$1</a>')
      .replace(/!\[([^\]]*)\]$$([^)]+)$$/gim, '<img alt="$1" src="$2" class="max-w-full h-auto rounded-lg my-4" />')
      .replace(/\n/gim, "<br>")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#2A2550] border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Content Preview</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{content.title}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Blockchain Researcher</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{content.price} MON</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className="bg-purple-600">{content.category}</Badge>
              {content.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-purple-500/30">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Cover Image */}
          {content.coverImage && (
            <div className="w-full">
              <img
                src={content.coverImage || "/placeholder.svg"}
                alt="Cover"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Summary */}
          <div className="bg-[#1E1B3A] p-4 rounded-lg border border-purple-500/20">
            <h3 className="font-semibold mb-2">Content Summary</h3>
            <p className="text-gray-300">{content.summary}</p>
          </div>

          {/* Content */}
          <div className="bg-[#1E1B3A] p-6 rounded-lg border border-purple-500/20">
            <h3 className="font-semibold mb-4">Main Content</h3>
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: content.content ? markdownToHtml(content.content) : "<p class='text-gray-400'>No content available</p>",
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} className="border-purple-500/30 bg-transparent">
              Close Preview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
