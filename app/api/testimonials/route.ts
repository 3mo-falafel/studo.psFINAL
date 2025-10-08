import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// POST: Submit a new testimonial
export async function POST(request: NextRequest) {
  console.log("========================================")
  console.log("🔍 Testimonial API - POST request received")
  
  try {
    const body = await request.json()
    console.log("📦 Request body:", body)
    
    const { customerName, rating, comment } = body

    if (!customerName?.trim() || !comment?.trim() || !rating) {
      console.log("❌ Missing required fields:", { customerName, rating, comment })
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

    console.log("💾 Inserting testimonial into database...")
    const { data, error } = await supabase
      .from("site_testimonials")
      .insert({
        customer_name: customerName,
        rating,
        comment,
        is_approved: false,
      })
      .select()
      .single()

    if (error) {
      console.error("❌ Database error:", error)
      return NextResponse.json(
        { error: `Failed to submit testimonial: ${error.message}` },
        { status: 500 }
      )
    }

    console.log("✅ Testimonial inserted successfully:", data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("❌ Testimonial API error:", error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  } finally {
    console.log("========================================")
  }
}

// GET: Fetch approved testimonials
export async function GET() {
  try {
    const supabase = await getSupabaseServerClient()

    const { data, error } = await supabase
      .from("site_testimonials")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Fetch testimonials error:", error)
      return NextResponse.json(
        { error: "Failed to fetch testimonials" },
        { status: 500 }
      )
    }

    return NextResponse.json({ testimonials: data || [] })
  } catch (error) {
    console.error("Testimonials API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
