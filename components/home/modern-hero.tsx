"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"
import { ArrowRight, ShoppingBag, Truck, MapPin, Shield, Sparkles, Gift, Zap, Info } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useLanguage } from "@/lib/contexts/language-context"

interface CategoryImage {
  id: string
  category_slot: number
  image_url: string
  is_active: boolean
}

interface ModernHeroProps {
  categoryImages: CategoryImage[]
}

export function ModernHero({ categoryImages }: ModernHeroProps) {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [currentImages, setCurrentImages] = useState<{ [key: number]: number }>({ 1: 0, 2: 0, 3: 0, 4: 0 })
  
  // Dynamic slot info using translations
  const SLOT_INFO = {
    1: { name: t("iPadPensSlot"), desc: t("iPadPensDesc") },
    2: { name: t("airpodsSlot"), desc: t("airpodsDesc") },
    3: { name: t("chargersSlot"), desc: t("chargersDesc") },
    4: { name: t("printedSlot"), desc: t("printedDesc") }
  }

  useEffect(() => {
    // Trigger animations on mount
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImages(prev => {
        const newIndexes = { ...prev }
        for (let slot = 1; slot <= 4; slot++) {
          const slotImages = categoryImages.filter(img => img.category_slot === slot && img.is_active)
          if (slotImages.length > 0) {
            setTimeout(() => {
              setCurrentImages(current => ({
                ...current,
                [slot]: (current[slot] + 1) % slotImages.length
              }))
            }, (slot - 1) * 1000)
          }
        }
        return newIndexes
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [categoryImages])

  const getImageForSlot = (slot: number) => {
    const slotImages = categoryImages.filter(img => img.category_slot === slot && img.is_active)
    if (slotImages.length === 0) return null
    return slotImages[currentImages[slot]]
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#4A9B8E]/10 via-background to-[#6B7280]/10 py-20 md:py-28 lg:py-36">
      {/* Animated Background Elements - Using Logo Colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[500px] h-[500px] bg-[#4A9B8E]/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] bg-[#6B7280]/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-[#3D8B7E]/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Special Offer Badge */}
            <div
              className={`inline-flex items-center gap-2 bg-gradient-to-r from-[#4A9B8E] to-[#3D8B7E] text-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-700 hover:scale-105 ${
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
              }`}
            >
              <Gift className="w-5 h-5 animate-bounce" />
              <span className="font-bold text-sm">{t("specialOfferBadge")}</span>
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1
                className={`text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-balance transition-all duration-700 delay-100 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <span className="block text-foreground">{t("heroMainTitle1")}</span>
                <span className="block bg-gradient-to-r from-[#4A9B8E] via-[#3D8B7E] to-[#6B7280] bg-clip-text text-transparent animate-gradient-x">
                  {t("heroMainTitle2")}
                </span>
                <span className="block text-foreground text-4xl md:text-5xl lg:text-6xl mt-2">{t("heroMainTitle3")}</span>
              </h1>

              <p
                className={`text-xl md:text-2xl text-muted-foreground max-w-xl leading-relaxed transition-all duration-700 delay-200 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <span className="font-semibold text-foreground">{t("heroDescription1")}</span> {t("heroDescription2")}
                <br />
                <span className="text-[#4A9B8E] font-semibold">{t("heroDescription3")}</span> {t("heroDescription4")}
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Button 
                asChild 
                size="lg" 
                className="group text-lg px-8 py-6 shadow-2xl hover:shadow-[#4A9B8E]/50 transition-all hover:scale-105 bg-gradient-to-r from-[#4A9B8E] to-[#3D8B7E] hover:from-[#4A9B8E]/90 hover:to-[#3D8B7E]/90"
              >
                <Link href="/shop">
                  <ShoppingBag className="ml-2 h-6 w-6" />
                  {t("startShopping")}
                  <ArrowRight className="mr-2 h-6 w-6 transition-transform group-hover:-translate-x-2 rotate-180" />
                </Link>
              </Button>
              
              {/* Learn More Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-8 py-6 border-2 border-[#4A9B8E] hover:bg-[#4A9B8E]/10 hover:border-[#3D8B7E] transition-all hover:scale-105"
                  >
                    <Info className="ml-2 h-5 w-5" />
                    {t("learnMoreDiscount")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                      <Gift className="w-6 h-6 text-[#4A9B8E]" />
                      {t("discountDialogTitle")}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      {t("discountDialogDescription")}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6 py-4">
                    {/* How It Works */}
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-[#4A9B8E]">🎯 كيف يعمل؟</h3>
                      <ol className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="font-bold text-[#4A9B8E] min-w-[24px]">1.</span>
                          <span>أكمل عملية الشراء على Studo.ps</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold text-[#4A9B8E] min-w-[24px]">2.</span>
                          <span>احصل على كود الخصم فوراً على صفحة النجاح</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold text-[#4A9B8E] min-w-[24px]">3.</span>
                          <span>احفظ الكود (صالح لمدة 90 يوماً)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold text-[#4A9B8E] min-w-[24px]">4.</span>
                          <span>استخدمه في طلبك القادم لتوفير المال!</span>
                        </li>
                      </ol>
                    </div>

                    {/* Discount Tiers */}
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-[#4A9B8E]">💰 مستويات الخصم</h3>
                      <div className="space-y-3">
                        {/* Tier 1 */}
                        <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-green-600 text-white text-sm px-3 py-1">خصم 5%</Badge>
                            <span className="text-2xl font-bold text-green-700 dark:text-green-400">₪250+</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            اشترِ بـ <strong>₪250 أو أكثر</strong> واحصل على <strong>كود خصم 5%</strong> لعملية الشراء القادمة.
                          </p>
                          <p className="text-xs text-green-700 dark:text-green-400 mt-2 font-medium">
                            صيغة الكود: STUDO5-XXXXXX
                          </p>
                        </div>

                        {/* Tier 2 */}
                        <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-blue-600 text-white text-sm px-3 py-1">خصم 10%</Badge>
                            <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">₪500+</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            اشترِ بـ <strong>₪500 أو أكثر</strong> واحصل على <strong>كود خصم 10%</strong> لعملية الشراء القادمة.
                          </p>
                          <p className="text-xs text-blue-700 dark:text-blue-400 mt-2 font-medium">
                            صيغة الكود: STUDO10-XXXXXX
                          </p>
                        </div>

                        {/* Tier 3 */}
                        <div className="border-2 border-purple-500 rounded-lg p-4 bg-purple-50 dark:bg-purple-950/20">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-purple-600 text-white text-sm px-3 py-1">خصم 15%</Badge>
                            <span className="text-2xl font-bold text-purple-700 dark:text-purple-400">₪1000+</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            اشترِ بـ <strong>₪1000 أو أكثر</strong> واحصل على <strong>كود خصم 15%</strong> لعملية الشراء القادمة!
                          </p>
                          <p className="text-xs text-purple-700 dark:text-purple-400 mt-2 font-medium">
                            صيغة الكود: STUDO15-XXXXXX
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-400 rounded-lg p-4">
                      <h3 className="text-lg font-bold mb-2 text-amber-800 dark:text-amber-400 flex items-center gap-2">
                        ⚠️ ملاحظات مهمة
                      </h3>
                      <ul className="space-y-1.5 text-sm text-amber-900 dark:text-amber-300">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 mt-0.5">•</span>
                          <span>الكودات <strong>تُستخدم مرة واحدة فقط</strong> - بمجرد الاستخدام، تنتهي صلاحيتها</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 mt-0.5">•</span>
                          <span>صالحة لمدة <strong>90 يوماً</strong> من تاريخ استلامها</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 mt-0.5">•</span>
                          <span>يُطبق الخصم على <strong>المجموع الفرعي</strong> قبل الشحن</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 mt-0.5">•</span>
                          <span>مشتريات أكبر = خصومات أكبر على طلبك القادم!</span>
                        </li>
                      </ul>
                    </div>

                    {/* CTA */}
                    <div className="text-center pt-4">
                      <Button asChild size="lg" className="bg-[#4A9B8E] hover:bg-[#3D8B7E]">
                        <Link href="/shop">
                          <ShoppingBag className="ml-2 h-5 w-5" />
                          ابدأ التسوق واكسب المكافآت
                        </Link>
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Features Grid */}
            <div
              className={`grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-8 transition-all duration-700 delay-400 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {/* Free Shipping */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A9B8E]/20 to-[#3D8B7E]/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                <div className="relative flex flex-col items-center gap-2 md:flex-row md:items-start md:gap-3 p-3 md:p-5 bg-card/80 backdrop-blur-sm rounded-xl border-2 border-[#4A9B8E]/30 hover:border-[#4A9B8E] transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl">
                  <div className="p-1.5 md:p-2 bg-[#4A9B8E]/10 rounded-lg flex-shrink-0">
                    <Truck className="w-5 h-5 md:w-6 md:h-6 text-[#4A9B8E]" />
                  </div>
                  <div className="text-center md:text-right min-w-0">
                    <h3 className="font-bold text-xs md:text-sm mb-0.5 md:mb-1">{t("freeShippingTitle")}</h3>
                    <p className="text-[10px] md:text-xs text-muted-foreground">{t("freeShippingDesc")}</p>
                  </div>
                </div>
              </div>

              {/* Free Pickup */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#6B7280]/20 to-[#4B5563]/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                <div className="relative flex flex-col items-center gap-2 md:flex-row md:items-start md:gap-3 p-3 md:p-5 bg-card/80 backdrop-blur-sm rounded-xl border-2 border-[#6B7280]/30 hover:border-[#6B7280] transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl">
                  <div className="p-1.5 md:p-2 bg-[#6B7280]/10 rounded-lg flex-shrink-0">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-[#6B7280]" />
                  </div>
                  <div className="text-center md:text-right min-w-0">
                    <h3 className="font-bold text-xs md:text-sm mb-0.5 md:mb-1">{t("freePickupTitle")}</h3>
                    <p className="text-[10px] md:text-xs text-muted-foreground">{t("freePickupDesc")}</p>
                  </div>
                </div>
              </div>

              {/* 1 Year Warranty */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#3D8B7E]/20 to-[#2D7A6E]/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                <div className="relative flex flex-col items-center gap-2 md:flex-row md:items-start md:gap-3 p-3 md:p-5 bg-card/80 backdrop-blur-sm rounded-xl border-2 border-[#3D8B7E]/30 hover:border-[#3D8B7E] transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl">
                  <div className="p-1.5 md:p-2 bg-[#3D8B7E]/10 rounded-lg flex-shrink-0">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-[#3D8B7E]" />
                  </div>
                  <div className="text-center md:text-right min-w-0">
                    <h3 className="font-bold text-xs md:text-sm mb-0.5 md:mb-1">{t("oneYearWarrantyTitle")}</h3>
                    <p className="text-[10px] md:text-xs text-muted-foreground">{t("oneYearWarrantyDesc")}</p>
                  </div>
                </div>
              </div>

              {/* Loyalty Rewards */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A9B8E]/20 to-[#6B7280]/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                <div className="relative flex flex-col items-center gap-2 md:flex-row md:items-start md:gap-3 p-3 md:p-5 bg-card/80 backdrop-blur-sm rounded-xl border-2 border-[#4A9B8E]/30 hover:border-[#4A9B8E] transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl">
                  <div className="p-1.5 md:p-2 bg-[#4A9B8E]/10 rounded-lg flex-shrink-0">
                    <Gift className="w-5 h-5 md:w-6 md:h-6 text-[#4A9B8E]" />
                  </div>
                  <div className="text-center md:text-right min-w-0">
                    <h3 className="font-bold text-xs md:text-sm mb-0.5 md:mb-1">{t("loyaltyRewardsTitle")}</h3>
                    <p className="text-[10px] md:text-xs text-muted-foreground">{t("loyaltyRewardsDesc")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Product Grid */}
          <div
            className={`relative transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-8 scale-95"
            }`}
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Glow Effect - Logo Colors */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A9B8E]/30 via-[#6B7280]/20 to-[#3D8B7E]/30 rounded-3xl blur-3xl animate-pulse-slow" />
              
              {/* Product Grid */}
              <div className="relative grid grid-cols-2 gap-4 p-4">
                {[1, 2, 3, 4].map((slot) => {
                  const slotImage = getImageForSlot(slot)
                  const info = SLOT_INFO[slot as keyof typeof SLOT_INFO]
                  return (
                    <div 
                      key={slot} 
                      className={`group bg-card rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 border-border hover:border-[#4A9B8E] cursor-pointer ${
                        slot === 2 || slot === 4 ? 'mt-8' : ''
                      }`}
                      style={{
                        animationDelay: `${slot * 100}ms`,
                        animation: isVisible ? 'slideUp 0.6s ease-out forwards' : 'none'
                      }}
                    >
                      <div className="aspect-square bg-gradient-to-br from-[#4A9B8E]/10 to-[#6B7280]/10 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative group-hover:scale-110 transition-transform duration-500">
                        {slotImage ? (
                          <Image 
                            src={slotImage.image_url} 
                            alt={info.name} 
                            fill 
                            className="object-cover transition-all duration-500 group-hover:scale-110" 
                          />
                        ) : (
                          <div className="text-5xl animate-bounce">📦</div>
                        )}
                      </div>
                      <h3 className="font-bold text-sm mb-1 group-hover:text-[#4A9B8E] transition-colors">{info.name}</h3>
                      <p className="text-xs text-muted-foreground">{info.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
