/**
 * Currency Utilities for Israeli Shekel (ILS)
 */

/**
 * Format a price value as Israeli Shekel
 * @param price - The price value to format
 * @param includeDecimals - Whether to include decimal places (default: true)
 * @returns Formatted price string with ₪ symbol
 * 
 * @example
 * formatPrice(49.99) // "₪49.99"
 * formatPrice(1500) // "₪1,500.00"
 * formatPrice(49.99, false) // "₪50"
 */
export function formatPrice(price: number | string, includeDecimals: boolean = true): string {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price

  if (isNaN(numericPrice)) {
    return "₪0.00"
  }

  if (includeDecimals) {
    return `₪${numericPrice.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  } else {
    return `₪${Math.round(numericPrice).toLocaleString("en-US")}`
  }
}

/**
 * Format a price value as Israeli Shekel with Hebrew formatting
 * @param price - The price value to format
 * @returns Formatted price string with ₪ symbol and Hebrew locale
 * 
 * @example
 * formatPriceHebrew(49.99) // "49.99 ₪"
 */
export function formatPriceHebrew(price: number | string): string {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price

  if (isNaN(numericPrice)) {
    return "0.00 ₪"
  }

  return `${numericPrice.toLocaleString("he-IL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ₪`
}

/**
 * Calculate discount percentage between two prices
 * @param originalPrice - The original/compare at price
 * @param discountedPrice - The discounted/sale price
 * @returns Percentage saved as a number (0-100)
 * 
 * @example
 * calculateDiscountPercentage(100, 75) // 25
 */
export function calculateDiscountPercentage(
  originalPrice: number | string,
  discountedPrice: number | string
): number {
  const original = typeof originalPrice === "string" ? parseFloat(originalPrice) : originalPrice
  const discounted = typeof discountedPrice === "string" ? parseFloat(discountedPrice) : discountedPrice

  if (isNaN(original) || isNaN(discounted) || original === 0) {
    return 0
  }

  const savings = original - discounted
  const percentage = (savings / original) * 100

  return Math.round(percentage)
}

/**
 * Format savings amount and percentage
 * @param originalPrice - The original/compare at price
 * @param discountedPrice - The discounted/sale price
 * @returns Formatted string like "Save ₪25.00 (25%)"
 * 
 * @example
 * formatSavings(100, 75) // "Save ₪25.00 (25%)"
 */
export function formatSavings(originalPrice: number | string, discountedPrice: number | string): string {
  const original = typeof originalPrice === "string" ? parseFloat(originalPrice) : originalPrice
  const discounted = typeof discountedPrice === "string" ? parseFloat(discountedPrice) : discountedPrice

  if (isNaN(original) || isNaN(discounted) || original <= discounted) {
    return ""
  }

  const savings = original - discounted
  const percentage = calculateDiscountPercentage(original, discounted)

  return `Save ${formatPrice(savings)} (${percentage}%)`
}

/**
 * Parse a price string to a number
 * @param priceString - The price string to parse (can include ₪, commas, etc.)
 * @returns Numeric price value
 * 
 * @example
 * parsePrice("₪1,500.00") // 1500
 * parsePrice("49.99") // 49.99
 */
export function parsePrice(priceString: string): number {
  // Remove currency symbols, commas, and spaces
  const cleaned = priceString.replace(/[₪,\s]/g, "")
  const parsed = parseFloat(cleaned)

  return isNaN(parsed) ? 0 : parsed
}
