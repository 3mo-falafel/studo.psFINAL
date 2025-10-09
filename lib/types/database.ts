export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  parent_id?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  compare_at_price?: number
  cost_price?: number
  sku?: string
  barcode?: string
  quantity: number // Legacy field name (for backwards compatibility)
  stock_quantity: number // Actual database field
  stock_status?: string // Stock status: 'in_stock' | 'low_stock' | 'out_of_stock'
  category_id?: string
  images: string[]
  is_featured: boolean
  is_active: boolean
  best_seller?: boolean // Best seller badge
  trending?: boolean // Trending badge
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at: string
  category?: Category
}

export interface Banner {
  id: string
  title: string
  subtitle?: string
  image_url: string
  link_url?: string
  button_text?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Address {
  id: string
  user_id: string
  full_name: string
  phone: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  user_id?: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  subtotal: number
  shipping_cost: number
  tax: number
  total: number
  payment_method?: string
  payment_status: "pending" | "paid" | "failed"
  shipping_address: Address
  billing_address?: Address
  delivery_method?: "birzeit" | "billin" | "home"
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_image: string | null
  quantity: number
  price: number
  total: number
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  featured_image?: string
  author_id?: string
  is_published: boolean
  published_at?: string
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: "new" | "read" | "replied"
  created_at: string
}
