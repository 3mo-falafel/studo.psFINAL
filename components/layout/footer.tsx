"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Instagram, Phone, MapPin, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/contexts/language-context"
import { TestimonialForm, TestimonialsDisplay } from "@/components/layout/testimonials"

interface Testimonial {
  id: string
  customer_name: string
  rating: number
  comment: string
  created_at: string
}

export function Footer() {
  const { t } = useLanguage()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials")
      const data = await response.json()
      setTestimonials(data.testimonials || [])
    } catch (error) {
      console.error("Failed to fetch testimonials:", error)
    }
  }
  
  return (
    <footer className="bg-gradient-to-br from-muted/50 via-background to-muted/30 border-t mt-20">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* About */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <div className="relative w-32 h-12 transition-transform duration-300 group-hover:scale-105">
                <Image src="/images/studo-logo.jpg" alt="Studo.ps Logo" fill className="object-contain" />
              </div>
            </Link>
            <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
              {t("trustedSource")}
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110"
              >
                <a href="https://instagram.com/studo.ps" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110"
              >
                <a href="https://wa.me/972599765211" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-balance">{t("quickLinks")}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/shop"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:-translate-x-1 inline-block"
                >
                  {t("shopAllProducts")}
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:-translate-x-1 inline-block"
                >
                  {t("categories")}
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:-translate-x-1 inline-block"
                >
                  {t("trackOrder")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:-translate-x-1 inline-block"
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:-translate-x-1 inline-block"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-balance">{t("customerService")}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/account"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:-translate-x-1 inline-block"
                >
                  {t("account")}
                </Link>
              </li>
              <li>
                <Link
                  href="/account/orders"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:-translate-x-1 inline-block"
                >
                  {t("trackOrders")}
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:-translate-x-1 inline-block"
                >
                  {t("wishlist")}
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:-translate-x-1 inline-block"
                >
                  {t("shippingInfo")}
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:-translate-x-1 inline-block"
                >
                  {t("returnsRefunds")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-balance">{t("contactUs")}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 group">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5 transition-transform group-hover:scale-110" />
                <span className="text-muted-foreground text-pretty leading-relaxed">{t("palestine")}</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="h-5 w-5 text-primary shrink-0 transition-transform group-hover:scale-110" />
                <a href="tel:+972599765211" className="text-muted-foreground hover:text-primary transition-colors" dir="ltr">
                  +972 59-976-5211
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Instagram className="h-5 w-5 text-primary shrink-0 transition-transform group-hover:scale-110" />
                <a
                  href="https://instagram.com/studo.ps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  @studo.ps
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <MessageCircle className="h-5 w-5 text-primary shrink-0 transition-transform group-hover:scale-110" />
                <a
                  href="https://wa.me/972599765211"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("messageWhatsApp")}
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-semibold">{t("newsletter")}</h4>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder={t("yourEmail")}
                  className="h-9 transition-all focus:ring-2 focus:ring-primary/20"
                />
                <Button size="sm" className="transition-all hover:scale-105 shadow-sm hover:shadow-md">
                  {t("subscribe")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold">{t("whatCustomersSay")}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t("realExperiences")}</p>
            </div>
            <TestimonialForm onSuccess={fetchTestimonials} />
          </div>
          <TestimonialsDisplay testimonials={testimonials} />
        </div>

        {/* Bottom bar */}
        <div className="border-t mt-8 md:mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Studo.ps. {t("allRightsReserved")}.</p>
        </div>
      </div>
    </footer>
  )
}
