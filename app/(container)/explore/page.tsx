import { ContentGrid } from "@/components/content-grid";
import { SearchAndFilters } from "@/components/search-and-filters";

export default function ExplorePage() {
  return (
    <>
      <section className="pt-16">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              内容展台
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              探索最新最热的优质内容，发现投资机会
            </p>
          </div>
        </div>
      </section>

      {/* Content Showcase */}
      <div className="container mx-auto py-12">
        <SearchAndFilters />
        <ContentGrid />
      </div>
    </>
  );
}
