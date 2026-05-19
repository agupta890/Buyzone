# BuyZone — Product Roadmap, Bug Tracker & Design Upgrade Plan

---

## 1. Known Bugs (Fix First)

| # | Bug | File(s) | Priority |
|---|-----|---------|----------|
| B1 | **Product images stored as base64 strings** — each product document is ~200–500 KB in MongoDB; makes every `/api/products` response massive and slow | `Admin.jsx`, `products-route.js` | 🔴 Critical |
| B2 | **Products with 0 stock can still be added to cart** — no stock check on add-to-cart or at checkout | `cart-router.js`, `ProductCard.jsx` | 🔴 Critical |
| B3 | **JWT secret is `"123"`** — trivially brute-forceable; any token can be forged | `server/.env` | 🔴 Critical |
| B4 | **Admin route `/admin` has no frontend guard** — any URL visitor can open the admin page | `App.jsx` | 🔴 Critical |
| B5 | **"View Details" button on order cards does nothing** — no detail/expand behaviour wired up | `Myorders.jsx` | 🟠 High |
| B6 | **`/categories` route linked in hero section doesn't exist** — leads to blank page | `HomePage.jsx`, `App.jsx` | 🟠 High |
| B7 | **Search icon in Navbar is imported but never rendered/functional** — users have no way to search | `Navbar.jsx` | 🟠 High |
| B8 | **Profile page fetches `data.username` but schema field is `name`** — name always shows blank | `Profile.jsx`, `userSchema.js` | 🟠 High |
| B9 | **`returnDays` missing on products created before the field was added** — defaults silently to 7 via `??` coalescing, but admin has no way to retroactively set it without editing each product | `productSchema.js` | 🟡 Medium |
| B10 | **Payment amount not verified server-side on Razorpay callback** — a user could tamper with order total | `payments-route.js` | 🟠 High |
| B11 | **No rate limiting on auth routes** — login endpoint is open to brute-force | `server.js`, `auth-router.js` | 🟠 High |
| B12 | **Cart items for deleted products appear as `null`** — UI crashes or renders broken rows | `Cart-context.jsx` (filters `null` but silently drops) | 🟡 Medium |
| B13 | **No 404 page** — unknown routes show blank screen | `App.jsx` | 🟡 Medium |
| B14 | **Profile photo upload in Profile page is wired to UI but no upload API exists** — silently fails | `Profile.jsx` | 🟡 Medium |
| B15 | **`featureImg` in HomePage is a hardcoded Cloudinary URL** — breaks if that asset is removed | `HomePage.jsx` | 🟡 Medium |
| B16 | **Testimonials and star ratings are hardcoded/fake** — misleads customers | `HomePage.jsx`, `ProductCard.jsx` | 🟡 Medium |
| B17 | **No error boundary** — any JS error in a component crashes the whole app with a blank screen | All pages | 🟡 Medium |
| B18 | **`countDocuments` was running sequentially after `find`** — now fixed with `Promise.all` | ✅ Fixed | — |
| B19 | **`addToCart` waited for server before updating UI** — now fixed with optimistic update | ✅ Fixed | — |

---

## 2. Missing Features

### 🛍️ Customer-Facing

| # | Feature | Description |
|---|---------|-------------|
| F1 | **Search** | Full-text search bar in navbar — searches product name, category, description |
| F2 | **Wishlist / Save for Later** | Heart icon on product cards; saved to user account |
| F3 | **Filter & Sort** | Price range slider, sort by price/rating/newest on Shop All and category pages |
| F4 | **Real Product Ratings & Reviews** | Customers can rate and review products they've purchased; aggregate rating shown |
| F5 | **Out-of-Stock Badge** | Show "Out of Stock" on cards and block add-to-cart when `stock === 0` |
| F6 | **Estimated Delivery Date** | Show "Estimated delivery: Mon 26 May" on product detail and order confirmation |
| F7 | **Coupon / Promo Codes** | Discount code input at checkout; admin can create/manage codes |
| F8 | **Wallet / Store Credit** | Credit wallet on returns; use wallet balance at checkout (enum value exists but unused) |
| F9 | **Order Invoice Download** | PDF receipt downloadable from order history |
| F10 | **Reorder Button** | "Buy Again" on delivered orders — adds same items back to cart |
| F11 | **Multiple Product Images** | Swipeable image gallery on product detail page |
| F12 | **Forgot Password / Reset** | Email-based password reset flow |
| F13 | **Email Notifications** | Order placed / shipped / delivered / return approved — transactional emails |
| F14 | **Related Products** | "You may also like" section on product detail page |
| F15 | **Product Variants** | Size, colour, weight options per product |
| F16 | **Recently Viewed** | Already in localStorage; needs persistent server-side storage and a visible page |
| F17 | **Order Tracking Timeline** | Detailed timeline inside an order: placed → packed → shipped (with timestamps) |
| F18 | **COD Order Confirmation Flow** | COD orders skip payment but need a proper confirmation step + order summary page |

