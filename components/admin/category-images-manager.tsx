"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Pencil, Trash2, Save, X, Loader2 } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface CategoryImage {
  id: string
  category_slot: number
  image_url: string
  display_order: number
  is_active: boolean
}

interface CategoryImagesManagerProps {
  images: CategoryImage[]
}

const SLOT_NAMES = {
  1: "iPad Pencils",
  2: "AirPods",
  3: "Chargers",
  4: "Printed Stuff"
}

export function CategoryImagesManager({ images: initialImages }: CategoryImagesManagerProps) {
  const [images, setImages] = useState<CategoryImage[]>(initialImages)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    image_url: "",
    category_slot: 1,
    display_order: 0,
    is_active: true,
  })

  const supabase = getSupabaseBrowserClient()
  const router = useRouter()

  const refreshImages = async () => {
    const { data } = await supabase
      .from("category_images")
      .select("*")
      .order("category_slot")
      .order("display_order")
    if (data) {
      setImages(data)
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from('category-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError && uploadError.message.includes('Bucket not found')) {
        const { error: bucketError } = await supabase.storage.createBucket('category-images', {
          public: true,
          fileSizeLimit: 10485760,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
        })
        
        if (bucketError && !bucketError.message.includes('already exists')) {
          throw bucketError
        }
        
        const { error: retryError } = await supabase.storage
          .from('category-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (retryError) throw retryError
      } else if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('category-images')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error: any) {
      console.error('Error uploading image:', error)
      alert(`Error uploading image: ${error.message || 'Please try again'}`)
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false, imageId?: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    const imageUrl = await uploadImage(file)
    if (imageUrl) {
      if (isEdit && imageId) {
        updateImage(imageId, "image_url", imageUrl)
      } else {
        setFormData({ 
          ...formData, 
          image_url: imageUrl
        })
      }
    }
  }

  const handleAdd = async () => {
    try {
      const slotImages = images.filter(img => img.category_slot === selectedSlot)
      const dataToInsert = {
        ...formData,
        category_slot: selectedSlot,
        display_order: slotImages.length,
      }

      const { data, error } = await supabase
        .from("category_images")
        .insert([dataToInsert])
        .select()
        .single()

      if (error) {
        console.error("Error adding image:", error)
        if (error.message.includes('row-level security')) {
          alert("Permission denied. Please make sure you're logged in as an admin user.")
        } else {
          alert("Error adding image: " + error.message)
        }
        return
      }

      await refreshImages()
      router.refresh()
      setIsAdding(false)
      setFormData({
        image_url: "",
        category_slot: selectedSlot,
        display_order: 0,
        is_active: true,
      })
    } catch (error: any) {
      console.error("Error adding image:", error)
      alert("Error adding image: " + (error.message || "Please try again"))
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      const image = images.find((img) => img.id === id)
      if (!image) return

      const { error } = await supabase
        .from("category_images")
        .update(image)
        .eq("id", id)

      if (error) {
        console.error("Error updating image:", error)
        if (error.message.includes('row-level security')) {
          alert("Permission denied. Please make sure you're logged in as an admin user.")
        } else {
          alert("Error updating image: " + error.message)
        }
        return
      }

      await refreshImages()
      router.refresh()
      setEditingId(null)
    } catch (error: any) {
      console.error("Error updating image:", error)
      alert("Error updating image: " + (error.message || "Please try again"))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const { error } = await supabase.from("category_images").delete().eq("id", id)

      if (error) {
        console.error("Error deleting image:", error)
        if (error.message.includes('row-level security')) {
          alert("Permission denied. Please make sure you're logged in as an admin user.")
        } else {
          alert("Error deleting image: " + error.message)
        }
        return
      }

      await refreshImages()
      router.refresh()
    } catch (error: any) {
      console.error("Error deleting image:", error)
      alert("Error deleting image: " + (error.message || "Please try again"))
    }
  }

  const updateImage = (id: string, field: string, value: any) => {
    setImages(images.map((img) => (img.id === id ? { ...img, [field]: value } : img)))
  }

  return (
    <div className="space-y-6">
      <Tabs value={selectedSlot.toString()} onValueChange={(v) => setSelectedSlot(Number.parseInt(v))}>
        <TabsList className="grid w-full grid-cols-4">
          {[1, 2, 3, 4].map(slot => (
            <TabsTrigger key={slot} value={slot.toString()}>
              {SLOT_NAMES[slot as keyof typeof SLOT_NAMES]} - {images.filter(img => img.category_slot === slot).length} images
            </TabsTrigger>
          ))}
        </TabsList>

        {[1, 2, 3, 4].map((slot) => {
          const slotImages = images.filter((img) => img.category_slot === slot)
          
          return (
            <TabsContent key={slot} value={slot.toString()} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{SLOT_NAMES[slot as keyof typeof SLOT_NAMES]}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Add multiple images for this category. They will rotate every 5 seconds with a 1-second delay.
                  </p>
                </CardHeader>
              </Card>

              {!isAdding && (
                <Button onClick={() => { setIsAdding(true); setSelectedSlot(slot) }} className="w-full md:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Image to {SLOT_NAMES[slot as keyof typeof SLOT_NAMES]}
                </Button>
              )}

              {isAdding && selectedSlot === slot && (
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Image to {SLOT_NAMES[slot as keyof typeof SLOT_NAMES]}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Category Image *</Label>
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, false)}
                          disabled={uploading}
                        />
                        {uploading && <Loader2 className="w-6 h-6 animate-spin" />}
                      </div>
                      {formData.image_url && (
                        <div className="mt-2 relative w-32 h-32 rounded overflow-hidden">
                          <Image src={formData.image_url} alt="Preview" fill className="object-cover" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                      />
                      <Label>Active</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAdd} disabled={!formData.image_url || uploading}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Image
                      </Button>
                      <Button variant="outline" onClick={() => setIsAdding(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-6">
                {slotImages.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      No images for this category yet. Add your first image above!
                    </CardContent>
                  </Card>
                ) : (
                  slotImages.map((image) => (
                    <Card key={image.id}>
                      <CardContent className="p-6">
                        {editingId === image.id ? (
                          <div className="space-y-4">
                            <div>
                              <Label>Category Image</Label>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, true, image.id)}
                                disabled={uploading}
                              />
                              {image.image_url && (
                                <div className="mt-2 relative w-32 h-32 rounded overflow-hidden">
                                  <Image src={image.image_url} alt="Preview" fill className="object-cover" />
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={image.is_active}
                                onCheckedChange={(checked) => updateImage(image.id, "is_active", checked)}
                              />
                              <Label>Active</Label>
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={() => handleUpdate(image.id)}>
                                <Save className="w-4 h-4 mr-2" />
                                Save
                              </Button>
                              <Button variant="outline" onClick={() => setEditingId(null)}>
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden bg-muted">
                              <Image
                                src={image.image_url || "/placeholder.svg"}
                                alt={`Category image ${image.id}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="text-sm text-muted-foreground">Display Order: {image.display_order}</p>
                                  <p className="text-sm">
                                    <span className="text-muted-foreground">Status:</span>{" "}
                                    <span className={image.is_active ? "text-green-600" : "text-red-600"}>
                                      {image.is_active ? "Active" : "Inactive"}
                                    </span>
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" onClick={() => setEditingId(image.id)}>
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleDelete(image.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
