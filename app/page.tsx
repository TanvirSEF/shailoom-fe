import { Hero } from "@/components/hero"
import { Categories } from "@/components/categories"

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Categories />
      {/* Additional sections can be added here */}
    </main>
  )
}
