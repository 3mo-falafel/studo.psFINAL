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

interface Banner {
  id: string
  title: string
  subtitle?: string
  description?: string
  image_url: string
  background_image_url?: string
  link_url?: string
  button_text?: string
  discount_percentage?: number
  countdown_end_time?: string
  banner_slot: number
  display_order: number
  is_active: boolean
}

interface BannersManagerProps {
  banners: Banner[]
}

export function BannersManager({ banners: initialBanners }: BannersManagerProps) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image_url: "",
    background_image_url: "",
    link_url: "",
    button_text: "",
    discount_percentage: 0,
    countdown_end_time: "",
    banner_slot: 1,
    display_order: 0,
    is_active: true,
  })

  const supabase = getSupabaseBrowserClient()
  const router = useRouter()

  const refreshBanners = async () => {
    const { data } = await supabase.from("banners").select("*").order("banner_slot").order("display_order")
    if (data) {
      setBanners(data)
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // First, try to upload
      let { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      // If bucket doesn't exist, create it and retry
      if (uploadError && uploadError.message.includes('Bucket not found')) {
        const { error: bucketError } = await supabase.storage.createBucket('banners', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
        })
        
        if (bucketError && !bucketError.message.includes('already exists')) {
          throw bucketError
        }
        
        // Retry upload after creating bucket
        const { error: retryError } = await supabase.storage
          .from('banners')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (retryError) throw retryError
      } else if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('banners')
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false, bannerId?: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    const imageUrl = await uploadImage(file)
    if (imageUrl) {
      if (isEdit && bannerId) {
        updateBanner(bannerId, "background_image_url", imageUrl)
        updateBanner(bannerId, "image_url", imageUrl)
      } else {
        setFormData({ 
          ...formData, 
          background_image_url: imageUrl,
          image_url: imageUrl 
        })
      }
    }
  }

  const handleAdd = async () => {
    try {
      const slotBanners = banners.filter(b => b.banner_slot === selectedSlot)
      const dataToInsert = {
        ...formData,
        banner_slot: selectedSlot,
        display_order: slotBanners.length,
      }

      const { data, error } = await supabase
        .from("banners")
        .insert([dataToInsert])
        .select()
        .single()

      if (error) {
        console.error("Error adding banner:", error)
        if (error.message.includes('row-level security')) {
          alert("Permission denied. Please make sure you're logged in as an admin user.")
        } else {
          alert("Error adding banner: " + error.message)
        }
        return
      }

      await refreshBanners()
      router.refresh()
      setIsAdding(false)
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        image_url: "",
        background_image_url: "",
        link_url: "",
        button_text: "",
        discount_percentage: 0,
        countdown_end_time: "",
        banner_slot: selectedSlot,
        display_order: 0,
        is_active: true,
      })
    } catch (error: any) {
      console.error("Error adding banner:", error)
      alert("Error adding banner: " + (error.message || "Please try again"))
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      const banner = banners.find((b) => b.id === id)
      if (!banner) return

      const { error } = await supabase
        .from("banners")
        .update(banner)
        .eq("id", id)

      if (error) {
        console.error("Error updating banner:", error)
        if (error.message.includes('row-level security')) {
          alert("Permission denied. Please make sure you're logged in as an admin user.")
        } else {
          alert("Error updating banner: " + error.message)
        }
        return
      }

      await refreshBanners()
      router.refresh()
      setEditingId(null)
    } catch (error: any) {
      console.error("Error updating banner:", error)
      alert("Error updating banner: " + (error.message || "Please try again"))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return

    try {
      const { error } = await supabase.from("banners").delete().eq("id", id)

      if (error) {
        console.error("Error deleting banner:", error)
        if (error.message.includes('row-level security')) {
          alert("Permission denied. Please make sure you're logged in as an admin user.")
        } else {
          alert("Error deleting banner: " + error.message)
        }
        return
      }

      await refreshBanners()
      router.refresh()
    } catch (error: any) {
      console.error("Error deleting banner:", error)
      alert("Error deleting banner: " + (error.message || "Please try again"))
    }
  }

  const updateBanner = (id: string, field: string, value: any) => {
    setBanners(banners.map((b) => (b.id === id ? { ...b, [field]: value } : b)))
  }

  return (
    <div className="space-y-6">
      <Tabs value={selectedSlot.toString()} onValueChange={(v) => setSelectedSlot(Number.parseInt(v))}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="1">
            Banner Slot 1 (Large) - {banners.filter(b => b.banner_slot === 1).length} offers
          </TabsTrigger>
          <TabsTrigger value="2">
            Banner Slot 2 (Small) - {banners.filter(b => b.banner_slot === 2).length} offers
          </TabsTrigger>
          <TabsTrigger value="3">
            Banner Slot 3 (Small) - {banners.filter(b => b.banner_slot === 3).length} offers
          </TabsTrigger>
        </TabsList>

        {[1, 2, 3].map((slot) => {
          const slotBanners = banners.filter((b) => b.banner_slot === slot)
          
          return (
            <TabsContent key={slot} value={slot.toString()} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Banner Slot {slot} {slot === 1 ? '(Large Banner)' : '(Small Banner)'}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Add multiple offers to this slot. They will rotate every 5 seconds on the homepage.
                  </p>
                </CardHeader>
              </Card>

              {!isAdding && (
                <Button onClick={() => { setIsAdding(true); setSelectedSlot(slot) }} className="w-full md:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Offer to Slot {slot}
                </Button>
              )}

              {isAdding && selectedSlot === slot && (
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Offer to Banner Slot {slot}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Title *</Label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Offer title"
                        />
                      </div>
                      <div>
                        <Label>Subtitle</Label>
                        <Input
                          value={formData.subtitle}
                          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                          placeholder="Offer subtitle"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Description</Label>
                        <Input
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Offer description"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Background Image *</Label>
                        <div className="flex gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, false)}
                            disabled={uploading}
                          />
                          {uploading && <Loader2 className="w-6 h-6 animate-spin" />}
                        </div>
                        {formData.background_image_url && (
                          <div className="mt-2 relative w-32 h-20 rounded overflow-hidden">
                            <Image src={formData.background_image_url} alt="Preview" fill className="object-cover" />
                          </div>
                        )}
                      </div>
                      <div>
                        <Label>Link URL</Label>
                        <Input
                          value={formData.link_url}
                          onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                          placeholder="/shop or https://..."
                        />
                      </div>
                      <div>
                        <Label>Button Text</Label>
                        <Input
                          value={formData.button_text}
                          onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                          placeholder="Shop Now"
                        />
                      </div>
                      <div>
                        <Label>Discount Percentage (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.discount_percentage}
                          onChange={(e) => setFormData({ ...formData, discount_percentage: Number.parseInt(e.target.value) || 0 })}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label>Countdown End Time</Label>
                        <Input
                          type="datetime-local"
                          value={formData.countdown_end_time}
                          onChange={(e) => setFormData({ ...formData, countdown_end_time: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                      />
                      <Label>Active</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAdd} disabled={!formData.title || !formData.image_url || uploading}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Offer
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
                {slotBanners.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      No offers in this slot yet. Add your first offer above!
                    </CardContent>
                  </Card>
                ) : (
                  slotBanners.map((banner) => (
                    <Card key={banner.id}>
                      <CardContent className="p-6">
                        {editingId === banner.id ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Title</Label>
                                <Input value={banner.title} onChange={(e) => updateBanner(banner.id, "title", e.target.value)} />
                              </div>
                              <div>
                                <Label>Subtitle</Label>
                                <Input
                                  value={banner.subtitle || ""}
                                  onChange={(e) => updateBanner(banner.id, "subtitle", e.target.value)}
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label>Description</Label>
                                <Input
                                  value={banner.description || ""}
                                  onChange={(e) => updateBanner(banner.id, "description", e.target.value)}
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label>Background Image</Label>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, true, banner.id)}
                                  disabled={uploading}
                                />
                                {banner.background_image_url && (
                                  <div className="mt-2 relative w-32 h-20 rounded overflow-hidden">
                                    <Image src={banner.background_image_url || banner.image_url} alt="Preview" fill className="object-cover" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <Label>Link URL</Label>
                                <Input
                                  value={banner.link_url || ""}
                                  onChange={(e) => updateBanner(banner.id, "link_url", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Button Text</Label>
                                <Input
                                  value={banner.button_text || ""}
                                  onChange={(e) => updateBanner(banner.id, "button_text", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Discount %</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={banner.discount_percentage || 0}
                                  onChange={(e) => updateBanner(banner.id, "discount_percentage", Number.parseInt(e.target.value) || 0)}
                                />
                              </div>
                              <div>
                                <Label>Countdown End</Label>
                                <Input
                                  type="datetime-local"
                                  value={banner.countdown_end_time ? new Date(banner.countdown_end_time).toISOString().slice(0, 16) : ""}
                                  onChange={(e) => updateBanner(banner.id, "countdown_end_time", e.target.value ? new Date(e.target.value).toISOString() : null)}
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={banner.is_active}
                                onCheckedChange={(checked) => updateBanner(banner.id, "is_active", checked)}
                              />
                              <Label>Active</Label>
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={() => handleUpdate(banner.id)}>
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
                            <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden bg-muted">
                              <Image
                                src={banner.background_image_url || banner.image_url || "/placeholder.svg"}
                                alt={banner.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-lg font-semibold">{banner.title}</h3>
                                  {banner.subtitle && <p className="text-sm text-muted-foreground">{banner.subtitle}</p>}
                                  {banner.description && <p className="text-sm text-muted-foreground mt-1">{banner.description}</p>}
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" onClick={() => setEditingId(banner.id)}>
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleDelete(banner.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-1 text-sm">
                                {banner.discount_percentage && banner.discount_percentage > 0 && (
                                  <p>
                                    <span className="text-muted-foreground">Discount:</span> {banner.discount_percentage}%
                                  </p>
                                )}
                                {banner.countdown_end_time && (
                                  <p>
                                    <span className="text-muted-foreground">Ends:</span> {new Date(banner.countdown_end_time).toLocaleString()}
                                  </p>
                                )}
                                <p>
                                  <span className="text-muted-foreground">Status:</span>{" "}
                                  <span className={banner.is_active ? "text-green-600" : "text-red-600"}>
                                    {banner.is_active ? "Active" : "Inactive"}
                                  </span>
                                </p>
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
