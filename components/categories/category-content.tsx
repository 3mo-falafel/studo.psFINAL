"use client"

import { useLanguage } from "@/lib/contexts/language-context"

interface CategoryContentProps {
  productsCount: number
}

export function CategoryProductCount({ productsCount }: CategoryContentProps) {
  const { t } = useLanguage()

  return (
    <div className="mb-6 text-sm text-muted-foreground">
      {t("showingResults").replace("{count}", productsCount.toString())}
    </div>
  )
}

export function CategoryNoProducts() {
  const { t } = useLanguage()

  return (
    <div className="text-center py-12">
      <p className="text-lg text-muted-foreground">{t("noProductsFound")}</p>
    </div>
  )
}
