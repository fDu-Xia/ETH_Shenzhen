"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Bookmark, Share2, Eye } from "lucide-react"

interface UnlockedContentDisplayProps {
  content: {
    title: string
    fullContent: string
    images: string[]
    downloadUrl?: string
  }
}

export function UnlockedContentDisplay({ content }: UnlockedContentDisplayProps) {
  const handleDownload = () => {
    // Mock download functionality
    const element = document.createElement("a")
    element.href = content.downloadUrl || "#"
    element.download = `${content.title}.pdf`
    element.click()
  }

  const handleSave = () => {
    // Mock save functionality
    console.log("Content saved to library")
  }

  const handleShare = () => {
    // Mock share functionality
    if (navigator.share) {
      navigator.share({
        title: content.title,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <Card className="bg-green-900/20 border-green-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-semibold">内容已解锁</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleDownload} size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Download className="w-4 h-4 mr-2" />
              下载内容
            </Button>
            <Button onClick={handleSave} size="sm" variant="outline">
              <Bookmark className="w-4 h-4 mr-2" />
              保存到库
            </Button>
            <Button onClick={handleShare} size="sm" variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              分享
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Full Content */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 leading-relaxed whitespace-pre-line">{content.fullContent}</div>
          </div>
        </CardContent>
      </Card>

      {/* High Quality Images */}
      {content.images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-white font-semibold">高清图片资源</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.images.map((image, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 overflow-hidden">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Content image ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      const link = document.createElement("a")
                      link.href = image
                      link.download = `image-${index + 1}.jpg`
                      link.click()
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    下载图片
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
