import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { ProductsTable } from "@/components/admin/products-table"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getUserWithRole } from "@/lib/supabase/user-utils"

export default async function AdminProductsPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { isAdmin } = await getUserWithRole(supabase, user.id, user.email!, user.user_metadata)

  if (!isAdmin) {
    redirect("/")
  }

  const { data: rawProducts, error } = await supabase
    .from("products")
    .select("id, name, slug, price, quantity, images, is_featured, categories(name)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
  }

  // Transform the data to match the expected format
  const products = (rawProducts || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    stock_quantity: p.quantity ?? 0, // Map 'quantity' to 'stock_quantity'
    images: Array.isArray(p.images) ? p.images : [],
    is_featured: p.is_featured ?? false,
    categories: Array.isArray(p.categories) && p.categories.length > 0 ? p.categories[0] : null,
  }))

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-8 bg-muted/30">
          <ProductsTable products={products} />
        </main>
      </div>
    </div>
  )
}
