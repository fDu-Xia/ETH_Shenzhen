"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, TrendingUp, Users, Clock, ThumbsUp, Unlock, CheckCircle } from "lucide-react"
import { PurchaseConfirmationModal } from "./purchase-confirmation-modal"
import { VotingModal } from "./voting-modal"
import { motion, useMotionTemplate } from "motion/react"
import { useColorChange } from "@/hooks/animation/use-color-change"

interface ContentDetailSidebarProps {
  content: {
    id: string
    title: string
    author: {
      name: string
      avatar: string
      verified: boolean
    }
    price: number
    currency: string
    isUnlocked: boolean
    previewImage: string
    stats: {
      views: number
      likes: number
      comments: number
      investors: number
    }
  }
  onPurchaseComplete: () => void
}

export function ContentDetailSidebar({ content, onPurchaseComplete }: ContentDetailSidebarProps) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [showVotingModal, setShowVotingModal] = useState(false)
  const color = useColorChange()
  const borderColor = useMotionTemplate`${color}33`
  const shadowColor = useMotionTemplate`0 4px 20px ${color}20`

  const handlePurchaseClick = () => {
    if (content.isUnlocked) return
    setShowPurchaseModal(true)
  }

  const handlePurchaseComplete = () => {
    onPurchaseComplete()
    setShowPurchaseModal(false)
  }

  return (
    <>
      <div className="space-y-6">
        {/* Price Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gray-950/30 backdrop-blur-sm border-gray-800 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Wallet className="w-5 h-5" style={{ color: color.get() }} />
                </motion.div>
                内容解锁
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <motion.div
                  className="text-4xl font-bold text-white"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {content.price} <span className="text-lg" style={{ color: color.get() }}>{content.currency}</span>
                </motion.div>
                <p className="text-sm text-gray-400 mt-1">≈ $125.50 USD</p>
              </div>

              {content.isUnlocked ? (
                <motion.button
                  disabled
                  className="w-full py-3 px-4 rounded-full bg-green-600/20 border border-green-600/50 text-green-400 font-medium flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CheckCircle className="w-5 h-5" />
                  已解锁
                </motion.button>
              ) : (
                <motion.button
                  onClick={handlePurchaseClick}
                  className="w-full py-3 px-4 rounded-full text-white font-medium flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: color,
                    boxShadow: shadowColor
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Unlock className="w-5 h-5" />
                  立即解锁内容
                </motion.button>
              )}

              <div className="text-xs text-gray-500 text-center">解锁后永久访问 • 支持作者创作</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Voting Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gray-950/30 backdrop-blur-sm border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <ThumbsUp className="w-5 h-5" style={{ color: color.get() }} />
                投票支持
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-400">即使未购买也可以投票支持优质内容</p>
              <motion.button
                onClick={() => setShowVotingModal(true)}
                className="w-full py-2.5 px-4 rounded-full border text-white font-medium flex items-center justify-center gap-2"
                style={{ borderColor: borderColor }}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: `${color.get()}20`
                }}
                whileTap={{ scale: 0.98 }}
              >
                <ThumbsUp className="w-4 h-4" />
                投票支持
              </motion.button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gray-950/30 backdrop-blur-sm border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" style={{ color: color.get() }} />
                内容统计
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: content.stats.views.toLocaleString(), label: "总阅读量" },
                  { value: content.stats.investors, label: "投资者数" },
                  { value: content.stats.likes, label: "点赞数" },
                  { value: content.stats.comments, label: "评论数" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Investment Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gray-950/30 backdrop-blur-sm border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" style={{ color: color.get() }} />
                投资收益
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <motion.div
                className="space-y-3 p-3 rounded-xl bg-gray-800/20"
                style={{ borderColor: borderColor }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">当前价格</span>
                  <span className="text-white font-medium">
                    {content.price} {content.currency}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">24h 涨幅</span>
                  <motion.span
                    className="text-green-400 font-medium"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    +12.5%
                  </motion.span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">总市值</span>
                  <span className="text-white font-medium">2.25 ETH</span>
                </div>
              </motion.div>
              <div className="pt-2 border-t border-gray-800/50">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>价格每小时更新</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Purchase Modal */}
      <PurchaseConfirmationModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        content={{
          title: content.title,
          author: content.author.name,
          price: content.price,
          currency: content.currency,
          previewImage: content.previewImage,
        }}
        onConfirmPurchase={handlePurchaseComplete}
      />

      {/* Voting Modal */}
      <VotingModal isOpen={showVotingModal} onClose={() => setShowVotingModal(false)} contentTitle={content.title} />
    </>
  )
}
