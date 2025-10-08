"use client"

import { useLanguage } from "@/lib/contexts/language-context"

export function FeaturesSection() {
  const { t } = useLanguage()

  return (
    <section className="container mx-auto px-4 py-16 md:py-20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div className="text-center group">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:rotate-3">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl md:text-2xl font-semibold mb-3">{t("qualityGuaranteedTitle")}</h3>
          <p className="text-muted-foreground text-pretty">{t("qualityGuaranteedDesc")}</p>
        </div>

        <div className="text-center group">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:rotate-3">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl md:text-2xl font-semibold mb-3">{t("bestPricesTitle")}</h3>
          <p className="text-muted-foreground text-pretty">{t("bestPricesDesc")}</p>
        </div>

        <div className="text-center group">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:rotate-3">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl md:text-2xl font-semibold mb-3">{t("fastDeliveryTitle")}</h3>
          <p className="text-muted-foreground text-pretty">{t("fastDeliveryDeliveryDesc")}</p>
        </div>
      </div>
    </section>
  )
}
