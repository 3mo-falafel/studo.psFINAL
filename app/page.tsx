import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ModernHero } from "@/components/home/modern-hero"
import { ProductCard } from "@/components/home/product-card"
import { CategoryGrid } from "@/components/home/category-grid"
import { PromotionalBanners } from "@/components/home/promotional-banners"
import { ScrollReveal } from "@/components/home/scroll-reveal"
import { SectionHeader } from "@/components/home/section-header"
import { FeaturesSection } from "@/components/home/features-section"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// Disable caching to get fresh stock data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  const supabase = await getSupabaseServerClient()

  // Fetch featured products with real stock data
  const { data: featuredProducts } = await supabase
    .from("products")
    .select(`id, name, slug, price, compare_at_price, images, stock_quantity, stock_status, category_id, subcategory_id, is_featured,
      category:categories!products_category_id_fkey(name, id),
      subcategory:categories!products_subcategory_id_fkey(name, id)
    `)
    .eq("is_active", true)
    .eq("is_featured", true)
    .limit(8)

  // Fetch all products for "New Arrivals" with real stock data
  const { data: newProducts } = await supabase
    .from("products")
    .select(`id, name, slug, price, compare_at_price, images, stock_quantity, stock_status, category_id, subcategory_id, is_featured,
      category:categories!products_category_id_fkey(name, id),
      subcategory:categories!products_subcategory_id_fkey(name, id)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8)

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .is("parent_id", null)
    .order("display_order", { ascending: true })
    .limit(8)

  const { data: banners } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  // Fetch category images for hero section
  const { data: categoryImages } = await supabase
    .from("category_images")
    .select("*")
    .eq("is_active", true)
    .order("category_slot", { ascending: true })
    .order("display_order", { ascending: true })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <ScrollReveal>
          <ModernHero categoryImages={categoryImages || []} />
        </ScrollReveal>

        {/* Categories */}
        <section className="container mx-auto px-4 py-16 md:py-20">
          <ScrollReveal>
            <SectionHeader 
              titleKey="shopByCategory"
              descriptionKey="browseProducts"
              linkHref="/categories"
            />
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <CategoryGrid categories={categories || []} />
          </ScrollReveal>
        </section>

        {/* Promotional Banners - Moved below categories */}
        {banners && banners.length > 0 && (
          <ScrollReveal delay={100}>
            <PromotionalBanners banners={banners} />
          </ScrollReveal>
        )}

        {/* Featured Products */}
        {featuredProducts && featuredProducts.length > 0 && (
          <section className="container mx-auto px-4 py-16 md:py-20 bg-muted/30">
            <ScrollReveal>
              <SectionHeader 
                titleKey="featuredProducts"
                descriptionKey="handPickedItems"
                linkHref="/shop"
              />
            </ScrollReveal>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {featuredProducts.map((product: any, index: number) => (
                <ScrollReveal key={product.id} delay={index * 100}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* New Arrivals */}
        {newProducts && newProducts.length > 0 && (
          <section className="container mx-auto px-4 py-16 md:py-20">
            <ScrollReveal>
              <SectionHeader 
                titleKey="newArrivals"
                descriptionKey="latestProducts"
                linkHref="/shop?sort=newest"
              />
            </ScrollReveal>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {newProducts.map((product: any, index: number) => (
                <ScrollReveal key={product.id} delay={index * 100}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* Features */}
        <FeaturesSection />
      </main>

      <Footer />
    </div>
  )
}
