import { getBookingsByEvent } from '@/lib/db';
import { getEvent } from '@/lib/db';
import AdminBookingsClient from '@/components/admin/AdminBookingsClient';

export default async function AdminBookingsPage() {
  const eventSlug = process.env.NEXT_PUBLIC_EVENT_SLUG || 'leap-2026';
  const event = await getEvent(eventSlug);

  if (!event) {
    return <div className="p-8 text-center text-stone-500">Event not found. Check NEXT_PUBLIC_EVENT_SLUG.</div>;
  }

  const bookings = await getBookingsByEvent(event.id);

  return <AdminBookingsClient bookings={bookings} />;
}
