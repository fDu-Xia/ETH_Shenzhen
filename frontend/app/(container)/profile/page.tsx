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
  username: "Blockchain Researcher",
  avatar: "/blockchain-researcher.png",
  bio: "Focused on blockchain technology research and Web3 ecosystem analysis, with 5 years of industry experience",
  joinDate: "March 2023",
  totalEarnings: "12,450",
  totalViews: "45,230",
  totalContent: 23,
};

// Mock content data
const userContent = [
  {
    id: "1",
    title: "Future Development Trends of Web3 Social Networks",
    preview: "/web3-social-network-future.png",
    publishDate: "2024-01-15",
    views: 2340,
    earnings: "450.00",
    status: "published" as const,
  },
  {
    id: "2",
    title: "Complete Guide to DeFi Protocol Security Audit",
    preview: "/defi-security-audit.png",
    publishDate: "2024-01-10",
    views: 1890,
    earnings: "320.50",
    status: "published" as const,
  },
  {
    id: "3",
    title: "Common Smart Contract Vulnerability Analysis",
    preview: "/smart-contract-vulnerabilities.png",
    publishDate: "2024-01-08",
    views: 0,
    earnings: "0.00",
    status: "draft" as const,
  },
  {
    id: "4",
    title: "Decentralized Storage Solution Comparison",
    preview: "/decentralized-storage-comparison.png",
    publishDate: "2024-01-05",
    views: 1560,
    earnings: "280.00",
    status: "removed" as const,
  },
];

const monthlyIncomeData = [
  { month: "Oct", income: 2340, contentSales: 1800, votingRevenue: 540 },
  { month: "Nov", income: 3120, contentSales: 2400, votingRevenue: 720 },
  { month: "Dec", income: 2890, contentSales: 2200, votingRevenue: 690 },
  { month: "Jan", income: 4100, contentSales: 3200, votingRevenue: 900 },
  { month: "Feb", income: 3650, contentSales: 2800, votingRevenue: 850 },
  { month: "Mar", income: 4500, contentSales: 3500, votingRevenue: 1000 },
];

const incomeSourceData = [
  { name: "Content Sales", value: 18200, color: "#8B5CF6" },
  { name: "Voting Revenue", value: 4700, color: "#A855F7" },
  { name: "Tips Income", value: 1800, color: "#9333EA" },
  { name: "Referral Rewards", value: 800, color: "#7C3AED" },
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
    type: "Content Sales",
    amount: "420.00",
    source: "Future Development Trends of Web3 Social Networks",
    status: "Received",
  },
  {
    id: "2",
    date: "2024-03-14",
    type: "Voting Revenue",
    amount: "85.50",
    source: "Complete Guide to DeFi Protocol Security Audit",
    status: "Received",
  },
  {
    id: "3",
    date: "2024-03-13",
    type: "Content Sales",
    amount: "350.00",
    source: "Common Smart Contract Vulnerability Analysis",
    status: "Received",
  },
  {
    id: "4",
    date: "2024-03-12",
    type: "Tips Income",
    amount: "120.00",
    source: "Decentralized Storage Solution Comparison",
    status: "Processing",
  },
  {
    id: "5",
    date: "2024-03-11",
    type: "Referral Rewards",
    amount: "50.00",
    source: "New User Referral Registration",
    status: "Received",
  },
];

