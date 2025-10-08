import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()

    // Get user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const body = await request.json()
    const {
      items,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      subtotal,
      discountCode,
      discountAmount,
      shipping,
      tax,
      total,
      notes,
    } = body

    // Generate simple order number: STUDO-XXXXXX (6 random digits)
    const randomDigits = Math.floor(100000 + Math.random() * 900000) // Generates 6-digit number
    const orderNumber = `STUDO-${randomDigits}`

    // Create order
    const { data: order, error: orderError} = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: user?.id || null,
        status: "pending",
        subtotal,
        discount_code: discountCode || null,
        discount_amount: discountAmount || 0,
        shipping_cost: shipping,
        tax,
        total,
        payment_method: paymentMethod,
        payment_status: "pending",
        shipping_address: shippingAddress,
        delivery_method: deliveryMethod,
        notes,
      })
      .select()
      .single()

    if (orderError) {
      console.error("Order creation error:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_image: item.image,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Order items creation error:", itemsError)
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    // Decrease stock for each product
    for (const item of items) {
      // Get current stock
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("quantity")
        .eq("id", item.id)
        .single()

      if (productError) {
        console.error("Error fetching product stock:", productError)
        continue // Continue with other items instead of failing the whole order
      }

      // Calculate new stock (ensure it doesn't go below 0)
      const newStock = Math.max(0, (product.quantity || 0) - item.quantity)

      // Update stock
      const { error: updateError } = await supabase
        .from("products")
        .update({ quantity: newStock })
        .eq("id", item.id)

      if (updateError) {
        console.error("Error updating product stock:", updateError)
        // Continue with other items instead of failing the whole order
      }
    }

    // Generate reward discount code based on order total (ILS)
    let earnedDiscountCode = null
    let earnedDiscountPercentage = 0

    if (total >= 1000) {
      earnedDiscountPercentage = 15
    } else if (total >= 500) {
      earnedDiscountPercentage = 10
    } else if (total >= 250) {
      earnedDiscountPercentage = 5
    }

    if (earnedDiscountPercentage > 0) {
      // Generate unique discount code: STUDO5/10/15-XXXXXX
      const codeRandomDigits = Math.floor(100000 + Math.random() * 900000)
      earnedDiscountCode = `STUDO${earnedDiscountPercentage}-${codeRandomDigits}`

      // Set expiration date to 90 days from now
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 90)

      // Insert discount code into database
      const { error: discountError } = await supabase.from("discount_codes").insert({
        code: earnedDiscountCode,
        discount_percentage: earnedDiscountPercentage,
        min_purchase: 0, // No minimum for earned codes
        order_id: order.id,
        user_id: user?.id || null,
        is_used: false,
        expires_at: expiresAt.toISOString(),
      })

      if (discountError) {
        console.error("Failed to create discount code:", discountError)
        // Don't fail the order if discount code creation fails
        earnedDiscountCode = null
      }
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.order_number,
      discountCode: earnedDiscountCode,
      discountPercentage: earnedDiscountPercentage,
    })
  } catch (error) {
    console.error("Order API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