### 🛠️ Admin-Facing

| # | Feature | Description |
|---|---------|-------------|
| A1 | **Analytics Dashboard** | Revenue, orders, users — with charts (see Section 3) |
| A2 | **User Management** | List all users, view order history per user, deactivate accounts |
| A3 | **Inventory Alerts** | Flag products with `stock < 5`; low-stock widget on dashboard |
| A4 | **Bulk Product Import** | CSV upload to create many products at once |
| A5 | **Coupon Management** | Create, edit, expire coupon codes |
| A6 | **Return Approval Flow** | Admin can approve or reject return requests; customer gets notified |
| A7 | **Order Search & Filter** | Filter orders by user email, order ID, status, date range |
| A8 | **Revenue Reports Export** | Download orders as CSV / PDF for accounting |
| A9 | **Admin Notifications** | Bell icon with new orders, return requests, low stock alerts |

---

## 3. Admin Dashboard — Professional Analytics Redesign

### Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  SIDEBAR (fixed, 240px)          │  MAIN CONTENT AREA               │
│  ─────────────────────           │  ──────────────────               │
│  BuyZone Admin                   │  [Header: page title + date]      │
│                                  │                                   │
│  📊 Dashboard                    │  KPI CARDS ROW (4 cards)          │
│  📦 Products                     │  ┌────────┐ ┌────────┐           │
│  🧾 Orders        (badge: new)   │  │Revenue │ │Orders  │  ...      │
│  👥 Customers                    │  └────────┘ └────────┘           │
│  🏷️  Coupons                     │                                   │
│  📈 Analytics                    │  CHARTS ROW                       │
│  ⚙️  Settings                    │  ┌──────────────┐ ┌──────────┐   │
│                                  │  │ Revenue Line │ │ Order    │   │
│  ─────────────                   │  │    Chart     │ │ Status   │   │
│  [Admin Avatar]                  │  │  (7/30/90d)  │ │  Donut   │   │
│  Admin Name                      │  └──────────────┘ └──────────┘   │
│  admin@buyzone.com               │                                   │
│                                  │  BOTTOM ROW                       │
│                                  │  ┌──────────────┐ ┌──────────┐   │
│                                  │  │  Recent      │ │  Low     │   │
│                                  │  │  Orders      │ │  Stock   │   │
│                                  │  │  Table       │ │  Alerts  │   │
│                                  │  └──────────────┘ └──────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

### KPI Cards (4 across top)
- **Total Revenue** — ₹ amount with % change vs last month (green/red arrow)
- **Total Orders** — count with breakdown: Pending / Delivered / Cancelled
- **Active Customers** — unique users who ordered this month
- **Return Requests** — open return requests needing action (highlighted orange if > 0)

### Charts
- **Revenue Over Time** — line chart, toggle: 7 days / 30 days / 3 months (use Recharts)
- **Order Status Distribution** — donut chart: Pending / Packing / Dispatched / Delivered / Cancelled
- **Top 5 Products** — horizontal bar chart by units sold

### Tables
- **Recent Orders** — last 10 orders with quick-status-change dropdown inline
- **Low Stock Alerts** — products where `stock < 5`, with direct edit link
- **Return Requests** — open returns with approve/reject buttons

### Tech to add
```
npm install recharts
```

---

## 4. Full UI Redesign Plan

### Design System

#### Color Palette
```
Primary:     #0F172A  (slate-950)   — backgrounds, headings
Accent:      #F59E0B  (amber-500)   — CTAs, highlights, badges
Surface:     #FFFFFF               — cards
Background:  #F8FAFC  (slate-50)   — page background
Border:      #E2E8F0  (slate-200)
Text-main:   #1E293B  (slate-800)
Text-muted:  #64748B  (slate-500)
Success:     #10B981  (emerald-500)
Error:       #EF4444  (red-500)
Warning:     #F97316  (orange-500)
```

