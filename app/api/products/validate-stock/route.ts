import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const body = await request.json()
    const { items } = body

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items array" }, { status: 400 })
    }

    const validationResults = []
    let allValid = true

    // Check stock for each item
    for (const item of items) {
      const { data: product, error } = await supabase
        .from("products")
        .select("id, name, quantity")
        .eq("id", item.id)
        .single()

      if (error || !product) {
        validationResults.push({
          id: item.id,
          name: "Unknown Product",
          available: false,
          stock: 0,
          requested: item.quantity,
        })
        allValid = false
        continue
      }

      const isAvailable = product.quantity >= item.quantity
      
      validationResults.push({
        id: product.id,
        name: product.name,
        available: isAvailable,
        stock: product.quantity,
        requested: item.quantity,
      })

      if (!isAvailable) {
        allValid = false
      }
    }

    return NextResponse.json({
      valid: allValid,
      items: validationResults,
    })
  } catch (error) {
    console.error("Stock validation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
