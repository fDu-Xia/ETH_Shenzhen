"use client";

import { motion } from "motion/react";
import { useColorAnimation } from "@/components/color-animation-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Wallet, 
  Hash, 
  Users, 
  Star, 
  Calendar,
  ExternalLink,
  Copy
} from "lucide-react";
import { useState } from "react";

interface BlockchainInfoProps {
  content: {
    contractAddress: string;
    creator: string;
    ipfsUrl: string;
    totalSupply: number;
    currentPrice: number;
    averageRating: number;
    ratingsCount: number;
    ipfsData?: {
      contentType: string;
      version: string;
      timestamp: string;
    };
  };
}

export function BlockchainInfo({ content }: BlockchainInfoProps) {
  const color = useColorAnimation();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(6)} MON`;
  };

  return (
    <Card className="bg-gray-950/30 border-gray-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Hash className="w-5 h-5" style={{ color: color.get() }} />
          区块链信息
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contract Information */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">合约地址</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300 font-mono">
                {formatAddress(content.contractAddress)}
              </span>
              <button
                onClick={() => copyToClipboard(content.contractAddress, 'contract')}
                className="p-1 hover:bg-gray-700/50 rounded transition-colors"
              >
                <Copy className={`w-3 h-3 ${copiedField === 'contract' ? 'text-green-400' : 'text-gray-400'}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">创作者</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300 font-mono">
                {formatAddress(content.creator)}
              </span>
              <button
                onClick={() => copyToClipboard(content.creator, 'creator')}
                className="p-1 hover:bg-gray-700/50 rounded transition-colors"
              >
                <Copy className={`w-3 h-3 ${copiedField === 'creator' ? 'text-green-400' : 'text-gray-400'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Token Statistics */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300 mb-2">代币统计</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30 text-center">
              <div className="text-lg font-bold text-white">{content.totalSupply}</div>
              <div className="text-xs text-gray-400">总供应量</div>
            </div>
            
            <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30 text-center">
              <div className="text-lg font-bold text-white">{formatPrice(content.currentPrice)}</div>
              <div className="text-xs text-gray-400">当前价格</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30 text-center">
              <div className="text-lg font-bold text-white">{content.averageRating.toFixed(1)}</div>
              <div className="text-xs text-gray-400">平均评分</div>
            </div>
            
            <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30 text-center">
              <div className="text-lg font-bold text-white">{content.ratingsCount}</div>
              <div className="text-xs text-gray-400">评分数量</div>
            </div>
          </div>
        </div>

        {/* IPFS Information */}
        {content.ipfsData && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300 mb-2">IPFS 内容</h4>
            
            <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">内容类型</span>
                <Badge variant="outline" className="text-xs">
                  {content.ipfsData.contentType}
                </Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">版本</span>
                <span className="text-sm text-gray-300">{content.ipfsData.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">创建时间</span>
                <span className="text-sm text-gray-300">
                  {new Date(content.ipfsData.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* IPFS Hash */}
            <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">IPFS 哈希</span>
                <button
                  onClick={() => copyToClipboard(content.ipfsUrl, 'ipfs')}
                  className="p-1 hover:bg-gray-700/50 rounded transition-colors"
                >
                  <Copy className={`w-3 h-3 ${copiedField === 'ipfs' ? 'text-green-400' : 'text-gray-400'}`} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300 font-mono break-all">
                  {content.ipfsUrl.length > 20 ? `${content.ipfsUrl.slice(0, 20)}...` : content.ipfsUrl}
                </span>
                <a
                  href={`https://muddy-moccasin-worm.myfilebase.com/ipfs/${content.ipfsUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-gray-700/50 rounded transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
