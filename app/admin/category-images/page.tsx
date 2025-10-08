import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { CategoryImagesManager } from "@/components/admin/category-images-manager"
import { redirect } from "next/navigation"
import { getUserWithRole } from "@/lib/supabase/user-utils"

export default async function AdminCategoryImagesPage() {
  const supabase = await getSupabaseServerClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch category images
  const { data: images } = await supabase
    .from("category_images")
    .select("*")
    .order("category_slot", { ascending: true })
    .order("display_order", { ascending: true })

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Category Showcase Images</h1>
              <p className="text-muted-foreground">
                Manage the 4 category showcase images on the homepage. Add multiple images per category that rotate every 5 seconds.
              </p>
            </div>
            <CategoryImagesManager images={images || []} />
          </div>
        </main>
      </div>
    </div>
  )
}
