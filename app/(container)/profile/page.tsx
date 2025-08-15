"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ArrowRight,
} from "lucide-react";
import { motion, useMotionTemplate } from "motion/react";
import { useColorAnimation } from "@/components/color-animation-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "recharts";

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
};

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
];

const monthlyIncomeData = [
  { month: "10月", income: 2340, contentSales: 1800, votingRevenue: 540 },
  { month: "11月", income: 3120, contentSales: 2400, votingRevenue: 720 },
  { month: "12月", income: 2890, contentSales: 2200, votingRevenue: 690 },
  { month: "1月", income: 4100, contentSales: 3200, votingRevenue: 900 },
  { month: "2月", income: 3650, contentSales: 2800, votingRevenue: 850 },
  { month: "3月", income: 4500, contentSales: 3500, votingRevenue: 1000 },
];

const incomeSourceData = [
  { name: "内容销售", value: 18200, color: "#8B5CF6" },
  { name: "投票分成", value: 4700, color: "#A855F7" },
  { name: "打赏收入", value: 1800, color: "#9333EA" },
  { name: "推荐奖励", value: 800, color: "#7C3AED" },
];

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
];

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
];

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
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "published":
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          已发布
        </Badge>
      );
    case "draft":
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          草稿
        </Badge>
      );
    case "removed":
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          已下架
        </Badge>
      );
    default:
      return null;
  }
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("content");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  const color = useColorAnimation();
  const border = useMotionTemplate`1px solid ${color}30`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}10`;
  const buttonBorder = useMotionTemplate`1px solid ${color}`;
  const buttonShadow = useMotionTemplate`0px 2px 8px ${color}20`;

  const filteredRecords = incomeRecords.filter((record) => {
    const matchesSearch =
      record.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || record.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <main className="container mx-auto pt-8 pb-4" >
      {/* User Info Card */}
      <motion.div
        className="p-8 rounded-2xl bg-gray-950/30 backdrop-blur-sm mb-8"
        style={{ border, boxShadow }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
          >
            <Avatar className="w-24 h-24 border-2" style={{ borderColor: color.get() }}>
              <AvatarImage
                src={userData.avatar || "/placeholder.svg"}
                alt={userData.username}
              />
              <AvatarFallback className="text-white text-2xl bg-gradient-to-br from-purple-500 to-pink-500">
                {userData.username.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              >
                <h1 className="text-3xl md:text-4xl font-light mb-2 text-white">
                  {userData.username}
                </h1>
                <p className="text-gray-400 mb-2">{userData.bio}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  加入时间：{userData.joinDate}
                </div>
              </motion.div>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                style={{
                  border: buttonBorder,
                  boxShadow: buttonShadow,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-950/30 text-white backdrop-blur-sm transition-colors hover:bg-gray-950/50 flex items-center gap-2 group"
              >
                <Edit className="w-4 h-4" />
                编辑资料
                <ArrowRight className="w-4 h-4 transition-transform group-hover:-rotate-45" />
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                className="text-center p-4 rounded-xl bg-gray-900/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="text-2xl font-bold"
                  style={{ color }}
                >
                  {userData.totalContent}
                </motion.div>
                <div className="text-sm text-gray-400">发布内容</div>
              </motion.div>
              <motion.div
                className="text-center p-4 rounded-xl bg-gray-900/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-bold text-green-400">
                  {userData.totalViews}
                </div>
                <div className="text-sm text-gray-400">总阅读量</div>
              </motion.div>
              <motion.div
                className="text-center p-4 rounded-xl bg-gray-900/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-bold text-yellow-400">
                  ¥{userData.totalEarnings}
                </div>
                <div className="text-sm text-gray-400">总收入</div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <motion.div
          className="grid w-full grid-cols-3 bg-gray-950/30 backdrop-blur-sm rounded-full p-1 mb-6"
          style={{ border }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          <motion.button
            onClick={() => setActiveTab("content")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "content"
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
            style={{
              background: activeTab === "content" ? color : "transparent",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FileText className="w-4 h-4" />
            我的内容
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("income")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "income"
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
            style={{
              background: activeTab === "income" ? color : "transparent",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <TrendingUp className="w-4 h-4" />
            收入统计
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("purchases")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "purchases"
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
            style={{
              background: activeTab === "purchases" ? color : "transparent",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingBag className="w-4 h-4" />
            购买记录
          </motion.button>
        </motion.div>

        {/* My Content Tab */}
        <TabsContent value="content" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-light text-white">我的内容</h2>
            <motion.button
              onClick={() => (window.location.href = "/publish")}
              style={{
                border: buttonBorder,
                boxShadow: buttonShadow,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-950/30 text-white backdrop-blur-sm transition-colors hover:bg-gray-950/50 flex items-center gap-2 group"
            >
              <Plus className="w-4 h-4" />
              发布新内容
              <ArrowRight className="w-4 h-4 transition-transform group-hover:-rotate-45" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userContent.map((content, index) => (
              <motion.div
                key={content.id}
                className="rounded-2xl bg-gray-950/30 backdrop-blur-sm overflow-hidden group hover:bg-gray-900/20 transition-all duration-300"
                initial={{
                  opacity: 0,
                  y: 30,
                  boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.05)`
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{ duration: 0.5, delay: 1.0 + index * 0.1, ease: "easeOut" }}
                whileHover={{
                  boxShadow: `inset 0 2px 0 0 ${color.get()}40, 0 0 0 1px ${color.get()}30, 0 4px 12px ${color.get()}20`
                }}
                style={{ border }}
              >
                <div className="relative p-3">
                  <img
                    src={content.preview || "/placeholder.svg"}
                    alt={content.title}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  <div className="absolute top-5 right-5">
                    {getStatusBadge(content.status)}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2 text-white">
                    {content.title}
                  </h3>

                  <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <span>{content.publishDate}</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {content.views}
                      </div>
                      <motion.div
                        className="flex items-center"
                        style={{ color }}
                      >
                        <DollarSign className="w-4 h-4 mr-1" />¥
                        {content.earnings}
                      </motion.div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-900/50 text-white backdrop-blur-sm transition-colors hover:bg-gray-900/70 flex items-center gap-1 border border-gray-700/50"
                    >
                      <Edit className="w-3 h-3" />
                      编辑
                    </motion.button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 rounded-full hover:bg-gray-800/50 transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </motion.button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-900/95 backdrop-blur-sm border-gray-700/50 rounded-xl">
                        <DropdownMenuItem className="text-red-400 hover:bg-red-500/20 rounded-lg cursor-pointer">
                          <Trash2 className="w-4 h-4 mr-2" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="income" className="mt-6">
          {/* Income Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              className="p-6 rounded-2xl bg-gray-950/30 backdrop-blur-sm hover:bg-gray-900/20 transition-all duration-300"
              initial={{
                boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.05)`
              }}
              whileHover={{
                boxShadow: `inset 0 2px 0 0 ${color.get()}40, 0 0 0 1px ${color.get()}30, 0 4px 12px ${color.get()}20`
              }}
              style={{ border }}
            >
              <p className="text-sm font-medium text-gray-400 mb-2">总收入</p>
              <div className="text-2xl font-bold text-green-400">¥25,500</div>
              <p className="text-xs text-gray-500">累计收入</p>
            </motion.div>

            <motion.div
              className="p-6 rounded-2xl bg-gray-950/30 backdrop-blur-sm hover:bg-gray-900/20 transition-all duration-300"
              initial={{
                boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.05)`
              }}
              whileHover={{
                boxShadow: `inset 0 2px 0 0 ${color.get()}40, 0 0 0 1px ${color.get()}30, 0 4px 12px ${color.get()}20`
              }}
              style={{ border }}
            >
              <p className="text-sm font-medium text-gray-400 mb-2">本月收入</p>
              <motion.div className="text-2xl font-bold" style={{ color }}>¥4,500</motion.div>
              <p className="text-xs text-gray-500">+9.8% 较上月</p>
            </motion.div>

            <motion.div
              className="p-6 rounded-2xl bg-gray-950/30 backdrop-blur-sm hover:bg-gray-900/20 transition-all duration-300"
              initial={{
                boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.05)`
              }}
              whileHover={{
                boxShadow: `inset 0 2px 0 0 ${color.get()}40, 0 0 0 1px ${color.get()}30, 0 4px 12px ${color.get()}20`
              }}
              style={{ border }}
            >
              <p className="text-sm font-medium text-gray-400 mb-2">内容销售收入</p>
              <div className="text-2xl font-bold text-blue-400">¥18,200</div>
              <p className="text-xs text-gray-500">71% 总收入占比</p>
            </motion.div>

            <motion.div
              className="p-6 rounded-2xl bg-gray-950/30 backdrop-blur-sm hover:bg-gray-900/20 transition-all duration-300"
              initial={{
                boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.05)`
              }}
              whileHover={{
                boxShadow: `inset 0 2px 0 0 ${color.get()}40, 0 0 0 1px ${color.get()}30, 0 4px 12px ${color.get()}20`
              }}
              style={{ border }}
            >
              <p className="text-sm font-medium text-gray-400 mb-2">投票分成收入</p>
              <div className="text-2xl font-bold text-yellow-400">¥4,700</div>
              <p className="text-xs text-gray-500">18% 总收入占比</p>
            </motion.div>
          </div>

          {/* Data Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <motion.div
              className="p-4 rounded-2xl bg-gray-950/30 backdrop-blur-sm text-center hover:bg-gray-900/20 transition-all duration-300"
              initial={{
                boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.05)`
              }}
              whileHover={{
                boxShadow: `inset 0 2px 0 0 ${color.get()}40, 0 0 0 1px ${color.get()}30, 0 4px 12px ${color.get()}20`
              }}
              style={{ border }}
            >
              <motion.div style={{ color }}>
                <FileText className="w-8 h-8 mx-auto mb-2" />
              </motion.div>
              <div className="text-xl font-bold text-white">23</div>
              <div className="text-sm text-gray-400">内容总数</div>
            </motion.div>

            <motion.div
              className="p-4 rounded-2xl bg-gray-950/30 backdrop-blur-sm text-center hover:bg-gray-900/20 transition-all duration-300"
              initial={{
                boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.05)`
              }}
              whileHover={{
                boxShadow: `inset 0 2px 0 0 ${color.get()}40, 0 0 0 1px ${color.get()}30, 0 4px 12px ${color.get()}20`
              }}
              style={{ border }}
            >
              <Eye className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">45,230</div>
              <div className="text-sm text-gray-400">总阅读量</div>
            </motion.div>

            <motion.div
              className="p-4 rounded-2xl bg-gray-950/30 backdrop-blur-sm text-center hover:bg-gray-900/20 transition-all duration-300"
              initial={{
                boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.05)`
              }}
              whileHover={{
                boxShadow: `inset 0 2px 0 0 ${color.get()}40, 0 0 0 1px ${color.get()}30, 0 4px 12px ${color.get()}20`
              }}
              style={{ border }}
            >
              <ThumbsUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">3,456</div>
              <div className="text-sm text-gray-400">总投票数</div>
            </motion.div>

            <motion.div
              className="p-4 rounded-2xl bg-gray-950/30 backdrop-blur-sm text-center hover:bg-gray-900/20 transition-all duration-300"
              initial={{
                boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.05)`
              }}
              whileHover={{
                boxShadow: `inset 0 2px 0 0 ${color.get()}40, 0 0 0 1px ${color.get()}30, 0 4px 12px ${color.get()}20`
              }}
              style={{ border }}
            >
              <BarChart3 className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">¥1,109</div>
              <div className="text-sm text-gray-400">平均每篇收入</div>
            </motion.div>

            <motion.div
              className="p-4 rounded-2xl bg-gray-950/30 backdrop-blur-sm text-center hover:bg-gray-900/20 transition-all duration-300"
              initial={{
                boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.05)`
              }}
              whileHover={{
                boxShadow: `inset 0 2px 0 0 ${color.get()}40, 0 0 0 1px ${color.get()}30, 0 4px 12px ${color.get()}20`
              }}
              style={{ border }}
            >
              <Users className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">1,234</div>
              <div className="text-sm text-gray-400">粉丝数量</div>
            </motion.div>
          </div>

          {/* Income Trend Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Income Trend */}
            <motion.div
              className="p-6 rounded-2xl bg-gray-950/30 backdrop-blur-sm"
              style={{ border, boxShadow }}
            >
              <h3 className="text-lg font-medium mb-4 text-white">月度收入趋势</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyIncomeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(17, 24, 39, 0.95)",
                        border: `1px solid ${color.get()}`,
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
            </motion.div>

            {/* Income Source Distribution */}
            <motion.div
              className="p-6 rounded-2xl bg-gray-950/30 backdrop-blur-sm"
              style={{ border, boxShadow }}
            >
              <h3 className="text-lg font-medium mb-4 text-white">收入来源分布</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={incomeSourceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                      }
                    >
                      {incomeSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(17, 24, 39, 0.95)",
                        border: `1px solid ${color.get()}`,
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Recent 30 Days Income */}
          <motion.div
            className="p-6 rounded-2xl bg-gray-950/30 backdrop-blur-sm mb-8"
            style={{ border, boxShadow }}
          >
            <h3 className="text-lg font-medium mb-4 text-white">最近30天收入</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyIncomeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.95)",
                      border: `1px solid ${color.get()}`,
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="income" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
        </motion.div>

          {/* Detailed Income Records */}
          <motion.div
            className="p-6 rounded-2xl bg-gray-950/30 backdrop-blur-sm"
            style={{ border, boxShadow }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h3 className="text-lg font-medium text-white">详细收入记录</h3>
              <motion.button
                style={{ boxShadow: buttonShadow }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-900/50 text-white backdrop-blur-sm transition-colors hover:bg-gray-900/70 flex items-center gap-2 border border-gray-700/50"
              >
                <Download className="w-4 h-4" />
                导出
              </motion.button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <motion.div
                className="relative flex-1 rounded-full"
                style={{
                  border,
                  boxShadow,
                }}
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <input
                  type="text"
                  placeholder="搜索收入记录..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-950/30 backdrop-blur-sm rounded-full text-white placeholder-gray-400 focus:outline-none focus:bg-gray-950/50 transition-colors"
                />
              </motion.div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48 bg-gray-900/50 border-gray-700/50 focus:border-gray-600 text-white rounded-xl h-12 hover:bg-gray-900/70 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="筛选类型" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900/95 backdrop-blur-sm border-gray-700/50 rounded-xl">
                  <style jsx global>{`
                    [data-state="checked"] {
                      background: ${color.get()}20 !important;
                      color: ${color.get()} !important;
                    }
                    [data-highlighted] {
                      background: ${color.get()}10 !important;
                    }
                  `}</style>
                  <SelectItem value="all" className="text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer">全部类型</SelectItem>
                  <SelectItem value="内容销售" className="text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer">内容销售</SelectItem>
                  <SelectItem value="投票分成" className="text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer">投票分成</SelectItem>
                  <SelectItem value="打赏收入" className="text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer">打赏收入</SelectItem>
                  <SelectItem value="推荐奖励" className="text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer">推荐奖励</SelectItem>
                </SelectContent>
              </Select>
            </div>
              <div className="space-y-4">
                {filteredRecords.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-900/30 rounded-xl hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${record.type === "内容销售" ? "bg-blue-500/20 text-blue-400" : ""}
                          ${record.type === "投票分成" ? "bg-green-500/20 text-green-400" : ""}
                          ${record.type === "打赏收入" ? "bg-yellow-500/20 text-yellow-400" : ""}
                          ${record.type === "推荐奖励" ? "bg-purple-500/20 text-purple-400" : ""}
                        `}>
                          {record.type}
                        </span>
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${record.status === "已到账" ? "bg-green-500/20 text-green-400" : ""}
                          ${record.status === "处理中" ? "bg-yellow-500/20 text-yellow-400" : ""}
                        `}>
                          {record.status}
                        </span>
                      </div>
                      <div className="font-medium mb-1 text-white">{record.source}</div>
                      <div className="text-sm text-gray-400">{record.date}</div>
                    </div>
                    <motion.div
                      className="text-right"
                      style={{ color }}
                    >
                      <div className="font-bold text-lg">
                        +¥{record.amount}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
          </motion.div>
        </TabsContent>

        {/* Purchase History Tab */}
        <TabsContent value="purchases" className="mt-6">
          <h2 className="text-2xl md:text-3xl font-light text-white mb-6">购买记录</h2>

          <div className="space-y-4">
            {purchaseHistory.map((purchase, index) => (
              <motion.div
                key={purchase.id}
                initial={{
                  opacity: 0,
                  x: -20,
                  boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.05)`
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-gray-950/30 backdrop-blur-sm hover:bg-gray-900/20 transition-all duration-300"
                whileHover={{
                  boxShadow: `inset 0 2px 0 0 ${color.get()}40, 0 0 0 1px ${color.get()}30, 0 4px 12px ${color.get()}20`
                }}
                style={{ border }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1 text-white">{purchase.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      作者：{purchase.author}
                    </p>
                    <p className="text-xs text-gray-500">
                      购买时间：{purchase.purchaseDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <motion.div
                      className="font-bold mb-2 text-lg"
                      style={{ color }}
                    >
                      ¥{purchase.price}
                    </motion.div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                      已完成
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
