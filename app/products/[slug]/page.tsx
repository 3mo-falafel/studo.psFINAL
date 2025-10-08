import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { ProductGallery } from "@/components/products/product-gallery"
import { ProductInfo } from "@/components/products/product-info"
import { SuggestedProducts } from "@/components/products/suggested-products"
import { ProductDescription } from "@/components/products/product-sections"
import { ReviewForm } from "@/components/products/review-form"
import { ReviewsList } from "@/components/products/reviews-list"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await getSupabaseServerClient()

  // Fetch product
  const { data: rawProduct } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (!rawProduct) {
    notFound()
  }

  // Extract category from array (Supabase returns it as array when using join)
  const category = Array.isArray(rawProduct.category) ? rawProduct.category[0] : rawProduct.category

  // Map quantity to stock_quantity for code consistency
  const product = {
    ...rawProduct,
    category,
    stock_quantity: rawProduct.quantity ?? 0,
  }

  // Fetch suggested products using smart SQL function
  const { data: suggestedProductsData } = await supabase
    .rpc('get_suggested_products', {
      p_product_id: product.id,
      p_limit: 8
    })

  // Map quantity field for suggested products
  const suggestedProducts = (suggestedProductsData || []).map((p: any) => ({
    ...p,
    stock_quantity: p.quantity ?? 0,
  }))

  // Fetch approved reviews for this product
  const { data: reviews } = await supabase
    .from("product_reviews")
    .select("*")
    .eq("product_id", product.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: "Categories", href: "/categories" },
              { label: product.category?.name || "Products", href: product.category ? `/categories/${product.category.slug}` : "/shop" },
              { label: product.name }
            ]}
            className="mb-6"
          />

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <ProductGallery images={product.images} productName={product.name} />
            <ProductInfo product={product} />
          </div>

          {/* Product Description */}
          {product.description && (
            <div className="mb-16">
              <ProductDescription />
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Review Form */}
            <ReviewForm 
              productId={product.id} 
              productName={product.name}
            />
            
            {/* Reviews List */}
            <ReviewsList 
              reviews={reviews || []} 
              productName={product.name}
            />
          </div>

          {/* Suggested Products (Related + Complementary) */}
          {suggestedProducts && suggestedProducts.length > 0 && (
            <SuggestedProducts products={suggestedProducts} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
