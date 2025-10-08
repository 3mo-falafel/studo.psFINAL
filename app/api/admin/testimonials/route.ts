import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user role
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (userData?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch all testimonials
    const { data: testimonials, error } = await supabase
      .from("site_testimonials")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Fetched testimonials:", testimonials?.length || 0)

    return NextResponse.json({ testimonials: testimonials || [] })
  } catch (error) {
    console.error("Failed to fetch testimonials:", error)
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    )
  }
}
