"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, TrendingUp, Clock, DollarSign } from "lucide-react"
import { usePathname } from "next/navigation"

export function SearchAndFilters() {
  const pathname = usePathname()
  const currentLocale = pathname.startsWith('/en') ? 'en' : 'zh'

  const translations = {
    zh: {
      hot: "热门",
      latest: "最新",
      price: "价格",
      sort: "排序:",
      searchPlaceholder: "搜索内容、创作者或标签..."
    },
    en: {
      hot: "Hot",
      latest: "Latest",
      price: "Price",
      sort: "Sort:",
      searchPlaceholder: "Search content, creators, or tags..."
    }
  }

  const t = translations[currentLocale as keyof typeof translations]

  const [activeFilter, setActiveFilter] = useState(t.hot)
  const [searchQuery, setSearchQuery] = useState("")

  const filters = [
    { name: t.hot, icon: TrendingUp, key: 'hot' },
    { name: t.latest, icon: Clock, key: 'latest' },
    { name: t.price, icon: DollarSign, key: 'price' },
  ]

  const handleFilterClick = (filterKey: string) => {
    const filter = filters.find(f => f.key === filterKey)
    if (filter) {
      setActiveFilter(filter.name)
    }
  }

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-[#2A2147] border-purple-700/50 text-white placeholder-gray-400 focus:border-purple-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400">{t.sort}</span>
        </div>

        {filters.map((filter) => {
          const Icon = filter.icon
          return (
            <Button
              key={filter.key}
              variant={activeFilter === filter.name ? "default" : "ghost"}
              size="sm"
              onClick={() => handleFilterClick(filter.key)}
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
