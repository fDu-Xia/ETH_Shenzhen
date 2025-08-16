"use client"

import { useState } from "react"
import { Search, Filter, TrendingUp, Clock, DollarSign } from "lucide-react"
import { motion, useMotionTemplate } from "motion/react"
import { useColorAnimation } from "@/components/color-animation-provider"

export function SearchAndFilters() {
  const [activeFilter, setActiveFilter] = useState("热门")
  const [searchQuery, setSearchQuery] = useState("")
  const color = useColorAnimation()
  
  const border = useMotionTemplate`1px solid ${color}`
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}20`
  const focusBoxShadow = useMotionTemplate`0px 4px 24px ${color}40`

  const filters = [
    { name: "热门", icon: TrendingUp },
    { name: "最新", icon: Clock },
    { name: "价格", icon: DollarSign },
  ]

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <motion.div
        className="relative mb-6 rounded-full"
        style={{
          border,
          boxShadow,
        }}
      >
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
        <input
          type="text"
          placeholder="搜索内容、创作者或标签..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-950/30 backdrop-blur-sm rounded-full text-white placeholder-gray-400 focus:outline-none focus:bg-gray-950/50 transition-colors"
        />
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400">排序:</span>
        </div>

        <div className="bg-gray-800/40 backdrop-blur-sm rounded-full p-1 flex items-center gap-1">
          {filters.map((filter) => {
            const Icon = filter.icon
            const isActive = activeFilter === filter.name
            
            return isActive ? (
              <motion.button
                key={filter.name}
                style={{
                  border,
                  boxShadow,
                }}
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={() => setActiveFilter(filter.name)}
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-950/30 text-white backdrop-blur-sm transition-colors hover:bg-gray-950/50 flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {filter.name}
              </motion.button>
            ) : (
              <button
                key={filter.name}
                onClick={() => setActiveFilter(filter.name)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 text-gray-300 hover:text-white hover:bg-gray-700/50 flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {filter.name}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
