import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Shield, Package, Sparkles, Heart, TrendingUp } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#4A9B8E] hover:bg-[#3D8B7E] text-white px-4 py-2">
              حول Studo.ps
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              من الطلاب،{" "}
              <span className="bg-gradient-to-r from-[#4A9B8E] to-[#6B7280] bg-clip-text text-transparent">
                للطلاب
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              مصدرك الموثوق لإكسسوارات التكنولوجيا الأصلية 100% والمواد المطبوعة
            </p>
          </div>

          {/* Founder Story */}
          <Card className="mb-12 overflow-hidden border-2 border-[#4A9B8E]/20">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-[#4A9B8E] shrink-0">
                  <Image
                    src="/placeholder-user.jpg"
                    alt="جبريل برناط"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">تعرف على جبريل برناط</h2>
                    <div className="flex items-center gap-2 text-[#4A9B8E] font-semibold mb-4">
                      <GraduationCap className="w-5 h-5" />
                      <span>طالب هندسة حاسوب</span>
                    </div>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    مرحباً! أنا جبريل، طالب هندسة حاسوب شغوف بمساعدة زملائي الطلاب في الحصول على منتجات 
                    تقنية عالية الجودة دون إفراغ محافظهم. بدأت Studo.ps لأنني أفهم صعوبة إيجاد إكسسوارات 
                    أصلية بأسعار معقولة.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    كل منتج تراه هنا <strong className="text-foreground">أصلي 100%</strong> ويأتي مع 
                    <strong className="text-foreground"> ضمان سنة كاملة</strong>. أنا أتحقق شخصياً من أصالة 
                    كل منتج لأن ثقتك تعني لي الكثير.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What We Offer */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">ما الذي يميزنا؟</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original Products */}
              <Card className="border-2 border-[#4A9B8E]/30 hover:border-[#4A9B8E] transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#4A9B8E]/10 rounded-lg">
                      <Shield className="w-8 h-8 text-[#4A9B8E]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">منتجات أصلية 100%</h3>
                      <p className="text-muted-foreground">
                        لا تقليد، لا غش. كل منتج أصلي ومُتحقق منه. تحصل على ما تدفع ثمنه - إكسسوارات 
                        أصلية عالية الجودة.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 1 Year Warranty */}
              <Card className="border-2 border-[#3D8B7E]/30 hover:border-[#3D8B7E] transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#3D8B7E]/10 rounded-lg">
                      <Sparkles className="w-8 h-8 text-[#3D8B7E]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">ضمان سنة كاملة</h3>
                      <p className="text-muted-foreground">
                        تسوق بثقة! جميع المنتجات تأتي مع ضمان كامل لمدة سنة. إذا حدث خطأ ما، نحن هنا 
                        لحمايتك.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Wide Range */}
              <Card className="border-2 border-[#6B7280]/30 hover:border-[#6B7280] transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#6B7280]/10 rounded-lg">
                      <Package className="w-8 h-8 text-[#6B7280]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">ليس فقط تكنولوجيا</h3>
                      <p className="text-muted-foreground">
                        إكسسوارات آيباد، ملحقات كمبيوتر، كفرات جوالات، شواحن، ومواد مطبوعة مخصصة. كل 
                        ما يحتاجه الطالب في مكان واحد!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Student-Friendly */}
              <Card className="border-2 border-[#4A9B8E]/30 hover:border-[#4A9B8E] transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#4A9B8E]/10 rounded-lg">
                      <Heart className="w-8 h-8 text-[#4A9B8E]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">أسعار مناسبة للطلاب</h3>
                      <p className="text-muted-foreground">
                        أفهم ميزانية الطلاب لأنني واحد منهم! لذلك أقدم أسعاراً تنافسية وخصومات ولاء 
                        تصل إلى 15%.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Our Products */}
          <Card className="mb-12 bg-gradient-to-br from-[#4A9B8E]/5 to-[#6B7280]/5 border-2 border-[#4A9B8E]/20">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-center mb-6">ما ستجده هنا</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "📱 إكسسوارات آيباد وأقلام Apple",
                  "🎧 إيربودز وسماعات رأس",
                  "💻 إكسسوارات الكمبيوتر",
                  "📱 كفرات جوالات وحماية شاشة",
                  "⚡ شواحن وكابلات (شحن سريع)",
                  "🖨️ مواد مطبوعة مخصصة",
                  "⌨️ لوحات مفاتيح وفأرات",
                  "🎒 حقائب تقنية ومنظمات",
                  "🔌 أدوات تقنية والمزيد"
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-3 bg-card rounded-lg border hover:border-[#4A9B8E] transition-all hover:-translate-y-0.5"
                  >
                    <span className="text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Why Trust Us */}
          <Card className="mb-12 border-2 border-[#4A9B8E]">
            <CardContent className="p-8 text-center">
              <TrendingUp className="w-16 h-16 text-[#4A9B8E] mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">لماذا يثق الطلاب بـ Studo.ps</h2>
              <div className="max-w-2xl mx-auto space-y-4 text-lg text-muted-foreground">
                <p>
                  <strong className="text-foreground">طالب لطالب:</strong> لست شركة كبيرة. أنا طالب 
                  مثلك، لذا أفهم احتياجاتك وميزانيتك.
                </p>
                <p>
                  <strong className="text-foreground">بدون وسطاء:</strong> التوريد المباشر يعني أسعار 
                  أفضل لك. أقطع التكاليف الإضافية وأمرر التوفير إليك.
                </p>
                <p>
                  <strong className="text-foreground">توصيل للحرم الجامعي:</strong> توصيل مجاني لجامعة 
                  بيرزيت واستلام مجاني من قرية بلعين. مريح للغاية!
                </p>
                <p>
                  <strong className="text-foreground">اكسب مكافآت:</strong> كلما تسوقت أكثر، كلما وفرت 
                  أكثر مع نظام الخصومات التراكمية (5-15% على طلبك التالي).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mission Statement */}
          <div className="text-center bg-gradient-to-r from-[#4A9B8E] to-[#3D8B7E] text-white rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">مهمتنا</h2>
            <p className="text-xl leading-relaxed max-w-2xl mx-auto">
              تقديم <strong>منتجات تقنية أصلية عالية الجودة</strong> للطلاب بأسعار لا تفرغ محافظهم. 
              كل منتج مباع هو وعد بالجودة، مدعوم بضمان وثقة.
            </p>
            <div className="mt-8 flex items-center justify-center gap-2 text-lg font-semibold">
              <Heart className="w-6 h-6" />
              <span>صُنع بواسطة الطلاب، للطلاب</span>
              <Heart className="w-6 h-6" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
