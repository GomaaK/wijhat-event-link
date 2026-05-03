export interface Event {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  hero_image: string | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface Tour {
  id: string;
  event_id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  duration_minutes: number;
  max_capacity: number;
  price_sar: number;
  category: string;
  sustainability_tags: string[];
  images: string[];
  inclusions: string[];
  exclusions: string[];
  meeting_point: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  is_active: boolean;
  sort_order: number;
  created_at: string;
  slots?: TourSlot[];
}

export interface TourSlot {
  id: string;
  tour_id: string;
  date: string;
  start_time: string;
  end_time: string;
  available_seats: number;
  is_open: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  tour_id: string;
  slot_id: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_nationality: string;
  num_guests: number;
  total_price: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  special_requests: string;
  voucher_code: string;
  checked_in: boolean;
  created_at: string;
  tour?: Tour;
  slot?: TourSlot;
}

export const CATEGORIES: Record<string, string> = {
  cultural: 'Cultural',
  heritage: 'Heritage',
  adventure: 'Adventure',
  culinary: 'Culinary',
  sustainability: 'Sustainability',
  business: 'Business',
};

export const SUSTAINABILITY_TAGS: Record<string, { label: string; icon: string }> = {
  'eco-transport': { label: 'Eco Transport', icon: '🚲' },
  'local-community': { label: 'Local Community', icon: '👥' },
  'carbon-neutral': { label: 'Carbon Neutral', icon: '🌱' },
};

export const DIFFICULTY: Record<string, { label: string; color: string }> = {
  easy: { label: 'Easy', color: 'green' },
  moderate: { label: 'Moderate', color: 'yellow' },
  challenging: { label: 'Challenging', color: 'red' },
};

export function formatPrice(sar: number): string {
  return `SAR ${sar.toFixed(0)}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export function generateVoucherCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'WJ-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
