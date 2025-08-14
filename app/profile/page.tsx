"use client"

import { useState } from "react"
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
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

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
  {
    id: "3",
    title: "智能合约常见漏洞分析",
    preview: "/smart-contract-vulnerabilities.png",
    publishDate: "2024-01-08",
    views: 0,
    earnings: "0.00",
    status: "draft" as const,
  },
  {
    id: "4",
    title: "去中心化存储解决方案对比",
    preview: "/decentralized-storage-comparison.png",
    publishDate: "2024-01-05",
    views: 1560,
    earnings: "280.00",
    status: "removed" as const,
  },
]

const monthlyIncomeData = [
  { month: "10月", income: 2340, contentSales: 1800, votingRevenue: 540 },
  { month: "11月", income: 3120, contentSales: 2400, votingRevenue: 720 },
  { month: "12月", income: 2890, contentSales: 2200, votingRevenue: 690 },
  { month: "1月", income: 4100, contentSales: 3200, votingRevenue: 900 },
  { month: "2月", income: 3650, contentSales: 2800, votingRevenue: 850 },
  { month: "3月", income: 4500, contentSales: 3500, votingRevenue: 1000 },
]

const incomeSourceData = [
  { name: "内容销售", value: 18200, color: "#8B5CF6" },
  { name: "投票分成", value: 4700, color: "#A855F7" },
  { name: "打赏收入", value: 1800, color: "#9333EA" },
  { name: "推荐奖励", value: 800, color: "#7C3AED" },
]

const dailyIncomeData = [
  { date: "3/1", income: 120 },
  { date: "3/2", income: 180 },
  { date: "3/3", income: 95 },
  { date: "3/4", income: 220 },
  { date: "3/5", income: 160 },
  { date: "3/6", income: 300 },
  { date: "3/7", income: 250 },
  { date: "3/8", income: 190 },
  { date: "3/9", income: 280 },
  { date: "3/10", income: 320 },
  { date: "3/11", income: 150 },
  { date: "3/12", income: 400 },
  { date: "3/13", income: 350 },
  { date: "3/14", income: 180 },
  { date: "3/15", income: 420 },
]

const incomeRecords = [
  {
    id: "1",
    date: "2024-03-15",
    type: "内容销售",
    amount: "420.00",
    source: "Web3社交网络的未来发展趋势",
    status: "已到账",
  },
  {
    id: "2",
    date: "2024-03-14",
    type: "投票分成",
    amount: "85.50",
    source: "DeFi协议安全审计完整指南",
    status: "已到账",
  },
  {
    id: "3",
    date: "2024-03-13",
    type: "内容销售",
    amount: "350.00",
    source: "智能合约常见漏洞分析",
    status: "已到账",
  },
  {
    id: "4",
    date: "2024-03-12",
    type: "打赏收入",
    amount: "120.00",
    source: "去中心化存储解决方案对比",
    status: "处理中",
  },
  {
    id: "5",
    date: "2024-03-11",
    type: "推荐奖励",
    amount: "50.00",
    source: "推荐新用户注册",
    status: "已到账",
  },
]

