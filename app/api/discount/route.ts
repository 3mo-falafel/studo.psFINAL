import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const body = await request.json()
    const { code } = body

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Invalid discount code" }, { status: 400 })
    }

    // Fetch the discount code
    const { data: discountData, error: fetchError } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("code", code.toUpperCase().trim())
      .single()

    if (fetchError || !discountData) {
      return NextResponse.json(
        {
          valid: false,
          error: "Invalid discount code. Please check and try again.",
        },
        { status: 404 }
      )
    }

    // Check if already used
    if (discountData.is_used) {
      return NextResponse.json(
        {
          valid: false,
          error: "This discount code has already been used and is no longer valid.",
        },
        { status: 400 }
      )
    }

    // Check if expired
    const now = new Date()
    const expiresAt = new Date(discountData.expires_at)

    if (expiresAt < now) {
      return NextResponse.json(
        {
          valid: false,
          error: "This discount code has expired.",
        },
        { status: 400 }
      )
    }

    // Valid discount code
    return NextResponse.json({
      valid: true,
      code: discountData.code,
      discountPercentage: discountData.discount_percentage,
      minPurchase: discountData.min_purchase,
      expiresAt: discountData.expires_at,
    })
  } catch (error) {
    console.error("Discount validation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Mark discount code as used
export async function PUT(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const body = await request.json()
    const { code, orderId } = body

    if (!code || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update the discount code to mark as used
    const { data, error } = await supabase
      .from("discount_codes")
      .update({
        is_used: true,
        used_at: new Date().toISOString(),
        used_in_order_id: orderId,
      })
      .eq("code", code.toUpperCase().trim())
      .eq("is_used", false) // Only update if not already used
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to apply discount code. It may have already been used.",
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Discount code applied successfully",
    })
  } catch (error) {
    console.error("Discount update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
