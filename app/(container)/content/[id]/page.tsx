"use client";

import { useState, use } from "react";
import { ContentDetailMain } from "@/components/content-detail-main";
import { ContentDetailSidebar } from "@/components/content-detail-sidebar";
import { CommentsSection } from "@/components/comments-section";
import { ContentDataCharts } from "@/components/content-data-charts";
import { UnlockedContentDisplay } from "@/components/unlocked-content-display";

// Mock data - in real app this would come from API
const mockContent = {
  id: "1",
  title: "Web3去中心化社交网络的未来发展趋势",
  author: {
    name: "区块链研究员",
    avatar: "/blockchain-researcher.png",
    verified: true,
  },
  publishedAt: "2024-01-15",
  previewImage: "/web3-social-network-future.png",
  description:
    "深入分析Web3去中心化社交网络的技术架构、商业模式和未来发展方向。本文将探讨当前主流去中心化社交平台的优势与挑战，以及如何通过代币经济学实现可持续发展。",
  price: 0.05,
  currency: "ETH",
  isUnlocked: false,
  stats: {
    views: 1234,
    likes: 89,
    comments: 23,
    investors: 45,
  },
  tags: ["Web3", "去中心化", "社交网络", "区块链"],
  fullContent: `# Web3去中心化社交网络的未来发展趋势

## 引言

Web3去中心化社交网络正在重新定义我们对社交媒体的理解。与传统的中心化平台不同，去中心化社交网络将数据所有权归还给用户，通过区块链技术确保内容的不可篡改性和用户隐私的保护。

## 技术架构分析

### 1. 分布式存储系统
去中心化社交网络采用IPFS（InterPlanetary File System）等分布式存储协议，确保内容的永久性和可访问性。用户发布的内容不再依赖于单一服务器，而是分布在全球节点网络中。

### 2. 智能合约治理
通过智能合约实现平台治理，包括内容审核、用户权限管理和代币分发机制。这种去中心化治理模式让社区成员能够参与平台决策。

### 3. 身份验证系统
基于区块链的身份验证系统，用户通过钱包地址建立数字身份，无需传统的用户名密码注册流程。

## 商业模式创新

### 代币经济学
- **创作者激励**：优质内容创作者通过代币奖励获得收益
- **社区治理**：代币持有者参与平台治理决策
- **价值捕获**：平台价值通过代币升值回馈给社区

### NFT集成
内容可以铸造为NFT，创作者能够通过版权交易获得持续收益，同时保护知识产权。

## 发展挑战与机遇

### 挑战
1. **用户体验**：当前去中心化应用的用户体验仍需改善
2. **扩展性**：区块链网络的处理能力限制
3. **监管合规**：各国监管政策的不确定性

### 机遇
1. **隐私保护**：用户对数据隐私的重视程度不断提高
2. **创作者经济**：直接的创作者-用户价值交换
3. **全球化**：无国界的内容分发和社交互动

## 未来展望

Web3去中心化社交网络将在以下方面实现突破：

1. **跨链互操作性**：不同区块链网络间的无缝连接
2. **AI集成**：智能内容推荐和自动化治理
3. **元宇宙融合**：虚拟世界中的社交体验

## 结论

去中心化社交网络代表了互联网发展的下一个阶段。虽然面临技术和监管挑战，但其在用户隐私保护、创作者经济和社区治理方面的优势将推动其持续发展。

随着技术的成熟和用户认知的提升，我们有理由相信Web3去中心化社交网络将成为未来社交媒体的主流形态。`,
  images: [
    "/web3-social-network-architecture.png",
    "/decentralized-social-media.png",
    "/defi-security-audit.png",
    "/smart-contract-vulnerabilities.png",
  ],
  downloadUrl: "/content/web3-social-network-analysis.pdf",
};

export default function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [isUnlocked, setIsUnlocked] = useState(mockContent.isUnlocked);
  const paramsId = use(params);

  const handlePurchaseComplete = () => {
    setIsUnlocked(true);
  };

  const contentWithUnlockStatus = {
    ...mockContent,
    isUnlocked,
  };

  return (
    <main className="container mx-auto pt-8 pb-4">
      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Main Content (2/3 width on desktop) */}
        <div className="lg:col-span-2">
          <ContentDetailMain content={contentWithUnlockStatus} />

          {isUnlocked && (
            <div className="mt-8">
              <UnlockedContentDisplay
                content={{
                  title: mockContent.title,
                  fullContent: mockContent.fullContent,
                  images: mockContent.images,
                  downloadUrl: mockContent.downloadUrl,
                }}
              />
            </div>
          )}
        </div>

        {/* Right Sidebar (1/3 width on desktop) */}
        <div className="lg:col-span-1">
          <ContentDetailSidebar
            content={contentWithUnlockStatus}
            onPurchaseComplete={handlePurchaseComplete}
          />
        </div>
      </div>

      {/* Data Visualization Charts Section */}
      <div className="mt-12">
        <ContentDataCharts contentId={paramsId.id} />
      </div>

      {/* Comments Section */}
      <div className="mt-12">
        <CommentsSection contentId={paramsId.id} />
      </div>
    </main>
  );
}
