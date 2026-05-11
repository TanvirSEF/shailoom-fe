import { describe, it, expect, beforeEach } from "vitest"
import { useCartStore } from "@/store/use-cart-store"
import { act } from "@testing-library/react"

describe("useCartStore", () => {
  beforeEach(() => {
    act(() => {
      useCartStore.setState({ items: [], animations: [] })
    })
  })

  it("starts with empty cart", () => {
    const state = useCartStore.getState()
    expect(state.items).toEqual([])
    expect(state.getItemCount()).toBe(0)
    expect(state.getTotalPrice()).toBe(0)
  })

  it("adds an item to cart", () => {
    act(() => {
      useCartStore.getState().addItem({
        id: 1,
        name: "Test Saree",
        price: 3500,
        image: "/test.png",
        quantity: 1,
      })
    })

    const state = useCartStore.getState()
    expect(state.items).toHaveLength(1)
    expect(state.items[0].name).toBe("Test Saree")
    expect(state.getItemCount()).toBe(1)
    expect(state.getTotalPrice()).toBe(3500)
  })

  it("increments quantity when adding existing item", () => {
    act(() => {
      const store = useCartStore.getState()
      store.addItem({ id: 1, name: "Saree", price: 1000, image: "/t.png", quantity: 1 })
      store.addItem({ id: 1, name: "Saree", price: 1000, image: "/t.png", quantity: 1 })
    })

    const state = useCartStore.getState()
    expect(state.items).toHaveLength(1)
    expect(state.items[0].quantity).toBe(2)
    expect(state.getTotalPrice()).toBe(2000)
  })

  it("removes an item from cart", () => {
    act(() => {
      const store = useCartStore.getState()
      store.addItem({ id: 1, name: "Saree", price: 1000, image: "/t.png", quantity: 1 })
      store.addItem({ id: 2, name: "Kurta", price: 2000, image: "/t.png", quantity: 1 })
    })

    act(() => {
      useCartStore.getState().removeItem(1)
    })

    const state = useCartStore.getState()
    expect(state.items).toHaveLength(1)
    expect(state.items[0].name).toBe("Kurta")
  })

  it("updates item quantity", () => {
    act(() => {
      useCartStore.getState().addItem({ id: 1, name: "Saree", price: 1000, image: "/t.png", quantity: 1 })
    })

    act(() => {
      useCartStore.getState().updateQuantity(1, 5)
    })

    expect(useCartStore.getState().items[0].quantity).toBe(5)
    expect(useCartStore.getState().getTotalPrice()).toBe(5000)
  })

  it("removes item when quantity set to 0", () => {
    act(() => {
      useCartStore.getState().addItem({ id: 1, name: "Saree", price: 1000, image: "/t.png", quantity: 1 })
    })

    act(() => {
      useCartStore.getState().updateQuantity(1, 0)
    })

    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it("clears the entire cart", () => {
    act(() => {
      const store = useCartStore.getState()
      store.addItem({ id: 1, name: "Saree", price: 1000, image: "/t.png", quantity: 2 })
      store.addItem({ id: 2, name: "Kurta", price: 2000, image: "/t.png", quantity: 1 })
    })

    act(() => {
      useCartStore.getState().clearCart()
    })

    expect(useCartStore.getState().items).toHaveLength(0)
    expect(useCartStore.getState().getTotalPrice()).toBe(0)
  })

  it("calculates total price correctly with multiple items", () => {
    act(() => {
      const store = useCartStore.getState()
      store.addItem({ id: 1, name: "Saree", price: 3500, image: "/t.png", quantity: 2 })
      store.addItem({ id: 2, name: "Kurta", price: 1200, image: "/t.png", quantity: 3 })
    })

    // (3500 * 2) + (1200 * 3) = 7000 + 3600 = 10600
    expect(useCartStore.getState().getTotalPrice()).toBe(10600)
    expect(useCartStore.getState().getItemCount()).toBe(5)
  })
})
