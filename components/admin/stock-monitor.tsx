import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, Package, TrendingDown } from "lucide-react"
import Link from "next/link"

interface StockMonitorProps {
  products: {
    id: string
    name: string
    stock_quantity: number
    stock_status: string
    low_stock_threshold: number
    price: number
  }[]
}

export function StockMonitor({ products }: StockMonitorProps) {
  const outOfStock = products.filter(p => p.stock_status === 'out_of_stock')
  const lowStock = products.filter(p => p.stock_status === 'low_stock')
  const needsAttention = [...outOfStock, ...lowStock]

  return (
    <div className="space-y-6">
      {/* Stock Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStock.length}</div>
            <p className="text-xs text-muted-foreground">Products unavailable</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStock.length}</div>
            <p className="text-xs text-muted-foreground">Need restocking soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">In inventory</p>
          </CardContent>
        </Card>
      </div>

      {/* Products Needing Attention */}
      {needsAttention.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Products Needing Attention
            </CardTitle>
            <CardDescription>
              Products that are out of stock or running low
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {needsAttention.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      ₪{product.price} • Alert at {product.low_stock_threshold} items
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-medium">{product.stock_quantity} left</p>
                      <Badge 
                        variant={product.stock_status === 'out_of_stock' ? 'destructive' : 'secondary'}
                        className={product.stock_status === 'low_stock' ? 'bg-orange-100 text-orange-800' : ''}
                      >
                        {product.stock_status === 'out_of_stock' ? '🚨 Out of Stock' : '⚠️ Low Stock'}
                      </Badge>
                    </div>
                    
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        Restock
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Products Stock Status */}
      <Card>
        <CardHeader>
          <CardTitle>All Products Stock Status</CardTitle>
          <CardDescription>Current inventory levels for all products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">₪{product.price}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="font-medium min-w-[3rem] text-right">
                    {product.stock_quantity}
                  </span>
                  
                  <Badge 
                    variant={
                      product.stock_status === 'out_of_stock' ? 'destructive' : 
                      product.stock_status === 'low_stock' ? 'secondary' : 
                      'default'
                    }
                    className={
                      product.stock_status === 'low_stock' ? 'bg-orange-100 text-orange-800' :
                      product.stock_status === 'in_stock' ? 'bg-green-100 text-green-800' : ''
                    }
                  >
                    {product.stock_status === 'in_stock' ? '✅ In Stock' :
                     product.stock_status === 'low_stock' ? '⚠️ Low Stock' :
                     '🚨 Out of Stock'}
                  </Badge>
                  
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}