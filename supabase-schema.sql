-- Wijhat Event-Link Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. EVENTS (white-label event container)
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#1B4332',
  secondary_color TEXT DEFAULT '#D4A574',
  hero_image TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. TOURS
-- ============================================
CREATE TABLE IF NOT EXISTS tours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  description TEXT NOT NULL,
  highlights TEXT[] DEFAULT '{}',
  duration_minutes INTEGER NOT NULL DEFAULT 120,
  max_capacity INTEGER NOT NULL DEFAULT 20,
  price_sar NUMERIC(10,2) NOT NULL DEFAULT 0,
  category TEXT DEFAULT 'cultural',
  sustainability_tags TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  inclusions TEXT[] DEFAULT '{}',
  exclusions TEXT[] DEFAULT '{}',
  meeting_point TEXT DEFAULT '',
  difficulty TEXT DEFAULT 'easy' CHECK (difficulty IN ('easy', 'moderate', 'challenging')),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 3. TOUR TIME SLOTS
-- ============================================
CREATE TABLE IF NOT EXISTS tour_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID REFERENCES tours(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  available_seats INTEGER NOT NULL DEFAULT 20,
  is_open BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tour_id, date, start_time)
);

-- ============================================
-- 4. BOOKINGS
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID REFERENCES tours(id) ON DELETE CASCADE NOT NULL,
  slot_id UUID REFERENCES tour_slots(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_nationality TEXT NOT NULL DEFAULT 'Saudi',
  num_guests INTEGER NOT NULL DEFAULT 1,
  total_price NUMERIC(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  special_requests TEXT DEFAULT '',
  voucher_code TEXT UNIQUE NOT NULL,
  checked_in BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 5. ADMIN ROLES
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read active events" ON events FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active tours" ON tours FOR SELECT USING (is_active = true);
CREATE POLICY "Public read open slots" ON tour_slots FOR SELECT USING (is_open = true);
CREATE POLICY "Public read bookings by voucher" ON bookings FOR SELECT USING (true);

-- Public insert (bookings)
CREATE POLICY "Public can create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update bookings" ON bookings FOR UPDATE USING (true);

-- Admin: full access
CREATE POLICY "Admin full access events" ON events FOR ALL USING (true);
CREATE POLICY "Admin full access tours" ON tours FOR ALL USING (true);
CREATE POLICY "Admin full access slots" ON tour_slots FOR ALL USING (true);
CREATE POLICY "Admin full access bookings" ON bookings FOR ALL USING (true);
CREATE POLICY "Admin full access admin_users" ON admin_users FOR ALL USING (true);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_tours_event ON tours(event_id);
CREATE INDEX idx_tours_category ON tours(category);
CREATE INDEX idx_tours_active ON tours(is_active) WHERE is_active = true;
CREATE INDEX idx_slots_tour_date ON tour_slots(tour_id, date);
CREATE INDEX idx_bookings_tour ON bookings(tour_id);
CREATE INDEX idx_bookings_voucher ON bookings(voucher_code);
CREATE INDEX idx_bookings_status ON bookings(payment_status);
CREATE INDEX idx_bookings_created ON bookings(created_at DESC);
CREATE INDEX idx_bookings_email ON bookings(customer_email);
