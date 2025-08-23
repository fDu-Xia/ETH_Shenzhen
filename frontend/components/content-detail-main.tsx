"use client"

import { Calendar, Eye, Heart, MessageCircle, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion, useMotionTemplate } from "motion/react"
import { useColorAnimation } from "@/components/color-animation-provider"

interface ContentDetailMainProps {
  content: {
    title: string
    author: {
      name: string
      avatar: string
      verified: boolean
    }
    publishedAt: string
    previewImage: string
    description: string
    isUnlocked: boolean
    stats: {
      views: number
      likes: number
      comments: number
      investors: number
    }
    tags: string[]
  }
}

export function ContentDetailMain({ content }: ContentDetailMainProps) {
  const color = useColorAnimation()
  const borderColor = useMotionTemplate`${color}33`
  const shadowColor = useMotionTemplate`0 4px 20px ${color}20`
  const bgColor = useMotionTemplate`${color}10`
  const tagBorderColor = useMotionTemplate`${color}50`

  return (
    <motion.div
      className="bg-gray-950/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-800"
      style={{
        boxShadow: shadowColor
      }}
    >
      <div className="space-y-6">
        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">{content.title}</h1>

        {/* Author Info and Publish Date */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-800/50">
          <motion.img
            src={content.author.avatar || "/placeholder.svg"}
            alt={content.author.name}
            className="w-12 h-12 rounded-full ring-2 ring-gray-800"
            whileHover={{ scale: 1.05 }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{content.author.name}</span>
              {content.author.verified && (
                <motion.div
                  className="w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: color }}
                  whileHover={{ scale: 1.2 }}
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Published on {content.publishedAt}</span>
            </div>
          </div>
        </div>

        {/* Preview Image */}
        <div className="relative overflow-hidden rounded-xl">
          <motion.img
            src={content.previewImage || "/placeholder.svg"}
            alt={content.title}
            className={`w-full h-64 lg:h-80 object-cover ${!content.isUnlocked ? "filter blur-sm" : ""}`}
            whileHover={{ scale: content.isUnlocked ? 1.02 : 1 }}
            transition={{ duration: 0.3 }}
          />
          {!content.isUnlocked && (
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: color }}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Eye className="w-8 h-8 text-white" />
                </motion.div>
                <p className="text-white font-medium">Unlock to view full content</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Content Description */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Content Summary</h2>
          <p className={`text-gray-300 leading-relaxed ${!content.isUnlocked ? "filter blur-sm select-none" : ""}`}>
            {content.description}
          </p>

          {!content.isUnlocked && (
            <motion.div
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: bgColor,
                borderColor: borderColor
              }}
            >
              <motion.p
                className="text-sm flex items-start gap-2"
                style={{ color: color }}
              >
                <span>🔒</span>
                <span>This content needs to be unlocked to view in full. After unlocking, you will get complete article content, exclusive insights and author interaction permissions.</span>
              </motion.p>
            </motion.div>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {content.tags.map((tag, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="px-3 py-1 rounded-full bg-gray-800/50 hover:bg-gray-800 border cursor-pointer inline-block"
                  style={{
                    color: color,
                    borderColor: tagBorderColor
                  }}
                >
                  #{tag}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Basic Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-800/50">
          {[
            { icon: Eye, value: content.stats.views.toLocaleString(), label: "Views" },
            { icon: Heart, value: content.stats.likes, label: "Likes" },
            { icon: MessageCircle, value: content.stats.comments, label: "Comments" },
            { icon: Users, value: content.stats.investors, label: "Investors" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              whileHover={{ x: 2 }}
            >
              <stat.icon className="w-4 h-4" />
              <span className="text-sm">{stat.value} {stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
