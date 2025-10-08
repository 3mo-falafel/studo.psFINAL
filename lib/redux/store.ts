import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "./slices/cart-slice"
import wishlistReducer from "./slices/wishlist-slice"
import authReducer from "./slices/auth-slice"

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
