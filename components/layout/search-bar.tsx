"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/contexts/language-context"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils/currency"

interface SearchResult {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  category: {
    name: string
    slug: string
  }
}

interface CategoryResult {
  id: string
  name: string
  slug: string
  description?: string
}

export function SearchBar() {
  const { t } = useLanguage()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [categories, setCategories] = useState<CategoryResult[]>([])
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceTimeout = useRef<NodeJS.Timeout>()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Debounced search function
  const performSearch = useCallback(async (searchQuery: string, category: string | null) => {
    if (!searchQuery.trim()) {
      setCategories([])
      setResults([])
      setIsLoading(false)
      return
    }

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        ...(category && { category }),
      })

      const response = await fetch(`/api/search?${params}`)
      if (!response.ok) throw new Error("Search failed")

      const data = await response.json()
      setCategories(data.categories || [])
      setResults(data.products || [])
    } catch (error) {
      console.error("Search error:", error)
      setCategories([])
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle input change with debouncing
  const handleInputChange = (value: string) => {
    setQuery(value)
    setIsOpen(true)
    setIsLoading(true)

    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    // Set new timeout for debounced search
    debounceTimeout.current = setTimeout(() => {
      performSearch(value, selectedCategory)
    }, 300) // 300ms debounce
  }

  // Handle category filter
  const handleCategoryFilter = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug)
    if (query.trim()) {
      setIsLoading(true)
      performSearch(query, categorySlug)
    }
  }

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setIsOpen(false)
      router.push(`/shop?search=${encodeURIComponent(query)}${selectedCategory ? `&category=${selectedCategory}` : ""}`)
    }
  }

  // Clear search
  const handleClear = () => {
    setQuery("")
    setCategories([])
    setResults([])
    setSelectedCategory(null)
    setIsOpen(false)
  }

  return (
    <div ref={searchRef} className="relative flex-1 max-w-xl">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("searchPlaceholder")}
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => query && setIsOpen(true)}
            className="pl-10 pr-10 h-10 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && query && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-xl z-50 max-h-[500px] overflow-y-auto">
          {/* Category Filters */}
          <div className="p-3 border-b bg-muted/30">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleCategoryFilter(null)}
              >
                {t("allCategories")}
              </Badge>
              {/* Add category badges dynamically - you can fetch from API */}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="p-8 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {/* Results */}
          {!isLoading && (categories.length > 0 || results.length > 0) && (
            <div className="py-2">
              {/* Categories Section - Show First */}
              {categories.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-muted/30">
                    {t("categories")}
                  </div>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-muted/30"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Search className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-1">{category.name}</h4>
                        {category.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{category.description}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Products Section */}
              {results.length > 0 && (
                <div>
                  {categories.length > 0 && (
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-muted/30 border-t">
                      {t("products")}
                    </div>
                  )}
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                        <p className="text-xs text-muted-foreground">{product.category.name}</p>
                        <p className="text-sm font-bold text-primary mt-1">{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* No Results */}
          {!isLoading && categories.length === 0 && results.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">{t("noSearchResults")}</p>
              <p className="text-sm text-muted-foreground mt-1">{t("tryDifferentKeywords")}</p>
            </div>
          )}

          {/* View All Results */}
          {!isLoading && (categories.length > 0 || results.length > 0) && (
            <div className="p-3 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsOpen(false)
                  router.push(`/shop?search=${encodeURIComponent(query)}${selectedCategory ? `&category=${selectedCategory}` : ""}`)
                }}
              >
                {t("viewAllResults")} ({categories.length + results.length})
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
