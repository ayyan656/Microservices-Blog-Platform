# 🎨 Editorial Component Mapping

> **Reference**: [witanddelight.com](https://witanddelight.com) → Microservices Blog Platform

---

## Visual DNA Analysis

### Typography System

| Element | Wit & Delight Style | Our Implementation |
|---------|---------------------|-------------------|
| **Headings** | Sophisticated Serif (similar to Playfair Display) | `Playfair Display` via Google Fonts |
| **Body Text** | Clean Sans-serif | `Inter` via Google Fonts |
| **Accent Text** | All-caps, letterspaced | Tailwind: `uppercase tracking-widest` |

### Color Palette

| Purpose | W&D Hex | Tailwind Class | Notes |
|---------|---------|----------------|-------|
| **Background** | `#FDFBF7` | `bg-[#FDFBF7]` | Warm off-white |
| **Primary Text** | `#1a1a1a` | `text-slate-900` | Deep charcoal |
| **Secondary Text** | `#6b7280` | `text-gray-500` | Muted gray |
| **Accent** | `#C9A77C` | `text-amber-600` | Warm gold hover |
| **Borders** | `#e5e5e5` | `border-gray-200` | Subtle dividers |
| **CTA Button** | `#FF4405` | `bg-[#FF4405]` | Vibrant orange |

---

## Component Mapping Table

### 🏠 Homepage Components

| W&D Component | Associated Service | Data Fields Mapping | Gap Analysis |
|---------------|-------------------|---------------------|--------------|
| **Top Hero Story** | Post-Service | `post.title` → Title, `post.imageUrl` → Hero Image, `post.excerpt` → Subheading | ✅ Complete |
| **Hero Author Badge** | Post-Service + User-Service | `post.authorId` → Needs user lookup | ⚠️ [DATA GAP] No author name in post response |
| **Category Label** | Post-Service | N/A | ❌ [DATA GAP] No category field exists |
| **Featured Date** | Post-Service | `post.publishedAt` → Formatted date | ✅ Complete |

---

| W&D Component | Associated Service | Data Fields Mapping | Gap Analysis |
|---------------|-------------------|---------------------|--------------|
| **Category Filter Bar** | N/A | Static categories in UI | ❌ [DATA GAP] No categories endpoint |
| **Editorial Card (Large)** | Post-Service | `post.title`, `post.imageUrl`, `post.excerpt` | ✅ Complete |
| **Editorial Card (Small)** | Post-Service | Same as above, different layout | ✅ Complete |
| **Read Time Badge** | Post-Service | N/A | ❌ [DATA GAP] Calculate: `Math.ceil(content.split(' ').length / 200)` mins |

---

| W&D Component | Associated Service | Data Fields Mapping | Gap Analysis |
|---------------|-------------------|---------------------|--------------|
| **Author Avatar** | User-Service | `post.authorId` → Generate via DiceBear API | ⚠️ Workaround needed |
| **Author Name** | User-Service | `user.name` → Requires separate API call | ⚠️ Workaround: Display "User #{id}" |
| **Newsletter Signup** | N/A | Frontend-only static component | ✅ N/A (Static) |
| **About Kate Sidebar** | N/A | Static content | ✅ N/A (Static) |

---

### 📝 Article Detail Components

| W&D Component | Associated Service | Data Fields Mapping | Gap Analysis |
|---------------|-------------------|---------------------|--------------|
| **Article Title** | Post-Service | `post.title` | ✅ Complete |
| **Article Hero Image** | Post-Service | `post.imageUrl` | ✅ Complete |
| **Article Body** | Post-Service | `post.content` (HTML) | ✅ Complete |
| **Published Date** | Post-Service | `post.publishedAt` | ✅ Complete |
| **Share Buttons** | N/A | Static social share links | ✅ N/A (Static) |
| **Comments Section** | Comment-Service | `comments.content`, `comments.author_name` | ✅ Complete |
| **Related Posts** | Post-Service | Fetch all, filter by similar content | ⚠️ No tags/categories for matching |

---

## Gap Analysis Summary

### ❌ Data Gaps (Cannot be fixed without backend changes)

| Missing Field | Workaround Strategy |
|--------------|---------------------|
| **Categories** | Use hardcoded categories in UI, or extract keywords from title |
| **Tags** | Skip for MVP |
| **Read Time** | Calculate on frontend: `Math.ceil(post.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)` |
| **Author Name** | Display placeholder: "User #{authorId}" or fetch from User-Service |
| **Author Avatar** | Use DiceBear API: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorId}` |
| **Featured Flag** | Use first post or most recent as "featured" |

### ✅ Fully Mapped Fields

| UI Element | Backend Field | Notes |
|------------|--------------|-------|
| Post Title | `post.title` | Direct mapping |
| Post Image | `post.imageUrl` | Falls back to placeholder |
| Post Excerpt | `post.excerpt` | Auto-generated if empty |
| Post Content | `post.content` | Rich HTML content |
| Published Date | `post.publishedAt` | Format with `Intl.DateTimeFormat` |
| Post Status | `post.status` | 'draft' / 'published' / 'archived' |
| Likes Count | `post.likesCount` | Display as is |
| Views Count | `post.viewsCount` | Display as is |
| Comments Count | `post.commentsCount` | Display as is |

---

## Frontend Utility Functions Needed

```javascript
// Calculate reading time
export const getReadTime = (content) => {
  const text = content.replace(/<[^>]*>/g, ''); // Strip HTML
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.ceil(words / 200); // 200 WPM average
};

