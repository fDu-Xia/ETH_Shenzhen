"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, TrendingUp, History, Loader2, ArrowLeft, Coins, AlertCircle, Zap } from "lucide-react"
import { motion, useMotionTemplate } from "motion/react"
import { useColorAnimation } from "@/components/color-animation-provider"
import { createPublicClient, createWalletClient, custom, formatEther, parseEther, getContract } from 'viem'
import { sepolia as monadTestnet } from 'viem/chains'

// ContentCoin合约ABI
const CONTENT_COIN_ABI = [
    {
        inputs: [{ name: 'rating', type: 'uint256' }],
        name: 'rateContent',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'userRatings',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'calculatePrice',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    }
] as const

interface VotingModalProps {
    isOpen: boolean
    onClose: () => void
    contentTitle: string
    contractAddress?: string
    walletAddress?: string | null
}

interface VoteHistory {
    id: string
    tokensSupported: number
    bonusCost: string
    timestamp: string
    status: "success" | "pending"
}

export function VotingModal({ isOpen, onClose, contentTitle, contractAddress, walletAddress }: VotingModalProps) {
    const [supportAmount, setSupportAmount] = useState("")
    const [isVoting, setIsVoting] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const [bonusCost, setBonusCost] = useState<string>("0")
    const [hasTokens, setHasTokens] = useState(false)
    const [hasRated, setHasRated] = useState(false)
    const [userSupport, setUserSupport] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const color = useColorAnimation()
    const borderColor = useMotionTemplate`${color}33`
    const shadowColor = useMotionTemplate`0 4px 20px ${color}20`

    // 创建公共客户端
    const publicClient = createPublicClient({
        chain: monadTestnet,
        transport: custom(typeof window !== 'undefined' ? window.ethereum : undefined)
    })

    // Mock voting history
    const [voteHistory] = useState<VoteHistory[]>([
        { id: "1", tokensSupported: 100, bonusCost: "0.1", timestamp: "2024-01-15 14:30", status: "success" },
        { id: "2", tokensSupported: 50, bonusCost: "0.05", timestamp: "2024-01-14 09:15", status: "success" },
        { id: "3", tokensSupported: 200, bonusCost: "0.2", timestamp: "2024-01-13 16:45", status: "pending" },
    ])

    useEffect(() => {
        if (isOpen && contractAddress && walletAddress) {
            checkUserStatus()
        }
    }, [isOpen, contractAddress, walletAddress])

    useEffect(() => {
        if (supportAmount && parseFloat(supportAmount) > 0 && contractAddress) {
            calculateBonusCost()
        } else {
            setBonusCost("0")
        }
    }, [supportAmount, contractAddress])

    const checkUserStatus = async () => {
        if (!contractAddress || !walletAddress || !publicClient) return

        try {
            setIsLoading(true)
            const contract = getContract({
                address: contractAddress as `0x${string}`,
                abi: CONTENT_COIN_ABI,
                client: publicClient
            })

            // 检查用户是否持有代币
            const balance = await contract.read.balanceOf([walletAddress as `0x${string}`])
            setHasTokens(Number(balance) > 0)

            // 检查用户是否已经支持过
            const rating = await contract.read.userRatings([walletAddress as `0x${string}`])
            setUserSupport(Number(rating))
            setHasRated(Number(rating) > 0)

        } catch (error: any) {
            console.error('Failed to check user status:', error)
            setError('Failed to check user status')
        } finally {
            setIsLoading(false)
        }
    }

    const calculateBonusCost = async () => {
        if (!contractAddress || !publicClient || !supportAmount) return

        const tokens = parseInt(supportAmount)
        if (tokens <= 0) return

        try {
            const contract = getContract({
                address: contractAddress as `0x${string}`,
                abi: CONTENT_COIN_ABI,
                client: publicClient
            })

            // 获取当前总供应量
            const totalSupply = await contract.read.totalSupply()
            const currentSupply = Number(totalSupply) / Math.pow(10, 18)

            // 计算bonus代币成本 - 模拟合约逻辑
            let totalCost = BigInt(0)
            for (let i = 0; i < tokens; i++) {
                // 简化计算：price = sqrt(supply + i) / 1000
                const supply = Math.floor(currentSupply + i)
                const sqrtSupply = Math.floor(Math.sqrt(supply))
                const priceWei = Math.floor(sqrtSupply / 1000) // 转换为wei
                totalCost += BigInt(priceWei)
            }

            setBonusCost(formatEther(totalCost))

        } catch (error: any) {
            console.error('Failed to calculate cost:', error)
            setBonusCost("0")
        }
    }

    const handleVote = async () => {
        if (!contractAddress || !walletAddress) return

        const tokens = supportAmount ? parseInt(supportAmount) : 0

        try {
            setIsVoting(true)
            setError(null)

            // 创建钱包客户端
            const walletClient = createWalletClient({
                chain: monadTestnet,
                transport: custom(window.ethereum)
            })

            const contract = getContract({
                address: contractAddress as `0x${string}`,
                abi: CONTENT_COIN_ABI,
                client: { public: publicClient, wallet: walletClient }
            })

            // 计算需要支付的费用
            const valueWei = tokens > 0 ? parseEther(bonusCost) : BigInt(0)

            // 调用rateContent函数
            const hash = await contract.write.rateContent([BigInt(tokens)], {
                account: walletAddress as `0x${string}`,
                value: valueWei,
                gas: BigInt(300000)
            })

            // 等待交易确认
            await publicClient.waitForTransactionReceipt({ hash })

            // 更新状态
            setHasRated(true)
            setUserSupport(tokens)
            setSupportAmount("")

            // 关闭模态框
            onClose()

        } catch (error: any) {
            console.error('Voting failed:', error)
            if (error.code === 4001) {
                setError('Transaction cancelled by user')
            } else if (error.shortMessage?.includes('Must own tokens')) {
                setError('Must hold tokens to support')
            } else if (error.shortMessage?.includes('Already rated')) {
                setError('You have already supported')
            } else {
                setError('Support failed: ' + (error.shortMessage || error.message))
            }
        } finally {
            setIsVoting(false)
        }
    }

    const supportTokens = supportAmount ? parseInt(supportAmount) : 0
    const canVote = hasTokens && !hasRated && walletAddress && contractAddress

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
                        Support Content
                    </DialogTitle>
                </DialogHeader>

                {!showHistory ? (
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {/* 状态检查 */}
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin" style={{ color: color.get() }} />
                                <span className="ml-2 text-gray-400">Checking user status...</span>
                            </div>
                        ) : (
                            <>
                                {/* 用户状态显示 */}
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
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-gray-400">
                                                            Holding tokens: {hasTokens ? "✅" : "❌"}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            Already supported: {hasRated ? `✅ (${userSupport} tokens)` : "❌"}
                                                        </p>
                                                    </div>
                                                    {!hasTokens && (
                                                        <p className="text-xs text-orange-400 mt-2">
                                                            💡 Need to purchase content unlock tokens first to support
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* 错误信息 */}
                                {error && (
                                    <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-900/30 rounded-lg">
                                        <AlertCircle className="w-4 h-4 text-red-400" />
                                        <span className="text-red-400 text-sm">{error}</span>
                                    </div>
                                )}

                                {/* 支持数量输入 */}
                                {!hasRated && hasTokens && (
                                    <motion.div
                                        className="space-y-3"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 flex items-center gap-2">
                                                <Zap className="w-4 h-4" />
                                                Support Token Amount
                                            </label>
                                            <motion.input
                                                type="number"
                                                step="1"
                                                min="0"
                                                placeholder="Enter number of tokens to get (0 = free support)"
                                                value={supportAmount}
                                                onChange={(e) => setSupportAmount(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-full bg-gray-800/50 border text-white placeholder-gray-500 focus:outline-none transition-all text-sm"
                                                style={{ borderColor: borderColor }}
                                                whileFocus={{
                                                    borderColor: color.get(),
                                                    boxShadow: shadowColor.get()
                                                }}
                                            />
                                        </div>

                                        {/* 快速选择按钮 */}
                                        <div className="flex gap-2 flex-wrap">
                                            {[0, 10, 50, 100, 500].map((amount, index) => (
                                                <motion.button
                                                    key={amount}
                                                    onClick={() => setSupportAmount(amount.toString())}
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
                                                    {amount === 0 ? "Free Support" : `${amount} tokens`}
                                                </motion.button>
                                            ))}
                                        </div>

                                        {/* 费用预览 */}
                                        {supportTokens >= 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="p-3 bg-gray-800/30 rounded-lg space-y-2"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-400">Support Method:</span>
                                                    <span className="text-white">
                            {supportTokens === 0 ? "Free Support" : `Buy ${supportTokens} tokens`}
                          </span>
                                                </div>
                                                {supportTokens > 0 && (
                                                    <>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm text-gray-400">Cost:</span>
                                                            <span style={{ color: color.get() }}>
                                {bonusCost} ETH
                              </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm text-gray-400">Get Tokens:</span>
                                                            <span className="text-white">
                                {supportTokens} tokens
                              </span>
                                                        </div>
                                                    </>
                                                )}
                                                <div className="text-xs text-gray-500 pt-1 border-t border-gray-700">
                                                    💡 The more you support, the more tokens you get, and the more future revenue share
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}

                                {/* 按钮区域 */}
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
                                        History
                                    </motion.button>

                                    <motion.button
                                        onClick={handleVote}
                                        disabled={!canVote || isVoting}
                                        className="flex-1 px-4 py-2.5 rounded-full text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            backgroundColor: color,
                                            boxShadow: shadowColor
                                        }}
                                        whileHover={{ scale: (!canVote || isVoting) ? 1 : 1.02 }}
                                        whileTap={{ scale: (!canVote || isVoting) ? 1 : 0.98 }}
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
                                        {isVoting ? "Supporting..." : hasRated ? "Supported" : !hasTokens ? "Need to hold tokens" : "Confirm Support"}
                                    </motion.button>
                                </div>
                            </>
                        )}
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
                                Support History
                            </h3>
                            <motion.button
                                onClick={() => setShowHistory(false)}
                                className="px-3 py-1.5 rounded-full text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
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
                                                        className="font-medium flex items-center gap-2"
                                                        style={{ color: color }}
                                                    >
                                                        <Coins className="w-4 h-4" />
                                                        Supported {vote.tokensSupported} tokens
                                                    </motion.div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Cost: {vote.bonusCost} ETH • {vote.timestamp}
                                                    </div>
                                                </div>
                                                <motion.div
                                                    className={`text-xs px-3 py-1 rounded-full ${
                                                        vote.status === "success"
                                                            ? "bg-green-900/20 text-green-400 border border-green-900/30"
                                                            : "bg-yellow-900/20 text-yellow-400 border border-yellow-900/30"
                                                    }`}
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    {vote.status === "success" ? "Confirmed" : "Processing"}
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