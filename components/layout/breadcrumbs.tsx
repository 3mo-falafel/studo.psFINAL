"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const { t } = useLanguage()

  // Add home as first item
  const allItems = [{ label: t("breadcrumbHome"), href: "/" }, ...items]

  // Generate JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.href && { "item": `${typeof window !== 'undefined' ? window.location.origin : ''}${item.href}` })
    }))
  }

  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb UI */}
      <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-sm ${className}`}>
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1
          const isFirst = index === 0

          return (
            <div key={index} className="flex items-center gap-2">
              {isFirst ? (
                <Link 
                  href={item.href || "#"}
                  className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Home className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ) : (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  {isLast || !item.href ? (
                    <span className="font-medium text-foreground">{item.label}</span>
                  ) : (
                    <Link 
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </>
              )}
            </div>
          )
        })}
      </nav>
    </>
  )
}
