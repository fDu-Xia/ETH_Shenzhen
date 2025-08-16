"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { motion, useMotionTemplate } from "motion/react"
import { useColorAnimation } from "@/components/color-animation-provider"
import { TrendingUp, BarChart3, DollarSign } from "lucide-react"

interface ContentDataChartsProps {
  contentId: string
}

// Mock data for charts
const readingTrendData = [
  { date: "01-01", views: 120 },
  { date: "01-02", views: 180 },
  { date: "01-03", views: 250 },
  { date: "01-04", views: 320 },
  { date: "01-05", views: 280 },
  { date: "01-06", views: 450 },
  { date: "01-07", views: 520 },
  { date: "01-08", views: 680 },
  { date: "01-09", views: 750 },
  { date: "01-10", views: 890 },
  { date: "01-11", views: 1020 },
  { date: "01-12", views: 1234 },
]

const votingTrendData = [
  { date: "01-01", likes: 5, dislikes: 1 },
  { date: "01-02", likes: 12, dislikes: 2 },
  { date: "01-03", likes: 18, dislikes: 3 },
  { date: "01-04", likes: 25, dislikes: 4 },
  { date: "01-05", likes: 32, dislikes: 5 },
  { date: "01-06", likes: 41, dislikes: 6 },
  { date: "01-07", likes: 48, dislikes: 7 },
  { date: "01-08", likes: 56, dislikes: 8 },
  { date: "01-09", likes: 67, dislikes: 9 },
  { date: "01-10", likes: 74, dislikes: 10 },
  { date: "01-11", likes: 82, dislikes: 11 },
  { date: "01-12", likes: 89, dislikes: 12 },
]

const priceTrendData = [
  { date: "01-01", price: 0.02 },
  { date: "01-02", price: 0.025 },
  { date: "01-03", price: 0.03 },
  { date: "01-04", price: 0.035 },
  { date: "01-05", price: 0.032 },
  { date: "01-06", price: 0.038 },
  { date: "01-07", price: 0.042 },
  { date: "01-08", price: 0.045 },
  { date: "01-09", price: 0.048 },
  { date: "01-10", price: 0.046 },
  { date: "01-11", price: 0.049 },
  { date: "01-12", price: 0.05 },
]

export function ContentDataCharts({ contentId }: ContentDataChartsProps) {
  const [activeTab, setActiveTab] = useState("reading")
  const color = useColorAnimation()
  const borderColor = useMotionTemplate`${color}33`
  const shadowColor = useMotionTemplate`0 4px 20px ${color}20`

  const tabIcons = {
    reading: TrendingUp,
    voting: BarChart3,
    price: DollarSign
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-950/30 backdrop-blur-sm border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <BarChart3 className="w-5 h-5" style={{ color: color.get() }} />
            </motion.div>
            数据分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800/30 border border-gray-700 p-1 rounded-full">
              {["reading", "voting", "price"].map((tab) => {
                const Icon = tabIcons[tab as keyof typeof tabIcons]
                const labels = {
                  reading: "阅读量趋势",
                  voting: "投票趋势",
                  price: "价格走势"
                }
                return (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 transition-all duration-300 rounded-full flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{labels[tab as keyof typeof labels]}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            <TabsContent value="reading" className="mt-6">
              <motion.div
                className="h-[300px] w-full p-4 rounded-xl bg-gray-800/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <ChartContainer
                  config={{
                    views: {
                      label: "阅读量",
                      color: color.get(),
                    },
                  }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={readingTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        contentStyle={{
                          backgroundColor: "rgba(17, 24, 39, 0.9)",
                          border: `1px solid ${color.get()}`,
                          borderRadius: "12px",
                          color: "#fff",
                          backdropFilter: "blur(8px)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke={color.get()}
                        strokeWidth={3}
                        dot={{ fill: color.get(), strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: color.get(), stroke: "#fff", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </motion.div>
            </TabsContent>

            <TabsContent value="voting" className="mt-6">
              <motion.div
                className="h-[300px] w-full p-4 rounded-xl bg-gray-800/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <ChartContainer
                  config={{
                    likes: {
                      label: "点赞",
                      color: color.get(),
                    },
                    dislikes: {
                      label: "踩",
                      color: "#6B7280",
                    },
                  }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={votingTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        contentStyle={{
                          backgroundColor: "rgba(17, 24, 39, 0.9)",
                          border: `1px solid ${color.get()}`,
                          borderRadius: "12px",
                          color: "#fff",
                          backdropFilter: "blur(8px)",
                        }}
                      />
                      <Bar dataKey="likes" fill={color.get()} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="dislikes" fill="#6B7280" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </motion.div>
            </TabsContent>

            <TabsContent value="price" className="mt-6">
              <motion.div
                className="h-[300px] w-full p-4 rounded-xl bg-gray-800/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <ChartContainer
                  config={{
                    price: {
                      label: "价格 (MON)",
                      color: color.get(),
                    },
                  }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={priceTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `${value} MON`} />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        contentStyle={{
                          backgroundColor: "rgba(17, 24, 39, 0.9)",
                          border: `1px solid ${color.get()}`,
                          borderRadius: "12px",
                          color: "#fff",
                          backdropFilter: "blur(8px)",
                        }}
                        formatter={(value) => [`${value} MON`, "价格"]}
                      />
                      <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={color.get()} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={color.get()} stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={color.get()}
                        strokeWidth={3}
                        fill="url(#priceGradient)"
                        dot={{ fill: color.get(), strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: color.get(), stroke: "#fff", strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
