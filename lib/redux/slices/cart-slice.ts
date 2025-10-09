import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  slug: string
  stock?: number // Optional: track available stock
}

interface CartState {
  items: CartItem[]
  total: number
}

const initialState: CartState = {
  items: [],
  total: 0,
}

// Load cart from localStorage if available
if (typeof window !== "undefined") {
  const savedCart = localStorage.getItem("cart")
  if (savedCart) {
    try {
      const parsed = JSON.parse(savedCart)
      initialState.items = parsed.items || []
      initialState.total = parsed.total || 0
    } catch (e) {
      console.error("Failed to parse cart from localStorage", e)
    }
  }
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      // Prevent adding out-of-stock items (stock = 0)
      if (action.payload.stock !== undefined && action.payload.stock <= 0) {
        console.warn(`Cannot add ${action.payload.name} to cart: Out of stock`)
        return
      }
      
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (existingItem) {
        // Check stock limit if stock is provided
        if (action.payload.stock !== undefined && existingItem.quantity >= action.payload.stock) {
          // Don't add more if we've reached stock limit
          console.warn(`Cannot add more ${action.payload.name}: Stock limit (${action.payload.stock}) reached`)
          return
        }
        existingItem.quantity += 1
        // Update stock value if provided
        if (action.payload.stock !== undefined) {
          existingItem.stock = action.payload.stock
        }
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }

      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state))
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state))
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id)

      if (item) {
        item.quantity = action.payload.quantity
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== action.payload.id)
        }
      }

      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state))
      }
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0

      if (typeof window !== "undefined") {
        localStorage.removeItem("cart")
      }
    },
    updateCartItemStock: (state, action: PayloadAction<{ id: string; stock: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id)
      
      if (item) {
        item.stock = action.payload.stock
        
        // If item quantity exceeds new stock, adjust it
        if (action.payload.stock <= 0) {
          // Remove item if out of stock
          state.items = state.items.filter((i) => i.id !== action.payload.id)
        } else if (item.quantity > action.payload.stock) {
          // Reduce quantity to match available stock
          item.quantity = action.payload.stock
        }
        
        // Recalculate total
        state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        
        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("cart", JSON.stringify(state))
        }
      }
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, updateCartItemStock } = cartSlice.actions
export default cartSlice.reducer
