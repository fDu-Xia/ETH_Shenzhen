"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Edit,
  Plus,
  Eye,
  DollarSign,
  Calendar,
  MoreHorizontal,
  Trash2,
  FileText,
  TrendingUp,
  ShoppingBag,
  Download,
  Search,
  Filter,
  Users,
  ThumbsUp,
  BarChart3,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"

// Mock user data
const userData = {
  id: "1",
  username: "区块链研究员",
  avatar: "/blockchain-researcher.png",
  bio: "专注于区块链技术研究和Web3生态分析，拥有5年行业经验",
  joinDate: "2023年3月",
  totalEarnings: "12,450",
  totalViews: "45,230",
  totalContent: 23,
}

// Mock content data
const userContent = [
  {
    id: "1",
    title: "Web3社交网络的未来发展趋势",
    preview: "/web3-social-network-future.png",
    publishDate: "2024-01-15",
    views: 2340,
    earnings: "450.00",
    status: "published" as const,
  },
  {
    id: "2",
    title: "DeFi协议安全审计完整指南",
    preview: "/defi-security-audit.png",
    publishDate: "2024-01-10",
    views: 1890,
    earnings: "320.50",
    status: "published" as const,
  },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("content")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  
  const pathname = usePathname()
  const currentLocale = pathname.startsWith('/en') ? 'en' : 'zh'

  // Simple translations for testing
  const t = {
    zh: {
      editProfile: "编辑资料",
      joinTime: "加入时间：",
      publishedContent: "发布内容",
      totalViews: "总阅读量",
      totalIncome: "总收入",
      myContent: "我的内容",
      incomeStats: "收入统计",
      purchaseHistory: "购买记录",
      publishNewContent: "发布新内容",
      edit: "编辑",
      delete: "删除",
      published: "已发布",
      draft: "草稿",
      removed: "已下架",
    },
    en: {
      editProfile: "Edit Profile",
      joinTime: "Joined: ",
      publishedContent: "Published Content",
      totalViews: "Total Views",
      totalIncome: "Total Income",
      myContent: "My Content",
      incomeStats: "Income Stats",
      purchaseHistory: "Purchase History",
      publishNewContent: "Publish New Content",
      edit: "Edit",
      delete: "Delete",
      published: "Published",
      draft: "Draft",
      removed: "Removed",
    }
  }[currentLocale]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{t.published}</Badge>
      case "draft":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">{t.draft}</Badge>
      case "removed":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{t.removed}</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#1E1B3A] text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* User Info Card */}
        <Card className="bg-[#2A2550] border-purple-500/20 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.username} />
                <AvatarFallback className="bg-purple-600 text-white text-2xl">
                  {userData.username.slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{userData.username}</h1>
                    <p className="text-gray-400 mb-2">{userData.bio}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {t.joinTime}{userData.joinDate}
                    </div>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Edit className="w-4 h-4 mr-2" />
                    {t.editProfile}
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{userData.totalContent}</div>
                    <div className="text-sm text-gray-400">{t.publishedContent}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{userData.totalViews}</div>
                    <div className="text-sm text-gray-400">{t.totalViews}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">¥{userData.totalEarnings}</div>
                    <div className="text-sm text-gray-400">{t.totalIncome}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#2A2550] border-purple-500/20">
            <TabsTrigger value="content" className="data-[state=active]:bg-purple-600">
              <FileText className="w-4 h-4 mr-2" />
              {t.myContent}
            </TabsTrigger>
            <TabsTrigger value="income" className="data-[state=active]:bg-purple-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              {t.incomeStats}
            </TabsTrigger>
            <TabsTrigger value="purchases" className="data-[state=active]:bg-purple-600">
              <ShoppingBag className="w-4 h-4 mr-2" />
              {t.purchaseHistory}
            </TabsTrigger>
          </TabsList>

          {/* My Content Tab */}
          <TabsContent value="content" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{t.myContent}</h2>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => (window.location.href = `/${currentLocale}/publish`)}>
                <Plus className="w-4 h-4 mr-2" />
                {t.publishNewContent}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userContent.map((content) => (
                <Card
                  key={content.id}
                  className="bg-[#2A2550] border-purple-500/20 hover:border-purple-400/40 transition-colors"
                >
                  <div className="relative">
                    <img
                      src={content.preview || "/placeholder.svg"}
                      alt={content.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2">{getStatusBadge(content.status)}</div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{content.title}</h3>

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                      <span>{content.publishDate}</span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {content.views}
                        </div>
                        <div className="flex items-center text-green-400">
                          <DollarSign className="w-4 h-4 mr-1" />¥{content.earnings}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-500/30 hover:bg-purple-600/20 bg-transparent"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        {t.edit}
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#2A2550] border-purple-500/20">
                          <DropdownMenuItem className="text-red-400 hover:bg-red-500/20">
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t.delete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Income Tab - Simple placeholder */}
          <TabsContent value="income" className="mt-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">{t.incomeStats}</h2>
              <p className="text-gray-400">Income statistics will be implemented here</p>
            </div>
          </TabsContent>

          {/* Purchase History Tab - Simple placeholder */}
          <TabsContent value="purchases" className="mt-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">{t.purchaseHistory}</h2>
              <p className="text-gray-400">Purchase history will be implemented here</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
