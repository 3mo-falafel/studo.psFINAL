import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")
    const category = searchParams.get("category")

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ categories: [], products: [] })
    }

    const supabase = await getSupabaseServerClient()

    // Search for matching categories FIRST
    const { data: categoriesData } = await supabase
      .from("categories")
      .select("id, name, slug, description")
      .eq("is_active", true)
      .ilike("name", `%${query}%`)
      .limit(3)

    // Build product search query
    let dbQuery = supabase
      .from("products")
      .select("id, name, slug, price, images, category:categories(name, slug)")
      .eq("is_active", true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

    // Filter by category if specified
    if (category) {
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category)
        .single()

      if (categoryData) {
        dbQuery = dbQuery.eq("category_id", categoryData.id)
      }
    }

    const { data: productsData, error } = await dbQuery.limit(10)

    if (error) {
      console.error("Search error:", error)
      return NextResponse.json({ categories: [], products: [] })
    }

    return NextResponse.json({ 
      categories: categoriesData || [], 
      products: productsData || [] 
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ categories: [], products: [], error: "Search failed" }, { status: 500 })
  }
}
