"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "ar" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage && (savedLanguage === "ar" || savedLanguage === "en")) {
      setLanguageState(savedLanguage)
      document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr"
      document.documentElement.lang = savedLanguage
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }

  const t = (key: string) => {
    return translations[language]?.[key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Navigation
    home: "الرئيسية",
    shop: "المتجر",
    categories: "التصنيفات",
    products: "المنتجات",
    cart: "السلة",
    wishlist: "المفضلة",
    account: "حسابي",
    login: "تسجيل دخول",
    signup: "تسجيل",
    logout: "تسجيل الخروج",
    
    // Hero Section
    specialOfferBadge: "من طالب لطالب",
    heroMainTitle1: "إكسسوارات أصلية",
    heroMainTitle2: "بأسعار الطلاب",
    heroMainTitle3: "خصومات تصل لـ 15%",
    heroDescription1: "اكسب خصومات مع كل عملية شراء!",
    heroDescription2: "توصيل مجاني دائماً للحرم الجامعي.",
    heroDescription3: "منتجات أصلية 100%",
    heroDescription4: "مع ضمان سنة كاملة",
    startShopping: "ابدأ التسوق",
    learnMoreDiscount: "اعرف المزيد عن الخصم",
    
    // Hero Discount Dialog
    discountDialogTitle: "نظام مكافآت الولاء - اكسب خصومات على طلبك القادم",
    discountDialogDescription: "اشترِ اليوم واحصل على كود خصم فوري لطلبك القادم! كلما زادت مشترياتك، زادت خصوماتك!",
    
    // Hero Features
    freeShippingTitle: "شحن مجاني",
    freeShippingDesc: "على الطلبات فوق ₪250",
    freePickupTitle: "استلام مجاني",
    freePickupDesc: "من متاجرنا المحلية",
    oneYearWarrantyTitle: "ضمان سنة",
    oneYearWarrantyDesc: "على جميع المنتجات",
    loyaltyRewardsTitle: "مكافآت الولاء",
    loyaltyRewardsDesc: "اكسب خصومات مع كل عملية شراء",
    
    // Hero Product Slots
    iPadPensSlot: "أقلام iPad",
    iPadPensDesc: "أقلام عالية الدقة",
    airpodsSlot: "سماعات AirPods",
    airpodsDesc: "جودة صوت مميزة",
    chargersSlot: "شواحن سريعة",
    chargersDesc: "شحن فائق السرعة",
    printedSlot: "منتجات مطبوعة",
    printedDesc: "تصاميم مخصصة",
    
    // Cart & Checkout
    checkout: "الدفع",
    total: "المجموع",
    subtotal: "المجموع الفرعي",
    shipping: "الشحن",
    tax: "الضريبة",
    free: "مجاني",
    myAccount: "حسابي",
    myWishlist: "قائمة المفضلة",
    shoppingCart: "سلة التسوق",
    cartEmpty: "سلة التسوق فارغة",
    orderSummary: "ملخص الطلب",
    proceedToCheckout: "متابعة إلى الدفع",
    continueShopping: "تابع التسوق",
    
    // Notifications
    addedToCart: "تمت الإضافة للسلة",
    addedToWishlist: "تمت الإضافة للمفضلة",
    removedFromCart: "تمت الإزالة من السلة",
    removedFromWishlist: "تمت الإزالة من المفضلة",
    itemAddedToCart: "تمت إضافة {quantity} {name} لسلة التسوق",
    itemRemovedFromCart: "تمت إزالة {name} من سلة التسوق",
    itemAddedToWishlist: "تمت إضافة {name} لقائمة المفضلة",
    itemRemovedFromWishlist: "تمت إزالة {name} من قائمة المفضلة",
    addedToCartDesc: "تمت إضافة {name} إلى سلة التسوق",
    removedFromWishlistDesc: "تمت إزالة {name} من قائمة المفضلة",
    addedToWishlistDesc: "تمت إضافة {name} إلى قائمة المفضلة",
    addToCart: "أضف للسلة",
    featured: "مميز",
    
    // Product
    inStock: "متوفر",
    outOfStock: "نفذ من المخزون",
    available: "قطعة متاحة",
    save: "وفر",
    description: "الوصف",
    youMayAlsoLike: "قد يعجبك أيضا",
    
    // Categories
    allCategories: "جميع التصنيفات",
    browseByCategory: "تصفح حسب التصنيف",
    
    // Shop
    shopAllProducts: "تسوق جميع المنتجات",
    browseProducts: "تصفح مجموعتنا الكاملة من إكسسوارات التكنولوجيا",
    showingResults: "عرض {count} منتج",
    noProductsFound: "لم يتم العثور على منتجات",
    sortBy: "ترتيب حسب",
    sortNewest: "الأحدث أولا",
    sortPriceLowHigh: "السعر: من الأقل للأعلى",
    sortPriceHighLow: "السعر: من الأعلى للأقل",
    sortNameAZ: "الاسم: من أ إلى ي",
    filters: "الفلاتر",
    priceRange: "نطاق السعر",
    applyFilters: "تطبيق فلتر السعر",
    clearFilters: "مسح جميع الفلاتر",
    loading: "جار التحميل...",
    tryAgain: "جرب تعديل الفلاتر أو مصطلحات البحث",
    
    // Auth
    welcomeBack: "مرحبا بعودتك",
    createAccount: "إنشاء حساب",
    signInToContinue: "سجل دخول لحسابك للمتابعة",
    signUpToGetStarted: "سجل للبدء بالتسوق",
    signUpNow: "سجل الآن",
    signInNow: "سجل دخول",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    dontHaveAccount: "ليس لديك حساب؟",
    
    // Product Features
    fastDelivery: "توصيل سريع",
    freeShippingOver: "توصيل مجاني على الطلبات فوق ₪250",
    qualityGuarantee: "ضمان الجودة",
    returnPolicy: "سياسة استرجاع لمدة 30 يوما على جميع المنتجات",
    securePackaging: "تغليف آمن",
    carefullyPacked: "جميع المنتجات مغلفة بعناية للتوصيل الآمن",
    
    // Stock & Inventory
    stockAvailable: "{count} متوفر في المخزون",
    lowStock: "مخزون منخفض - متبقي {count} فقط!",
    outOfStockLabel: "نفذ من المخزون",
    backInSoon: "سيعود قريباً",
    notifyWhenAvailable: "أخبرني عند التوفر",
    stockLimitReached: "الحد الأقصى المتاح: {max}",
    cannotExceedStock: "لا يمكن طلب أكثر من {max} قطعة",
    insufficientStock: "مخزون غير كافٍ",
    onlyXLeft: "متبقي {count} فقط!",
    quantityExceedsStock: "الكمية المطلوبة تتجاوز المخزون المتاح",
    selectQuantity: "اختر الكمية",
    
    // Admin Inventory
    inventory: "المخزون",
    manageInventory: "إدارة المخزون",
    stockStatus: "حالة المخزون",
    allProducts: "جميع المنتجات",
    inStockProducts: "منتجات متوفرة",
    lowStockProducts: "مخزون منخفض (أقل من 10)",
    outOfStockProducts: "منتجات نفذت",
    refillStock: "إعادة التعبئة",
    updateStock: "تحديث المخزون",
    currentStock: "المخزون الحالي",
    newStockQuantity: "الكمية الجديدة",
    stockUpdated: "تم تحديث المخزون بنجاح",
    stockUpdateFailed: "فشل تحديث المخزون",
    stockCount: "عدد القطع",
    
    // Home Page Sections
    shopByCategory: "تسوق حسب التصنيف",
    featuredProducts: "المنتجات المميزة",
    handPickedItems: "منتجات منتقاة بعناية لك",
    newArrivals: "وصل حديثا",
    latestProducts: "أحدث المنتجات في متجرنا",
    viewAll: "عرض الكل",
    
    // Footer
    about: "من نحن",
    contact: "اتصل بنا",
    contactUs: "تواصل معنا",
    privacyPolicy: "سياسة الخصوصية",
    termsOfService: "شروط الخدمة",
    followUs: "تابعنا",
    quickLinks: "روابط سريعة",
    
    // Category Names (Database categories translated)
    "ipad-accessories": "إكسسوارات iPad",
    "airpods": "سماعات رأس",
    "phone-accessories": "إكسسوارات الهاتف",
    "computer-accessories": "إكسسوارات الكمبيوتر",
    "chargers": "شواحن",
    "hard-disks": "أقراص صلبة",
    "printed-stuff": "منتجات مطبوعة",
    "gift-packages": "باقات هدايا",
    "bags": "قريباً",
    
    // Home Features
    qualityGuaranteedTitle: "ضمان الجودة",
    qualityGuaranteedDesc: "جميع المنتجات منتقاة ومختبرة بعناية",
    bestPricesTitle: "أفضل الأسعار",
    bestPricesDesc: "أسعار تنافسية على جميع المنتجات",
    fastDeliveryTitle: "توصيل سريع",
    fastDeliveryDeliveryDesc: "توصيل سريع وموثوق في جميع أنحاء فلسطين",
    
    // Contact Page
    contactUsLabel: "تواصل معنا",
    letsConnect: "لنتواصل",
    together: "معاً",
    contactHeroDesc: "هل لديك أسئلة؟ تحتاج مساعدة؟ تريد تقديم طلب؟ أنا هنا لمساعدتك!",
    whatsapp: "واتساب",
    fastestResponse: "أسرع استجابة",
    whatsappDesc: "أسرع طريقة للوصول إلي! أرد على رسائل الواتساب خلال دقائق.",
    whatsappMessage: "مرحباً جبريل! أنا مهتم بمنتجاتك",
    messageOnWhatsapp: "راسلني على الواتساب",
    instagram: "إنستغرام",
    latestUpdates: "آخر التحديثات",
    instagramDesc: "تابعنا للحصول على تحديثات المنتجات، عروض خاصة، ومحتوى من وراء الكواليس!",
    followInstagram: "تابع @studo.ps",
    emailUs: "راسلنا عبر البريد الإلكتروني",
    emailDesc: "للاستفسارات التفصيلية، مشاكل الطلبات، أو الشراكات التجارية",
    deliveryAndPickup: "التوصيل والاستلام المجاني",
    freeDelivery: "توصيل مجاني",
    birzeitCampus: "حرم جامعة بيرزيت",
    campusDeliveryDesc: "الطلبات تُوصل مباشرة للحرم الجامعي (الحد الأدنى ₪50)",
    freePickup: "استلام مجاني",
    bileinVillage: "قرية بلعين",
    pickupDesc: "الاستلام متاح بموعد (راسل على الواتساب للحجز)",
    alwaysHere: "نحن دائماً هنا!",
    availableEveryDay: "متاحون كل يوم",
    whatsappAvailability: "راسل في أي وقت! أرد بأسرع وقت ممكن، عادةً خلال دقائق.",
    instagramAvailability: "راسل أو علق في أي وقت. أتفقد الرسائل بانتظام طوال اليوم.",
    quickTips: "نصائح تواصل سريعة",
    wantToOrder: "تريد الطلب؟",
    wantToOrderDesc: "أرسل لي رسالة واتساب مع اسم المنتج أو شارك لقطة شاشة",
    haveQuestions: "لديك أسئلة؟",
    haveQuestionsDesc: "الواتساب هو الأسرع! عادةً أرد خلال 5-10 دقائق",
    trackOrder: "تتبع طلبك",
    trackOrderDesc1: "استخدم",
    trackOrderPage: "صفحة تتبع الطلب",
    trackOrderDesc2: "أو راسلني",
    customOrders: "طلبات مخصصة",
    customOrdersDesc: "تحتاج مواد مطبوعة أو منتجات خاصة؟ لنتحدث على الواتساب!",
    
    // Search
    searchPlaceholder: "ابحث عن منتجات...",
    noSearchResults: "لا توجد نتائج",
    tryDifferentKeywords: "جرب كلمات مفتاحية مختلفة",
    viewAllResults: "عرض جميع النتائج",
    
    // Reviews & Ratings
    reviews: "التقييمات",
    writeReview: "اكتب تقييم",
    customerReviews: "آراء العملاء",
    rating: "التقييم",
    yourName: "اسمك",
    yourReview: "تقييمك",
    submitReview: "إرسال التقييم",
    reviewSubmitted: "تم إرسال التقييم",
    reviewPending: "تقييمك قيد المراجعة من قبل المسؤول",
    noReviews: "لا توجد تقييمات بعد",
    beTheFirst: "كن أول من يقيم هذا المنتج",
    stars: "نجوم",
    starRating: "{count} نجوم",
    basedOnReviews: "بناءً على {count} تقييم",
    helpful: "مفيد",
    verifiedPurchase: "عملية شراء موثقة",
    
    // Testimonials (Footer Reviews)
    whatCustomersSay: "ماذا يقول عملاؤنا",
    realExperiences: "تجارب حقيقية من عملائنا الكرام",
    shareExperience: "شارك تجربتك معنا",
    reviewDescription: "نحن نقدر رأيك ونسعى دائماً لتحسين خدماتنا",
    enterName: "أدخل اسمك",
    shareThoughts: "شاركنا رأيك وتجربتك معنا...",
    submitting: "جاري الإرسال...",
    fillAllFields: "يرجى ملء جميع الحقول",
    
    // Wishlist Enhanced
    moveToCart: "انقل للسلة",
    shareWishlist: "شارك قائمة الرغبات",
    wishlistShared: "تم نسخ رابط المشاركة",
    compareProducts: "قارن المنتجات",
    itemNoLongerAvailable: "{name} لم يعد متوفراً",
    wishlistUpdates: "تحديثات قائمة الرغبات",
    
    // Social Proof
    viewing: "{count} يشاهدون الآن",
    soldToday: "بيع {count} اليوم",
    trending: "رائج",
    bestSeller: "الأكثر مبيعاً",
    hotItem: "منتج مطلوب",
    views: "مشاهدة",
    
    // Breadcrumbs
    breadcrumbHome: "الرئيسية",
    
    // Filters Enhanced
    bestSellers: "الأكثر مبيعاً",
    trendingNow: "الرائج الآن",
    multipleCategories: "تصنيفات متعددة",
    selectCategories: "اختر التصنيفات",
    specialOffers: "عروض خاصة",
    selected: "محدد",
    clearSelection: "مسح التحديد",
    
    // Toast Actions
    viewCart: "عرض السلة",
    viewWishlist: "عرض المفضلة",
    undo: "تراجع",
    
    // Admin Reviews
    pendingReviews: "تقييمات قيد الانتظار",
    approvedReviews: "تقييمات معتمدة",
    approveReview: "اعتماد",
    rejectReview: "رفض",
    reviewApproved: "تم اعتماد التقييم",
    reviewRejected: "تم رفض التقييم",
    manageCustomerReviews: "إدارة تقييمات وتعليقات العملاء",
    
    // Suggested Products
    suggestedProducts: "منتجات مقترحة",
    relatedProducts: "منتجات ذات صلة",
    similarItems: "منتجات مشابهة من نفس الفئة",
    complementaryItems: "منتجات تكميلية قد تحتاجها",
    basedOnThisProduct: "بناءً على هذا المنتج",
  },
  en: {
    // Navigation
    home: "Home",
    shop: "Shop",
    categories: "Categories",
    products: "Products",
    cart: "Cart",
    wishlist: "Wishlist",
    account: "Account",
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
    
    // Hero Section
    specialOfferBadge: "From Student For Student",
    heroMainTitle1: "Original Accessories",
    heroMainTitle2: "Student Prices",
    heroMainTitle3: "Discounts Up To 15%",
    heroDescription1: "Earn discounts with every purchase!",
    heroDescription2: "Free campus delivery always.",
    heroDescription3: "100% Original Products",
    heroDescription4: "With 1 Year Warranty",
    startShopping: "Start Shopping",
    learnMoreDiscount: "Learn More About Discount",
    
    // Hero Discount Dialog
    discountDialogTitle: "Loyalty Rewards System - Earn Discounts on Your Next Order",
    discountDialogDescription: "Shop today and get an instant discount code for your next order! The more you buy, the more you save!",
    
    // Hero Features
    freeShippingTitle: "Free Shipping",
    freeShippingDesc: "On orders over ₪250",
    freePickupTitle: "Free Pickup",
    freePickupDesc: "From our local stores",
    oneYearWarrantyTitle: "1 Year Warranty",
    oneYearWarrantyDesc: "On all products",
    loyaltyRewardsTitle: "Loyalty Rewards",
    loyaltyRewardsDesc: "Earn discounts with every purchase",
    
    // Hero Product Slots
    iPadPensSlot: "iPad Pens",
    iPadPensDesc: "High-precision pens",
    airpodsSlot: "AirPods",
    airpodsDesc: "Premium sound quality",
    chargersSlot: "Fast Chargers",
    chargersDesc: "Ultra-fast charging",
    printedSlot: "Printed Products",
    printedDesc: "Custom designs",
    
    // Cart & Checkout
    checkout: "Checkout",
    total: "Total",
    subtotal: "Subtotal",
    shipping: "Shipping",
    tax: "Tax",
    free: "Free",
    myAccount: "My Account",
    myWishlist: "My Wishlist",
    shoppingCart: "Shopping Cart",
    cartEmpty: "Cart is Empty",
    orderSummary: "Order Summary",
    proceedToCheckout: "Proceed to Checkout",
    continueShopping: "Continue Shopping",
    
    // Notifications
    addedToCart: "Added to Cart",
    addedToWishlist: "Added to Wishlist",
    removedFromCart: "Removed from Cart",
    removedFromWishlist: "Removed from Wishlist",
    itemAddedToCart: "{quantity} {name} has been added to your cart",
    itemRemovedFromCart: "{name} has been removed from your cart",
    itemAddedToWishlist: "{name} has been added to your wishlist",
    itemRemovedFromWishlist: "{name} has been removed from your wishlist",
    addedToCartDesc: "{name} has been added to your cart",
    removedFromWishlistDesc: "{name} has been removed from your wishlist",
    addedToWishlistDesc: "{name} has been added to your wishlist",
    addToCart: "Add to Cart",
    featured: "Featured",
    
    // Product
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    available: "available",
    save: "Save",
    description: "Description",
    youMayAlsoLike: "You May Also Like",
    
    // Categories
    allCategories: "All Categories",
    browseByCategory: "Browse by Category",
    
    // Shop
    shopAllProducts: "Shop All Products",
    browseProducts: "Browse our complete collection of tech accessories",
    showingResults: "Showing {count} products",
    noProductsFound: "No products found",
    sortBy: "Sort By",
    sortNewest: "Newest",
    sortPriceLowHigh: "Price: Low to High",
    sortPriceHighLow: "Price: High to Low",
    sortNameAZ: "Name: A-Z",
    filters: "Filters",
    priceRange: "Price Range",
    applyFilters: "Apply Price Filter",
    clearFilters: "Clear All Filters",
    loading: "Loading...",
    tryAgain: "Try adjusting filters or search terms",
    
    // Auth
    welcomeBack: "Welcome Back",
    createAccount: "Create Account",
    signInToContinue: "Sign in to your account to continue",
    signUpToGetStarted: "Sign up to get started shopping",
    signUpNow: "Sign up now",
    signInNow: "Sign in",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    
    // Product Features
    fastDelivery: "Fast Delivery",
    freeShippingOver: "Free shipping on orders over ₪250",
    qualityGuarantee: "Quality Guarantee",
    returnPolicy: "30-day return policy on all products",
    securePackaging: "Secure Packaging",
    carefullyPacked: "All products are carefully packed for safe delivery",
    
    // Stock & Inventory
    stockAvailable: "{count} in stock",
    lowStock: "Low stock - only {count} left!",
    outOfStockLabel: "Out of Stock",
    backInSoon: "Back in soon",
    notifyWhenAvailable: "Notify when available",
    stockLimitReached: "Maximum available: {max}",
    cannotExceedStock: "Cannot order more than {max} items",
    insufficientStock: "Insufficient stock",
    onlyXLeft: "Only {count} left!",
    quantityExceedsStock: "Requested quantity exceeds available stock",
    selectQuantity: "Select Quantity",
    
    // Admin Inventory
    inventory: "Inventory",
    manageInventory: "Manage Inventory",
    stockStatus: "Stock Status",
    allProducts: "All Products",
    inStockProducts: "In Stock",
    lowStockProducts: "Low Stock (Less than 10)",
    outOfStockProducts: "Out of Stock",
    refillStock: "Refill Stock",
    updateStock: "Update Stock",
    currentStock: "Current Stock",
    newStockQuantity: "New Stock Quantity",
    stockUpdated: "Stock updated successfully",
    stockUpdateFailed: "Failed to update stock",
    stockCount: "Stock Count",
    
    // Home Page Sections
    shopByCategory: "Shop by Category",
    featuredProducts: "Featured Products",
    handPickedItems: "Hand-picked items just for you",
    newArrivals: "New Arrivals",
    latestProducts: "Latest products in our store",
    viewAll: "View All",
    
    // Footer
    about: "About Us",
    contact: "Contact",
    contactUs: "Contact Us",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    followUs: "Follow Us",
    quickLinks: "Quick Links",
    
    // Category Names (Database categories translated)
    "ipad-accessories": "iPad Accessories",
    "airpods": "Headphones",
    "phone-accessories": "Phone Accessories",
    "computer-accessories": "Computer Accessories",
    "chargers": "Chargers",
    "hard-disks": "Hard Disks",
    "printed-stuff": "Printed Products",
    "gift-packages": "Gift Packages",
    "bags": "Coming Soon",
    
    // Home Features
    qualityGuaranteedTitle: "Quality Guaranteed",
    qualityGuaranteedDesc: "All products are carefully selected and tested",
    bestPricesTitle: "Best Prices",
    bestPricesDesc: "Competitive pricing on all products",
    fastDeliveryTitle: "Fast Delivery",
    fastDeliveryDeliveryDesc: "Quick and reliable shipping across Palestine",
    
    // Contact Page
    contactUsLabel: "Contact Us",
    letsConnect: "Let's Connect",
    together: "Together",
    contactHeroDesc: "Have questions? Need help? Want to place an order? I'm here to help!",
    whatsapp: "WhatsApp",
    fastestResponse: "Fastest Response",
    whatsappDesc: "The fastest way to reach me! I respond to WhatsApp messages within minutes.",
    whatsappMessage: "Hi Jibreel! I'm interested in your products",
    messageOnWhatsapp: "Message me on WhatsApp",
    instagram: "Instagram",
    latestUpdates: "Latest Updates",
    instagramDesc: "Follow us for product updates, special offers, and behind-the-scenes content!",
    followInstagram: "Follow @studo.ps",
    emailUs: "Email Us",
    emailDesc: "For detailed inquiries, order issues, or business partnerships",
    deliveryAndPickup: "Free Delivery & Pickup",
    freeDelivery: "Free Delivery",
    birzeitCampus: "Birzeit University Campus",
    campusDeliveryDesc: "Orders delivered directly to campus (₪50 minimum)",
    freePickup: "Free Pickup",
    bileinVillage: "Bilein Village",
    pickupDesc: "Pickup available by appointment (message on WhatsApp to book)",
    alwaysHere: "We're Always Here!",
    availableEveryDay: "Available every day",
    whatsappAvailability: "Message anytime! I reply as soon as possible, usually within minutes.",
    instagramAvailability: "Message or comment anytime. I check messages regularly throughout the day.",
    quickTips: "Quick Contact Tips",
    wantToOrder: "Want to Order?",
    wantToOrderDesc: "Send me a WhatsApp message with product name or share a screenshot",
    haveQuestions: "Have Questions?",
    haveQuestionsDesc: "WhatsApp is fastest! I usually reply within 5-10 minutes",
    trackOrder: "Track Your Order",
    trackOrderDesc1: "Use the",
    trackOrderPage: "track order page",
    trackOrderDesc2: "or message me",
    customOrders: "Custom Orders",
    customOrdersDesc: "Need printed materials or special products? Let's talk on WhatsApp!",
    
    // Search
    searchPlaceholder: "Search for products...",
    noSearchResults: "No results found",
    tryDifferentKeywords: "Try different keywords",
    viewAllResults: "View All Results",
    
    // Reviews & Ratings
    reviews: "Reviews",
    writeReview: "Write a Review",
    customerReviews: "Customer Reviews",
    rating: "Rating",
    yourName: "Your Name",
    yourReview: "Your Review",
    submitReview: "Submit Review",
    reviewSubmitted: "Review Submitted",
    reviewPending: "Your review is pending admin approval",
    noReviews: "No reviews yet",
    beTheFirst: "Be the first to review this product",
    stars: "stars",
    starRating: "{count} stars",
    basedOnReviews: "Based on {count} reviews",
    helpful: "Helpful",
    verifiedPurchase: "Verified Purchase",
    
    // Testimonials (Footer Reviews)
    whatCustomersSay: "What Our Customers Say",
    realExperiences: "Real experiences from our valued customers",
    shareExperience: "Share Your Experience",
    reviewDescription: "We value your opinion and strive to improve our services",
    enterName: "Enter your name",
    shareThoughts: "Share your thoughts and experience with us...",
    submitting: "Submitting...",
    fillAllFields: "Please fill all fields",
    
    // Wishlist Enhanced
    moveToCart: "Move to Cart",
    shareWishlist: "Share Wishlist",
    wishlistShared: "Wishlist link copied",
    compareProducts: "Compare Products",
    itemNoLongerAvailable: "{name} is no longer available",
    wishlistUpdates: "Wishlist Updates",
    
    // Social Proof
    viewing: "{count} viewing now",
    soldToday: "Sold {count} today",
    trending: "Trending",
    bestSeller: "Best Seller",
    hotItem: "Hot Item",
    views: "views",
    
    // Breadcrumbs
    breadcrumbHome: "Home",
    
    // Filters Enhanced
    bestSellers: "Best Sellers",
    trendingNow: "Trending Now",
    multipleCategories: "Multiple Categories",
    selectCategories: "Select Categories",
    specialOffers: "Special Offers",
    selected: "selected",
    clearSelection: "Clear Selection",
    
    // Toast Actions
    viewCart: "View Cart",
    viewWishlist: "View Wishlist",
    undo: "Undo",
    
    // Admin Reviews
    pendingReviews: "Pending Reviews",
    approvedReviews: "Approved Reviews",
    approveReview: "Approve",
    rejectReview: "Reject",
    reviewApproved: "Review approved",
    reviewRejected: "Review rejected",
    manageCustomerReviews: "Manage customer reviews and ratings",
    
    // Suggested Products
    suggestedProducts: "Suggested Products",
    relatedProducts: "Related Products",
    similarItems: "Similar items from the same category",
    complementaryItems: "Complementary items you might need",
    basedOnThisProduct: "Based on this product",
  },
}
