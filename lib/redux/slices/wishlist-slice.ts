import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  slug: string
}

interface WishlistState {
  items: WishlistItem[]
}

const initialState: WishlistState = {
  items: [],
}

// Load wishlist from localStorage if available
if (typeof window !== "undefined") {
  const savedWishlist = localStorage.getItem("wishlist")
  if (savedWishlist) {
    try {
      const parsed = JSON.parse(savedWishlist)
      initialState.items = parsed.items || []
    } catch (e) {
      console.error("Failed to parse wishlist from localStorage", e)
    }
  }
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.find((item) => item.id === action.payload.id)

      if (!exists) {
        state.items.push(action.payload)

        if (typeof window !== "undefined") {
          localStorage.setItem("wishlist", JSON.stringify(state))
        }
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)

      if (typeof window !== "undefined") {
        localStorage.setItem("wishlist", JSON.stringify(state))
      }
    },
    clearWishlist: (state) => {
      state.items = []

      if (typeof window !== "undefined") {
        localStorage.removeItem("wishlist")
      }
    },
  },
})

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
