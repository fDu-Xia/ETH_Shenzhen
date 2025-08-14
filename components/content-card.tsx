import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Eye, Users, TrendingUp, CheckCircle } from "lucide-react"

interface ContentCardProps {
  content: {
    id: string
    title: string
    description: string
    image: string
    price: string
    author: {
      name: string
      avatar: string
      verified: boolean
    }
    stats: {
      investors: number
      views: string
      likes: number
    }
    tags: string[]
    trending: boolean
  }
}

export function ContentCard({ content }: ContentCardProps) {
  return (
    <div className="bg-[#2A2147] rounded-xl border border-purple-800/30 overflow-hidden hover:border-purple-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
      {/* Image */}
      <div className="relative">
        <Image
          src={content.image || "/placeholder.svg"}
          alt={content.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        {content.trending && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <TrendingUp className="w-3 h-3 mr-1" />
            热门
          </Badge>
        )}
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="text-white font-semibold text-sm">{content.price}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Author */}
        <div className="flex items-center mb-3">
          <Image
            src={content.author.avatar || "/placeholder.svg"}
            alt={content.author.name}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-gray-300 text-sm">{content.author.name}</span>
          {content.author.verified && <CheckCircle className="w-4 h-4 text-purple-400 ml-1" />}
        </div>

        {/* Title and Description */}
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{content.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{content.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {content.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-purple-900/30 text-purple-300 hover:bg-purple-800/40">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {content.stats.investors}
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {content.stats.views}
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {content.stats.likes}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/content/${content.id}`}>
          <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
            查看详情
          </Button>
        </Link>
      </div>
    </div>
  )
}
