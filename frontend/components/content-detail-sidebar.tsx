"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, TrendingUp, Users, Clock, ThumbsUp, Unlock, CheckCircle, Loader2 } from "lucide-react"
import { PurchaseConfirmationModal } from "./purchase-confirmation-modal"
import { VotingModal } from "./voting-modal"
import { motion, useMotionTemplate } from "motion/react"
import { useColorAnimation } from "@/components/color-animation-provider"
import { createPublicClient, createWalletClient, custom, formatEther, parseEther, getContract } from 'viem'
import { sepolia as monadTestnet } from 'viem/chains'

// ContentCoin合约ABI
const CONTENT_COIN_ABI = [
    {
        inputs: [{ name: 'amount', type: 'uint256' }],
        name: 'mintTokens',
        outputs: [],
        stateMutability: 'payable',
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
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getContentInfo',
        outputs: [
            { name: '', type: 'string' },
            { name: '', type: 'address' },
            { name: '', type: 'uint256' },
            { name: '', type: 'uint256' },
            { name: '', type: 'uint256' },
            { name: '', type: 'uint256' }
        ],
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
        contractAddress: string // 添加合约地址
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
    const [isLoading, setIsLoading] = useState(false)
    const [currentPrice, setCurrentPrice] = useState<string | null>(null)
    const [priceInUSD, setPriceInUSD] = useState<string | null>(null)
    const [walletAddress, setWalletAddress] = useState<string | null>(null)
    const [userTokenBalance, setUserTokenBalance] = useState<string>("0")
    const [error, setError] = useState<string | null>(null)

    const color = useColorAnimation()
    const borderColor = useMotionTemplate`${color}33`
    const shadowColor = useMotionTemplate`0 4px 20px ${color}20`

    // 创建公共客户端用于读取操作
    const publicClient = createPublicClient({
        chain: monadTestnet,
        transport: custom(typeof window !== 'undefined' ? window.ethereum : undefined)
    })

    // 检查用户是否已连接钱包
    useEffect(() => {
        checkWalletConnection()
    }, [])

    // 获取当前价格
    useEffect(() => {
        if (content.contractAddress) {
            fetchCurrentPrice()
            fetchUserBalance()
        }
    }, [content.contractAddress, walletAddress])

    const checkWalletConnection = async () => {
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' })
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0])
                }
            } catch (error) {
                console.error('Failed to check wallet connection:', error)
            }
        }
    }

    const connectWallet = async () => {
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                setIsLoading(true)
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
                setWalletAddress(accounts[0])
                setError(null)
            } catch (error: any) {
                setError('Failed to connect wallet: ' + error.message)
            } finally {
                setIsLoading(false)
            }
        } else {
            setError('Please install MetaMask wallet')
        }
    }

    const fetchCurrentPrice = async () => {
        if (!content.contractAddress || !publicClient) return

        try {
            const contract = getContract({
                address: content.contractAddress as `0x${string}`,
                abi: CONTENT_COIN_ABI,
                client: publicClient
            })

            const priceWei = await contract.read.calculatePrice()
            const priceEth = formatEther(priceWei)
            setCurrentPrice(priceEth)

            // 假设ETH价格为$2000（实际应该从API获取）
            const usdPrice = (parseFloat(priceEth) * 2000).toFixed(2)
            setPriceInUSD(usdPrice)

        } catch (error: any) {
            console.error('Failed to get price:', error)
            setError('Failed to get price')
        }
    }

    const fetchUserBalance = async () => {
        if (!content.contractAddress || !walletAddress || !publicClient) return

        try {
            const contract = getContract({
                address: content.contractAddress as `0x${string}`,
                abi: CONTENT_COIN_ABI,
                client: publicClient
            })

            const balance = await contract.read.balanceOf([walletAddress as `0x${string}`])
            const balanceFormatted = formatEther(balance)
            setUserTokenBalance(balanceFormatted)

        } catch (error: any) {
            console.error('Failed to get balance:', error)
        }
    }

    const handlePurchaseClick = async () => {
        if (parseFloat(userTokenBalance) > 0) {
            // 用户已经拥有代币，直接解锁
            onPurchaseComplete()
            return
        }

        if (!walletAddress) {
            await connectWallet()
            return
        }

        // 开始购买流程
        await purchaseTokens()
    }

    const purchaseTokens = async () => {
        if (!content.contractAddress || !walletAddress) return

        try {
            setIsLoading(true)
            setError(null)

            // 创建钱包客户端用于写入操作
            const walletClient = createWalletClient({
                chain: monadTestnet,
                transport: custom(window.ethereum)
            })

            const contract = getContract({
                address: content.contractAddress as `0x${string}`,
                abi: CONTENT_COIN_ABI,
                client: { public: publicClient, wallet: walletClient }
            })

            // 获取当前价格
            const priceWei = await contract.read.calculatePrice()

            // 购买1个代币的数量
            const tokensToMint = BigInt(1)

            // 调用mintTokens函数
            const hash = await contract.write.mintTokens([tokensToMint], {
                account: walletAddress as `0x${string}`,
                value: priceWei * tokensToMint,
                gas: BigInt(300000)
            })

            // 等待交易确认
            await publicClient.waitForTransactionReceipt({ hash })

            // 更新用户余额
            await fetchUserBalance()

            // 调用购买完成回调
            onPurchaseComplete()

            setError(null)
        } catch (error: any) {
            console.error('Purchase failed:', error)
            if (error.code === 4001) {
                setError('Transaction cancelled by user')
            } else if (error.code === -32603) {
                setError('Transaction failed, please check if you have sufficient balance')
            } else {
                setError('Purchase failed: ' + (error.shortMessage || error.message))
            }
        } finally {
            setIsLoading(false)
        }
    }

    const isUnlocked = parseFloat(userTokenBalance) > 0

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
                                Content Unlock
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
                                    {currentPrice ? parseFloat(currentPrice).toFixed(6) : 'Loading...'}
                                    <span className="text-lg" style={{ color: color.get() }}>ETH</span>
                                </motion.div>
                                <p className="text-sm text-gray-400 mt-1">
                                    {priceInUSD ? `≈ $${priceInUSD} USD` : 'Calculating...'}
                                </p>
                            </div>

                            {error && (
                                <div className="text-red-400 text-sm text-center p-2 bg-red-900/20 rounded">
                                    {error}
                                </div>
                            )}

                            {isUnlocked ? (
                                <motion.button
                                    disabled
                                    className="w-full py-3 px-4 rounded-full bg-green-600/20 border border-green-600/50 text-green-400 font-medium flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Unlocked (holding {parseFloat(userTokenBalance).toFixed(2)} tokens)
                                </motion.button>
                            ) : (
                                <motion.button
                                    onClick={handlePurchaseClick}
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 rounded-full text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                    style={{
                                        backgroundColor: color,
                                        boxShadow: shadowColor
                                    }}
                                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Unlock className="w-5 h-5" />
                                    )}
                                    {isLoading ? 'Processing...' : !walletAddress ? 'Connect Wallet' : 'Unlock Content Now'}
                                </motion.button>
                            )}

                            <div className="text-xs text-gray-500 text-center">
                                {!walletAddress ? 'Please connect wallet first' : 'Permanent access after unlock • Support creators'}
                            </div>
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
                                Vote Support
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-400">
                                {isUnlocked ? 'Token holders can vote and rate' : 'Purchase to rate content'}
                            </p>
                            <motion.button
                                onClick={() => setShowVotingModal(true)}
                                disabled={!isUnlocked}
                                className="w-full py-2.5 px-4 rounded-full border text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ borderColor: borderColor }}
                                whileHover={{
                                    scale: isUnlocked ? 1.02 : 1,
                                    backgroundColor: isUnlocked ? `${color.get()}20` : undefined
                                }}
                                whileTap={{ scale: isUnlocked ? 0.98 : 1 }}
                            >
                                <ThumbsUp className="w-4 h-4" />
                                Vote Support
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
                                Content Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { value: content.stats.views.toLocaleString(), label: "Total Views" },
                                    { value: content.stats.investors, label: "Investors" },
                                    { value: content.stats.likes, label: "Likes" },
                                    { value: content.stats.comments, label: "Comments" }
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
                                Investment Returns
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <motion.div
                                className="space-y-3 p-3 rounded-xl bg-gray-800/20"
                                style={{ borderColor: borderColor }}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Current Price</span>
                                    <span className="text-white font-medium">
                    {currentPrice ? `${parseFloat(currentPrice).toFixed(6)} ETH` : 'Loading...'}
                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">24h Change</span>
                                    <motion.span
                                        className="text-green-400 font-medium"
                                        animate={{ opacity: [1, 0.5, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        +12.5%
                                    </motion.span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">My Holdings</span>
                                    <span className="text-white font-medium">
                    {parseFloat(userTokenBalance).toFixed(2)} tokens
                  </span>
                                </div>
                            </motion.div>
                            <div className="pt-2 border-t border-gray-800/50">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    <span>Real-time price updates</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Voting Modal */}
            <VotingModal
                isOpen={showVotingModal}
                onClose={() => setShowVotingModal(false)}
                contentTitle={content.title}
                contractAddress={content.contractAddress}
                walletAddress={walletAddress}
            />
        </>
    )
}