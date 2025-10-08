# 🎨 HOMEPAGE VISUAL LAYOUT

## **HERO SECTION (Top of Homepage)**

```
┌─────────────────────────────────────────────────────────────────┐
│                         HERO SECTION                             │
├─────────────────────────────┬───────────────────────────────────┤
│  LEFT SIDE                  │  RIGHT SIDE                       │
│                             │                                   │
│  [Studo.ps Logo]            │   ┌──────────┬──────────┐        │
│                             │   │  iPad    │          │        │
│  Your One-Stop Shop for     │   │ Pencils  │ AirPods  │        │
│  Tech Accessories           │   │  🖼️      │  🖼️      │        │
│                             │   └──────────┴──────────┘        │
│  Discover premium iPad...   │   ┌──────────┬──────────┐        │
│                             │   │          │ Printed  │        │
│  [Shop Now] [Browse]        │   │ Chargers │  Stuff   │        │
│                             │   │  🖼️      │  🖼️      │        │
│  ┌─────────────────────┐   │   └──────────┴──────────┘        │
│  │ 🚚 Free Delivery    │   │                                   │
│  │    Birzeit Univ     │   │   (Images rotate every 5s)        │
│  ├─────────────────────┤   │   (1s delay between each)         │
│  │ 📍 Free Pickup      │   │                                   │
│  │    Bilin Village    │   │                                   │
│  ├─────────────────────┤   │                                   │
│  │ 🛡️ 1 Year           │   │                                   │
│  │    Guarantee        │   │                                   │
│  └─────────────────────┘   │                                   │
└─────────────────────────────┴───────────────────────────────────┘
```

## **ROTATION BEHAVIOR**

### Slot Timing:
```
Time 0s: Slot 1 (iPad Pencils) shows Image 1
Time 1s: Slot 2 (AirPods) shows Image 1
Time 2s: Slot 3 (Chargers) shows Image 1
Time 3s: Slot 4 (Printed Stuff) shows Image 1

Time 5s: Slot 1 switches to Image 2
Time 6s: Slot 2 switches to Image 2
Time 7s: Slot 3 switches to Image 2
Time 8s: Slot 4 switches to Image 2

... continues cycling through all uploaded images ...
```

### Stagger Effect:
```
📦 Slot 1: ▓▓▓▓▓░░░░░░░░░░ (shows Image 1 at 0s)
📦 Slot 2: ░▓▓▓▓▓░░░░░░░░░ (shows Image 1 at 1s)
📦 Slot 3: ░░▓▓▓▓▓░░░░░░░░ (shows Image 1 at 2s)
📦 Slot 4: ░░░▓▓▓▓▓░░░░░░░ (shows Image 1 at 3s)
```

## **ADMIN INTERFACE**

```
┌─────────────────────────────────────────────────────────────┐
│  ADMIN DASHBOARD → Category Images                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [iPad Pencils] [AirPods] [Chargers] [Printed Stuff]       │
│  ─────────────                                              │
│                                                             │
│  📸 Upload New Image                                        │
│  ┌───────────────────────────────────────────┐             │
│  │  📁 Choose File...                         │             │
│  │  Title: ___________________________        │             │
│  │  Description: ___________________          │             │
│  │  Display Order: [1]                        │             │
│  │  Active: ☑                                 │             │
│  │  [Upload Image]                            │             │
│  └───────────────────────────────────────────┘             │
│                                                             │
│  📋 Existing Images                                         │
│  ┌─────────────────────────────────────┐                   │
│  │ 🖼️ Image Title                      │                   │
│  │    Description text here...         │                   │
│  │    Order: 1 | Active: ☑             │                   │
│  │    [Edit] [Delete]                  │                   │
│  └─────────────────────────────────────┘                   │
│  ┌─────────────────────────────────────┐                   │
│  │ 🖼️ Another Image                    │                   │
│  │    More description...              │                   │
│  │    Order: 2 | Active: ☑             │                   │
│  │    [Edit] [Delete]                  │                   │
│  └─────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

## **RESPONSIVE BEHAVIOR**

### Desktop (lg):
- Hero: 2 columns (text left, images right)
- Product cards: 2x2 grid
- Feature badges: 3 columns

### Tablet (md):
- Hero: 2 columns (smaller text)
- Product cards: 2x2 grid
- Feature badges: 3 columns

### Mobile (sm):
- Hero: 1 column (stacked)
- Product cards: 2x2 grid (smaller)
- Feature badges: 1 column (stacked)

## **COLOR SCHEME**

```
Background Gradients:
- Hero: from-primary/5 → via-background → to-accent/5
- Decorative blobs: primary/10, accent/10
- Product cards: bg-card with border

Badges:
- Delivery: bg-primary/10 (blue-ish)
- Pickup: bg-accent/10 (purple-ish)
- Guarantee: bg-green-100 (green)

Text:
- Headings: text-4xl to text-6xl font-bold
- Body: text-muted-foreground
- Accents: text-primary gradient
```

## **ANIMATIONS**

```
Entry Animations:
├─ Logo: opacity 0→100, translateY 16px→0, delay 0ms
├─ Heading: opacity 0→100, translateY 16px→0, delay 100ms
├─ Description: opacity 0→100, translateY 16px→0, delay 200ms
├─ Buttons: opacity 0→100, translateY 16px→0, delay 300ms
├─ Badges: opacity 0→100, translateY 16px→0, delay 400ms
└─ Product Grid: opacity 0→100, translateX 32px→0, delay 200ms

Hover Effects:
├─ Product Cards: translateY 0→-8px, shadow-lg→shadow-xl
├─ Buttons: shadow-lg→shadow-xl
└─ Background: blur animations (animate-float)

Image Transitions:
└─ Fade: transition-opacity duration-500ms
```

## **IMAGE SPECIFICATIONS**

### Recommended Sizes:
- Logo: 120px × 40px (SVG preferred)
- Product Cards: Square aspect ratio (500px × 500px recommended)
- File Format: JPG, PNG, WebP
- Max Size: 10MB per image

### Storage Paths:
- Logo: `/public/studo-logo.png`
- Category Images: Supabase Storage `category-images/` bucket

## **RESPONSIVE BREAKPOINTS**

```
Tailwind Breakpoints Used:
- sm: 640px (grid-cols-2, flex-row)
- md: 768px (text-5xl, py-20)
- lg: 1024px (grid-cols-2, text-6xl, py-32)

Container:
- Max width: container mx-auto
- Padding: px-4
```
