import { Calendar, Eye, Heart, MessageCircle, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ContentDetailMainProps {
  content: {
    title: string
    author: {
      name: string
      avatar: string
      verified: boolean
    }
    publishedAt: string
    previewImage: string
    description: string
    isUnlocked: boolean
    stats: {
      views: number
      likes: number
      comments: number
      investors: number
    }
    tags: string[]
  }
}

export function ContentDetailMain({ content }: ContentDetailMainProps) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">{content.title}</h1>

      {/* Author Info and Publish Date */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-700">
        <img
          src={content.author.avatar || "/placeholder.svg"}
          alt={content.author.name}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">{content.author.name}</span>
            {content.author.verified && (
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>发布于 {content.publishedAt}</span>
          </div>
        </div>
      </div>

      {/* Preview Image */}
      <div className="relative">
        <img
          src={content.previewImage || "/placeholder.svg"}
          alt={content.title}
          className={`w-full h-64 lg:h-80 object-cover rounded-lg ${!content.isUnlocked ? "filter blur-sm" : ""}`}
        />
        {!content.isUnlocked && (
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <p className="text-white font-medium">解锁后查看完整内容</p>
            </div>
          </div>
        )}
      </div>

      {/* Content Description */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">内容简介</h2>
        <p className={`text-gray-300 leading-relaxed ${!content.isUnlocked ? "filter blur-sm" : ""}`}>
          {content.description}
        </p>

        {!content.isUnlocked && (
          <div className="bg-purple-900/30 border border-purple-600/30 rounded-lg p-4">
            <p className="text-purple-300 text-sm">
              🔒 此内容需要解锁后才能完整查看。解锁后您将获得完整的文章内容、独家见解和作者互动权限。
            </p>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-white">标签</h3>
        <div className="flex flex-wrap gap-2">
          {content.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-purple-900/30 text-purple-300 hover:bg-purple-800/40">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Basic Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
        <div className="flex items-center gap-2 text-gray-400">
          <Eye className="w-4 h-4" />
          <span className="text-sm">{content.stats.views.toLocaleString()} 阅读</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Heart className="w-4 h-4" />
          <span className="text-sm">{content.stats.likes} 点赞</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">{content.stats.comments} 评论</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Users className="w-4 h-4" />
          <span className="text-sm">{content.stats.investors} 投资者</span>
        </div>
      </div>
    </div>
  )
}