const purchaseHistory = [
  {
    id: "1",
    title: "去中心化存储解决方案对比",
    author: "区块链研究员",
    purchaseDate: "2024-03-10",
    price: "280.00",
  },
  {
    id: "2",
    title: "智能合约常见漏洞分析",
    author: "区块链研究员",
    purchaseDate: "2024-03-09",
    price: "180.00",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "published":
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">已发布</Badge>
    case "draft":
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">草稿</Badge>
    case "removed":
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">已下架</Badge>
    default:
      return null
  }
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("content")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const filteredRecords = incomeRecords.filter((record) => {
    const matchesSearch =
      record.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || record.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen bg-[#1E1B3A] text-white">
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
                      加入时间：{userData.joinDate}
                    </div>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Edit className="w-4 h-4 mr-2" />
                    编辑资料
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{userData.totalContent}</div>
                    <div className="text-sm text-gray-400">发布内容</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{userData.totalViews}</div>
                    <div className="text-sm text-gray-400">总阅读量</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">¥{userData.totalEarnings}</div>
                    <div className="text-sm text-gray-400">总收入</div>
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
              我的内容
            </TabsTrigger>
            <TabsTrigger value="income" className="data-[state=active]:bg-purple-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              收入统计
            </TabsTrigger>
            <TabsTrigger value="purchases" className="data-[state=active]:bg-purple-600">
              <ShoppingBag className="w-4 h-4 mr-2" />
              购买记录
            </TabsTrigger>
          </TabsList>

          {/* My Content Tab */}
          <TabsContent value="content" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">我的内容</h2>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => (window.location.href = "/publish")}>
                <Plus className="w-4 h-4 mr-2" />
                发布新内容
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
                        编辑
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
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="income" className="mt-6">
            {/* Income Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-[#2A2550] border-purple-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">总收入</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">¥25,500</div>
                  <p className="text-xs text-gray-500">累计收入</p>
                </CardContent>
              </Card>

              <Card className="bg-[#2A2550] border-purple-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">本月收入</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">¥4,500</div>
                  <p className="text-xs text-gray-500">+9.8% 较上月</p>
                </CardContent>
              </Card>

              <Card className="bg-[#2A2550] border-purple-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">内容销售收入</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">¥18,200</div>
                  <p className="text-xs text-gray-500">71% 总收入占比</p>
                </CardContent>
              </Card>

              <Card className="bg-[#2A2550] border-purple-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">投票分成收入</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">¥4,700</div>
                  <p className="text-xs text-gray-500">18% 总收入占比</p>
                </CardContent>
              </Card>
            </div>

            {/* Data Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <Card className="bg-[#2A2550] border-purple-500/20">
                <CardContent className="p-4 text-center">
                  <FileText className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-xl font-bold">23</div>
                  <div className="text-sm text-gray-400">内容总数</div>
                </CardContent>
              </Card>

              <Card className="bg-[#2A2550] border-purple-500/20">
                <CardContent className="p-4 text-center">
                  <Eye className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-xl font-bold">45,230</div>
                  <div className="text-sm text-gray-400">总阅读量</div>
                </CardContent>
              </Card>

              <Card className="bg-[#2A2550] border-purple-500/20">
                <CardContent className="p-4 text-center">
                  <ThumbsUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-xl font-bold">3,456</div>
                  <div className="text-sm text-gray-400">总投票数</div>
                </CardContent>
              </Card>

              <Card className="bg-[#2A2550] border-purple-500/20">
                <CardContent className="p-4 text-center">
                  <BarChart3 className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-xl font-bold">¥1,109</div>
                  <div className="text-sm text-gray-400">平均每篇收入</div>
                </CardContent>
              </Card>

              <Card className="bg-[#2A2550] border-purple-500/20">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                  <div className="text-xl font-bold">1,234</div>
                  <div className="text-sm text-gray-400">粉丝数量</div>
                </CardContent>
              </Card>
            </div>

            {/* Income Trend Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Monthly Income Trend */}
              <Card className="bg-[#2A2550] border-purple-500/20">
                <CardHeader>
                  <CardTitle>月度收入趋势</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyIncomeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#2A2550",
                          border: "1px solid #8B5CF6",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Income Source Distribution */}
              <Card className="bg-[#2A2550] border-purple-500/20">
                <CardHeader>
                  <CardTitle>收入来源分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={incomeSourceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {incomeSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#2A2550",
                          border: "1px solid #8B5CF6",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent 30 Days Income */}
            <Card className="bg-[#2A2550] border-purple-500/20 mb-8">
              <CardHeader>
                <CardTitle>最近30天收入</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyIncomeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#2A2550",
                        border: "1px solid #8B5CF6",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="income" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Detailed Income Records */}
            <Card className="bg-[#2A2550] border-purple-500/20">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle>详细收入记录</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-purple-500/30 bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      导出
                    </Button>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="搜索收入记录..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-[#1E1B3A] border-purple-500/30"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-48 bg-[#1E1B3A] border-purple-500/30">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="筛选类型" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2550] border-purple-500/20">
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="内容销售">内容销售</SelectItem>
                      <SelectItem value="投票分成">投票分成</SelectItem>
                      <SelectItem value="打赏收入">打赏收入</SelectItem>
                      <SelectItem value="推荐奖励">推荐奖励</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 bg-[#1E1B3A] rounded-lg hover:bg-[#252147] transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <Badge
                            variant="outline"
                            className={`
                              ${record.type === "内容销售" ? "border-blue-500/30 text-blue-400" : ""}
                              ${record.type === "投票分成" ? "border-green-500/30 text-green-400" : ""}
                              ${record.type === "打赏收入" ? "border-yellow-500/30 text-yellow-400" : ""}
                              ${record.type === "推荐奖励" ? "border-purple-500/30 text-purple-400" : ""}
                            `}
                          >
                            {record.type}
                          </Badge>
                          <Badge
                            className={`
                              ${record.status === "已到账" ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                              ${record.status === "处理中" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : ""}
                            `}
                          >
                            {record.status}
                          </Badge>
                        </div>
                        <div className="font-medium mb-1">{record.source}</div>
                        <div className="text-sm text-gray-400">{record.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-400 text-lg">+¥{record.amount}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Purchase History Tab */}
          <TabsContent value="purchases" className="mt-6">
            <h2 className="text-2xl font-bold mb-6">购买记录</h2>

            <div className="space-y-4">
              {purchaseHistory.map((purchase) => (
                <Card key={purchase.id} className="bg-[#2A2550] border-purple-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{purchase.title}</h3>
                        <p className="text-sm text-gray-400 mb-2">作者：{purchase.author}</p>
                        <p className="text-xs text-gray-500">购买时间：{purchase.purchaseDate}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-400 mb-2">¥{purchase.price}</div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">已完成</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
