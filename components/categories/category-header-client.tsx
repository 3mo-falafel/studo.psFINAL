"use client"

import { useLanguage } from "@/lib/contexts/language-context"

interface CategoryHeaderProps {
  categoryName: string
  categorySlug: string
  categoryDescription?: string
}

export function CategoryHeader({ categoryName, categorySlug, categoryDescription }: CategoryHeaderProps) {
  const { t } = useLanguage()
  
  // Try to get translated name, fallback to database name
  const translatedName = t(categorySlug) !== categorySlug ? t(categorySlug) : categoryName

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold mb-2">{translatedName}</h1>
      {categorySlug !== "phone-accessories" && categoryDescription && (
        <p className="text-muted-foreground">{categoryDescription}</p>
      )}
    </div>
  )
}
