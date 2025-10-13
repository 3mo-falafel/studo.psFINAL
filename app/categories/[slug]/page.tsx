import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { IptvDescription } from "@/components/categories/iptv-description"
import { CategoryHeader } from "@/components/categories/category-header-client"
import { CategoryProducts } from "@/components/categories/category-products-client"
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

  // Fetch subcategories (for iPad Accessories)
  const { data: subcategories } = await supabase
    .from("categories")
    .select("*")
    .eq("parent_id", category.id)
    .eq("is_active", true)
    .order("display_order", { ascending: true })


  // Get subcategory IDs for this category
  const subcategoryIds = (subcategories || []).map((sub) => sub.id)

  let rawProducts = []
  if (subcategoryIds.length > 0) {
    // Fetch products in this category or its subcategories
    const { data } = await supabase
      .from("products")
      .select(`id, name, slug, price, compare_at_price, images, quantity, category_id, subcategory_id, is_featured, is_active, created_at, updated_at,
        category:categories!products_category_id_fkey(name, id),
        subcategory:categories!products_subcategory_id_fkey(name, id)
      `)
      .or(`category_id.eq.${category.id},subcategory_id.in.(${subcategoryIds.join(",")})`)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
    rawProducts = data || []
  } else {
    // Only fetch products by main category
    const { data } = await supabase
      .from("products")
      .select(`id, name, slug, price, compare_at_price, images, quantity, category_id, subcategory_id, is_featured, is_active, created_at, updated_at,
        category:categories!products_category_id_fkey(name, id),
        subcategory:categories!products_subcategory_id_fkey(name, id)
      `)
      .eq("category_id", category.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
    rawProducts = data || []
  }

  // Map quantity to stock_quantity and add subcategory_id
  const products = (rawProducts || []).map((p: any) => ({
    ...p,
    stock_quantity: p.quantity ?? 0,
  }))

  // Prepare subcategories with coming soon flag
  const subcategoriesWithFlags = (subcategories || []).map((sub) => ({
    id: sub.id,
    name: sub.name,
    slug: sub.slug,
    image_url: sub.image_url || "",
    isComingSoon: sub.slug === "cases",
  }))

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Category Header */}
          <CategoryHeader 
            categoryName={category.name}
            categorySlug={category.slug}
            categoryDescription={category.description}
          />

          {/* IPTV Special Description */}
          {category.slug === "phone-accessories" && <IptvDescription />}

          {/* Products with Subcategory Filter */}
          <CategoryProducts
            products={products}
            subcategories={subcategoriesWithFlags}
            showSubcategoryFilter={
              category.slug === "ipad-accessories" ||
              category.slug === "computer-accessories" ||
              category.slug === "bags" ||
              category.slug === "headphones" ||
              category.slug === "airpods" ||
              category.slug === "hard-disks"
            }
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
