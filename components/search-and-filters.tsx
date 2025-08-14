"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, TrendingUp, Clock, DollarSign } from "lucide-react"

export function SearchAndFilters() {
  const [activeFilter, setActiveFilter] = useState("热门")
  const [searchQuery, setSearchQuery] = useState("")

  const filters = [
    { name: "热门", icon: TrendingUp },
    { name: "最新", icon: Clock },
    { name: "价格", icon: DollarSign },
  ]

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="搜索内容、创作者或标签..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-[#2A2147] border-purple-700/50 text-white placeholder-gray-400 focus:border-purple-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400">排序:</span>
        </div>

        {filters.map((filter) => {
          const Icon = filter.icon
          return (
            <Button
              key={filter.name}
              variant={activeFilter === filter.name ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveFilter(filter.name)}
              className={
                activeFilter === filter.name
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                  : "text-gray-400 hover:text-purple-400 hover:bg-purple-900/20"
              }
            >
              <Icon className="w-4 h-4 mr-2" />
              {filter.name}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
