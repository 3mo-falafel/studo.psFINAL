import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const supabase = await getSupabaseServerClient()
    const { reviewId: rawReviewId } = await params
    
    // Remove the dollar prefix that Next.js adds
    const reviewId = rawReviewId.replace(/^\$/, "")

    console.log("Approving review (cleaned):", reviewId)

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("User authenticated:", user.id)

    const { data, error } = await supabase
      .from("product_reviews")
      .update({ is_approved: true })
      .eq("id", reviewId)
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Review approved successfully:", data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Failed to approve review:", error)
    return NextResponse.json(
      { error: "Failed to approve review", details: String(error) },
      { status: 500 }
    )
  }
}