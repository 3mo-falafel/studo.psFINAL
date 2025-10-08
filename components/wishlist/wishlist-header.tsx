"use client"

import { useLanguage } from "@/lib/contexts/language-context"

export function WishlistHeader() {
  const { t } = useLanguage()
  return <h1 className="text-4xl font-bold mb-8">{t("myWishlist")}</h1>
}
