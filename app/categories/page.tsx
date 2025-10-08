import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CategoryGrid } from "@/components/home/category-grid"
import { CategoriesHeader } from "@/components/categories/categories-header"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function CategoriesPage() {
  const supabase = await getSupabaseServerClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .is("parent_id", null)
    .order("display_order", { ascending: true })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <CategoriesHeader />
          <CategoryGrid categories={categories || []} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
