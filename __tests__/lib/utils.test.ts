import { describe, it, expect } from "vitest"
import { cn } from "@/lib/utils"

describe("cn utility", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "active")).toBe("base active")
  })

  it("handles undefined and null", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end")
  })

  it("merges tailwind classes correctly", () => {
    // twMerge should deduplicate conflicting tailwind classes
    expect(cn("px-4", "px-6")).toBe("px-6")
    expect(cn("text-sm", "text-lg")).toBe("text-lg")
  })

  it("handles empty input", () => {
    expect(cn()).toBe("")
  })
})
