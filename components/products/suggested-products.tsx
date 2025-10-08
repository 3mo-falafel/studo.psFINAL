"use client"

import { ProductCard } from "@/components/home/product-card"
import { useLanguage } from "@/lib/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Package } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compare_at_price?: number
  images: string[]
  category_id: string
  best_seller?: boolean
  trending?: boolean
  is_related?: boolean
  stock_quantity?: number
  quantity?: number
}

interface SuggestedProductsProps {
  products: Product[]
}

export function SuggestedProducts({ products }: SuggestedProductsProps) {
  const { t } = useLanguage()

  if (!products || products.length === 0) {
    return null
  }

  // Separate related and complementary products
  const relatedProducts = products.filter(p => p.is_related)
  const complementaryProducts = products.filter(p => !p.is_related)

  return (
    <div className="space-y-8">
      {/* Related Products (Same Category) */}
      {relatedProducts.length > 0 && (
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{t("relatedProducts")}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t("similarItems")}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {relatedProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={{
                      ...product,
                      stock_quantity: product.quantity || product.stock_quantity || 0
                    }} 
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Complementary Products (Different Categories) */}
      {complementaryProducts.length > 0 && (
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">{t("youMayAlsoLike")}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t("complementaryItems")}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {complementaryProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={{
                      ...product,
                      stock_quantity: product.quantity || product.stock_quantity || 0
                    }} 
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* All Suggested Products (Fallback if no separation) */}
      {relatedProducts.length === 0 && complementaryProducts.length === 0 && products.length > 0 && (
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{t("suggestedProducts")}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t("basedOnThisProduct")}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={{
                      ...product,
                      stock_quantity: product.quantity || product.stock_quantity || 0
                    }} 
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  )
}