const purchaseHistory = [
  {
    id: "1",
    title: "Decentralized Storage Solution Comparison",
    author: "Blockchain Researcher",
    purchaseDate: "2024-03-10",
    price: "280.00",
  },
  {
    id: "2",
    title: "Common Smart Contract Vulnerability Analysis",
    author: "Blockchain Researcher",
    purchaseDate: "2024-03-09",
    price: "180.00",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "published":
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          Published
        </Badge>
      );
    case "draft":
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          Draft
        </Badge>
      );
    case "removed":
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          Removed
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
    const matchesType = filterType === "all" ||
      (filterType === "Content Sales" && record.type === "Content Sales") ||
      (filterType === "Voting Revenue" && record.type === "Voting Revenue") ||
      (filterType === "Tips Income" && record.type === "Tips Income") ||
      (filterType === "Referral Rewards" && record.type === "Referral Rewards");
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
                  Joined: {userData.joinDate}
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
                Edit Profile
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
                <div className="text-sm text-gray-400">Published</div>
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
                <div className="text-sm text-gray-400">Total Views</div>
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
                <div className="text-sm text-gray-400">Total Income</div>
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
            My Content
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
            Income Stats
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
            Purchase History
          </motion.button>
        </motion.div>

        {/* My Content Tab */}
        <TabsContent value="content" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-light text-white">My Content</h2>
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
              Publish New Content
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
                      Edit
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
                          Delete
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
              <p className="text-sm font-medium text-gray-400 mb-2">Total Income</p>
              <div className="text-2xl font-bold text-green-400">¥25,500</div>
              <p className="text-xs text-gray-500">Cumulative Income</p>
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
              <p className="text-sm font-medium text-gray-400 mb-2">This Month</p>
              <motion.div className="text-2xl font-bold" style={{ color }}>¥4,500</motion.div>
              <p className="text-xs text-gray-500">+9.8% vs last month</p>
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
              <p className="text-sm font-medium text-gray-400 mb-2">Content Sales Revenue</p>
              <div className="text-2xl font-bold text-blue-400">¥18,200</div>
              <p className="text-xs text-gray-500">71% of total</p>
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
              <p className="text-sm font-medium text-gray-400 mb-2">Voting Revenue</p>
              <div className="text-2xl font-bold text-yellow-400">¥4,700</div>
              <p className="text-xs text-gray-500">18% of total</p>
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
              <div className="text-sm text-gray-400">Total Content</div>
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
              <div className="text-sm text-gray-400">Total Views</div>
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
              <div className="text-sm text-gray-400">Total Votes</div>
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
              <div className="text-sm text-gray-400">Avg. Income per Article</div>
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
              <div className="text-sm text-gray-400">Followers</div>
            </motion.div>
          </div>

          {/* Income Trend Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Income Trend */}
            <motion.div
              className="p-6 rounded-2xl bg-gray-950/30 backdrop-blur-sm"
              style={{ border, boxShadow }}
            >
              <h3 className="text-lg font-medium mb-4 text-white">Monthly Income Trend</h3>
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
              <h3 className="text-lg font-medium mb-4 text-white">Income Source Distribution</h3>
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
            <h3 className="text-lg font-medium mb-4 text-white">Last 30 Days Income</h3>
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
              <h3 className="text-lg font-medium text-white">Detailed Income Records</h3>
              <motion.button
                style={{ boxShadow: buttonShadow }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-900/50 text-white backdrop-blur-sm transition-colors hover:bg-gray-900/70 flex items-center gap-2 border border-gray-700/50"
              >
                <Download className="w-4 h-4" />
                Export
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
                  placeholder="Search income records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-950/30 backdrop-blur-sm rounded-full text-white placeholder-gray-400 focus:outline-none focus:bg-gray-950/50 transition-colors"
                />
              </motion.div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48 bg-gray-900/50 border-gray-700/50 focus:border-gray-600 text-white rounded-xl h-12 hover:bg-gray-900/70 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter Type" />
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
                  <SelectItem value="all" className="text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer">All Types</SelectItem>
                  <SelectItem value="Content Sales" className="text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer">Content Sales</SelectItem>
                  <SelectItem value="Voting Revenue" className="text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer">Voting Revenue</SelectItem>
                  <SelectItem value="Tips Income" className="text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer">Tips Income</SelectItem>
                  <SelectItem value="Referral Rewards" className="text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer">Referral Rewards</SelectItem>
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
                          ${record.type === "Content Sales" ? "bg-blue-500/20 text-blue-400" : ""}
                          ${record.type === "Voting Revenue" ? "bg-green-500/20 text-green-400" : ""}
                          ${record.type === "Tips Income" ? "bg-yellow-500/20 text-yellow-400" : ""}
                          ${record.type === "Referral Rewards" ? "bg-purple-500/20 text-purple-400" : ""}
                        `}>
                          {record.type}
                        </span>
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${record.status === "Received" ? "bg-green-500/20 text-green-400" : ""}
                          ${record.status === "Processing" ? "bg-yellow-500/20 text-yellow-400" : ""}
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
          <h2 className="text-2xl md:text-3xl font-light text-white mb-6">Purchase History</h2>

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
                      Author: {purchase.author}
                    </p>
                    <p className="text-xs text-gray-500">
                      Purchase Date: {purchase.purchaseDate}
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
                      Completed
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
