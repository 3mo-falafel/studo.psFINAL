"use client"

import { useEffect, useState } from "react"
import { Eye, TrendingUp, ShoppingBag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/contexts/language-context"

interface SocialProofStatsProps {
  productId: string
  className?: string
}

interface Analytics {
  views_count: number
  views_today: number
  sales_count: number
  sales_today: number
}

export function SocialProofStats({ productId, className = "" }: SocialProofStatsProps) {
  const { t } = useLanguage()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [viewingNow, setViewingNow] = useState(0)

  useEffect(() => {
    // Track this view
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    }).catch(console.error)

    // Fetch analytics
    fetch(`/api/analytics?productId=${productId}`)
      .then(res => res.json())
      .then(data => setAnalytics(data.analytics))
      .catch(console.error)

    // Simulate "viewing now" count (random 1-8 people)
    // In production, this would be a real-time counter
    setViewingNow(Math.floor(Math.random() * 8) + 1)

    // Update viewing count every 30 seconds
    const interval = setInterval(() => {
      setViewingNow(Math.floor(Math.random() * 8) + 1)
    }, 30000)

    return () => clearInterval(interval)
  }, [productId])

  if (!analytics) return null

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* Viewing Now */}
      {viewingNow > 0 && (
        <Badge variant="outline" className="gap-1 text-xs border-blue-500 text-blue-600 bg-blue-50">
          <Eye className="h-3 w-3" />
          {t("viewing").replace("{count}", viewingNow.toString())}
        </Badge>
      )}

      {/* Sold Today */}
      {analytics.sales_today > 0 && (
        <Badge variant="outline" className="gap-1 text-xs border-green-500 text-green-600 bg-green-50">
          <ShoppingBag className="h-3 w-3" />
          {t("soldToday").replace("{count}", analytics.sales_today.toString())}
        </Badge>
      )}

      {/* Total Views (if significant) */}
      {analytics.views_count > 50 && (
        <Badge variant="outline" className="gap-1 text-xs border-purple-500 text-purple-600 bg-purple-50">
          <TrendingUp className="h-3 w-3" />
          {analytics.views_count}+ {t("views")}
        </Badge>
      )}
    </div>
  )
}
