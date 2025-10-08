import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/home/product-card"
import { CategoryProductCount, CategoryNoProducts } from "@/components/categories/category-content"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const supabase = await getSupabaseServerClient()

  // Fetch category
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (!category) {
    notFound()
  }

  // Fetch products in this category
  const { data: rawProducts } = await supabase
    .from("products")
    .select("id, name, slug, price, compare_at_price, images, quantity, category_id, is_featured, category:categories(*)")
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  // Map quantity to stock_quantity
  const products = (rawProducts || []).map((p: any) => ({
    ...p,
    stock_quantity: p.quantity ?? 0,
  }))

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Category Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
            {category.description && <p className="text-muted-foreground">{category.description}</p>}
          </div>

          {/* Products Grid */}
          {products && products.length > 0 ? (
            <>
              <CategoryProductCount productsCount={products.length} />
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <CategoryNoProducts />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
