"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart, Menu, Instagram, MessageCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/lib/redux/hooks"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CartSidebar } from "@/components/cart/cart-sidebar"
import { LanguageToggle } from "@/components/layout/language-toggle"
import { SearchBar } from "@/components/layout/search-bar"
import { useLanguage } from "@/lib/contexts/language-context"

export function Header() {
  const cartItems = useAppSelector((state) => state.cart.items)
  const wishlistItems = useAppSelector((state) => state.wishlist.items)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { t } = useLanguage()

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex h-16 md:h-20 items-center justify-between gap-4">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-colors">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <nav className="flex flex-col gap-4 mt-8 px-4">
                  <Link href="/" className="text-lg font-medium hover:text-primary transition-colors text-right">
                    {t("home")}
                  </Link>
                  <Link href="/shop" className="text-lg font-medium hover:text-primary transition-colors text-right">
                    {t("shop")}
                  </Link>
                  <Link href="/categories" className="text-lg font-medium hover:text-primary transition-colors text-right">
                    {t("categories")}
                  </Link>
                  <Link href="/track-order" className="text-lg font-medium hover:text-primary transition-colors text-right">
                    {t("trackOrder")}
                  </Link>
                  <Link href="/about" className="text-lg font-medium hover:text-primary transition-colors text-right">
                    {t("about")}
                  </Link>
                  <Link href="/contact" className="text-lg font-medium hover:text-primary transition-colors text-right">
                    {t("contact")}
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2 group flex-shrink-0 absolute left-1/2 -translate-x-1/2 lg:relative lg:left-auto lg:translate-x-0">
              <div className="relative w-24 h-10 md:w-32 md:h-12 transition-transform duration-300 group-hover:scale-105">
                <Image src="/images/studo-logo.jpg" alt="Studo.ps Logo" fill className="object-contain" priority />
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <SearchBar />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium hover:text-primary transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {t("home")}
              </Link>
              <Link
                href="/shop"
                className="text-sm font-medium hover:text-primary transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {t("shop")}
              </Link>
              <Link
                href="/categories"
                className="text-sm font-medium hover:text-primary transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {t("categories")}
              </Link>
              <Link
                href="/track-order"
                className="text-sm font-medium hover:text-primary transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {t("trackOrder")}
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium hover:text-primary transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {t("about")}
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium hover:text-primary transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {t("contact")}
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <LanguageToggle />

              {/* Instagram */}
              <a
                href="https://instagram.com/studo.ps"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:block"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/972599765211"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:block"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </a>

              <Link href="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                >
                  <Heart className="h-5 w-5" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center animate-scale-in font-semibold">
                      {wishlistItems.length}
                    </span>
                  )}
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(true)}
                className="relative hover:bg-primary/10 transition-all duration-300 hover:scale-110"
              >
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center animate-scale-in font-semibold shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <SearchBar />
          </div>
        </div>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
