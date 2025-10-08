import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getUserWithRole } from "@/lib/supabase/user-utils"

export default async function DebugProductsPage() {
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

  // Test 1: Get all products with wildcard
  const { data: allProducts, error: allError } = await supabase
    .from("products")
    .select("*")

  // Test 2: Get with specific fields
  const { data: specificProducts, error: specificError } = await supabase
    .from("products")
    .select("id, name, slug, price, stock_quantity, images, is_featured")

  // Test 3: Get with category
  const { data: withCategory, error: catError } = await supabase
    .from("products")
    .select("id, name, stock_quantity, categories(name)")

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Products Debug Page</h1>

      <div className="space-y-8">
        {/* Test 1 Results */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Test 1: SELECT * (All Fields)</h2>
          {allError && <p className="text-red-500">Error: {allError.message}</p>}
          <p>Count: {allProducts?.length || 0}</p>
          <pre className="bg-gray-100 p-2 rounded overflow-auto text-xs mt-2">
            {JSON.stringify(allProducts, null, 2)}
          </pre>
        </div>

        {/* Test 2 Results */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Test 2: SELECT Specific Fields</h2>
          {specificError && <p className="text-red-500">Error: {specificError.message}</p>}
          <p>Count: {specificProducts?.length || 0}</p>
          <pre className="bg-gray-100 p-2 rounded overflow-auto text-xs mt-2">
            {JSON.stringify(specificProducts, null, 2)}
          </pre>
        </div>

        {/* Test 3 Results */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Test 3: SELECT With Categories</h2>
          {catError && <p className="text-red-500">Error: {catError.message}</p>}
          <p>Count: {withCategory?.length || 0}</p>
          <pre className="bg-gray-100 p-2 rounded overflow-auto text-xs mt-2">
            {JSON.stringify(withCategory, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
