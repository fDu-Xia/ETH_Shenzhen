"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, TrendingUp, History, Loader2, ArrowLeft, Coins } from "lucide-react"
import { motion, useMotionTemplate } from "motion/react"
import { useColorChange } from "@/hooks/animation/use-color-change"

interface VotingModalProps {
  isOpen: boolean
  onClose: () => void
  contentTitle: string
}

interface VoteHistory {
  id: string
  amount: number
  currency: string
  timestamp: string
  status: "success" | "pending"
}

export function VotingModal({ isOpen, onClose, contentTitle }: VotingModalProps) {
  const [voteAmount, setVoteAmount] = useState("")
  const [isVoting, setIsVoting] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const color = useColorChange()
  const borderColor = useMotionTemplate`${color}33`
  const shadowColor = useMotionTemplate`0 4px 20px ${color}20`

  // Mock voting history
  const [voteHistory] = useState<VoteHistory[]>([
    { id: "1", amount: 0.1, currency: "ETH", timestamp: "2024-01-15 14:30", status: "success" },
    { id: "2", amount: 0.05, currency: "ETH", timestamp: "2024-01-14 09:15", status: "success" },
    { id: "3", amount: 0.2, currency: "ETH", timestamp: "2024-01-13 16:45", status: "pending" },
  ])

  const handleVote = async () => {
    if (!voteAmount || Number.parseFloat(voteAmount) <= 0) return

    setIsVoting(true)

    // Mock voting process
    setTimeout(() => {
      setIsVoting(false)
      setVoteAmount("")
      // Show success message or update UI
      onClose()
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-950/95 backdrop-blur-xl border-gray-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <ThumbsUp className="w-5 h-5" style={{ color: color.get() }} />
            </motion.div>
            投票支持
          </DialogTitle>
        </DialogHeader>

        {!showHistory ? (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gray-950/30 backdrop-blur-sm border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Coins className="w-5 h-5 mt-0.5" style={{ color: color.get() }} />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm mb-2">{contentTitle}</h4>
                      <p className="text-gray-400 text-xs">通过投票支持优质内容，帮助作者获得更多收益</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="text-sm text-gray-400 flex items-center gap-2">
                <span>投票金额</span>
                <span style={{ color: color.get() }}>(ETH)</span>
              </label>
              <motion.input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.1"
                value={voteAmount}
                onChange={(e) => setVoteAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full bg-gray-800/50 border text-white placeholder-gray-500 focus:outline-none transition-all"
                style={{ borderColor: borderColor }}
                whileFocus={{
                  borderColor: color.get(),
                  boxShadow: shadowColor.get()
                }}
              />
              <div className="flex gap-2">
                {[0.01, 0.05, 0.1, 0.2].map((amount, index) => (
                  <motion.button
                    key={amount}
                    onClick={() => setVoteAmount(amount.toString())}
                    className="px-3 py-1.5 rounded-full border text-xs text-gray-300 hover:text-white transition-colors"
                    style={{ borderColor: borderColor }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: `${color.get()}20`
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {amount} ETH
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <div className="flex gap-3 pt-4">
              <motion.button
                onClick={() => setShowHistory(true)}
                className="flex-1 px-4 py-2.5 rounded-full border text-gray-300 font-medium flex items-center justify-center gap-2"
                style={{ borderColor: borderColor }}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: `${color.get()}10`
                }}
                whileTap={{ scale: 0.98 }}
              >
                <History className="w-4 h-4" />
                历史记录
              </motion.button>
              <motion.button
                onClick={handleVote}
                disabled={!voteAmount || Number.parseFloat(voteAmount) <= 0 || isVoting}
                className="flex-1 px-4 py-2.5 rounded-full text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: color,
                  boxShadow: shadowColor
                }}
                whileHover={{ scale: (!voteAmount || Number.parseFloat(voteAmount) <= 0 || isVoting) ? 1 : 1.02 }}
                whileTap={{ scale: (!voteAmount || Number.parseFloat(voteAmount) <= 0 || isVoting) ? 1 : 0.98 }}
              >
                {isVoting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <TrendingUp className="w-4 h-4" />
                )}
                {isVoting ? "投票中..." : "确认投票"}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <History className="w-4 h-4" style={{ color: color.get() }} />
                投票历史
              </h3>
              <motion.button
                onClick={() => setShowHistory(false)}
                className="px-3 py-1.5 rounded-full text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-4 h-4" />
                返回
              </motion.button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {voteHistory.map((vote, index) => (
                <motion.div
                  key={vote.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gray-950/30 backdrop-blur-sm border-gray-800 hover:bg-gray-950/40 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <motion.div
                            className="font-medium"
                            style={{ color: color }}
                          >
                            {vote.amount} {vote.currency}
                          </motion.div>
                          <div className="text-xs text-gray-500 mt-1">{vote.timestamp}</div>
                        </div>
                        <motion.div
                          className={`text-xs px-3 py-1 rounded-full ${
                            vote.status === "success"
                              ? "bg-green-900/20 text-green-400 border border-green-900/30"
                              : "bg-yellow-900/20 text-yellow-400 border border-yellow-900/30"
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {vote.status === "success" ? "已确认" : "处理中"}
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  )
}
