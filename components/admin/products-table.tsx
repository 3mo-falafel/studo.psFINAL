"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit, Trash2, Package, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatPrice } from "@/lib/utils/currency"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/contexts/language-context"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock_quantity: number | null | undefined
  images: string[] | null
  is_featured: boolean
  categories?: { name: string } | null
}

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  const { toast } = useToast()
  const { t } = useLanguage()
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false)
  const [newStockValue, setNewStockValue] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  // Filter products by stock status with null-safe handling
  const inStockProducts = products.filter(p => {
    const stock = typeof p.stock_quantity === 'number' ? p.stock_quantity : 0
    return stock > 10
  })
  
  const lowStockProducts = products.filter(p => {
    const stock = typeof p.stock_quantity === 'number' ? p.stock_quantity : 0
    return stock > 0 && stock <= 10
  })
  
  const outOfStockProducts = products.filter(p => {
    const stock = typeof p.stock_quantity === 'number' ? p.stock_quantity : 0
    return stock <= 0
  })

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
      return
    }

    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.from("products").delete().eq("id", productId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Product deleted",
      description: `${productName} has been deleted successfully.`,
    })

    router.refresh()
  }

  const openStockDialog = (product: Product) => {
    setSelectedProduct(product)
    setNewStockValue((product.stock_quantity ?? 0).toString())
    setIsStockDialogOpen(true)
  }

  const handleStockUpdate = async () => {
    if (!selectedProduct) return

    const newStock = parseInt(newStockValue)
    if (isNaN(newStock) || newStock < 0) {
      toast({
        title: t("stockUpdateFailed"),
        description: "Please enter a valid number",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)
    const supabase = getSupabaseBrowserClient()
    
    const { error } = await supabase
      .from("products")
      .update({ quantity: newStock })
      .eq("id", selectedProduct.id)

    if (error) {
      toast({
        title: t("stockUpdateFailed"),
        description: "Failed to update stock. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: t("stockUpdated"),
        description: `${selectedProduct.name}: ${selectedProduct.stock_quantity} → ${newStock}`,
      })
      setIsStockDialogOpen(false)
      router.refresh()
    }

    setIsUpdating(false)
  }

  const getStockBadge = (stock: number | undefined | null) => {
    const stockQty = stock ?? 0
    
    if (stockQty <= 0) {
      return (
        <Badge variant="outline" className="text-destructive border-destructive">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {t("outOfStockLabel")}
        </Badge>
      )
    } else if (stockQty <= 10) {
      return (
        <Badge variant="outline" className="text-orange-600 border-orange-600">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {t("lowStock").replace("{count}", stockQty.toString())}
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="text-green-600 border-green-600">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {t("stockAvailable").replace("{count}", stockQty.toString())}
        </Badge>
      )
    }
  }

  const renderProductList = (productList: Product[]) => {
    if (productList.length === 0) {
      return (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">{t("noProductsFound")}</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {productList.map((product) => (
          <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
              <Image src={product.images?.[0] || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{product.name}</h3>
                {product.is_featured && <Badge variant="secondary">Featured</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {product.categories?.name || "Uncategorized"}
              </p>
              {getStockBadge(product.stock_quantity)}
            </div>

            <div className="text-right">
              <p className="font-bold text-lg">{formatPrice(product.price)}</p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openStockDialog(product)}
              >
                <Package className="h-4 w-4 mr-2" />
                {t("updateStock")}
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link href={`/admin/products/${product.id}/edit`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDelete(product.id, product.name)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t("products")}</h1>
            <p className="text-muted-foreground">{t("manageInventory")}</p>
          </div>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              {t("allProducts")} ({products.length})
            </TabsTrigger>
            <TabsTrigger value="in-stock" className="text-green-600">
              {t("inStockProducts")} ({inStockProducts.length})
            </TabsTrigger>
            <TabsTrigger value="low-stock" className="text-orange-600">
              {t("lowStockProducts")} ({lowStockProducts.length})
            </TabsTrigger>
            <TabsTrigger value="out-of-stock" className="text-destructive">
              {t("outOfStockProducts")} ({outOfStockProducts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>{t("allProducts")} ({products.length})</CardTitle>
              </CardHeader>
              <CardContent>{renderProductList(products)}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="in-stock">
            <Card>
              <CardHeader>
                <CardTitle>{t("inStockProducts")} ({inStockProducts.length})</CardTitle>
              </CardHeader>
              <CardContent>{renderProductList(inStockProducts)}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="low-stock">
            <Card>
              <CardHeader>
                <CardTitle>{t("lowStockProducts")} ({lowStockProducts.length})</CardTitle>
              </CardHeader>
              <CardContent>{renderProductList(lowStockProducts)}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="out-of-stock">
            <Card>
              <CardHeader>
                <CardTitle>{t("outOfStockProducts")} ({outOfStockProducts.length})</CardTitle>
              </CardHeader>
              <CardContent>{renderProductList(outOfStockProducts)}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Stock Update Dialog */}
      <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("updateStock")}</DialogTitle>
            <DialogDescription>
              {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-stock">{t("currentStock")}</Label>
              <Input
                id="current-stock"
                value={selectedProduct?.stock_quantity || 0}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-stock">{t("newStockQuantity")}</Label>
              <Input
                id="new-stock"
                type="number"
                min="0"
                value={newStockValue}
                onChange={(e) => setNewStockValue(e.target.value)}
                placeholder="Enter new stock quantity"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStockDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStockUpdate} disabled={isUpdating}>
              {isUpdating ? "Updating..." : t("updateStock")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
