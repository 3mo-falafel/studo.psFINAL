import { redirect, notFound } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { ProductForm } from "@/components/admin/product-form"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getUserWithRole } from "@/lib/supabase/user-utils"

export default async function EditProductPage({ params }: { params: { id: string } }) {
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

  // Fetch the product
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!product) {
    notFound()
  }

  // Fetch categories for the select dropdown
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("is_active", true)
    .order("name")

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Edit Product</h1>
              <p className="text-muted-foreground">Update product information</p>
            </div>

            <ProductForm product={product} categories={categories || []} />
          </div>
        </main>
      </div>
    </div>
  )
}
