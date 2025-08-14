"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, TrendingUp, Users, Clock, ThumbsUp } from "lucide-react"
import { PurchaseConfirmationModal } from "./purchase-confirmation-modal"
import { VotingModal } from "./voting-modal"

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
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-purple-400" />
              内容解锁
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {content.price} <span className="text-lg text-purple-400">{content.currency}</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">≈ $125.50 USD</p>
            </div>

            {content.isUnlocked ? (
              <Button disabled className="w-full bg-green-600 hover:bg-green-700">
                ✓ 已解锁
              </Button>
            ) : (
              <Button onClick={handlePurchaseClick} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                立即解锁内容
              </Button>
            )}

            <div className="text-xs text-gray-400 text-center">解锁后永久访问 • 支持作者创作</div>
          </CardContent>
        </Card>

        {/* Voting Card */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-purple-400" />
              投票支持
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-400">即使未购买也可以投票支持优质内容</p>
            <Button
              onClick={() => setShowVotingModal(true)}
              variant="outline"
              className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              投票支持
            </Button>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              内容统计
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{content.stats.views.toLocaleString()}</div>
                <div className="text-xs text-gray-400">总阅读量</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{content.stats.investors}</div>
                <div className="text-xs text-gray-400">投资者数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{content.stats.likes}</div>
                <div className="text-xs text-gray-400">点赞数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{content.stats.comments}</div>
                <div className="text-xs text-gray-400">评论数</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Info Card */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              投资收益
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">当前价格</span>
              <span className="text-white font-medium">
                {content.price} {content.currency}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">24h 涨幅</span>
              <span className="text-green-400 font-medium">+12.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">总市值</span>
              <span className="text-white font-medium">2.25 ETH</span>
            </div>
            <div className="pt-2 border-t border-gray-700">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>价格每小时更新</span>
              </div>
            </div>
          </CardContent>
        </Card>
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
