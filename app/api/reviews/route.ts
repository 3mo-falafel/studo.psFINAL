import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// POST - Submit a new review
export async function POST(request: NextRequest) {
  console.log("========================================")
  console.log("🔍 Review API - POST request received")
  
  try {
    const body = await request.json()
    console.log("📦 Request body:", body)
    
    const { productId, customerName, rating, comment } = body

    if (!productId || !customerName || !rating || !comment) {
      console.log("❌ Missing required fields:", { productId, customerName, rating, comment })
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      console.log("❌ Invalid rating:", rating)
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    console.log("✅ Validation passed")
    console.log("🔌 Creating Supabase client...")
    
    const supabase = await getSupabaseServerClient()

    console.log("💾 Inserting review into database...")
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
      console.error("❌ Database error:", error)
      return NextResponse.json(
        { error: `Failed to submit review: ${error.message}` },
        { status: 500 }
      )
    }

    console.log("✅ Review inserted successfully:", data)
    return NextResponse.json({ 
      success: true, 
      review: data,
      message: "Review submitted and pending approval"
    })
  } catch (error) {
    console.error("❌ Review API error:", error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  } finally {
    console.log("========================================")
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
