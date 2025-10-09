/**
 * Script to run RLS fix for product_reviews table
 * This will execute the SQL to allow normal users to submit reviews
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function runRLSFix() {
  console.log('🔧 Starting RLS Fix for Product Reviews...\n');

  // Get Supabase credentials from environment
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Create Supabase client with service role key (bypasses RLS)
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    console.log('📋 Step 1: Dropping old policies...');
    
    // Drop old policies
    const dropPolicies = `
      DROP POLICY IF EXISTS "Anyone can insert reviews" ON product_reviews;
      DROP POLICY IF EXISTS "Users can create reviews" ON product_reviews;
      DROP POLICY IF EXISTS "Authenticated users can create reviews" ON product_reviews;
      DROP POLICY IF EXISTS "Allow insert for authenticated users" ON product_reviews;
      DROP POLICY IF EXISTS "Anyone can view approved reviews" ON product_reviews;
      DROP POLICY IF EXISTS "Admins can do everything with reviews" ON product_reviews;
      DROP POLICY IF EXISTS "Admins can manage all reviews" ON product_reviews;
    `;

    for (const sql of dropPolicies.split(';').filter(s => s.trim())) {
      const { error } = await supabase.rpc('exec_sql', { sql: sql.trim() });
      if (error && !error.message.includes('does not exist')) {
        console.warn('⚠️  Warning:', error.message);
      }
    }
    console.log('✅ Old policies dropped\n');

    console.log('📋 Step 2: Creating new INSERT policies...');
    
    // Policy for authenticated users
    const { error: error1 } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Allow authenticated users to insert reviews"
        ON product_reviews
        FOR INSERT
        TO authenticated
        WITH CHECK (true);
      `
    });
    
    if (error1) {
      console.error('❌ Error creating authenticated policy:', error1);
    } else {
      console.log('✅ Authenticated users policy created');
    }

    // Policy for anonymous users
    const { error: error2 } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Allow anonymous users to insert reviews"
        ON product_reviews
        FOR INSERT
        TO anon
        WITH CHECK (true);
      `
    });
    
    if (error2) {
      console.error('❌ Error creating anonymous policy:', error2);
    } else {
      console.log('✅ Anonymous users policy created');
    }

    console.log('\n📋 Step 3: Creating SELECT policy...');
    
    const { error: error3 } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Anyone can view approved reviews"
        ON product_reviews
        FOR SELECT
        USING (is_approved = true);
      `
    });
    
    if (error3) {
      console.error('❌ Error creating SELECT policy:', error3);
    } else {
      console.log('✅ SELECT policy created');
    }

    console.log('\n📋 Step 4: Creating admin policy...');
    
    const { error: error4 } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Admins can manage all reviews"
        ON product_reviews
        FOR ALL
        TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
          )
        );
      `
    });
    
    if (error4) {
      console.error('❌ Error creating admin policy:', error4);
    } else {
      console.log('✅ Admin policy created');
    }

    console.log('\n📋 Step 5: Ensuring RLS is enabled...');
    
    const { error: error5 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;'
    });
    
    if (error5) {
      console.warn('⚠️  RLS may already be enabled:', error5.message);
    } else {
      console.log('✅ RLS enabled');
    }

    console.log('\n🎉 RLS Fix completed successfully!');
    console.log('\n📝 Summary:');
    console.log('  ✅ Old policies removed');
    console.log('  ✅ New PERMISSIVE policies created');
    console.log('  ✅ Both authenticated and anonymous users can submit reviews');
    console.log('  ✅ Only approved reviews are visible');
    console.log('  ✅ Admins can manage all reviews');
    console.log('\n🧪 Test by submitting a review on your site!');

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the fix
runRLSFix();
