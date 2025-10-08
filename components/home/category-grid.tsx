"use client"

import Link from "next/link"
import Image from "next/image"
import type { Category } from "@/lib/types/database"
import { useLanguage } from "@/lib/contexts/language-context"

interface CategoryGridProps {
  categories: Category[]
}

const categoryIcons: Record<string, string> = {
  "ipad-accessories": "image",
  airpods: "image",
  "phone-accessories": "image",
  "computer-accessories": "image",
  chargers: "image",
  "hard-disks": "image",
  "printed-stuff": "image",
  "gift-packages": "",
  bags: "image",
}

const categoryImages: Record<string, string> = {
  "ipad-accessories": "https://alephksa.com/cdn/shop/files/IMG-16727206_m_jpg_1_82aff6da-5d37-46a6-b718-e689d70d969d_533x.jpg?v=1741104644",
  "phone-accessories": "https://thumbs.dreamstime.com/b/assorted-smartphone-accessories-arranged-white-background-various-phone-cases-colors-like-pink-blue-beige-black-379556645.jpg",
  bags: "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-discovery-backpack-pm--N40514_PM2_Front%20view.jpg",
  airpods: "https://assets.myntassets.com/h_1440,q_75,w_1080/v1/assets/images/25958266/2024/3/16/31fd32e3-c12d-4d08-8c4d-2527a534114a1710561034921-JBL-Black-Tune-720BT-76Hr-Playtime-Quick-Charge-Multi-Connec-1.jpg",
  "computer-accessories": "https://png.pngtree.com/thumb_back/fh260/background/20231003/pngtree-stylish-minimalistic-white-workspace-with-laptop-and-accessories-in-top-view-image_13563503.png",
  chargers: "https://cdn.ihouse.ps/images/14806944691605193945.jpg",
  "hard-disks": "https://media.istockphoto.com/id/1008235126/photo/external-hard-drive-or-hard-disk-hdd-isolated-on-white-background.jpg?s=170667a&w=0&k=20&c=KrJcTSCDQSO_wAd3GrmKJzzQi-Jfh3IINhsxkhXXqQc=",
  "printed-stuff": "https://m.media-amazon.com/images/I/51XSAmXyFBS._UF350,350_QL50_.jpg",
}

const categoryGradients: Record<string, string> = {
  "ipad-accessories": "from-[#4A9B8E]/30 via-[#4A9B8E]/20 to-[#3D8B7E]/30",
  airpods: "from-[#4A9B8E]/30 via-[#4A9B8E]/20 to-[#3D8B7E]/30",
  "phone-accessories": "from-[#4A9B8E]/30 via-[#4A9B8E]/20 to-[#3D8B7E]/30",
  "computer-accessories": "from-[#4A9B8E]/30 via-[#4A9B8E]/20 to-[#3D8B7E]/30",
  chargers: "from-[#4A9B8E]/30 via-[#4A9B8E]/20 to-[#3D8B7E]/30",
  "hard-disks": "from-[#4A9B8E]/30 via-[#4A9B8E]/20 to-[#3D8B7E]/30",
  "printed-stuff": "from-[#4A9B8E]/30 via-[#4A9B8E]/20 to-[#3D8B7E]/30",
  "gift-packages": "from-[#4A9B8E]/30 via-[#4A9B8E]/20 to-[#3D8B7E]/30",
  bags: "from-[#4A9B8E]/30 via-[#4A9B8E]/20 to-[#3D8B7E]/30",
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const { t } = useLanguage()
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {categories.map((category) => {
        const icon = categoryIcons[category.slug] || ""
        const imageUrl = categoryImages[category.slug]
        const gradient = categoryGradients[category.slug] || "from-primary/20 to-accent/20"
        
        // Translate category name using slug as key, fallback to original name
        const translatedName = t(category.slug) !== category.slug ? t(category.slug) : category.name

        return (
          <Link key={category.id} href={`/categories/${category.slug}`}>
            <div className="group flex flex-col items-center gap-3 cursor-pointer">
              <div className={`relative w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-2xl border-2 border-[#4A9B8E]/20 group-hover:border-[#4A9B8E]/50 backdrop-blur-sm bg-white/40 overflow-hidden`}>
                {icon === "image" && imageUrl ? (
                  <div className="relative w-full h-full">
                    <Image src={imageUrl} alt={translatedName} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                ) : (
                  <span className="text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">{icon}</span>
                )}
                <div className="absolute inset-0 rounded-full border-2 border-[#4A9B8E] opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
              </div>
              <h3 className="font-semibold text-sm md:text-base text-center group-hover:text-[#4A9B8E] transition-colors duration-300 px-2">{translatedName}</h3>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
