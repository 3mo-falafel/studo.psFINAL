"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { Category } from "@/lib/types/database"

interface CategoriesManagerProps {
  categories: Category[]
}

export function CategoriesManager({ categories }: CategoriesManagerProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  })

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    })
    setShowForm(true)
  }

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      return
    }

    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.from("categories").delete().eq("id", categoryId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Category deleted",
      description: `${categoryName} has been deleted successfully.`,
    })

    router.refresh()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const categoryData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
      }

      if (editingCategory) {
        const { error } = await supabase.from("categories").update(categoryData).eq("id", editingCategory.id)

        if (error) throw error

        toast({
          title: "Category updated",
          description: "The category has been updated successfully.",
        })
      } else {
        const { error } = await supabase.from("categories").insert(categoryData)

        if (error) throw error

        toast({
          title: "Category created",
          description: "The new category has been created successfully.",
        })
      }

      setFormData({ name: "", slug: "", description: "" })
      setEditingCategory(null)
      setShowForm(false)
      router.refresh()
    } catch (error) {
      console.error("Category form error:", error)
      toast({
        title: "Error",
        description: "Failed to save category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setFormData({ name: "", slug: "", description: "" })
    setEditingCategory(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Categories</h1>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingCategory ? "Edit Category" : "Add New Category"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value
                      const slug = name.toLowerCase().replace(/\s+/g, "-")
                      setFormData((prev) => ({ ...prev, name, slug }))
                    }}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Categories ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.slug}</p>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(category.id, category.name)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No categories yet</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Category
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
