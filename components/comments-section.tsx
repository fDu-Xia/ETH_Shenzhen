import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Heart, Reply } from "lucide-react"

interface CommentsSectionProps {
  contentId: string
}

// Mock comments data
const mockComments = [
  {
    id: "1",
    author: {
      name: "加密投资者",
      avatar: "/crypto-investor.png",
      verified: false,
    },
    content: "非常有见地的分析！Web3社交网络确实是未来的趋势，期待看到更多深度内容。",
    timestamp: "2小时前",
    likes: 12,
    replies: 3,
  },
  {
    id: "2",
    author: {
      name: "区块链开发者",
      avatar: "/blockchain-developer.png",
      verified: true,
    },
    content: "技术架构部分讲得很清楚，对我们团队的项目很有帮助。已经解锁支持作者！",
    timestamp: "5小时前",
    likes: 8,
    replies: 1,
  },
  {
    id: "3",
    author: {
      name: "Web3爱好者",
      avatar: "/web3-enthusiast.png",
      verified: false,
    },
    content: "想了解更多关于代币经济学的内容，作者有计划出续集吗？",
    timestamp: "1天前",
    likes: 5,
    replies: 0,
  },
]

export function CommentsSection({ contentId }: CommentsSectionProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-purple-400" />
          评论区 ({mockComments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Input Placeholder */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
          <p className="text-gray-400 text-sm mb-3">发表您的看法...</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">需要解锁内容后才能评论</span>
            <Button size="sm" disabled className="bg-purple-600/50">
              发布评论
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {mockComments.map((comment) => (
            <div key={comment.id} className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <img
                  src={comment.author.avatar || "/placeholder.svg"}
                  alt={comment.author.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-white text-sm">{comment.author.name}</span>
                    {comment.author.verified && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                    )}
                    <span className="text-xs text-gray-400">{comment.timestamp}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{comment.content}</p>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-gray-400 hover:text-purple-400 text-xs">
                      <Heart className="w-3 h-3" />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-400 hover:text-purple-400 text-xs">
                      <Reply className="w-3 h-3" />
                      <span>回复 ({comment.replies})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Comments */}
        <div className="text-center">
          <Button variant="outline" className="border-gray-600 text-gray-400 hover:text-white bg-transparent">
            加载更多评论
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
