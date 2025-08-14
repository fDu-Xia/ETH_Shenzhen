import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContentGrid } from "@/components/content-grid"
import { SearchAndFilters } from "@/components/search-and-filters"

export default async function ExplorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const translations = {
    zh: {
      contentShowcase: "内容展台",
      exploreDescription: "探索最新最热的优质内容，发现投资机会"
    },
    en: {
      contentShowcase: "Content Showcase",
      exploreDescription: "Explore the latest and hottest quality content, discover investment opportunities"
    }
  };

  const t = translations[locale as keyof typeof translations];

  return (
    <div className="min-h-screen bg-[#1E1B3A] text-white">
      <Header />
      <main>
        {/* Page Header */}
        <section className="bg-gradient-to-br from-[#1E1B3A] via-[#2D1B69] to-[#1E1B3A] py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                {t.contentShowcase}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8">{t.exploreDescription}</p>
            </div>
          </div>
        </section>

        {/* Content Showcase */}
        <div className="container mx-auto px-4 py-12">
          <SearchAndFilters />
          <ContentGrid />
        </div>
      </main>
      <Footer />
    </div>
  )
}
