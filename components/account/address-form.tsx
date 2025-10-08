"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Address } from "@/lib/types/database"

interface AddressFormProps {
  userId: string
  address?: Address | null
  onClose: () => void
}

export function AddressForm({ userId, address, onClose }: AddressFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    fullName: address?.full_name || "",
    phone: address?.phone || "",
    addressLine1: address?.address_line1 || "",
    addressLine2: address?.address_line2 || "",
    city: address?.city || "",
    state: address?.state || "",
    postalCode: address?.postal_code || "",
    country: address?.country || "Pakistan",
    isDefault: address?.is_default || false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const addressData = {
        user_id: userId,
        full_name: formData.fullName,
        phone: formData.phone,
        address_line1: formData.addressLine1,
        address_line2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode,
        country: formData.country,
        is_default: formData.isDefault,
      }

      if (address) {
        // Update existing address
        const { error } = await supabase.from("addresses").update(addressData).eq("id", address.id)

        if (error) throw error

        toast({
          title: "Address updated",
          description: "Your address has been updated successfully.",
        })
      } else {
        // Create new address
        const { error } = await supabase.from("addresses").insert(addressData)

        if (error) throw error

        toast({
          title: "Address added",
          description: "Your new address has been saved successfully.",
        })
      }

      router.refresh()
      onClose()
    } catch (error) {
      console.error("Address form error:", error)
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{address ? "Edit Address" : "Add New Address"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="addressLine1">Address Line 1 *</Label>
            <Input
              id="addressLine1"
              value={formData.addressLine1}
              onChange={(e) => setFormData((prev) => ({ ...prev, addressLine1: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="addressLine2">Address Line 2</Label>
            <Input
              id="addressLine2"
              value={formData.addressLine2}
              onChange={(e) => setFormData((prev) => ({ ...prev, addressLine2: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State/Province *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code *</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => setFormData((prev) => ({ ...prev, postalCode: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isDefault: checked as boolean }))}
            />
            <Label htmlFor="isDefault" className="cursor-pointer">
              Set as default address
            </Label>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : address ? "Update Address" : "Add Address"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
