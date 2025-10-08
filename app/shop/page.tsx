import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/home/product-card"
import { ShopFilters } from "@/components/shop/shop-filters"
import { ShopHeader } from "@/components/shop/shop-header"
import { ProductCount, LoadingFilters, NoProducts } from "@/components/shop/shop-content"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Suspense } from "react"

interface ShopPageProps {
  searchParams: Promise<{
    category?: string
    categories?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
    search?: string
    bestSellers?: string
    trending?: string
  }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const supabase = await getSupabaseServerClient()

  // Build query - explicitly select fields and map quantity to stock_quantity
  let query = supabase
    .from("products")
    .select("id, name, slug, price, compare_at_price, images, quantity, category_id, is_featured, best_seller, trending, category:categories(*)")
    .eq("is_active", true)

  // Apply special filters
  if (params.bestSellers === "true") {
    query = query.eq("best_seller", true)
  }

  if (params.trending === "true") {
    query = query.eq("trending", true)
  }

  // Apply category filters
  if (params.categories) {
    // Multiple categories (comma-separated)
    const categoryIds = params.categories.split(",").filter(Boolean)
    if (categoryIds.length > 0) {
      query = query.in("category_id", categoryIds)
    }
  } else if (params.category) {
    // Single category (legacy support)
    query = query.eq("category_id", params.category)
  }

  if (params.search) {
    query = query.ilike("name", `%${params.search}%`)
  }

  if (params.minPrice) {
    query = query.gte("price", Number.parseFloat(params.minPrice))
  }

  if (params.maxPrice) {
    query = query.lte("price", Number.parseFloat(params.maxPrice))
  }

  // Apply sorting
  switch (params.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true })
      break
    case "price-desc":
      query = query.order("price", { ascending: false })
      break
    case "newest":
      query = query.order("created_at", { ascending: false })
      break
    case "name":
      query = query.order("name", { ascending: true })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  const { data: rawProducts } = await query

  // Map quantity to stock_quantity for code consistency
  const products = (rawProducts || []).map((p: any) => ({
    ...p,
    stock_quantity: p.quantity ?? 0,
  }))

  // Fetch categories for filter
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <ShopHeader />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <Suspense fallback={<LoadingFilters />}>
                <ShopFilters categories={categories || []} />
              </Suspense>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {products && products.length > 0 ? (
                <>
                  <ProductCount count={products.length} />
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              ) : (
                <NoProducts />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
