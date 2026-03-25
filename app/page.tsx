import { Hero } from "@/components/hero"
import { Categories } from "@/components/categories"
import { NewArrivals } from "@/components/new-arrivals"
import { PromotionalBanner } from "@/components/promotional-banner"
import { OurStory } from "@/components/our-story"

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Categories />
      <NewArrivals />
      <PromotionalBanner />
      <OurStory />
    </main>
  )
}
