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

  return (
    <Card className="bg-[#2A2550] border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">数据分析</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#1E1B3A] border border-purple-500/20">
            <TabsTrigger
              value="reading"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 transition-all duration-300"
            >
              阅读量趋势
            </TabsTrigger>
            <TabsTrigger
              value="voting"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 transition-all duration-300"
            >
              投票趋势
            </TabsTrigger>
            <TabsTrigger
              value="price"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 transition-all duration-300"
            >
              价格走势
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reading" className="mt-6">
            <div className="h-[300px] w-full">
              <ChartContainer
                config={{
                  views: {
                    label: "阅读量",
                    color: "#8B5CF6",
                  },
                }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={readingTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      contentStyle={{
                        backgroundColor: "#2A2550",
                        border: "1px solid #8B5CF6",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: "#A855F7" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="voting" className="mt-6">
            <div className="h-[300px] w-full">
              <ChartContainer
                config={{
                  likes: {
                    label: "点赞",
                    color: "#8B5CF6",
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      contentStyle={{
                        backgroundColor: "#2A2550",
                        border: "1px solid #8B5CF6",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="likes" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="dislikes" fill="#6B7280" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="price" className="mt-6">
            <div className="h-[300px] w-full">
              <ChartContainer
                config={{
                  price: {
                    label: "价格 (ETH)",
                    color: "#8B5CF6",
                  },
                }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `${value} ETH`} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      contentStyle={{
                        backgroundColor: "#2A2550",
                        border: "1px solid #8B5CF6",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                      formatter={(value) => [`${value} ETH`, "价格"]}
                    />
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      fill="url(#priceGradient)"
                      dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: "#A855F7" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
