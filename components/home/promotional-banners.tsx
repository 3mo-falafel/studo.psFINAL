"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Tag, Zap, Percent } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"
import { CountdownTimer } from "./countdown-timer"
import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface Banner {
  id: string
  title: string
  subtitle?: string
  description?: string
  image_url: string
  background_image_url?: string
  link_url?: string
  button_text?: string
  button_link?: string
  badge_text?: string
  discount_percentage?: number
  countdown_end_time?: string
  position?: string
  banner_slot: number
  display_order: number
  is_active: boolean
}

interface PromotionalBannersProps {
  banners: Banner[]
}

export function PromotionalBanners({ banners: initialBanners }: PromotionalBannersProps) {
  const [banners, setBanners] = useState(initialBanners)
  const [currentIndexes, setCurrentIndexes] = useState({ slot1: 0, slot2: 0, slot3: 0 })
  const supabase = getSupabaseBrowserClient()
  
  // Filter active banners and group by slot
  const activeBanners = banners.filter((b) => b.is_active)
  
  const slot1Banners = activeBanners
    .filter(b => b.banner_slot === 1)
    .sort((a, b) => a.display_order - b.display_order)
  
  const slot2Banners = activeBanners
    .filter(b => b.banner_slot === 2)
    .sort((a, b) => a.display_order - b.display_order)
  
  const slot3Banners = activeBanners
    .filter(b => b.banner_slot === 3)
    .sort((a, b) => a.display_order - b.display_order)

  // Rotate banners every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndexes(prev => ({
        slot1: slot1Banners.length > 0 ? (prev.slot1 + 1) % slot1Banners.length : 0,
        slot2: slot2Banners.length > 0 ? (prev.slot2 + 1) % slot2Banners.length : 0,
        slot3: slot3Banners.length > 0 ? (prev.slot3 + 1) % slot3Banners.length : 0,
      }))
    }, 5000) // 5 seconds

    return () => clearInterval(interval)
  }, [slot1Banners.length, slot2Banners.length, slot3Banners.length])

  // Get current banner for each slot
  const largeBanner = slot1Banners[currentIndexes.slot1]
  const smallBanner1 = slot2Banners[currentIndexes.slot2]
  const smallBanner2 = slot3Banners[currentIndexes.slot3]

  const handleBannerExpire = async (bannerId: string) => {
    // Update banner to inactive when countdown expires
    await supabase.from("banners").update({ is_active: false }).eq("id", bannerId)
    setBanners(prev => prev.map(b => b.id === bannerId ? { ...b, is_active: false } : b))
  }

  if (!largeBanner && !smallBanner1 && !smallBanner2) return null

  return (
    <section className="container mx-auto px-4 py-8 md:py-16 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Large Banner */}
        {largeBanner && (
          <ScrollReveal direction="left" className="lg:row-span-2">
            <Link
              href={largeBanner.button_link || largeBanner.link_url || "#"}
              className="group relative block h-full min-h-[300px] md:min-h-[400px] lg:min-h-[600px] rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800">
                <Image
                  src={largeBanner.background_image_url || largeBanner.image_url || "/placeholder.svg?height=600&width=800"}
                  alt={largeBanner.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-6 md:p-8 lg:p-12 flex flex-col justify-end">
                {largeBanner.discount_percentage && largeBanner.discount_percentage > 0 && (
                  <Badge className="w-fit mb-3 md:mb-4 bg-red-600 hover:bg-red-700 text-white border-0 px-3 md:px-4 py-1 md:py-1.5 text-base md:text-lg font-bold">
                    <Percent className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-1.5" />
                    {largeBanner.discount_percentage}% OFF
                  </Badge>
                )}
                {!largeBanner.discount_percentage && (
                  <Badge className="w-fit mb-3 md:mb-4 bg-primary/90 hover:bg-primary text-white border-0 px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm font-semibold">
                    <Sparkles className="w-3.5 md:w-4 h-3.5 md:h-4 mr-1 md:mr-1.5" />
                    {largeBanner.badge_text || "Featured Offer"}
                  </Badge>
                )}
                <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 md:mb-4 text-balance leading-tight">
                  {largeBanner.title}
                </h2>
                {largeBanner.subtitle && (
                  <p className="text-base md:text-lg lg:text-xl text-white/90 mb-3 md:mb-4 text-pretty max-w-lg">{largeBanner.subtitle}</p>
                )}
                {largeBanner.description && (
                  <p className="text-sm md:text-base lg:text-lg text-white/80 mb-4 md:mb-6 text-pretty max-w-lg">{largeBanner.description}</p>
                )}
                {largeBanner.countdown_end_time && (
                  <div className="mb-4 md:mb-6">
                    <CountdownTimer 
                      endTime={largeBanner.countdown_end_time} 
                      onExpire={() => handleBannerExpire(largeBanner.id)}
                      className="text-white"
                    />
                  </div>
                )}
                {largeBanner.button_text && (
                  <Button
                    size="lg"
                    className="w-fit group-hover:translate-x-2 transition-transform bg-white text-primary hover:bg-white/90 text-sm md:text-base"
                  >
                    {largeBanner.button_text}
                    <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                  </Button>
                )}
              </div>
            </Link>
          </ScrollReveal>
        )}

        {/* Two Smaller Banners */}
        <div className="space-y-4 md:space-y-6">
          {smallBanner1 && (
            <ScrollReveal direction="right" delay={100}>
              <Link
                href={smallBanner1.button_link || smallBanner1.link_url || "#"}
                className="group relative block h-full min-h-[200px] md:min-h-[250px] lg:min-h-[280px] rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-700">
                  <Image
                    src={smallBanner1.background_image_url || smallBanner1.image_url || "/placeholder.svg?height=400&width=600"}
                    alt={smallBanner1.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-70"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-accent/60 via-accent/40 to-transparent" />
                <div className="absolute inset-0 p-5 md:p-6 lg:p-8 flex flex-col justify-end">
                  {smallBanner1.discount_percentage && smallBanner1.discount_percentage > 0 && (
                    <Badge className="w-fit mb-2 md:mb-3 bg-red-600 hover:bg-red-700 text-white border-0 px-2.5 md:px-3 py-0.5 md:py-1 text-sm md:text-base font-bold">
                      <Percent className="w-3.5 md:w-4 h-3.5 md:h-4 mr-1" />
                      {smallBanner1.discount_percentage}% OFF
                    </Badge>
                  )}
                  {!smallBanner1.discount_percentage && (
                    <Badge className="w-fit mb-2 md:mb-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 px-2.5 md:px-3 py-0.5 md:py-1 text-xs font-semibold">
                      <Tag className="w-3 md:w-3.5 h-3 md:h-3.5 mr-1" />
                      {smallBanner1.badge_text || "Special Deal"}
                    </Badge>
                  )}
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-3 text-balance">{smallBanner1.title}</h3>
                  {smallBanner1.subtitle && (
                    <p className="text-xs md:text-sm lg:text-base text-white/90 mb-2 text-pretty">{smallBanner1.subtitle}</p>
                  )}
                  {smallBanner1.description && (
                    <p className="text-xs md:text-sm text-white/80 mb-3 md:mb-4 text-pretty">{smallBanner1.description}</p>
                  )}
                  {smallBanner1.countdown_end_time && (
                    <div className="mb-3 md:mb-4">
                      <CountdownTimer 
                        endTime={smallBanner1.countdown_end_time} 
                        onExpire={() => handleBannerExpire(smallBanner1.id)}
                        className="text-white text-xs"
                      />
                    </div>
                  )}
                  {smallBanner1.button_text && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-fit group-hover:translate-x-2 transition-transform bg-white/90 hover:bg-white text-accent text-xs md:text-sm"
                    >
                      {smallBanner1.button_text}
                      <ArrowRight className="ml-1.5 md:ml-2 h-3.5 md:h-4 w-3.5 md:w-4" />
                    </Button>
                  )}
                </div>
              </Link>
            </ScrollReveal>
          )}

          {smallBanner2 && (
            <ScrollReveal direction="right" delay={200}>
              <Link
                href={smallBanner2.button_link || smallBanner2.link_url || "#"}
                className="group relative block h-full min-h-[200px] md:min-h-[250px] lg:min-h-[280px] rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-700 to-teal-800">
                  <Image
                    src={smallBanner2.background_image_url || smallBanner2.image_url || "/placeholder.svg?height=400&width=600"}
                    alt={smallBanner2.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-70"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-tl from-primary/60 via-primary/40 to-transparent" />
                <div className="absolute inset-0 p-5 md:p-6 lg:p-8 flex flex-col justify-end">
                  {smallBanner2.discount_percentage && smallBanner2.discount_percentage > 0 && (
                    <Badge className="w-fit mb-2 md:mb-3 bg-red-600 hover:bg-red-700 text-white border-0 px-2.5 md:px-3 py-0.5 md:py-1 text-sm md:text-base font-bold">
                      <Percent className="w-3.5 md:w-4 h-3.5 md:h-4 mr-1" />
                      {smallBanner2.discount_percentage}% OFF
                    </Badge>
                  )}
                  {!smallBanner2.discount_percentage && (
                    <Badge className="w-fit mb-2 md:mb-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 px-2.5 md:px-3 py-0.5 md:py-1 text-xs font-semibold">
                      <Zap className="w-3 md:w-3.5 h-3 md:h-3.5 mr-1" />
                      {smallBanner2.badge_text || "Limited Time"}
                    </Badge>
                  )}
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-3 text-balance">{smallBanner2.title}</h3>
                  {smallBanner2.subtitle && (
                    <p className="text-xs md:text-sm lg:text-base text-white/90 mb-2 text-pretty">{smallBanner2.subtitle}</p>
                  )}
                  {smallBanner2.description && (
                    <p className="text-xs md:text-sm text-white/80 mb-3 md:mb-4 text-pretty">{smallBanner2.description}</p>
                  )}
                  {smallBanner2.countdown_end_time && (
                    <div className="mb-3 md:mb-4">
                      <CountdownTimer 
                        endTime={smallBanner2.countdown_end_time} 
                        onExpire={() => handleBannerExpire(smallBanner2.id)}
                        className="text-white text-xs"
                      />
                    </div>
                  )}
                  {smallBanner2.button_text && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-fit group-hover:translate-x-2 transition-transform bg-white/90 hover:bg-white text-primary text-xs md:text-sm"
                    >
                      {smallBanner2.button_text}
                      <ArrowRight className="ml-1.5 md:ml-2 h-3.5 md:h-4 w-3.5 md:w-4" />
                    </Button>
                  )}
                </div>
              </Link>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  )
}
