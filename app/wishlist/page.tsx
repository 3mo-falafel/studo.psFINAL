import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { WishlistItems } from "@/components/wishlist/wishlist-items"
import { WishlistHeader } from "@/components/wishlist/wishlist-header"

export default function WishlistPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <WishlistHeader />
          <WishlistItems />
        </div>
      </main>

      <Footer />
    </div>
  )
}
