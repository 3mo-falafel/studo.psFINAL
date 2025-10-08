"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { User, Package, MapPin, Heart, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useAppDispatch } from "@/lib/redux/hooks"
import { clearUser } from "@/lib/redux/slices/auth-slice"
import { useToast } from "@/hooks/use-toast"

export function AccountSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    dispatch(clearUser())

    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح",
    })

    router.push("/")
    router.refresh()
  }

  const menuItems = [
    { href: "/account", label: "نظرة عامة", icon: User },
    { href: "/account/orders", label: "الطلبات", icon: Package },
    { href: "/account/addresses", label: "العناوين", icon: MapPin },
    { href: "/wishlist", label: "المفضلة", icon: Heart },
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start" size="sm">
                  <Icon className="h-4 w-4 ml-2" />
                  {item.label}
                </Button>
              </Link>
            )
          })}

          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 ml-2" />
            تسجيل الخروج
          </Button>
        </nav>
      </CardContent>
    </Card>
  )
}
