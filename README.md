# Wijhat Event-Link

**Curated experience booking for events.** A white-label platform that lets event organizers offer bookable tours and experiences to their attendees.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)

## Features

- **Event-branded experience pages** — White-label for any event
- **Tour catalog** with category filtering, search, and rich detail pages
- **Guest checkout** — No account required, reserve in 3 steps
- **Optional accounts** — Supabase Auth for returning users
- **Admin dashboard** — Manage bookings, mark paid, check-in guests
- **Voucher system** — Unique codes, shareable booking confirmations
- **WhatsApp integration** — Direct inquiry link on every tour
- **Sustainability tags** — Eco transport, local community, carbon neutral
- **Responsive** — Works on mobile, tablet, desktop

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Supabase (PostgreSQL + Auth + RLS)
- **Deployment:** Vercel-ready

## Quick Start

### 1. Clone & Install

```bash
cd projects/wijhat-event-link
cp .env.local.example .env.local
npm install
```

### 2. Configure Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your `Project URL` and `anon key` into `.env.local`
3. Run the schema in **Supabase SQL Editor**:

```bash
# Copy and run these files in order:
cat supabase-schema.sql | pbcopy  # paste into SQL Editor
cat supabase-seed.sql | pbcopy    # paste into SQL Editor (sample data)
```

### 3. Create Admin Users

After running the schema, create admin users in Supabase:

1. Go to **Authentication → Users → Add User** (create with email + password)
2. Then run this SQL to grant admin access:

```sql
INSERT INTO admin_users (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'your-admin@email.com'),
  'admin'
);
```

Repeat for each admin (Khaled + Alaa's team).

### 4. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Tour listing (home)
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── tours/[id]/page.tsx         # Tour detail page
│   ├── checkout/page.tsx           # 3-step checkout
│   ├── voucher/[code]/page.tsx     # Voucher display
│   ├── admin/
│   │   ├── layout.tsx              # Admin auth guard
│   │   ├── login/page.tsx          # Admin login
│   │   ├── bookings/page.tsx       # Bookings management
│   │   └── tours/new/page.tsx      # Add new tour
│   └── api/
│       ├── checkout/route.ts       # Booking creation API
│       └── admin/
│           ├── update-status/route.ts  # Mark paid/failed/refunded
│           ├── checkin/route.ts        # Check-in guest
│           └── signout/route.ts        # Admin sign out
├── components/
│   ├── layout/HeroSection.tsx
│   ├── tour/
│   │   ├── CategoryFilter.tsx
│   │   ├── TourGrid.tsx
│   │   └── TourDetailClient.tsx
│   ├── booking/
│   │   ├── CheckoutForm.tsx
│   │   └── VoucherClient.tsx
│   └── admin/
│       └── AdminBookingsClient.tsx
└── lib/
    ├── supabase.ts                 # Supabase client
    ├── types.ts                    # TypeScript types + helpers
    ├── data.ts                     # Data access layer
    └── auth.ts                     # Auth helpers
```

## Database Schema

### Core Tables

| Table | Purpose |
|-------|---------|
| `events` | White-label event container (name, slug, branding, dates) |
| `tours` | Experience listings (title, description, price, capacity, images) |
| `tour_slots` | Available time slots per tour (date, time, available seats) |
| `bookings` | Reservations with voucher codes, payment status, check-in |
| `admin_users` | Admin role assignments (links to Supabase Auth) |

### Key Features

- **Row Level Security** — Public read, authenticated write for bookings
- **Voucher codes** — Auto-generated `WJ-XXXXXXXX` format
- **Seat management** — Decrements on booking, shows availability
- **Payment status flow** — `pending → paid / failed → refunded`

## Admin Access

- **URL:** `/admin`
- **Login:** Email + password (Supabase Auth)
- **Capabilities:**
  - View all bookings with search and filter
  - Mark bookings as paid/failed/refunded
  - Check-in guests at the event
  - View and share voucher links
  - Add new tours

## Sample Data

The seed includes:
- **1 event:** LEAP 2026 (Feb 9–12, 2026)
- **10 tours:** Riyadh City, Diriyah Heritage, AlUla Expedition, Desert Safari, Culinary Journey, Edge of the World, Art Trail, Sustainability Tour, Souq Experience, LEAP VIP Add-On
- **Time slots:** Multiple slots per tour across the event dates

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key |
| `NEXT_PUBLIC_EVENT_SLUG` | ❌ | Event slug (default: `leap-2026`) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ❌ | WhatsApp number for inquiry link |

## Deployment (Vercel)

```bash
npm run build   # Test build
vercel          # Deploy
```

Set environment variables in Vercel dashboard → Settings → Environment Variables.

## Future Enhancements

- [ ] Email confirmation via Supabase Edge Functions
- [ ] Payment gateway (Moyasar/Stripe) integration
- [ ] Multi-language support (Arabic RTL)
- [ ] Mobile app (React Native)
- [ ] Calendar sync (Google Calendar / Apple Calendar)
- [ ] Analytics dashboard
- [ ] QR code check-in (scanning vouchers)
- [ ] Waitlist for sold-out tours
