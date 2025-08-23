"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Bookmark, Share2, Eye, FileText, Image as ImageIcon, CheckCircle } from "lucide-react"
import { motion, useMotionTemplate } from "motion/react"
import { useColorAnimation } from "@/components/color-animation-provider"
import { useState } from "react"

interface UnlockedContentDisplayProps {
  content: {
    title: string
    fullContent: string
    images: string[]
    downloadUrl?: string
  }
}

export function UnlockedContentDisplay({ content }: UnlockedContentDisplayProps) {
  const color = useColorAnimation()
  const borderColor = useMotionTemplate`${color}33`
  const shadowColor = useMotionTemplate`0 4px 20px ${color}20`
  const [savedToLibrary, setSavedToLibrary] = useState(false)

  const handleDownload = () => {
    // Mock download functionality
    const element = document.createElement("a")
    element.href = content.downloadUrl || "#"
    element.download = `${content.title}.pdf`
    element.click()
  }

  const handleSave = () => {
    // Mock save functionality
    setSavedToLibrary(true)
    setTimeout(() => setSavedToLibrary(false), 3000)
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gray-950/30 backdrop-blur-sm border-gray-800 overflow-hidden">
          <motion.div
            className="h-1 w-full"
            style={{ backgroundColor: color }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1 }}
          />
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <CheckCircle className="w-5 h-5 text-green-400" />
              </motion.div>
              <span className="text-green-400 font-semibold">Content Unlocked</span>
            </div>
            <div className="flex gap-3 flex-wrap">
              <motion.button
                onClick={handleDownload}
                className="px-4 py-2 rounded-full text-white text-sm font-medium flex items-center gap-2"
                style={{
                  backgroundColor: color,
                  boxShadow: shadowColor
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                Download Content
              </motion.button>
              <motion.button
                onClick={handleSave}
                className="px-4 py-2 rounded-full border text-white text-sm font-medium flex items-center gap-2"
                style={{ borderColor: borderColor }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: `${color.get()}20`
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Bookmark className={`w-4 h-4 ${savedToLibrary ? 'fill-current' : ''}`} />
                {savedToLibrary ? 'Saved' : 'Save to Library'}
              </motion.button>
              <motion.button
                onClick={handleShare}
                className="px-4 py-2 rounded-full border text-white text-sm font-medium flex items-center gap-2"
                style={{ borderColor: borderColor }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: `${color.get()}20`
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-4 h-4" />
                Share
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Full Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-gray-950/30 backdrop-blur-sm border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5" style={{ color: color.get() }} />
              <h3 className="text-lg font-semibold text-white">Full Content</h3>
            </div>
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed whitespace-pre-line">{content.fullContent}</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* High Quality Images */}
      {content.images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" style={{ color: color.get() }} />
            <h3 className="text-lg font-semibold text-white">HD Image Resources</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="bg-gray-950/30 backdrop-blur-sm border-gray-800 overflow-hidden group">
                  <div className="relative">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Content image ${index + 1}`}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardContent className="p-3">
                    <motion.button
                      className="w-full py-2 px-4 rounded-full border text-white text-sm font-medium flex items-center justify-center gap-2"
                      style={{ borderColor: borderColor }}
                      onClick={() => {
                        const link = document.createElement("a")
                        link.href = image
                        link.download = `image-${index + 1}.jpg`
                        link.click()
                      }}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: `${color.get()}20`
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Download className="w-4 h-4" />
                      Download Image
                    </motion.button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
