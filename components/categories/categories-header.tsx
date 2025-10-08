"use client"

import { useLanguage } from "@/lib/contexts/language-context"

export function CategoriesHeader() {
  const { t } = useLanguage()

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold mb-2">{t("allCategories")}</h1>
      <p className="text-muted-foreground">{t("browseByCategory")}</p>
    </div>
  )
}
