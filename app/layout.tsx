import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Tajawal } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ReduxProvider } from "@/components/providers/redux-provider"
import { LanguageProvider } from "@/lib/contexts/language-context"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Studo.ps - إكسسوارات تقنية أصلية",
  description: "تسوق إكسسوارات آيباد، حقائب لابتوب، كفرات إيربودز، شواحن والمزيد - منتجات أصلية 100%",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${tajawal.variable} ${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        <Suspense fallback={null}>
          <LanguageProvider>
            <ReduxProvider>{children}</ReduxProvider>
          </LanguageProvider>
          <Analytics />
          <Toaster />
        </Suspense>
      </body>
    </html>
  )
}
