import { getClient } from './supabase';
import { Event, Tour, TourSlot, Booking, generateVoucherCode } from './types';

// ─── Events ──────────────────────────────────────────────
export async function getEvent(slug: string): Promise<Event | null> {
  const { data, error } = await getClient()
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  if (error) throw error;
  return data;
}

export async function getAllEvents(): Promise<Event[]> {
  const { data, error } = await getClient()
    .from('events')
    .select('*')
    .eq('is_active', true)
    .order('start_date', { ascending: true });
  if (error) throw error;
  return data || [];
}

// ─── Tours ───────────────────────────────────────────────
export async function getToursByEvent(eventId: string): Promise<Tour[]> {
  const { data, error } = await getClient()
    .from('tours')
    .select('*')
    .eq('event_id', eventId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getTour(tourId: string): Promise<Tour | null> {
  const { data, error } = await getClient()
    .from('tours')
    .select('*')
    .eq('id', tourId)
    .eq('is_active', true)
    .single();
  if (error) throw error;
  return data;
}

export async function getTourWithSlots(tourId: string): Promise<Tour | null> {
  const { data, error } = await getClient()
    .from('tours')
    .select(`
      *,
      slots:tour_slots(*)
    `)
    .eq('id', tourId)
    .eq('is_active', true)
    .single();
  if (error) throw error;
  return data;
}

// ─── Slots ───────────────────────────────────────────────
export async function getSlotsForTour(tourId: string): Promise<TourSlot[]> {
  const { data, error } = await getClient()
    .from('tour_slots')
    .select('*')
    .eq('tour_id', tourId)
    .eq('is_open', true)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .order('start_time', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getSlot(slotId: string): Promise<TourSlot | null> {
  const { data, error } = await getClient()
    .from('tour_slots')
    .select('*')
    .eq('id', slotId)
    .single();
  if (error) throw error;
  return data;
}

export async function decrementSlotSeats(slotId: string, numGuests: number): Promise<void> {
  const { data: slot } = await getClient()
    .from('tour_slots')
    .select('available_seats')
    .eq('id', slotId)
    .single();

  if (slot && slot.available_seats >= numGuests) {
    await getClient()
      .from('tour_slots')
      .update({ available_seats: slot.available_seats - numGuests })
      .eq('id', slotId);
  } else {
    throw new Error('Not enough seats available');
  }
}

// ─── Bookings ────────────────────────────────────────────
export async function createBooking(params: {
  tourId: string;
  slotId: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNationality: string;
  numGuests: number;
  totalPrice: number;
  specialRequests?: string;
}): Promise<Booking> {
  const voucherCode = generateVoucherCode();

  const { data, error } = await getClient()
    .from('bookings')
    .insert({
      tour_id: params.tourId,
      slot_id: params.slotId,
      user_id: params.userId || null,
      customer_name: params.customerName,
      customer_email: params.customerEmail,
      customer_phone: params.customerPhone,
      customer_nationality: params.customerNationality,
      num_guests: params.numGuests,
      total_price: params.totalPrice,
      payment_status: 'pending',
      special_requests: params.specialRequests || '',
      voucher_code: voucherCode,
    })
    .select()
    .single();

  if (error) throw error;

  await decrementSlotSeats(params.slotId, params.numGuests);

  return data;
}

export async function getBookingByVoucher(code: string): Promise<Booking | null> {
  const { data, error } = await getClient()
    .from('bookings')
    .select(`
      *,
      tour:tours(*),
      slot:tour_slots(*)
    `)
    .eq('voucher_code', code)
    .single();
  if (error) return null;
  return data;
}

export async function getBookingsByEvent(eventId: string): Promise<Booking[]> {
  const tours = await getToursByEvent(eventId);
  const tourIds = tours.map(t => t.id);

  if (tourIds.length === 0) return [];

  const { data, error } = await getClient()
    .from('bookings')
    .select(`
      *,
      tour:tours(*),
      slot:tour_slots(*)
    `)
    .in('tour_id', tourIds)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateBookingStatus(
  bookingId: string,
  status: Booking['payment_status']
): Promise<void> {
  const { error } = await getClient()
    .from('bookings')
    .update({ payment_status: status })
    .eq('id', bookingId);
  if (error) throw error;
}

export async function checkInBooking(bookingId: string): Promise<void> {
  const { error } = await getClient()
    .from('bookings')
    .update({ checked_in: true })
    .eq('id', bookingId);
  if (error) throw error;
}