#### Typography
```
Font:       "Inter" (Google Fonts) — replace current system font
Headings:   font-weight: 800–900, tight letter-spacing
Body:       font-weight: 400–500, 16px base, 1.6 line-height
Labels:     font-weight: 700, uppercase, 0.08em tracking
```

#### Spacing Scale
```
Use 8px base unit throughout: 8 / 16 / 24 / 32 / 48 / 64 / 96px
Consistent section padding: py-16 sm:py-24
Card padding: p-6 (24px)
```

#### Shadows
```
Card:       shadow-md (soft, not harsh)
Dropdown:   shadow-xl with ring-1 ring-slate-100
Hover:      transition to shadow-2xl + -translate-y-1
```

---

### Page-by-Page Redesign Notes

#### Navbar
- Sticky with backdrop-blur + border-bottom on scroll
- Centered category nav on desktop
- Integrated search bar (expands on focus)
- Cart bubble count badge
- User avatar dropdown (Orders / Profile / Logout)
- Mobile: full-screen slide-in drawer with smooth animation

#### Home Page
- Hero: full-bleed image with left-aligned text, auto-sliding, dot indicators
- No fake "10% OFF" on every product — earn badges dynamically (bestseller, new, low stock)
- Trending section: proper 4-column grid with consistent card heights
- Category grid: large editorial-style tiles with gradient overlays
- Remove hardcoded testimonials OR replace with real review data
- Add a "Why BuyZone" section with animated stat counters

#### Product Card
- Clean white card, no border by default, shadow on hover
- Single "Add to Cart" CTA — not duplicated (one in overlay, one in footer)
- "Go to Cart" replaces button after adding ✅ (done)
- Return policy badge if `returnDays > 0` (small chip: "7-day return")
- Real stock indicator: "Only 3 left!" when `stock < 5`

#### Product Detail Page
- Two-column layout: large image left, details right
- Image zoom on hover (no separate gallery yet — add when multi-image lands)
- "Add to Cart" and "Buy Now" sticky on mobile ✅ (done)
- Return policy shown clearly ✅ (done)
- Related products section at bottom (F14)
- Breadcrumb navigation

#### Cart Page
- Clean line-item list: image / name / qty stepper / price / remove
- Sticky order summary sidebar on desktop
- Coupon code input field (even if non-functional initially)
- Estimated delivery date display
- Empty cart state with CTA to Shop All

#### My Orders Page
- Filters: All / Active / Delivered / Cancelled / Returns
- Order card shows all items (currently only shows first item's image)
- "View Details" expands inline to show all items, address, payment method ✅ (currently dead button)
- Return/Cancel actions ✅ (done)
- Reorder button on Delivered orders (F10)

#### Authentication Pages
- Split-screen layout: left = brand visual, right = form
- Password visibility toggle
- Form validation with inline error messages
- "Forgot password?" link

#### Admin Panel
- Full redesign described in Section 3 above
- Use Recharts for all charts
- Professional sidebar navigation (not top-tab)
- Consistent table UI with sorting, pagination, search

---

## 5. Prioritised Execution Order

### Sprint 1 — Critical Bugs & Security (Do immediately)
1. Fix JWT secret (B3)
2. Add admin route frontend guard (B4)
3. Stock check on add-to-cart (B2)
4. Fix profile `username` → `name` (B8)
5. Add `/categories` route or fix the link (B6)
6. Wire up "View Details" on orders (B5)
7. Add functional search (F1)

### Sprint 2 — Core Missing Features
1. Filter & Sort on shop pages (F3)
2. Out-of-stock badge + cart block (F5)
3. Real reviews & ratings system (F4)
4. Reorder button (F10)
5. Coupon codes — backend + checkout UI (F7)

### Sprint 3 — Admin Dashboard
1. Analytics dashboard with Recharts (A1)
2. Low stock alerts (A3)
3. Return approval flow (A6)
4. Order search & filter (A7)

### Sprint 4 — UI Polish & Professional Redesign
1. Inter font + design tokens
2. Navbar redesign + search
3. Product card cleanup
4. Home page hero + sections
5. Cart + checkout redesign
6. Orders page redesign
7. Auth pages redesign

### Sprint 5 — Advanced Features
1. Wishlist (F2)
2. Product image gallery (F11)
3. Email notifications (F13)
4. Password reset (F12)
5. Wallet system (F8)
6. Product variants (F15)
