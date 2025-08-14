"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Users, Zap } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

export function HeroSection() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = pathname.startsWith('/en') ? 'en' : 'zh'

  const navigateToExplore = () => {
    router.push(`/${currentLocale}/explore`)
  }

  const content = {
    zh: {
      title: "发现和投资\n优质内容",
      subtitle: "通过代币化让优质内容获得应有价值，创作者直接从社区获得收益，投资者分享内容成功的回报",
      cta: "开始探索",
      stats: {
        investment: "内容投资总额",
        users: "活跃用户",
        content: "优质内容"
      }
    },
    en: {
      title: "Discover and Invest in\nQuality Content",
      subtitle: "Through tokenization, quality content gets its deserved value, creators earn directly from the community, and investors share in content success returns",
      cta: "Start Exploring",
      stats: {
        investment: "Total Content Investment",
        users: "Active Users",
        content: "Quality Content"
      }
    }
  }

  const t = content[currentLocale as keyof typeof content]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1E1B3A] via-[#2D1B69] to-[#1E1B3A] py-20">
    {/* <section className="relative overflow-hidden py-20"> */}
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10 animate-background"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent whitespace-pre-line">
            {t.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 text-lg cursor-pointer"
              onClick={navigateToExplore}
            >
              {t.cta}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-purple-400 mr-2" />
                <span className="text-2xl font-bold text-white">1.2M+</span>
              </div>
              <p className="text-gray-400">{t.stats.investment}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-purple-400 mr-2" />
                <span className="text-2xl font-bold text-white">50K+</span>
              </div>
              <p className="text-gray-400">{t.stats.users}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="w-6 h-6 text-purple-400 mr-2" />
                <span className="text-2xl font-bold text-white">10K+</span>
              </div>
              <p className="text-gray-400">{t.stats.content}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
