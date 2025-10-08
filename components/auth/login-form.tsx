"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useAppDispatch } from "@/lib/redux/hooks"
import { setUser } from "@/lib/redux/slices/auth-slice"

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        toast({
          title: "فشل تسجيل الدخول",
          description: error.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (data.user) {
        // Try to fetch user data from users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role, full_name")
          .eq("id", data.user.id)
          .maybeSingle()

        // If user doesn't exist in users table, create their profile
        if (!userData && !userError) {
          const { error: insertError } = await supabase.from("users").insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: data.user.user_metadata?.full_name || "",
            role: "customer",
          })

          if (insertError) {
            console.error("[v0] Error creating user profile:", insertError)
          }
        } else if (userError) {
          console.error("[v0] Error fetching user data:", userError)
        }

        dispatch(
          setUser({
            id: data.user.id,
            email: data.user.email!,
            fullName: userData?.full_name || data.user.user_metadata?.full_name,
          }),
        )

        toast({
          title: "مرحباً بعودتك!",
          description: "تم تسجيل الدخول بنجاح",
        })

        if (userData?.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/account")
        }
        router.refresh()
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              required
              dir="ltr"
            />
          </div>

          <div>
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
