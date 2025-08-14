import { ContentCard } from "@/components/content-card"

// Mock data for content posts
const mockContent = [
  {
    id: "1",
    title: "Web3 去中心化应用开发完整指南",
    description: "从零开始学习如何构建去中心化应用，包含智能合约、前端集成和最佳实践。",
    image: "/web3-development-tutorial.png",
    price: "0.05 ETH",
    author: {
      name: "区块链开发者",
      avatar: "/developer-avatar.png",
      verified: true,
    },
    stats: {
      investors: 234,
      views: "12.5K",
      likes: 892,
    },
    tags: ["Web3", "开发", "教程"],
    trending: true,
  },
  {
    id: "2",
    title: "NFT 艺术创作与市场分析",
    description: "深入分析 NFT 艺术市场趋势，分享成功的创作和营销策略。",
    image: "/digital-nft-art.png",
    price: "0.03 ETH",
    author: {
      name: "CryptoArtist",
      avatar: "/artist-avatar.png",
      verified: true,
    },
    stats: {
      investors: 156,
      views: "8.2K",
      likes: 445,
    },
    tags: ["NFT", "艺术", "市场"],
    trending: false,
  },
  {
    id: "3",
    title: "DeFi 协议深度解析",
    description: "详细解析主流 DeFi 协议的工作原理、风险评估和投资策略。",
    image: "/defi-protocol-analysis.png",
    price: "0.08 ETH",
    author: {
      name: "DeFi 分析师",
      avatar: "/analyst-avatar.png",
      verified: true,
    },
    stats: {
      investors: 389,
      views: "15.7K",
      likes: 1203,
    },
    tags: ["DeFi", "分析", "投资"],
    trending: true,
  },
  {
    id: "4",
    title: "元宇宙项目投资指南",
    description: "全面分析元宇宙赛道的投资机会，包含项目评估框架和风险管理。",
    image: "/metaverse-investment-guide.png",
    price: "0.06 ETH",
    author: {
      name: "元宇宙投资人",
      avatar: "/investor-avatar.png",
      verified: false,
    },
    stats: {
      investors: 178,
      views: "9.8K",
      likes: 567,
    },
    tags: ["元宇宙", "投资", "指南"],
    trending: false,
  },
  {
    id: "5",
    title: "加密货币交易策略大全",
    description: "分享多年交易经验总结的策略和技巧，适合不同风险偏好的投资者。",
    image: "/crypto-trading-strategies.png",
    price: "0.04 ETH",
    author: {
      name: "交易大师",
      avatar: "/trader-avatar.png",
      verified: true,
    },
    stats: {
      investors: 445,
      views: "22.1K",
      likes: 1567,
    },
    tags: ["交易", "策略", "加密货币"],
    trending: true,
  },
  {
    id: "6",
    title: "区块链游戏开发实战",
    description: "从游戏设计到智能合约集成，完整的区块链游戏开发教程。",
    image: "/blockchain-game-development.png",
    price: "0.07 ETH",
    author: {
      name: "游戏开发者",
      avatar: "/game-developer-avatar.png",
      verified: true,
    },
    stats: {
      investors: 267,
      views: "11.3K",
      likes: 789,
    },
    tags: ["游戏", "开发", "区块链"],
    trending: false,
  },
]

export function ContentGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockContent.map((content) => (
        <ContentCard key={content.id} content={content} />
      ))}
    </div>
  )
}
