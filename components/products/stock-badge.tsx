"use client"

import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/contexts/language-context"
import { AlertCircle, CheckCircle2, TrendingUp } from "lucide-react"

interface StockBadgeProps {
  quantity: number
  className?: string
  showIcon?: boolean
  variant?: "default" | "detailed"
}

export function StockBadge({ quantity, className = "", showIcon = true, variant = "default" }: StockBadgeProps) {
  const { t } = useLanguage()

  if (quantity <= 0) {
    return (
      <Badge variant="destructive" className={`${className}`}>
        {showIcon && <AlertCircle className="h-3 w-3 mr-1" />}
        {t("outOfStock")}
      </Badge>
    )
  }

  if (quantity <= 5) {
    return (
      <Badge variant="outline" className={`border-orange-500 text-orange-600 bg-orange-50 ${className}`}>
        {showIcon && <AlertCircle className="h-3 w-3 mr-1 animate-pulse" />}
        {variant === "detailed" ? t("onlyXLeft").replace("{count}", quantity.toString()) : t("lowStock").replace("{count}", quantity.toString())}
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className={`border-green-500 text-green-600 bg-green-50 ${className}`}>
      {showIcon && <CheckCircle2 className="h-3 w-3 mr-1" />}
      {variant === "detailed" ? t("stockAvailable").replace("{count}", quantity.toString()) : t("inStock")}
    </Badge>
  )
}

// Social proof badges
interface SocialProofBadgeProps {
  type: "trending" | "bestSeller" | "hot"
  className?: string
}

export function SocialProofBadge({ type, className = "" }: SocialProofBadgeProps) {
  const { t } = useLanguage()

  const badges = {
    trending: {
      label: t("trending"),
      className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
      icon: <TrendingUp className="h-3 w-3 mr-1" />
    },
    bestSeller: {
      label: t("bestSeller"),
      className: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
      icon: null
    },
    hot: {
      label: t("hotItem"),
      className: "bg-gradient-to-r from-red-500 to-pink-600 text-white animate-pulse",
      icon: null
    }
  }

  const badge = badges[type]

  return (
    <Badge className={`${badge.className} ${className} shadow-lg`}>
      {badge.icon}
      {badge.label}
    </Badge>
  )
}
