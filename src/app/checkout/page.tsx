'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getTour, getSlot } from '@/lib/db';
import { formatPrice, formatDuration, formatDate, formatTime } from '@/lib/types';
import { Tour, TourSlot } from '@/lib/types';
import CheckoutForm from '@/components/booking/CheckoutForm';
import Link from 'next/link';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const tourId = searchParams.get('tour');
  const slotId = searchParams.get('slot');
  const guests = parseInt(searchParams.get('guests') || '1', 10);

  const [tour, setTour] = useState<Tour | null>(null);
  const [slot, setSlot] = useState<TourSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!tourId || !slotId) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const [t, s] = await Promise.all([getTour(tourId), getSlot(slotId)]);
        if (!t || !s) {
          setNotFound(true);
        } else {
          setTour(t);
          setSlot(s);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tourId, slotId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-2">Invalid Checkout</h1>
          <p className="text-stone-500">Tour or slot not found.</p>
          <Link href="/" className="text-emerald-700 hover:text-emerald-800 mt-4 inline-block">← Back to tours</Link>
        </div>
      </div>
    );
  }

  const total = tour!.price_sar * guests;

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="bg-white border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <a href={`/tours/${tour!.id}`} className="text-sm text-stone-600 hover:text-stone-900 font-medium">
            ← Back to {tour!.title}
          </a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-stone-900 mb-6">Complete Your Reservation</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <CheckoutForm tour={tour!} slot={slot!} guests={guests} total={total} />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 sticky top-16">
              <h2 className="font-bold text-stone-900 mb-4">Booking Summary</h2>

              <div className="flex gap-3 mb-4">
                <img
                  src={tour!.images[0] || 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=500&fit=crop'}
                  alt={tour!.title}
                  className="w-20 h-16 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold text-stone-900 text-sm">{tour!.title}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{formatDuration(tour!.duration_minutes)}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Date</span>
                  <span className="text-stone-900 font-medium">{formatDate(slot!.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Time</span>
                  <span className="text-stone-900 font-medium">
                    {formatTime(slot!.start_time)} — {formatTime(slot!.end_time)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Guests</span>
                  <span className="text-stone-900 font-medium">{guests} × {formatPrice(tour!.price_sar)}</span>
                </div>
                <div className="border-t border-stone-200 pt-2 flex justify-between">
                  <span className="font-semibold text-stone-900">Total</span>
                  <span className="font-bold text-stone-900 text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-amber-50 rounded-xl text-xs text-amber-800">
                <p className="font-medium mb-1">💡 Reservation Mode</p>
                <p>No payment is required now. Your spot will be held and you can pay later via the admin team or on arrival.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
