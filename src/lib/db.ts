import { store, mockEvent } from './mock-data';
import { Event, Tour, TourSlot, Booking, generateVoucherCode } from './types';

// ─── Events ──────────────────────────────────────────────
export async function getEvent(slug: string): Promise<Event | null> {
  // Match slug flexibly
  const allSlugs = [mockEvent.slug, 'leap-2026', 'leap2026', 'leap_2026'];
  if (allSlugs.includes(slug.toLowerCase())) {
    return mockEvent;
  }
  return null;
}

export async function getAllEvents(): Promise<Event[]> {
  return [mockEvent];
}

// ─── Tours ───────────────────────────────────────────────
export async function getToursByEvent(eventId: string): Promise<Tour[]> {
  return store.tours.filter(t => t.event_id === eventId && t.is_active).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getTour(tourId: string): Promise<Tour | null> {
  return store.tours.find(t => t.id === tourId && t.is_active) || null;
}

export async function getTourWithSlots(tourId: string): Promise<Tour | null> {
  const tour = store.tours.find(t => t.id === tourId && t.is_active);
  if (!tour) return null;
  const slots = store.slots.filter(s => s.tour_id === tourId);
  return { ...tour, slots };
}

// ─── Slots ───────────────────────────────────────────────
export async function getSlotsForTour(tourId: string): Promise<TourSlot[]> {
  return store.slots
    .filter(s => s.tour_id === tourId && s.is_open)
    .sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time));
}

export async function getSlot(slotId: string): Promise<TourSlot | null> {
  return store.slots.find(s => s.id === slotId) || null;
}

export async function decrementSlotSeats(slotId: string, numGuests: number): Promise<void> {
  const slot = store.slots.find(s => s.id === slotId);
  if (!slot || slot.available_seats < numGuests) {
    throw new Error('Not enough seats available');
  }
  slot.available_seats -= numGuests;
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
  const tour = store.tours.find(t => t.id === params.tourId);
  const slot = store.slots.find(s => s.id === params.slotId);

  const booking: Booking = {
    id: `book-${Date.now()}`,
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
    checked_in: false,
    created_at: new Date().toISOString(),
    tour: tour ? { ...tour, slots: undefined } : undefined,
    slot,
  };

  store.bookings.push(booking);

  // Decrement seats
  await decrementSlotSeats(params.slotId, params.numGuests);

  return booking;
}

export async function getBookingByVoucher(code: string): Promise<Booking | null> {
  const booking = store.bookings.find(b => b.voucher_code === code.toUpperCase());
  if (!booking) return null;

  // Enrich with tour and slot
  const tour = store.tours.find(t => t.id === booking.tour_id);
  const slot = store.slots.find(s => s.id === booking.slot_id);
  return { ...booking, tour: tour ? { ...tour, slots: undefined } : undefined, slot };
}

export async function getBookingsByEvent(eventId: string): Promise<Booking[]> {
  const tours = store.tours.filter(t => t.event_id === eventId);
  const tourIds = new Set(tours.map(t => t.id));

  return store.bookings
    .filter(b => tourIds.has(b.tour_id))
    .map(b => {
      const tour = store.tours.find(t => t.id === b.tour_id);
      const slot = store.slots.find(s => s.id === b.slot_id);
      return { ...b, tour: tour ? { ...tour, slots: undefined } : undefined, slot };
    })
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function getAllBookings(): Promise<Booking[]> {
  return store.bookings
    .map(b => {
      const tour = store.tours.find(t => t.id === b.tour_id);
      const slot = store.slots.find(s => s.id === b.slot_id);
      return { ...b, tour: tour ? { ...tour, slots: undefined } : undefined, slot };
    })
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function updateBookingStatus(
  bookingId: string,
  status: Booking['payment_status']
): Promise<void> {
  const booking = store.bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.payment_status = status;
  }
}

export async function checkInBooking(bookingId: string): Promise<void> {
  const booking = store.bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.checked_in = true;
  }
}

// ─── Analytics ───────────────────────────────────────────
export async function getAnalytics(): Promise<{
  totalBookings: number;
  totalRevenue: number;
  avgBookingValue: number;
  topTours: { tour_id: string; title: string; bookings: number; revenue: number }[];
  bookingsByNationality: { nationality: string; count: number }[];
  bookingsByDay: { date: string; count: number; revenue: number }[];
  activeTours: number;
  upcomingSlots: number;
}> {
  const allBookings = store.bookings;
  const paidBookings = allBookings.filter(b => b.payment_status === 'paid');
  const totalRevenue = paidBookings.reduce((sum, b) => sum + Number(b.total_price), 0);

  const tourMap = new Map(store.tours.map(t => [t.id, t.title]));
  const tourBookings = new Map<string, number>();
  const tourRevenue = new Map<string, number>();

  allBookings.forEach(b => {
    tourBookings.set(b.tour_id, (tourBookings.get(b.tour_id) || 0) + 1);
    if (b.payment_status === 'paid') {
      tourRevenue.set(b.tour_id, (tourRevenue.get(b.tour_id) || 0) + Number(b.total_price));
    }
  });

  const topTours = Array.from(tourBookings.entries())
    .map(([tourId, bookingCount]) => ({
      tour_id: tourId,
      title: tourMap.get(tourId) || 'Unknown',
      bookings: bookingCount,
      revenue: tourRevenue.get(tourId) || 0,
    }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5);

  const natMap = new Map<string, number>();
  allBookings.forEach(b => {
    natMap.set(b.customer_nationality, (natMap.get(b.customer_nationality) || 0) + 1);
  });
  const bookingsByNationality = Array.from(natMap.entries())
    .map(([nationality, count]) => ({ nationality, count }))
    .sort((a, b) => b.count - a.count);

  // Last 7 days
  const dayMap = new Map<string, { count: number; revenue: number }>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    dayMap.set(key, { count: 0, revenue: 0 });
  }
  allBookings.forEach(b => {
    const day = b.created_at.split('T')[0];
    if (dayMap.has(day)) {
      const entry = dayMap.get(day)!;
      entry.count++;
      if (b.payment_status === 'paid') entry.revenue += Number(b.total_price);
    }
  });
  const bookingsByDay = Array.from(dayMap.entries()).map(([date, data]) => ({
    date,
    count: data.count,
    revenue: data.revenue,
  }));

  const today = new Date().toISOString().split('T')[0];
  const upcomingSlots = store.slots.filter(s => s.date >= today && s.is_open).length;

  return {
    totalBookings: allBookings.length,
    totalRevenue,
    avgBookingValue: paidBookings.length > 0 ? totalRevenue / paidBookings.length : 0,
    topTours,
    bookingsByNationality,
    bookingsByDay,
    activeTours: store.tours.filter(t => t.is_active).length,
    upcomingSlots,
  };
}
