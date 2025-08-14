"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, AlertCircle, CheckCircle, Loader2 } from "lucide-react"

interface PurchaseConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  content: {
    title: string
    author: string
    price: number
    currency: string
    previewImage: string
  }
  onConfirmPurchase: () => void
}

type TransactionStatus = "idle" | "processing" | "success" | "failed"

export function PurchaseConfirmationModal({
  isOpen,
  onClose,
  content,
  onConfirmPurchase,
}: PurchaseConfirmationModalProps) {
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>("idle")
  const [walletBalance] = useState(5.2) // Mock wallet balance

  const handlePurchase = async () => {
    setTransactionStatus("processing")

    // Mock transaction processing
    setTimeout(() => {
      if (Math.random() > 0.1) {
        // 90% success rate
        setTransactionStatus("success")
        setTimeout(() => {
          onConfirmPurchase()
          onClose()
          setTransactionStatus("idle")
        }, 2000)
      } else {
        setTransactionStatus("failed")
        setTimeout(() => {
          setTransactionStatus("idle")
        }, 3000)
      }
    }, 2000)
  }

  const getStatusContent = () => {
    switch (transactionStatus) {
      case "processing":
        return (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">处理交易中...</h3>
            <p className="text-gray-400">请稍候，正在确认您的购买</p>
          </div>
        )
      case "success":
        return (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">购买成功！</h3>
            <p className="text-gray-400">内容已解锁，正在跳转...</p>
          </div>
        )
      case "failed":
        return (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">交易失败</h3>
            <p className="text-gray-400 mb-4">请检查您的钱包余额或网络连接</p>
            <Button onClick={() => setTransactionStatus("idle")} variant="outline">
              重试
            </Button>
          </div>
        )
      default:
        return (
          <>
            <div className="space-y-4">
              {/* Content Summary */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={content.previewImage || "/placeholder.svg"}
                      alt={content.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm">{content.title}</h4>
                      <p className="text-gray-400 text-xs mt-1">作者：{content.author}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price and Balance */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">内容价格</span>
                  <span className="text-white font-semibold">
                    {content.price} {content.currency}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">钱包余额</span>
                  <span
                    className={`font-semibold ${walletBalance >= content.price ? "text-green-400" : "text-red-400"}`}
                  >
                    {walletBalance} {content.currency}
                  </span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">总计</span>
                    <span className="text-purple-400 font-bold text-lg">
                      {content.price} {content.currency}
                    </span>
                  </div>
                </div>
              </div>

              {walletBalance < content.price && (
                <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm">余额不足，请先充值</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                取消
              </Button>
              <Button
                onClick={handlePurchase}
                disabled={walletBalance < content.price}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <Wallet className="w-4 h-4 mr-2" />
                确认购买
              </Button>
            </div>
          </>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">购买确认</DialogTitle>
        </DialogHeader>
        {getStatusContent()}
      </DialogContent>
    </Dialog>
  )
}
