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

export function SignupForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "كلمات المرور غير متطابقة",
        description: "الرجاء التأكد من تطابق كلمات المرور",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "كلمة المرور قصيرة جداً",
        description: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/account`,
        },
      })

      if (error) {
        toast({
          title: "فشل التسجيل",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      if (data.user) {
        // Create user profile in users table
        const { error: profileError } = await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: formData.fullName,
          role: "customer",
        })

        if (profileError) {
          console.error("[v0] Error creating user profile:", profileError)
        }

        toast({
          title: "تم إنشاء الحساب!",
          description: "يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك",
        })

        router.push("/auth/login")
      }
    } catch (error) {
      console.error("Signup error:", error)
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
            <Label htmlFor="fullName">الاسم الكامل</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="أحمد محمد"
              value={formData.fullName}
              onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
              required
            />
          </div>

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

          <div>
            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              required
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "جارٍ إنشاء الحساب..." : "إنشاء حساب"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
