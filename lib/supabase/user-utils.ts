import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Ensures a user profile exists in the users table.
 * Creates one if it doesn't exist.
 * Returns the user data if successful, null otherwise.
 */
export async function ensureUserProfile(
  supabase: SupabaseClient,
  userId: string,
  userEmail: string,
  userMetadata?: { full_name?: string },
) {
  // Try to fetch existing user data
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle()

  // If user doesn't exist in users table, create their profile
  if (!userData && !userError) {
    const { data: newUserData, error: insertError } = await supabase
      .from("users")
      .insert({
        id: userId,
        email: userEmail,
        full_name: userMetadata?.full_name || "",
        role: "customer",
      })
      .select()
      .single()

    if (insertError) {
      console.error("[v0] Error creating user profile:", insertError)
      return null
    }

    return newUserData
  } else if (userError) {
    console.error("[v0] Error fetching user data:", userError)
    return null
  }

  return userData
}

/**
 * Gets user data and ensures profile exists.
 * Returns both the full user data and just the role.
 */
export async function getUserWithRole(
  supabase: SupabaseClient,
  userId: string,
  userEmail: string,
  userMetadata?: { full_name?: string },
) {
  const userData = await ensureUserProfile(supabase, userId, userEmail, userMetadata)
  return {
    userData,
    role: userData?.role || "customer",
    isAdmin: userData?.role === "admin",
  }
}
