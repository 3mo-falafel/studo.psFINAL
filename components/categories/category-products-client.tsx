"use client"

import { useState, useMemo } from "react"
import { ProductCard } from "@/components/home/product-card"
import { CategoryProductCount, CategoryNoProducts } from "@/components/categories/category-content"
import { SubcategoryFilter } from "@/components/categories/subcategory-filter"
import type { Product as ProductType } from "@/lib/types/database"

interface Subcategory {
  id: string
  name: string
  slug: string
  image_url: string
  isComingSoon?: boolean
}

interface CategoryProductsProps {
  products: (ProductType & { subcategory_id?: string })[]
  subcategories: Subcategory[]
  showSubcategoryFilter: boolean
}

export function CategoryProducts({ products, subcategories, showSubcategoryFilter }: CategoryProductsProps) {
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])

  // Filter products based on selected subcategories
  const filteredProducts = useMemo(() => {
    if (selectedSubcategories.length === 0) {
      return products
    }

    return products.filter((product) => {
      // Get subcategory slugs for this product
      const productSubcategorySlugs = subcategories
        .filter((sub) => sub.id === product.subcategory_id)
        .map((sub) => sub.slug)

      // Check if any of the product's subcategories match selected ones
      return productSubcategorySlugs.some((slug) => selectedSubcategories.includes(slug))
    })
  }, [products, selectedSubcategories, subcategories])

  const handleFilterChange = (selectedSlugs: string[]) => {
    setSelectedSubcategories(selectedSlugs)
  }

  return (
    <>
      {/* Subcategory Filter */}
      {showSubcategoryFilter && subcategories.length > 0 && (
        <SubcategoryFilter subcategories={subcategories} onFilterChange={handleFilterChange} />
      )}

      {/* Products Grid */}
      {filteredProducts && filteredProducts.length > 0 ? (
        <>
          <CategoryProductCount productsCount={filteredProducts.length} />
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <CategoryNoProducts />
      )}
    </>
  )
}
