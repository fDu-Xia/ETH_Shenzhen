import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#1E1B3A] text-white">
      <Header />
      <main>
        <HeroSection />
      </main>
      <Footer />
    </div>
  )
}
