import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: number | string
  name: string
  price: number
  image: string
  fabric?: string
  quantity: number
}

interface FlyAnimation {
  id: number
  image: string
  rect: { x: number; y: number; width: number; height: number }
}

interface CartStore {
  items: CartItem[]
  animations: FlyAnimation[]
  addItem: (item: CartItem) => void
  removeItem: (id: number | string) => void
  updateQuantity: (id: number | string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getItemCount: () => number
  triggerFly: (image: string, element: HTMLElement) => void
  removeAnimation: (id: number) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      animations: [],

      addItem: (newItem) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item) => item.id === newItem.id)

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
          })
        } else {
          set({ items: [...currentItems, newItem] })
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      triggerFly: (image, element) => {
        const rect = element.getBoundingClientRect()
        const id = Date.now()
        set({
          animations: [
            ...get().animations,
            { id, image, rect: { x: rect.left, y: rect.top, width: rect.width, height: rect.height } }
          ]
        })
      },

      removeAnimation: (id) => {
        set({
          animations: get().animations.filter(a => a.id !== id)
        })
      }
    }),
    {
      name: "shailoom-cart",
      partialize: (state) => ({ items: state.items }), // Only persist items, not animations
    }
  )
)
