"use client"

import { useLanguage } from "@/lib/contexts/language-context"
import { Tv, Clapperboard, Globe, Zap, Smartphone, HeadphonesIcon, Clock, DollarSign } from "lucide-react"

export function IptvDescription() {
  const { language } = useLanguage()

  if (language === "ar") {
    return (
      <div className="bg-gradient-to-br from-[#4A9B8E]/10 via-white to-[#4A9B8E]/5 rounded-2xl p-6 md:p-8 mb-8 border border-[#4A9B8E]/20 shadow-lg">
        <div className="max-w-4xl">
          {/* Main Description */}
          <div className="mb-6">
            <p className="text-lg leading-relaxed text-gray-700 mb-4">
              <span className="font-bold text-[#4A9B8E]">IPTV</span> هو خدمة بث تلفزيوني متطورة تتيح لك مشاهدة آلاف القنوات والأفلام والمسلسلات من جميع أنحاء العالم بجودة عالية الدقة.
            </p>
            <p className="text-lg leading-relaxed text-gray-700 mb-4">
              نحن نوفر لك تجربة ترفيهية شاملة تشمل <span className="font-bold text-[#4A9B8E]">أكثر من 7,000 قناة تلفزيونية</span> متنوعة، بالإضافة إلى مكتبة ضخمة تحتوي على <span className="font-bold text-[#4A9B8E]">أكثر من 7,000 مسلسل</span> و <span className="font-bold text-[#4A9B8E]">18,000 فيلم</span> من مختلف الأنواع والبلدان.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              سواء كنت تبحث عن القنوات الرياضية المباشرة، أو الأفلام الحديثة، أو المسلسلات الشهيرة، أو حتى البرامج الوثائقية والترفيهية، ستجد كل ما تحتاجه في مكان واحد.
            </p>
          </div>

          {/* Features Grid */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6 text-[#4A9B8E]">مميزات الخدمة:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-white/80 p-4 rounded-xl border border-[#4A9B8E]/10 hover:border-[#4A9B8E]/30 transition-all">
                <div className="bg-[#4A9B8E]/10 p-2 rounded-lg shrink-0">
                  <Tv className="w-5 h-5 text-[#4A9B8E]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">جودة بث عالية الدقة</h4>
                  <p className="text-sm text-gray-600">(HD & 4K)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/80 p-4 rounded-xl border border-[#4A9B8E]/10 hover:border-[#4A9B8E]/30 transition-all">
                <div className="bg-[#4A9B8E]/10 p-2 rounded-lg shrink-0">
                  <Smartphone className="w-5 h-5 text-[#4A9B8E]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">متوافق مع جميع الأجهزة</h4>
                  <p className="text-sm text-gray-600">هاتف، تابلت، تلفزيون ذكي، كمبيوتر</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/80 p-4 rounded-xl border border-[#4A9B8E]/10 hover:border-[#4A9B8E]/30 transition-all">
                <div className="bg-[#4A9B8E]/10 p-2 rounded-lg shrink-0">
                  <HeadphonesIcon className="w-5 h-5 text-[#4A9B8E]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">دعم فني متاح</h4>
                  <p className="text-sm text-gray-600">24/7</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/80 p-4 rounded-xl border border-[#4A9B8E]/10 hover:border-[#4A9B8E]/30 transition-all">
                <div className="bg-[#4A9B8E]/10 p-2 rounded-lg shrink-0">
                  <Zap className="w-5 h-5 text-[#4A9B8E]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">تحديثات مستمرة</h4>
                  <p className="text-sm text-gray-600">للمحتوى والخدمة</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/80 p-4 rounded-xl border border-[#4A9B8E]/10 hover:border-[#4A9B8E]/30 transition-all">
                <div className="bg-[#4A9B8E]/10 p-2 rounded-lg shrink-0">
                  <Globe className="w-5 h-5 text-[#4A9B8E]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">واجهة سهلة الاستخدام</h4>
                  <p className="text-sm text-gray-600">تصفح وبحث بسيط</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/80 p-4 rounded-xl border border-[#4A9B8E]/10 hover:border-[#4A9B8E]/30 transition-all">
                <div className="bg-[#4A9B8E]/10 p-2 rounded-lg shrink-0">
                  <DollarSign className="w-5 h-5 text-[#4A9B8E]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">أسعار تنافسية</h4>
                  <p className="text-sm text-gray-600">مع خطط مرنة</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-[#4A9B8E]/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#4A9B8E] mb-1">7,000+</div>
              <div className="text-sm text-gray-600">قناة تلفزيونية</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#4A9B8E] mb-1">7,000+</div>
              <div className="text-sm text-gray-600">مسلسل</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#4A9B8E] mb-1">18,000+</div>
              <div className="text-sm text-gray-600">فيلم</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // English version
  return (
    <div className="bg-gradient-to-br from-[#4A9B8E]/10 via-white to-[#4A9B8E]/5 rounded-2xl p-6 md:p-8 mb-8 border border-[#4A9B8E]/20 shadow-lg">
      <div className="max-w-4xl">
        {/* Main Description */}
        <div className="mb-6">
          <p className="text-lg leading-relaxed text-gray-700 mb-4">
            <span className="font-bold text-[#4A9B8E]">IPTV</span> is an advanced television streaming service that allows you to watch thousands of channels, movies, and series from around the world in high definition quality.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 mb-4">
            We provide you with a comprehensive entertainment experience that includes <span className="font-bold text-[#4A9B8E]">more than 7,000 diverse TV channels</span>, in addition to a huge library containing <span className="font-bold text-[#4A9B8E]">more than 7,000 series</span> and <span className="font-bold text-[#4A9B8E]">18,000 movies</span> from various genres and countries.
          </p>
          <p className="text-lg leading-relaxed text-gray-700">
            Whether you're looking for live sports channels, recent movies, popular series, or even documentary and entertainment programs, you'll find everything you need in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-6 text-[#4A9B8E]">Service Features:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-white/80 p-4 rounded-xl border border-[#4A9B8E]/10 hover:border-[#4A9B8E]/30 transition-all">
              <div className="bg-[#4A9B8E]/10 p-2 rounded-lg shrink-0">
                <Tv className="w-5 h-5 text-[#4A9B8E]" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">High-Definition Streaming</h4>
                <p className="text-sm text-gray-600">(HD & 4K)</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/80 p-4 rounded-xl border border-[#4A9B8E]/10 hover:border-[#4A9B8E]/30 transition-all">
              <div className="bg-[#4A9B8E]/10 p-2 rounded-lg shrink-0">
                <Smartphone className="w-5 h-5 text-[#4A9B8E]" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Compatible with All Devices</h4>
                <p className="text-sm text-gray-600">Phone, Tablet, Smart TV, Computer</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/80 p-4 rounded-xl border border-[#4A9B8E]/10 hover:border-[#4A9B8E]/30 transition-all">
              <div className="bg-[#4A9B8E]/10 p-2 rounded-lg shrink-0">
                <HeadphonesIcon className="w-5 h-5 text-[#4A9B8E]" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Technical Support Available</h4>
                <p className="text-sm text-gray-600">24/7</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/80 p-4 rounded-xl border border-[#4A9B8E]/10 hover:border-[#4A9B8E]/30 transition-all">
              <div className="bg-[#4A9B8E]/10 p-2 rounded-lg shrink-0">
                <Zap className="w-5 h-5 text-[#4A9B8E]" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Continuous Updates</h4>
                <p className="text-sm text-gray-600">For content and service</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/80 p-4 rounded-xl border border-[#4A9B8E]/10 hover:border-[#4A9B8E]/30 transition-all">
              <div className="bg-[#4A9B8E]/10 p-2 rounded-lg shrink-0">
                <Globe className="w-5 h-5 text-[#4A9B8E]" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Easy-to-Use Interface</h4>
                <p className="text-sm text-gray-600">Simple browsing and search</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/80 p-4 rounded-xl border border-[#4A9B8E]/10 hover:border-[#4A9B8E]/30 transition-all">
              <div className="bg-[#4A9B8E]/10 p-2 rounded-lg shrink-0">
                <DollarSign className="w-5 h-5 text-[#4A9B8E]" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Competitive Pricing</h4>
                <p className="text-sm text-gray-600">With flexible plans</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-[#4A9B8E]/20">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#4A9B8E] mb-1">7,000+</div>
            <div className="text-sm text-gray-600">TV Channels</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#4A9B8E] mb-1">7,000+</div>
            <div className="text-sm text-gray-600">Series</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#4A9B8E] mb-1">18,000+</div>
            <div className="text-sm text-gray-600">Movies</div>
          </div>
        </div>
      </div>
    </div>
  )
}
