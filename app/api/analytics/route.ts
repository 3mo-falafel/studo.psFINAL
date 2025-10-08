import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// POST - Track product view
export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    const supabase = await getSupabaseServerClient()

    // Upsert analytics record
    const { error } = await supabase.rpc('increment_product_view', {
      p_product_id: productId
    })

    if (error) {
      console.error("Analytics tracking error:", error)
      // Don't fail the request, just log it
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

// GET - Get product analytics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    const supabase = await getSupabaseServerClient()

    const { data, error } = await supabase
      .from("product_analytics")
      .select("*")
      .eq("product_id", productId)
      .single()

    if (error && error.code !== 'PGRST116') { // Not found is okay
      console.error("Fetch analytics error:", error)
    }

    return NextResponse.json({
      analytics: data || {
        views_count: 0,
        views_today: 0,
        sales_count: 0,
        sales_today: 0
      }
    })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
