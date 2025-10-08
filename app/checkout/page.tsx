"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { CheckoutSummary } from "@/components/checkout/checkout-summary"
import { useLanguage } from "@/lib/contexts/language-context"
import { useState } from "react"

export default function CheckoutPage() {
  const [deliveryMethod, setDeliveryMethod] = useState<string>("birzeit")
  const { t } = useLanguage()
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string
    percentage: number
    amount: number
  } | null>(null)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">{t("checkout")}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CheckoutForm
                onDeliveryMethodChange={setDeliveryMethod}
                onDiscountApplied={setAppliedDiscount}
                appliedDiscount={appliedDiscount}
              />
            </div>
            <div>
              <CheckoutSummary
                deliveryMethod={deliveryMethod}
                onDiscountApplied={setAppliedDiscount}
                onDiscountRemoved={() => setAppliedDiscount(null)}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
