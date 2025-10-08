# Language Toggle Feature - Arabic/English

## Overview
The Studo.ps e-commerce website now supports **bilingual functionality** with a language toggle button that allows users to switch between Arabic (العربية) and English.

## Features

### 🌍 Language Toggle Button
- **Location**: Top navigation bar (header)
- **Icon**: Globe icon (🌐)
- **Options**: 
  - 🇵🇸 العربية (Arabic) - **DEFAULT**
  - 🇬🇧 English

### 🎯 Default Language
- **Arabic (ar)** is set as the default language
- The website loads in Arabic on first visit
- User preference is saved in browser localStorage

### 🔄 Dynamic Language Switching
- **Instant switching**: No page reload required
- **RTL/LTR toggle**: Automatically changes text direction
  - Arabic: Right-to-Left (RTL)
  - English: Left-to-Right (LTR)
- **Persistent preference**: Language choice saved across sessions

## Implementation Details

### Files Created

1. **`lib/contexts/language-context.tsx`**
   - Language context provider
   - Translation function `t(key)`
   - LocalStorage persistence
   - Automatic RTL/LTR switching
   - Comprehensive translation dictionary

2. **`components/layout/language-toggle.tsx`**
   - Language toggle dropdown component
   - Visual language selector with flags
   - Active language highlighting

### Files Modified

1. **`app/layout.tsx`**
   - Wrapped app with `LanguageProvider`
   - Added `suppressHydrationWarning` for dynamic lang/dir changes

2. **`components/layout/header.tsx`**
   - Added `LanguageToggle` component
   - Integrated `useLanguage()` hook
   - Converted hardcoded Arabic text to use `t()` function

## Translation Dictionary

The translation system includes comprehensive translations for:

### Navigation
- home, shop, categories, trackOrder, about, contact
- cart, wishlist, account, login, signup, logout

### Hero & Common
- heroTitle, heroSubtitle, heroDescription, shopNow
- search, addToCart, addToWishlist, viewDetails, learnMore
- continueShopping, checkout, total, subtotal, shipping, free
- featured, new, sale, outOfStock, inStock, price, quantity, remove

### Product Pages
- productDescription, relatedProducts, reviews, specifications

### Cart & Checkout
- shoppingCart, cartEmpty, orderSummary, proceedToCheckout
- placeOrder, contactInformation, deliveryMethod, paymentMethod
- deliveryAddress, orderNotes

### Account
- myAccount, orders, addresses, overview, recentOrders
- totalOrders, viewAll

### Authentication
- welcomeBack, createAccount, signIn, signUp
- email, password, confirmPassword, fullName
- forgotPassword, noAccount, haveAccount

### Footer
- quickLinks, customerService, contactUs, followUs
- allRightsReserved

### Messages
- addedToCart, addedToWishlist, removedFromCart, removedFromWishlist
- loading, error, success, processing, noResults, tryAgain

## Usage in Components

### Using the Translation Function

```tsx
import { useLanguage } from "@/lib/contexts/language-context"

export function MyComponent() {
  const { t, language, setLanguage } = useLanguage()

  return (
    <div>
      <h1>{t("heroTitle")}</h1>
      <button>{t("shopNow")}</button>
      <p>Current language: {language}</p>
    </div>
  )
}
```

### Adding New Translations

Edit `lib/contexts/language-context.tsx` and add to the translations object:

```typescript
const translations: Record<Language, Record<string, string>> = {
  ar: {
    // ... existing translations
    myNewKey: "النص العربي",
  },
  en: {
    // ... existing translations
    myNewKey: "English Text",
  },
}
```

## User Experience

### First Visit
1. Website loads in **Arabic (default)**
2. Text direction: RTL
3. Arabic font (Tajawal) displayed

### Switching to English
1. Click globe icon in header
2. Select "🇬🇧 English"
3. Instant switch to English
4. Text direction changes to LTR
5. Preference saved in localStorage

### Returning Visit
- Website remembers user's language preference
- Loads in previously selected language
- Maintains direction (RTL/LTR) preference

## Technical Benefits

✅ **No Page Reload**: Instant language switching using React context
✅ **Persistent State**: LocalStorage saves user preference
✅ **Automatic RTL/LTR**: Document direction updates dynamically
✅ **Centralized Translations**: Single source of truth for all text
✅ **Type-Safe**: TypeScript ensures translation keys exist
✅ **Scalable**: Easy to add new languages or translations
✅ **Performance**: Context API provides efficient re-renders

## Future Enhancements

Potential improvements for the language system:

1. **More Languages**: Add support for Hebrew, French, etc.
2. **URL-based Language**: `/ar/shop` vs `/en/shop`
3. **SEO Optimization**: Hreflang tags for multilingual SEO
4. **Translation Management**: Admin panel to manage translations
5. **Fallback System**: Auto-translate missing keys
6. **Pluralization**: Handle singular/plural forms
7. **Date/Number Formatting**: Locale-specific formatting
8. **Content Translation**: Translate product descriptions, categories

## Browser Compatibility

- ✅ Chrome/Edge (Modern)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS/Android)
- ⚠️ IE11 (requires polyfills)

## Notes

- **Default**: Arabic (ar) is the default language
- **Storage**: User preference stored in browser localStorage
- **Hydration**: `suppressHydrationWarning` prevents hydration mismatches
- **Direction**: HTML `dir` attribute updates automatically
- **Font**: Tajawal font optimized for Arabic display

---

**Created by**: جبريل برناط (Jibreel Bornat)
**Website**: Studo.ps - From Students, For Students
