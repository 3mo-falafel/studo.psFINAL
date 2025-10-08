"use client"

import { useLanguage } from "@/lib/contexts/language-context"

interface ProductCountProps {
  count: number
}

export function ProductCount({ count }: ProductCountProps) {
  const { t } = useLanguage()

  return (
    <div className="mb-6 text-sm text-muted-foreground">
      {t("showingResults").replace("{count}", count.toString())}
    </div>
  )
}

export function LoadingFilters() {
  const { t } = useLanguage()
  
  return <div>{t("loading")}</div>
}

export function NoProducts() {
  const { t } = useLanguage()
  
  return (
    <div className="text-center py-12">
      <p className="text-xl text-muted-foreground mb-4">{t("noProductsFound")}</p>
      <p className="text-sm text-muted-foreground">{t("tryAgain")}</p>
    </div>
  )
}
