"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface StockUpdate {
  id: string
  stock_quantity: number
  stock_status: string
}

/**
 * Hook to subscribe to real-time stock updates for products
 * This ensures the UI always shows the latest stock quantities
 */
export function useRealtimeStock(productId?: string | string[]) {
  const [stockData, setStockData] = useState<Record<string, StockUpdate>>({})
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    
    // Subscribe to products table changes
    const channel = supabase
      .channel('product-stock-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
          filter: productId 
            ? Array.isArray(productId)
              ? undefined // If multiple IDs, we'll filter in handler
              : `id=eq.${productId}`
            : undefined // No filter means all products
        },
        (payload: any) => {
          const newData = payload.new as any
          
          // If we have specific product IDs to watch, filter here
          if (Array.isArray(productId) && !productId.includes(newData.id)) {
            return
          }
          
          setStockData((prev) => ({
            ...prev,
            [newData.id]: {
              id: newData.id,
              stock_quantity: newData.stock_quantity,
              stock_status: newData.stock_status,
            }
          }))
        }
      )
      .subscribe((status: string) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [productId])

  return { stockData, isConnected }
}

/**
 * Hook to get real-time stock for a single product
 * Fetches current stock immediately, then subscribes to updates
 */
export function useProductStock(productId: string, initialStock?: number) {
  const [currentStock, setCurrentStock] = useState(initialStock ?? 0)
  const { stockData } = useRealtimeStock(productId)
  
  // Fetch fresh stock data immediately on mount
  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    
    async function fetchCurrentStock() {
      const { data, error } = await supabase
        .from('products')
        .select('stock_quantity, stock_status')
        .eq('id', productId)
        .single()
      
      if (!error && data) {
        setCurrentStock(data.stock_quantity ?? 0)
      }
    }
    
    fetchCurrentStock()
  }, [productId])
  
  // Update from real-time data when available
  useEffect(() => {
    if (stockData[productId]?.stock_quantity !== undefined) {
      setCurrentStock(stockData[productId].stock_quantity)
    }
  }, [stockData, productId])
  
  const stock = currentStock
  const status = stockData[productId]?.stock_status
  
  return { 
    stock, 
    status,
    isOutOfStock: stock <= 0,
    isLowStock: stock > 0 && stock < 10
  }
}
