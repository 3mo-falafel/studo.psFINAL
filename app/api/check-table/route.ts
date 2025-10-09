import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  console.log("🔧 Adding user_id column to site_testimonials...")
  
  try {
    const supabase = await getSupabaseServerClient()
    
    console.log("📊 Step 1: Check current table structure...")
    
    // Check current table structure
    const { data: currentColumns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'site_testimonials')
      .order('ordinal_position')
    
    console.log("📋 Current columns:", currentColumns)
    
    if (columnsError) {
      console.error("❌ Could not check table structure:", columnsError)
      return NextResponse.json({
        success: false,
        error: `Could not check table structure: ${columnsError.message}`
      })
    }
    
    // Check if user_id column exists
    const hasUserId = currentColumns?.some(col => col.column_name === 'user_id')
    console.log("🔍 Has user_id column:", hasUserId)
    
    if (!hasUserId) {
      console.log("➕ Adding user_id column...")
      
      // Use a simple ALTER TABLE approach
      try {
        // Since we can't use exec_sql, let's try a workaround by testing the column
        const { data: testData, error: testError } = await supabase
          .from("site_testimonials")
          .insert({
            customer_name: "Structure Test",
            rating: 5,
            comment: "Testing structure",
            is_approved: false,
            user_id: null  // This will fail if column doesn't exist
          })
          .select()
          .single()
          
        if (testError && testError.message.includes('column "user_id" of relation "site_testimonials" does not exist')) {
          console.log("❌ user_id column definitely doesn't exist")
          
          return NextResponse.json({
            success: false,
            error: "user_id column doesn't exist and cannot be added via API",
            current_columns: currentColumns,
            recommendation: "Please add the user_id column manually in the database",
            sql_needed: "ALTER TABLE site_testimonials ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;"
          })
        } else if (!testError) {
          console.log("✅ user_id column already exists and works!")
          
          // Clean up test data
          await supabase
            .from("site_testimonials")
            .delete()
            .eq("id", testData.id)
            
          return NextResponse.json({
            success: true,
            message: "user_id column already exists and works!",
            current_columns: currentColumns
          })
        } else {
          console.log("🤔 Different error, might be RLS:", testError)
          // This might be an RLS error, which means the column exists but insert failed due to policies
          
          return NextResponse.json({
            success: false,
            error: `Insert test failed: ${testError.message}`,
            current_columns: currentColumns,
            likely_cause: "RLS policy preventing insert, not missing column"
          })
        }
      } catch (e) {
        console.error("❌ Structure test failed:", e)
        return NextResponse.json({
          success: false,
          error: `Structure test failed: ${e}`,
          current_columns: currentColumns
        })
      }
    } else {
      console.log("✅ user_id column already exists")
      
      // Test if the table works with all required fields
      console.log("🧪 Testing complete testimonial insert...")
      
      const { data: testData, error: testError } = await supabase
        .from("site_testimonials")
        .insert({
          customer_name: "Complete Test",
          rating: 5,
          comment: "Testing complete functionality",
          is_approved: false,
          user_id: null
        })
        .select()
        .single()
        
      if (testError) {
        console.error("❌ Complete test failed:", testError)
        return NextResponse.json({
          success: false,
          error: `Table test failed: ${testError.message}`,
          error_code: testError.code,
          current_columns: currentColumns,
          has_user_id: true
        })
      }
      
      console.log("✅ Complete test successful:", testData)
      
      // Clean up test data
      await supabase
        .from("site_testimonials")
        .delete()
        .eq("id", testData.id)
      
      return NextResponse.json({
        success: true,
        message: "Table structure is complete and working!",
        current_columns: currentColumns,
        test_result: testData,
        has_user_id: true
      })
    }
    
  } catch (error) {
    console.error("❌ Table structure check failed:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Send a POST request to check/add user_id column to site_testimonials"
  })
}