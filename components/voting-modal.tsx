"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, TrendingUp, History, Loader2 } from "lucide-react"

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
      <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 text-purple-400" />
            投票支持
          </DialogTitle>
        </DialogHeader>

        {!showHistory ? (
          <div className="space-y-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <h4 className="font-semibold text-white text-sm mb-2">{contentTitle}</h4>
                <p className="text-gray-400 text-xs">通过投票支持优质内容，帮助作者获得更多收益</p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <label className="text-sm text-gray-400">投票金额 (ETH)</label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.1"
                value={voteAmount}
                onChange={(e) => setVoteAmount(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <div className="flex gap-2">
                {[0.01, 0.05, 0.1, 0.2].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setVoteAmount(amount.toString())}
                    className="text-xs"
                  >
                    {amount} ETH
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowHistory(true)} className="flex-1">
                <History className="w-4 h-4 mr-2" />
                历史记录
              </Button>
              <Button
                onClick={handleVote}
                disabled={!voteAmount || Number.parseFloat(voteAmount) <= 0 || isVoting}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {isVoting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <TrendingUp className="w-4 h-4 mr-2" />}
                {isVoting ? "投票中..." : "确认投票"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">投票历史</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowHistory(false)}>
                返回
              </Button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {voteHistory.map((vote) => (
                <Card key={vote.id} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-white font-medium">
                          {vote.amount} {vote.currency}
                        </div>
                        <div className="text-xs text-gray-400">{vote.timestamp}</div>
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded ${
                          vote.status === "success"
                            ? "bg-green-900/20 text-green-400"
                            : "bg-yellow-900/20 text-yellow-400"
                        }`}
                      >
                        {vote.status === "success" ? "已确认" : "处理中"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
