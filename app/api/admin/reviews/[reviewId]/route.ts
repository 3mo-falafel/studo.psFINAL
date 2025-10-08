import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const supabase = await getSupabaseServerClient()
    const { reviewId: rawReviewId } = await params
    
    // Remove the dollar prefix that Next.js adds
    const reviewId = rawReviewId.replace(/^\$/, "")

    console.log("Deleting review (cleaned):", reviewId)

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("User authenticated:", user.id)

    const { data, error } = await supabase
      .from("product_reviews")
      .delete()
      .eq("id", reviewId)
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Review deleted successfully:", data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Failed to delete review:", error)
    return NextResponse.json(
      { error: "Failed to delete review", details: String(error) },
      { status: 500 }
    )
  }
}