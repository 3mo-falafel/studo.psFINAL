import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  console.log("🔧 Creating RPC function for testimonials...")
  
  try {
    const supabase = await getSupabaseServerClient()
    
    // Create the RPC function SQL
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION insert_testimonial(
        customer_name_param TEXT,
        rating_param INTEGER,
        comment_param TEXT
      ) RETURNS TABLE (
        id UUID,
        customer_name TEXT,
        rating INTEGER,
        comment TEXT,
        is_approved BOOLEAN,
        created_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ
      ) 
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        RETURN QUERY
        INSERT INTO site_testimonials (customer_name, rating, comment, is_approved)
        VALUES (customer_name_param, rating_param, comment_param, false)
        RETURNING 
          site_testimonials.id,
          site_testimonials.customer_name,
          site_testimonials.rating,
          site_testimonials.comment,
          site_testimonials.is_approved,
          site_testimonials.created_at,
          site_testimonials.updated_at;
      END;
      $$;
    `
    
    console.log("📝 Creating RPC function...")
    
    // Try to execute the function creation
    const { data, error } = await supabase.rpc('exec_sql', { query: createFunctionSQL })
    
    if (error) {
      console.error("❌ Failed to create RPC function:", error)
      
      // Alternative approach: try to use the function even if creation failed
      console.log("🧪 Testing if function already exists...")
      const testResult = await supabase.rpc('insert_testimonial', {
        customer_name_param: 'Test User',
        rating_param: 5,
        comment_param: 'Test comment'
      })
      
      if (testResult.error) {
        console.log("❌ Function doesn't exist and can't be created")
        return NextResponse.json({
          success: false,
          error: `Could not create RPC function: ${error.message}`,
          function_exists: false
        })
      } else {
        console.log("✅ Function already exists and works!")
        // Clean up test data
        if (testResult.data && testResult.data.length > 0) {
          await supabase
            .from('site_testimonials')
            .delete()
            .eq('id', testResult.data[0].id)
        }
        return NextResponse.json({
          success: true,
          message: "RPC function already exists and works!",
          function_exists: true
        })
      }
    }
    
    console.log("✅ RPC function created:", data)
    
    // Test the new function
    console.log("🧪 Testing new RPC function...")
    const testResult = await supabase.rpc('insert_testimonial', {
      customer_name_param: 'Test User',
      rating_param: 5,
      comment_param: 'Test comment'
    })
    
    if (testResult.error) {
      console.error("❌ Function test failed:", testResult.error)
      return NextResponse.json({
        success: false,
        error: `Function created but test failed: ${testResult.error.message}`,
        function_created: true,
        function_works: false
      })
    }
    
    console.log("✅ Function test successful:", testResult.data)
    
    // Clean up test data
    if (testResult.data && testResult.data.length > 0) {
      await supabase
        .from('site_testimonials')
        .delete()
        .eq('id', testResult.data[0].id)
    }
    
    return NextResponse.json({
      success: true,
      message: "RPC function created and tested successfully!",
      function_created: true,
      function_works: true,
      test_result: testResult.data
    })
    
  } catch (error) {
    console.error("❌ RPC creation failed:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Send a POST request to create the testimonials RPC function"
  })
}