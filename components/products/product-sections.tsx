"use client"

import { useLanguage } from "@/lib/contexts/language-context"

export function ProductDescription() {
  const { t } = useLanguage()
  return <h2 className="text-2xl font-bold mb-4">{t("description")}</h2>
}

export function RelatedProductsTitle() {
  const { t } = useLanguage()
  return <h2 className="text-2xl font-bold mb-6">{t("youMayAlsoLike")}</h2>
}
