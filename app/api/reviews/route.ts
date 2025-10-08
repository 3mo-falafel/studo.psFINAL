import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// POST - Submit a new review
export async function POST(request: NextRequest) {
  try {
    const { productId, customerName, rating, comment } = await request.json()

    if (!productId || !customerName || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    const supabase = await getSupabaseServerClient()

    const { data, error } = await supabase
      .from("product_reviews")
      .insert({
        product_id: productId,
        customer_name: customerName,
        rating,
        comment,
        is_approved: false, // Requires admin approval
      })
      .select()
      .single()

    if (error) {
      console.error("Review submission error:", error)
      return NextResponse.json(
        { error: "Failed to submit review" },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      review: data,
      message: "Review submitted and pending approval"
    })
  } catch (error) {
    console.error("Review API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// GET - Get approved reviews for a product
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
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Fetch reviews error:", error)
      return NextResponse.json(
        { error: "Failed to fetch reviews" },
        { status: 500 }
      )
    }

    return NextResponse.json({ reviews: data || [] })
  } catch (error) {
    console.error("Review API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
