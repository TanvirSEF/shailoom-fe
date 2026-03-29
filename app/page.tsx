import { Hero } from "@/components/hero"
import { ServiceFeatures } from "@/components/service-features"
import { Categories } from "@/components/categories"
import { NewArrivals } from "@/components/new-arrivals"
import { PromotionalBanner } from "@/components/promotional-banner"
import { Lookbook } from "@/components/lookbook"
import { Testimonials } from "@/components/testimonials"
import { OurStory } from "@/components/our-story"

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <ServiceFeatures />
      <Categories />
      <NewArrivals />
      <PromotionalBanner />
      <Lookbook />
      <Testimonials />
      <OurStory />
    </main>
  )
}
