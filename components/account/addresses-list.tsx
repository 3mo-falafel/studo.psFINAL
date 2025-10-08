"use client"

import { useState } from "react"
import { Plus, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddressForm } from "@/components/account/address-form"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { Address } from "@/lib/types/database"

interface AddressesListProps {
  addresses: Address[]
  userId: string
}

export function AddressesList({ addresses, userId }: AddressesListProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return
    }

    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.from("addresses").delete().eq("id", addressId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Address deleted",
      description: "The address has been removed successfully.",
    })

    router.refresh()
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingAddress(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Manage your saved addresses</p>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </div>

      {showForm && <AddressForm userId={userId} address={editingAddress} onClose={handleFormClose} />}

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{address.full_name}</h3>
                  {address.is_default && <Badge>Default</Badge>}
                </div>

                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                  <p>{address.address_line1}</p>
                  {address.address_line2 && <p>{address.address_line2}</p>}
                  <p>
                    {address.city}, {address.state} {address.postal_code}
                  </p>
                  <p>{address.country}</p>
                  <p className="pt-2">{address.phone}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(address)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(address.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        !showForm && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-lg text-muted-foreground mb-4">No saved addresses yet</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Address
              </Button>
            </CardContent>
          </Card>
        )
      )}
    </div>
  )
}
