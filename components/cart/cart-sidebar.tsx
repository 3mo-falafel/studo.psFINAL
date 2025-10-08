"use client"

import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { removeFromCart, updateQuantity } from "@/lib/redux/slices/cart-slice"
import Image from "next/image"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector((state) => state.cart.items)
  const total = useAppSelector((state) => state.cart.total)

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id))
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      dispatch(removeFromCart(id))
    } else {
      dispatch(updateQuantity({ id, quantity }))
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              Shopping Cart
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-primary/10">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground/20 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">Add some products to get started!</p>
            <Button onClick={onClose} asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1 truncate">{item.name}</h4>
                      <p className="text-lg font-bold text-primary mb-2">₪{item.price.toFixed(2)}</p>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 bg-transparent"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 bg-transparent"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemove(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t p-6 space-y-4 bg-muted/30">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₪{total.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₪{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout" onClick={onClose}>
                    Checkout
                  </Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent" size="lg" onClick={onClose} asChild>
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
