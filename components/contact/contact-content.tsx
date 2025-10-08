"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Instagram, Mail, MapPin, Clock, Phone } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/contexts/language-context"

export function ContactContent() {
  const { t } = useLanguage()

  return (
    <>
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-[#4A9B8E] hover:bg-[#3D8B7E] text-white px-4 py-2">
          {t("contactUsLabel")}
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          {t("letsConnect")}{" "}
          <span className="bg-gradient-to-r from-[#4A9B8E] to-[#6B7280] bg-clip-text text-transparent">
            {t("together")}
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("contactHeroDesc")}
        </p>
      </div>

      {/* Primary Contact Methods */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* WhatsApp - Primary */}
        <Card className="border-2 border-[#25D366]/30 hover:border-[#25D366] transition-all hover:-translate-y-1 bg-gradient-to-br from-[#25D366]/5 to-background">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-[#25D366]/10 rounded-lg">
                <MessageCircle className="w-8 h-8 text-[#25D366]" />
              </div>
              <div>
                <CardTitle className="text-2xl">{t("whatsapp")}</CardTitle>
                <Badge variant="outline" className="mt-1 border-[#25D366] text-[#25D366]">
                  {t("fastestResponse")}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t("whatsappDesc")}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Phone className="w-5 h-5 text-[#25D366]" />
                <span dir="ltr">+972 59-976-5211</span>
              </div>
              <Button 
                asChild
                className="w-full bg-[#25D366] hover:bg-[#20BA55] text-white text-lg py-6"
              >
                <Link 
                  href={`https://wa.me/972599765211?text=${encodeURIComponent(t("whatsappMessage"))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5 ml-2" />
                  {t("messageOnWhatsapp")}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instagram */}
        <Card className="border-2 border-[#E1306C]/30 hover:border-[#E1306C] transition-all hover:-translate-y-1 bg-gradient-to-br from-[#E1306C]/5 to-background">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-[#F58529] via-[#E1306C] to-[#C13584]/10 rounded-lg">
                <Instagram className="w-8 h-8 text-[#E1306C]" />
              </div>
              <div>
                <CardTitle className="text-2xl">{t("instagram")}</CardTitle>
                <Badge variant="outline" className="mt-1 border-[#E1306C] text-[#E1306C]">
                  {t("latestUpdates")}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t("instagramDesc")}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Instagram className="w-5 h-5 text-[#E1306C]" />
                <span>@studo.ps</span>
              </div>
              <Button 
                asChild
                className="w-full bg-gradient-to-r from-[#F58529] via-[#E1306C] to-[#C13584] hover:opacity-90 text-white text-lg py-6"
              >
                <Link 
                  href="https://instagram.com/studo.ps"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="w-5 h-5 ml-2" />
                  {t("followInstagram")}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Contact */}
      <Card className="mb-12 border-2 border-[#4A9B8E]/30">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="p-4 bg-[#4A9B8E]/10 rounded-lg">
              <Mail className="w-12 h-12 text-[#4A9B8E]" />
            </div>
            <div className="flex-1 text-center md:text-right">
              <h3 className="text-2xl font-bold mb-2">{t("emailUs")}</h3>
              <p className="text-muted-foreground mb-3">
                {t("emailDesc")}
              </p>
              <Button 
                asChild
                variant="outline"
                className="border-[#4A9B8E] text-[#4A9B8E] hover:bg-[#4A9B8E] hover:text-white"
              >
                <Link href="mailto:jibreelebornat@gmail.com">
                  <Mail className="w-4 h-4 ml-2" />
                  jibreelebornat@gmail.com
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location & Hours */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Free Delivery/Pickup */}
        <Card className="border-2 border-[#4A9B8E]/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#4A9B8E]/10 rounded-lg">
                <MapPin className="w-6 h-6 text-[#4A9B8E]" />
              </div>
              <CardTitle>{t("deliveryAndPickup")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500">
                  {t("freeDelivery")}
                </Badge>
              </h4>
              <p className="text-muted-foreground">📍 {t("birzeitCampus")}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t("campusDeliveryDesc")}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500">
                  {t("freePickup")}
                </Badge>
              </h4>
              <p className="text-muted-foreground">📍 {t("bileinVillage")}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t("pickupDesc")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card className="border-2 border-[#25D366]/30 bg-gradient-to-br from-[#25D366]/5 to-background">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#25D366]/10 rounded-lg">
                <Clock className="w-6 h-6 text-[#25D366]" />
              </div>
              <CardTitle>{t("alwaysHere")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center py-6 bg-card rounded-lg border-2 border-[#25D366]">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#25D366] mb-2">24/7</div>
                <p className="text-sm text-muted-foreground">{t("availableEveryDay")}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MessageCircle className="w-5 h-5 text-[#25D366] mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">{t("whatsapp")}:</strong> {t("whatsappAvailability")}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Instagram className="w-5 h-5 text-[#E1306C] mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">{t("instagram")}:</strong> {t("instagramAvailability")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Tips */}
      <Card className="bg-gradient-to-br from-[#4A9B8E]/5 to-[#6B7280]/5 border-2 border-[#4A9B8E]/20">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">{t("quickTips")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
              <span className="text-2xl">🛒</span>
              <div>
                <h4 className="font-semibold mb-1">{t("wantToOrder")}</h4>
                <p className="text-sm text-muted-foreground">
                  {t("wantToOrderDesc")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
              <span className="text-2xl">❓</span>
              <div>
                <h4 className="font-semibold mb-1">{t("haveQuestions")}</h4>
                <p className="text-sm text-muted-foreground">
                  {t("haveQuestionsDesc")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
              <span className="text-2xl">📦</span>
              <div>
                <h4 className="font-semibold mb-1">{t("trackOrder")}</h4>
                <p className="text-sm text-muted-foreground">
                  {t("trackOrderDesc1")} <Link href="/track-order" className="text-[#4A9B8E] hover:underline">{t("trackOrderPage")}</Link> {t("trackOrderDesc2")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
              <span className="text-2xl">🎁</span>
              <div>
                <h4 className="font-semibold mb-1">{t("customOrders")}</h4>
                <p className="text-sm text-muted-foreground">
                  {t("customOrdersDesc")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
