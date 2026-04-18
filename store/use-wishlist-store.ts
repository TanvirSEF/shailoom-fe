import { create } from "zustand";
import { userService } from "@/lib/services/user-service";

interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  category?: string;
  stock?: number;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearLocal: () => void;
}

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  items: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const data = await userService.getWishlist();
      set({ items: data || [], isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (productId: string) => {
    try {
      await userService.addToWishlist(productId);
      await get().fetchWishlist();
    } catch (error: any) {
      throw error;
    }
  },

  removeItem: async (productId: string) => {
    try {
      await userService.removeFromWishlist(productId);
      set((state) => ({
        items: state.items.filter((item) => item._id !== productId),
      }));
    } catch (error: any) {
      throw error;
    }
  },

  isInWishlist: (productId: string) => {
    return get().items.some((item) => item._id === productId);
  },

  clearLocal: () => set({ items: [] }),
}));
