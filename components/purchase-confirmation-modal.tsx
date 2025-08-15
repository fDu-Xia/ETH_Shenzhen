"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, AlertCircle, CheckCircle, Loader2, ShieldCheck } from "lucide-react"
import { motion, useMotionTemplate } from "motion/react"
import { useColorAnimation } from "@/components/color-animation-provider"

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
  const color = useColorAnimation()
  const borderColor = useMotionTemplate`${color}33`
  const shadowColor = useMotionTemplate`0 4px 20px ${color}20`
  const bgColor = useMotionTemplate`${color}10`

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
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-12 h-12 mx-auto mb-4" style={{ color: color.get() }} />
            </motion.div>
            <h3 className="text-lg font-semibold text-white mb-2">处理交易中...</h3>
            <p className="text-gray-400">请稍候，正在确认您的购买</p>
          </motion.div>
        )
      case "success":
        return (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-lg font-semibold text-white mb-2">购买成功！</h3>
            <p className="text-gray-400">内容已解锁，正在跳转...</p>
          </motion.div>
        )
      case "failed":
        return (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
            >
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-lg font-semibold text-white mb-2">交易失败</h3>
            <p className="text-gray-400 mb-4">请检查您的钱包余额或网络连接</p>
            <motion.button
              onClick={() => setTransactionStatus("idle")}
              className="px-4 py-2 rounded-full border border-red-400 text-red-400 hover:bg-red-400/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              重试
            </motion.button>
          </motion.div>
        )
      default:
        return (
          <>
            <div className="space-y-4">
              {/* Content Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-gray-950/30 backdrop-blur-sm border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <motion.img
                        src={content.previewImage || "/placeholder.svg"}
                        alt={content.title}
                        className="w-16 h-16 rounded-lg object-cover"
                        whileHover={{ scale: 1.05 }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm">{content.title}</h4>
                        <p className="text-gray-400 text-xs mt-1">作者：{content.author}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Price and Balance */}
              <motion.div
                className="space-y-3 p-4 rounded-xl bg-gray-950/30 border"
                style={{ borderColor: borderColor }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">内容价格</span>
                  <motion.span
                    className="text-white font-semibold"
                    style={{ color: color }}
                  >
                    {content.price} {content.currency}
                  </motion.span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">钱包余额</span>
                  <span
                    className={`font-semibold ${walletBalance >= content.price ? "text-green-400" : "text-red-400"}`}
                  >
                    {walletBalance} {content.currency}
                  </span>
                </div>
                <div className="border-t border-gray-800/50 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">总计</span>
                    <motion.span
                      className="font-bold text-lg"
                      style={{ color: color }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {content.price} {content.currency}
                    </motion.span>
                  </div>
                </div>
              </motion.div>

              {/* Security Notice */}
              <motion.div
                className="flex items-center gap-2 p-3 rounded-xl border"
                style={{
                  backgroundColor: bgColor,
                  borderColor: borderColor
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <ShieldCheck className="w-4 h-4" style={{ color: color.get() }} />
                <span className="text-gray-300 text-sm">安全交易，智能合约保障</span>
              </motion.div>

              {walletBalance < content.price && (
                <motion.div
                  className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700 rounded-xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm">余额不足，请先充值</span>
                </motion.div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <motion.button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-full border text-gray-300 font-medium"
                style={{ borderColor: borderColor }}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: `${color.get()}10`
                }}
                whileTap={{ scale: 0.98 }}
              >
                取消
              </motion.button>
              <motion.button
                onClick={handlePurchase}
                disabled={walletBalance < content.price}
                className="flex-1 px-4 py-2.5 rounded-full text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: color,
                  boxShadow: shadowColor
                }}
                whileHover={{ scale: walletBalance >= content.price ? 1.02 : 1 }}
                whileTap={{ scale: walletBalance >= content.price ? 0.98 : 1 }}
              >
                <Wallet className="w-4 h-4" />
                确认购买
              </motion.button>
            </div>
          </>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-950/95 backdrop-blur-xl border-gray-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Wallet className="w-5 h-5" style={{ color: color.get() }} />
            </motion.div>
            购买确认
          </DialogTitle>
        </DialogHeader>
        {getStatusContent()}
      </DialogContent>
    </Dialog>
  )
}
