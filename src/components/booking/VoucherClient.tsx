'use client';

import { Booking, formatPrice, formatDate, formatTime, formatDuration } from '@/lib/types';

interface VoucherClientProps {
  booking: Booking;
}

export default function VoucherClient({ booking }: VoucherClientProps) {
  const tour = booking.tour;
  const slot = booking.slot;

  if (!tour || !slot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-500">Booking data incomplete.</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-stone-100 text-stone-800',
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 px-8 py-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold text-white">Wijhat Experience</h1>
                <p className="text-emerald-200 text-sm mt-1">Booking Voucher</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                statusColors[booking.payment_status] || 'bg-stone-100 text-stone-800'
              }`}>
                {booking.payment_status}
              </span>
            </div>
          </div>

          {/* Voucher Code */}
          <div className="px-8 py-6 bg-stone-50 border-b border-stone-200 text-center">
            <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Voucher Code</p>
            <p className="text-4xl font-mono font-bold text-emerald-800 tracking-[0.2em]">
              {booking.voucher_code}
            </p>
            {booking.checked_in && (
              <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                ✓ CHECKED IN
              </span>
            )}
          </div>

          {/* Tour Details */}
          <div className="px-8 py-6">
            <div className="flex gap-4 mb-6">
              <img
                src={tour.images[0] || 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=500&fit=crop'}
                alt={tour.title}
                className="w-28 h-24 rounded-xl object-cover"
              />
              <div>
                <h2 className="text-lg font-bold text-stone-900">{tour.title}</h2>
                <p className="text-sm text-stone-500 mt-0.5">{tour.subtitle}</p>
                <p className="text-xs text-stone-400 mt-1">{formatDuration(tour.duration_minutes)}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-xs text-stone-500 mb-1">Date</p>
                <p className="font-semibold text-stone-900">{formatDate(slot.date)}</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-xs text-stone-500 mb-1">Time</p>
                <p className="font-semibold text-stone-900">
                  {formatTime(slot.start_time)} — {formatTime(slot.end_time)}
                </p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-xs text-stone-500 mb-1">Guests</p>
                <p className="font-semibold text-stone-900">{booking.num_guests}</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-xs text-stone-500 mb-1">Total</p>
                <p className="font-semibold text-stone-900">{formatPrice(booking.total_price)}</p>
              </div>
            </div>

            {/* Guest Info */}
            <div className="mt-6 pt-6 border-t border-stone-200">
              <h3 className="text-sm font-bold text-stone-900 mb-3">Guest Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Name</span>
                  <span className="text-stone-900">{booking.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Email</span>
                  <span className="text-stone-900">{booking.customer_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Phone</span>
                  <span className="text-stone-900">{booking.customer_phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Nationality</span>
                  <span className="text-stone-900">{booking.customer_nationality}</span>
                </div>
              </div>
            </div>

            {booking.special_requests && (
              <div className="mt-4">
                <h3 className="text-sm font-bold text-stone-900 mb-1">Special Requests</h3>
                <p className="text-sm text-stone-600 bg-amber-50 p-3 rounded-xl">{booking.special_requests}</p>
              </div>
            )}

            {/* Meeting Point */}
            {tour.meeting_point && (
              <div className="mt-4 p-4 bg-emerald-50 rounded-xl">
                <p className="text-xs text-emerald-700 font-semibold mb-1">📍 Meeting Point</p>
                <p className="text-sm text-emerald-900">{tour.meeting_point}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-stone-50 border-t border-stone-200 text-center">
            <p className="text-xs text-stone-400">
              Booked on {new Date(booking.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Booking ID: {booking.id.slice(0, 8)}
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-sm text-emerald-800 hover:text-emerald-900 font-medium">
            ← Browse More Experiences
          </a>
        </div>
      </div>
    </div>
  );
}
