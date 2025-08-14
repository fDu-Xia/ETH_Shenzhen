import { ContentGrid } from "@/components/content-grid";
import { SearchAndFilters } from "@/components/search-and-filters";

export default function ExplorePage() {
  return (
    <>
      <section className="pt-16 pb-8">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-light mb-6 text-white tracking-tight">
              探索
              <span className="font-normal"> · </span>
              投资
              <span className="font-normal"> · </span>
              共创
            </h1>
            <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
              在这里，每一份优质内容都是一次投资机会。
              <br className="hidden md:block" />
              与创作者共同成长，分享知识价值的复利。
            </p>
          </div>
        </div>
      </section>

      {/* Content Showcase */}
      <div className="container mx-auto pb-12">
        <SearchAndFilters />
        <ContentGrid />
      </div>
    </>
  );
}
