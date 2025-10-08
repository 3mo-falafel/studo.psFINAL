import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ testimonialId: string }> }
) {
  try {
    const supabase = await getSupabaseServerClient()
    const { testimonialId: rawTestimonialId } = await params

    // Remove the $ prefix that Next.js adds to route parameters
    const testimonialId = rawTestimonialId.replace(/^\$/, '')

    console.log("Deleting testimonial (cleaned):", testimonialId)

    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("User authenticated:", user.id)

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (userError) {
      console.error("User lookup error:", userError)
      return NextResponse.json({ error: "User lookup failed" }, { status: 500 })
    }

    if (userData?.role !== "admin") {
      console.error("User is not admin:", userData)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.log("User is admin, deleting testimonial")

    // Delete testimonial
    const { data, error } = await supabase
      .from("site_testimonials")
      .delete()
      .eq("id", testimonialId)
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Testimonial deleted successfully:", data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Exception:", error)
    return NextResponse.json(
      { error: "Failed to delete testimonial", details: String(error) },
      { status: 500 }
    )
  }
}
