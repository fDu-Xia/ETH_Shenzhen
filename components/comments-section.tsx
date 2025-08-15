"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Heart, Reply, Send } from "lucide-react"
import { motion, useMotionTemplate } from "motion/react"
import { useColorAnimation } from "@/components/color-animation-provider"
import { useState } from "react"

interface CommentsSectionProps {
  contentId: string
}

// Mock comments data
const mockComments = [
  {
    id: "1",
    author: {
      name: "加密投资者",
      avatar: "/crypto-investor.png",
      verified: false,
    },
    content: "非常有见地的分析！Web3社交网络确实是未来的趋势，期待看到更多深度内容。",
    timestamp: "2小时前",
    likes: 12,
    replies: 3,
  },
  {
    id: "2",
    author: {
      name: "区块链开发者",
      avatar: "/blockchain-developer.png",
      verified: true,
    },
    content: "技术架构部分讲得很清楚，对我们团队的项目很有帮助。已经解锁支持作者！",
    timestamp: "5小时前",
    likes: 8,
    replies: 1,
  },
  {
    id: "3",
    author: {
      name: "Web3爱好者",
      avatar: "/web3-enthusiast.png",
      verified: false,
    },
    content: "想了解更多关于代币经济学的内容，作者有计划出续集吗？",
    timestamp: "1天前",
    likes: 5,
    replies: 0,
  },
]

export function CommentsSection({ contentId }: CommentsSectionProps) {
  const color = useColorAnimation()
  const borderColor = useMotionTemplate`${color}33`
  const shadowColor = useMotionTemplate`0 4px 20px ${color}20`
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set())

  const toggleLike = (commentId: string) => {
    setLikedComments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-950/30 backdrop-blur-sm border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5" style={{ color: color.get() }} />
            评论区 ({mockComments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Comment Input */}
          <motion.div
            className="rounded-xl p-4 border bg-gray-800/20"
            style={{ borderColor: borderColor }}
            whileHover={{ boxShadow: shadowColor.get() }}
          >
            <textarea
              placeholder="发表您的看法..."
              className="w-full bg-transparent text-gray-300 placeholder-gray-500 resize-none outline-none mb-3"
              rows={3}
              disabled
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">需要解锁内容后才能评论</span>
              <motion.button
                disabled
                className="px-4 py-2 rounded-full text-white text-sm font-medium flex items-center gap-2 opacity-50 cursor-not-allowed"
                style={{ backgroundColor: color }}
              >
                <Send className="w-4 h-4" />
                发布评论
              </motion.button>
            </div>
          </motion.div>

          {/* Comments List */}
          <div className="space-y-4">
            {mockComments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl p-4 bg-gray-800/20 hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <motion.img
                    src={comment.author.avatar || "/placeholder.svg"}
                    alt={comment.author.name}
                    className="w-10 h-10 rounded-full ring-2 ring-gray-800"
                    whileHover={{ scale: 1.1 }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-white text-sm">{comment.author.name}</span>
                      {comment.author.verified && (
                        <motion.div
                          className="w-3 h-3 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: color }}
                          whileHover={{ scale: 1.3 }}
                        >
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </motion.div>
                      )}
                      <span className="text-xs text-gray-500">• {comment.timestamp}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3 leading-relaxed">{comment.content}</p>
                    <div className="flex items-center gap-4">
                      <motion.button
                        onClick={() => toggleLike(comment.id)}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${
                          likedComments.has(comment.id) ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${likedComments.has(comment.id) ? 'fill-current' : ''}`}
                        />
                        <span>{comment.likes + (likedComments.has(comment.id) ? 1 : 0)}</span>
                      </motion.button>
                      <motion.button
                        className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Reply className="w-3.5 h-3.5" />
                        <span>回复 ({comment.replies})</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More Comments */}
          <div className="text-center pt-4">
            <motion.button
              className="px-6 py-2.5 rounded-full border text-gray-400 hover:text-white text-sm font-medium transition-colors"
              style={{ borderColor: borderColor }}
              whileHover={{
                scale: 1.05,
                backgroundColor: `${color.get()}10`
              }}
              whileTap={{ scale: 0.95 }}
            >
              加载更多评论
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
