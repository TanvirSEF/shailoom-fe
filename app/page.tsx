import { Hero } from "@/components/hero"
import { Categories } from "@/components/categories"
import { NewArrivals } from "@/components/new-arrivals"

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Categories />
      <NewArrivals />
      {/* Additional sections can be added here */}
    </main>
  )
}
