"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Category } from "@/lib/types/database"
import { useState } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import { TrendingUp, Star, Sparkles } from "lucide-react"

interface ShopFiltersProps {
  categories: Category[]
}

export function ShopFilters({ categories }: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()

  const [priceRange, setPriceRange] = useState([
    Number.parseInt(searchParams.get("minPrice") || "0"),
    Number.parseInt(searchParams.get("maxPrice") || "999"),
  ])

  // Special filters
  const [showBestSellers, setShowBestSellers] = useState(searchParams.get("bestSellers") === "true")
  const [showTrending, setShowTrending] = useState(searchParams.get("trending") === "true")
  
  // Multiple category selection
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",").filter(Boolean) || []
  )

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/shop?${params.toString()}`)
  }

  const applyAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Price range
    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())
    
    // Best sellers and trending
    if (showBestSellers) {
      params.set("bestSellers", "true")
    } else {
      params.delete("bestSellers")
    }
    
    if (showTrending) {
      params.set("trending", "true")
    } else {
      params.delete("trending")
    }
    
    // Multiple categories
    if (selectedCategories.length > 0) {
      params.set("categories", selectedCategories.join(","))
      params.delete("category") // Remove single category filter
    } else {
      params.delete("categories")
    }
    
    router.push(`/shop?${params.toString()}`)
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const clearFilters = () => {
    setShowBestSellers(false)
    setShowTrending(false)
    setSelectedCategories([])
    setPriceRange([0, 999])
    router.push("/shop")
  }

  return (
    <div className="space-y-6">
      {/* Special Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {t("specialOffers")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="bestSellers"
              checked={showBestSellers}
              onCheckedChange={(checked) => {
                setShowBestSellers(checked as boolean)
                // Auto-apply filter
                setTimeout(() => applyAllFilters(), 100)
              }}
            />
            <Label htmlFor="bestSellers" className="cursor-pointer flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              {t("bestSellers")}
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="trending"
              checked={showTrending}
              onCheckedChange={(checked) => {
                setShowTrending(checked as boolean)
                // Auto-apply filter
                setTimeout(() => applyAllFilters(), 100)
              }}
            />
            <Label htmlFor="trending" className="cursor-pointer flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              {t("trendingNow")}
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Sort */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("sortBy")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={searchParams.get("sort") || "newest"} onValueChange={(value) => updateFilter("sort", value)}>
            <SelectTrigger>
              <SelectValue placeholder={t("sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("sortNewest")}</SelectItem>
              <SelectItem value="price-asc">{t("sortPriceLowHigh")}</SelectItem>
              <SelectItem value="price-desc">{t("sortPriceHighLow")}</SelectItem>
              <SelectItem value="name">{t("sortNameAZ")}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Categories - Multi-Select */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("categories")}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("selectCategories")}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={`cat-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => {
                  toggleCategory(category.id)
                  // Auto-apply filter
                  setTimeout(() => applyAllFilters(), 100)
                }}
              />
              <Label htmlFor={`cat-${category.id}`} className="cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
          
          {selectedCategories.length > 0 && (
            <>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {selectedCategories.length} {t("selected")}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategories([])
                    setTimeout(() => applyAllFilters(), 100)
                  }}
                  className="h-auto p-0 text-xs"
                >
                  {t("clearSelection")}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("priceRange")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Slider
              min={0}
              max={999}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
              onValueCommit={() => {
                // Auto-apply when user releases slider
                applyAllFilters()
              }}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm">
              <span>₪ {priceRange[0].toLocaleString()}</span>
              <span>₪ {priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
        {t("clearFilters")}
      </Button>
    </div>
  )
}
