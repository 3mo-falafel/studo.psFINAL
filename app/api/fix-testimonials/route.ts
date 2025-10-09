import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  console.log("🚀 TESTIMONIALS DIAGNOSTIC - Starting...")
  
  try {
    const supabase = await getSupabaseServerClient()
    
    console.log("🔍 Step 1: Testing direct insert to understand the issue...")
    
    const { data: testData, error: testError } = await supabase
      .from("site_testimonials")
      .insert({
        customer_name: "Diagnostic Test User",
        rating: 5,
        comment: "Diagnostic test comment",
        is_approved: false,
      })
      .select()
      .single()
      
    if (testError) {
      console.error("❌ Direct insert failed:", testError)
      
      console.log("🔍 Step 2: Let's check the table structure and permissions...")
      
      // Check if table exists and structure
      const { data: tableCheck, error: tableError } = await supabase
        .from("site_testimonials")
        .select("*")
        .limit(1)
        
      console.log("📊 Table check result:", { tableCheck, tableError })
      
      return NextResponse.json({
        success: false,
        error: `Diagnostic insert failed: ${testError.message}`,
        error_code: testError.code,
        error_details: testError.details,
        error_hint: testError.hint,
        table_accessible: !tableError,
        step: "diagnostic_failed"
      })
    }
    
    console.log("✅ Diagnostic insert successful:", testData)
    
    // Clean up test data
    const { error: deleteError } = await supabase
      .from("site_testimonials")
      .delete()
      .eq("id", testData.id)
      
    if (deleteError) {
      console.log("⚠️  Could not clean up test data:", deleteError)
    } else {
      console.log("🧹 Test data cleaned up successfully")
    }
    
    return NextResponse.json({
      success: true,
      message: "Diagnostic test PASSED - testimonials should work!",
      test_result: testData,
      cleanup_successful: !deleteError
    })
    
  } catch (error) {
    console.error("❌ Diagnostic failed:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Send a POST request to run testimonials diagnostic"
  })
}