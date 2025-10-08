"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { X, Upload, Loader2 } from "lucide-react"
import Image from "next/image"

interface Category {
  id: string
  name: string
}

interface ProductFormProps {
  product?: any
  categories: Category[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Form state
  const [name, setName] = useState(product?.name || "")
  const [description, setDescription] = useState(product?.description || "")
  const [price, setPrice] = useState(product?.price || "")
  const [compareAtPrice, setCompareAtPrice] = useState(product?.compare_at_price || "")
  const [categoryId, setCategoryId] = useState(product?.category_id || "")
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [isFeatured, setIsFeatured] = useState(product?.is_featured || false)
  const [isActive, setIsActive] = useState(product?.is_active ?? true)
  const [sku, setSku] = useState(product?.sku || "")
  const [quantity, setQuantity] = useState(product?.quantity || 0)

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from("products")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("products")
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Error uploading image")
      return null
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const uploadedUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(files[i])
      if (url) uploadedUrls.push(url)
    }

    setImages([...images, ...uploadedUrls])
    setUploading(false)
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !price || !categoryId) {
      alert("Please fill in all required fields")
      return
    }

    setLoading(true)

    try {
      const slug = generateSlug(name)
      const productData = {
        name,
        slug,
        description,
        price: parseFloat(price),
        compare_at_price: compareAtPrice ? parseFloat(compareAtPrice) : null,
        category_id: categoryId,
        images,
        is_featured: isFeatured,
        is_active: isActive,
        sku: sku || null,
        quantity: parseInt(quantity.toString()) || 0,
        updated_at: new Date().toISOString(),
      }

      let error

      if (product?.id) {
        // Update existing product
        const { error: updateError } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id)
        error = updateError
      } else {
        // Create new product
        const { error: insertError } = await supabase
          .from("products")
          .insert([productData])
        error = insertError
      }

      if (error) throw error

      alert(product?.id ? "Product updated successfully!" : "Product added successfully!")
      router.push("/admin/products")
      router.refresh()
    } catch (error: any) {
      console.error("Error saving product:", error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the product details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. iPad Pro Leather Case"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed product description..."
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. IPD-CASE-001"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Stock Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload multiple product images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="images" className="cursor-pointer">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Uploading images...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm font-medium">Click to upload images</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB each</p>
                      </div>
                    )}
                  </div>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </Label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="relative aspect-square rounded-lg overflow-hidden border">
                        <Image
                          src={image}
                          alt={`Product ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="compareAtPrice">Price Before Discount</Label>
                <Input
                  id="compareAtPrice"
                  type="number"
                  step="0.01"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="0.00"
                />
                {compareAtPrice && price && parseFloat(compareAtPrice) > parseFloat(price) && (
                  <p className="text-xs text-green-600 mt-1">
                    Save {Math.round(((parseFloat(compareAtPrice) - parseFloat(price)) / parseFloat(compareAtPrice)) * 100)}%
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="category">Select Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Featured Product</Label>
                  <p className="text-sm text-muted-foreground">Show on homepage</p>
                </div>
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Active</Label>
                  <p className="text-sm text-muted-foreground">Visible to customers</p>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{product?.id ? "Update Product" : "Add Product"}</>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/products")}
              disabled={loading}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
