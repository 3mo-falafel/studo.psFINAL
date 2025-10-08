"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/contexts/language-context"

interface SectionHeaderProps {
  titleKey: string
  descriptionKey: string
  linkHref?: string
  linkTextKey?: string
}

export function SectionHeader({ titleKey, descriptionKey, linkHref, linkTextKey = "viewAll" }: SectionHeaderProps) {
  const { t } = useLanguage()

  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-balance">{t(titleKey)}</h2>
        <p className="text-muted-foreground text-lg">{t(descriptionKey)}</p>
      </div>
      {linkHref && (
        <Button
          variant="outline"
          asChild
          className="hover:bg-primary hover:text-primary-foreground transition-all bg-transparent"
        >
          <Link href={linkHref}>{t(linkTextKey)}</Link>
        </Button>
      )}
    </div>
  )
}
