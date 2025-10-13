
"use client"

import { useState } from "react"
import Image from "next/image"
import { useLanguage } from "@/lib/contexts/language-context"
import { cn } from "@/lib/utils"

interface Subcategory {
  id: string
  name: string
  slug: string
  image_url: string
  isComingSoon?: boolean
}

interface SubcategoryFilterProps {
  subcategories: Subcategory[]
  onFilterChange: (selectedSlugs: string[]) => void
}

const subcategoryImages: Record<string, string> = {
  // iPad Accessories
  "pencils": "https://c1.neweggimages.com/productimage/nb640/B39GS24052906CQSZ16.jpg",
  "keyboards-mice": "https://m.media-amazon.com/images/I/61PwCPnxrfL.jpg",
  "stands": "https://i.ebayimg.com/images/g/QlQAAOSwQoZjoUYt/s-l1200.jpg",
  "cases": "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MDEQ4?wid=890&hei=890&fmt=jpeg&qlt=90&.v=1739826847442",

  // Bags
  "backpacks": "https://boconi.com/cdn/shop/products/cognac_front.jpg?v=1710510583",
  "laptop-bags": "https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-3d-render-laptop-bag-perspective-view-png-image_9192010.png",
  "calvin-klein-bag": "https://calvinklein-eu.scene7.com/is/image/CalvinKleinEU/K50K511190_BAX_main?$b2c_uplp_listing_2560$",

  // Headphones
  "wireless-headphones": "https://media.ldlc.com/r1600/ld/products/00/06/16/68/LD0006166841.jpg",
  "wireless-airpods": "https://uk.jbl.com/dw/image/v2/BFND_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw018a07e6/01.JBL_Tune%20Buds_Product%20Image_Hero_Purple.png?sw=680&sh=680",
  "gaming-headphones": "https://cdns3.thecosmicbyte.com/wp-content/uploads/G2050-BLUE.jpg",
  "wired-headphones": "https://i5.walmartimages.com/seo/Sony-MDR-ZX110-Wired-On-Ear-Headphones-Black_7c3f7ed8-05e7-49d4-98fe-616a1997debf.58b3271a16b69c93a3cd8d6600b7d3cc.jpeg",

  // Hard Disks
  "flash-drive": "https://www.picstop.co.uk/user/products/large/sdcz50_5fangle_4_1.jpg",
  "hard-drive": "https://shop.sandisk.com/content/dam/store/en-us/assets/products/portable/extreme-pro-usb-3-1-ssd/gallery/extreme-pro-usb-3-1-ssd-right.png.thumb.1280.1280.png",
  "memory-card": "https://shop.sandisk.com/content/dam/store/en-us/assets/products/memory-cards/microsd-express-memory-card/gallery/microsd-express-memory-card-256gb-front.png.thumb.1280.1280.png",
}

export function SubcategoryFilter({ subcategories, onFilterChange }: SubcategoryFilterProps) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([])
  const { t } = useLanguage()

  const toggleSubcategory = (slug: string) => {
    const newSelected = selectedSlugs.includes(slug)
      ? selectedSlugs.filter(s => s !== slug)
      : [...selectedSlugs, slug]
    
    setSelectedSlugs(newSelected)
    onFilterChange(newSelected)
  }

  if (!subcategories || subcategories.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{t("filterBySubcategory")}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {subcategories.map((subcategory) => {
          const isSelected = selectedSlugs.includes(subcategory.slug)
          const imageUrl = subcategoryImages[subcategory.slug] || subcategory.image_url
          const translatedName = t(subcategory.slug) !== subcategory.slug ? t(subcategory.slug) : subcategory.name

          return (
            <button
              key={subcategory.id}
              onClick={() => !subcategory.isComingSoon && toggleSubcategory(subcategory.slug)}
              disabled={subcategory.isComingSoon}
              className={cn(
                "group flex flex-col items-center gap-3 transition-all duration-300",
                subcategory.isComingSoon ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                isSelected && !subcategory.isComingSoon && "transform scale-105"
              )}
            >
              <div
                className={cn(
                  "relative w-32 h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center transition-all duration-300 ease-out border-2 backdrop-blur-sm bg-white/40 overflow-hidden",
                  isSelected
                    ? "border-[#4A9B8E] shadow-2xl scale-110 bg-gradient-to-br from-[#4A9B8E]/30 via-[#4A9B8E]/20 to-[#3D8B7E]/30"
                    : "border-[#4A9B8E]/20 group-hover:border-[#4A9B8E]/50 group-hover:scale-110 group-hover:shadow-2xl bg-gradient-to-br from-[#4A9B8E]/10 via-white to-[#4A9B8E]/5",
                  subcategory.isComingSoon && "grayscale"
                )}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={imageUrl}
                    alt={translatedName}
                    fill
                    className={cn(
                      "object-cover transition-transform duration-300",
                      !subcategory.isComingSoon && "group-hover:scale-110"
                    )}
                  />
                </div>
                {isSelected && !subcategory.isComingSoon && (
                  <div className="absolute inset-0 bg-[#4A9B8E]/20 flex items-center justify-center">
                    <div className="bg-[#4A9B8E] text-white rounded-full p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </div>
                )}
                <div
                  className={cn(
                    "absolute inset-0 rounded-full border-2 transition-all duration-300",
                    isSelected
                      ? "border-[#4A9B8E] opacity-100 scale-110"
                      : "border-[#4A9B8E] opacity-0 group-hover:opacity-100 group-hover:scale-110"
                  )}
                />
              </div>
              <h3
                className={cn(
                  "font-semibold text-sm md:text-base text-center transition-colors duration-300 px-2",
                  isSelected
                    ? "text-[#4A9B8E]"
                    : "group-hover:text-[#4A9B8E]"
                )}
              >
                {translatedName}
                {subcategory.isComingSoon && (
                  <span className="block text-xs text-muted-foreground mt-1">
                    ({t("comingSoon")})
                  </span>
                )}
              </h3>
            </button>
          )
        })}
      </div>
      {selectedSlugs.length > 0 && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">
            {t("selected")}: {selectedSlugs.length}
          </span>
          <button
            onClick={() => {
              setSelectedSlugs([])
              onFilterChange([])
            }}
            className="text-sm text-[#4A9B8E] hover:text-[#3D8B7E] underline"
          >
            {t("clearSelection")}
          </button>
        </div>
      )}
    </div>
  )
}