// Format date in W&D style
export const formatEditorialDate = (dateString) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(dateString));
};

// Generate avatar URL
export const getAuthorAvatar = (authorId) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorId}`;
};

// Static categories (until backend supports)
export const EDITORIAL_CATEGORIES = [
  'Interiors & Decor',
  'Lifestyle',
  'Travel & Leisure',
  'Career',
  'Wellness'
];
```

---

## Visual Component Wireframes

### Hero Section Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌──────────────────┐    ┌─────────────────────────────┐   │
│  │                  │    │  CATEGORY • DATE            │   │
│  │                  │    │                             │   │
│  │   HERO IMAGE     │    │  Article Title Goes        │   │
│  │   (7 cols)       │    │  Here With Elegant         │   │
│  │                  │    │  Serif Typography          │   │
│  │                  │    │                             │   │
│  │                  │    │  Excerpt text that gives   │   │
│  │                  │    │  readers a preview...      │   │
│  │                  │    │                             │   │
│  │                  │    │  [→] Read More Button      │   │
│  └──────────────────┘    └─────────────────────────────┘   │
│                          (5 cols)                          │
└─────────────────────────────────────────────────────────────┘
```

### Asymmetric Editorial Grid

```
┌─────────────────────────────────────────────────────────────┐
│  LATEST ARTICLES                    [Filter: All | Tech]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────────────┐  ┌──────────────────────┐  │
│  │                            │  │ ┌──────────────────┐ │  │
│  │     LARGE CARD (8 cols)    │  │ │   SMALL CARD     │ │  │
│  │     Featured Article       │  │ │   (4 cols)       │ │  │
│  │     with big image         │  │ └──────────────────┘ │  │
│  │                            │  │ ┌──────────────────┐ │  │
│  │                            │  │ │   SMALL CARD     │ │  │
│  │                            │  │ │   (4 cols)       │ │  │
│  └────────────────────────────┘  │ └──────────────────┘ │  │
│                                  └──────────────────────┘  │
│                                                             │
│  ──────────────────────────────────────────────────────────│
│  Border divider (not shadow)                               │
│  ──────────────────────────────────────────────────────────│
│                                                             │
│  ┌──────────┐┌──────────┐┌──────────┐┌──────────┐         │
│  │  CARD 3  ││  CARD 4  ││  CARD 5  ││  CARD 6  │         │
│  │  cols    ││  cols    ││  cols    ││  cols    │         │
│  └──────────┘└──────────┘└──────────┘└──────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Newsletter Signup Section

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│          ✉️  Stay in the Loop                               │
│                                                             │
│   Join our newsletter for weekly inspiration on             │
│   design, lifestyle, and everything in between.            │
│                                                             │
│   ┌──────────────────────────────┐ ┌────────────────┐      │
│   │  Your email address          │ │  Subscribe →   │      │
│   └──────────────────────────────┘ └────────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Tailwind Class Patterns for W&D Style

### Asymmetric Grid
```html
<div class="grid grid-cols-12 gap-8">
  <article class="col-span-8">Large featured</article>
  <div class="col-span-4 space-y-6">
    <article>Small card 1</article>
    <article>Small card 2</article>
  </div>
</div>
```

### Border-Box Dividers (Not Shadows)
```html
<section class="border-b border-gray-200 pb-16 mb-16">
  Content here
</section>
```

### Elegant Hover States
```html
<h2 class="group-hover:text-amber-600 transition-colors duration-300">
  Title with subtle color shift
</h2>
```

### Micro-interaction Arrows
```html
<span class="transform group-hover:translate-x-1 transition-transform">
  →
</span>
```

---

*Mapping document for Wit & Delight inspired editorial redesign*
