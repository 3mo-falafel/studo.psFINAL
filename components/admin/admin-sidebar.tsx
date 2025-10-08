"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, ShoppingBag, Users, FolderTree, LogOut, Home, ImageIcon, Images, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useAppDispatch } from "@/lib/redux/hooks"
import { clearUser } from "@/lib/redux/slices/auth-slice"
import { useToast } from "@/hooks/use-toast"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    dispatch(clearUser())

    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    })

    router.push("/")
    router.refresh()
  }

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: FolderTree },
    { href: "/admin/banners", label: "Banners", icon: ImageIcon },
    { href: "/admin/category-images", label: "Category Images", icon: Images },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/reviews", label: "Reviews", icon: Star },
    { href: "/admin/users", label: "Users", icon: Users },
  ]

  return (
    <aside className="w-64 border-r bg-background flex flex-col">
      <div className="p-6 border-b">
        <Link href="/admin">
          <h1 className="text-2xl font-bold">STUDO Admin</h1>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t space-y-1">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="h-4 w-4 mr-3" />
            Back to Store
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
