'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Tour, TourSlot, CATEGORIES, SUSTAINABILITY_TAGS,
  formatPrice, formatDuration, formatDate, formatTime, DIFFICULTY
} from '@/lib/types';

interface TourDetailClientProps {
  tour: Tour;
  slots: TourSlot[];
}

export default function TourDetailClient({ tour, slots }: TourDetailClientProps) {
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [guests, setGuests] = useState(1);

  const totalPrice = tour.price_sar * guests;

  const handleReserve = () => {
    if (!selectedSlot) return;
    const params = new URLSearchParams({
      tour: tour.id,
      slot: selectedSlot,
      guests: guests.toString(),
    });
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Back nav */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center">
          <Link href="/" className="flex items-center text-stone-600 hover:text-stone-900 text-sm font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Experiences
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="rounded-2xl overflow-hidden">
              <div className="relative h-64 sm:h-96 bg-stone-200">
                <img
                  src={tour.images[currentImage] || tour.images[0] || 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=500&fit=crop'}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
                {tour.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {tour.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          i === currentImage ? 'bg-white scale-125' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              {tour.images.length > 1 && (
                <div className="flex gap-2 p-2 bg-white">
                  {tour.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`flex-1 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        i === currentImage ? 'border-emerald-600' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Meta */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                  {CATEGORIES[tour.category]}
                </span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  tour.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  tour.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {DIFFICULTY[tour.difficulty]?.label}
                </span>
                {tour.sustainability_tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                    {SUSTAINABILITY_TAGS[tag]?.icon} {SUSTAINABILITY_TAGS[tag]?.label}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl font-bold text-stone-900">{tour.title}</h1>
              <p className="text-lg text-stone-500 mt-1">{tour.subtitle}</p>

              <div className="flex flex-wrap gap-6 mt-4 text-sm text-stone-600">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDuration(tour.duration_minutes)}
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Up to {tour.max_capacity} guests
                </span>
                {tour.meeting_point && (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {tour.meeting_point}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 border border-stone-100">
              <h2 className="text-xl font-bold text-stone-900 mb-3">About This Experience</h2>
              <p className="text-stone-600 leading-relaxed whitespace-pre-line">{tour.description}</p>
            </div>

            {/* Highlights */}
            {tour.highlights.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-stone-100">
                <h2 className="text-xl font-bold text-stone-900 mb-3">Highlights</h2>
                <ul className="space-y-2">
                  {tour.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-stone-600">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-stone-100">
                <h2 className="text-lg font-bold text-stone-900 mb-3">What&apos;s Included</h2>
                <ul className="space-y-2">
                  {tour.inclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                      <svg className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-stone-100">
                <h2 className="text-lg font-bold text-stone-900 mb-3">Not Included</h2>
                <ul className="space-y-2">
                  {tour.exclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-stone-500">
                      <svg className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-16 space-y-4">
              {/* Price Card */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-3xl font-bold text-stone-900">{formatPrice(tour.price_sar)}</span>
                  <span className="text-sm text-stone-500">per person</span>
                </div>

                {/* Guest count */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-stone-700 mb-1">Number of Guests</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-10 h-10 rounded-lg border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-50"
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">{guests}</span>
                    <button
                      onClick={() => setGuests(Math.min(tour.max_capacity, guests + 1))}
                      className="w-10 h-10 rounded-lg border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Slot Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-stone-700 mb-2">Select Date & Time</label>
                  {slots.length === 0 ? (
                    <p className="text-sm text-stone-500 py-3 text-center">No available slots</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {slots.map(slot => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot.id)}
                          disabled={slot.available_seats < guests}
                          className={`w-full text-left p-3 rounded-xl border transition-all ${
                            selectedSlot === slot.id
                              ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-200'
                              : slot.available_seats < guests
                              ? 'border-stone-100 bg-stone-50 opacity-50 cursor-not-allowed'
                              : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-stone-900 text-sm">
                                {formatDate(slot.date)}
                              </p>
                              <p className="text-stone-500 text-xs mt-0.5">
                                {formatTime(slot.start_time)} — {formatTime(slot.end_time)}
                              </p>
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              slot.available_seats <= 3
                                ? 'bg-red-100 text-red-700'
                                : 'bg-stone-100 text-stone-600'
                            }`}>
                              {slot.available_seats} left
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Total & CTA */}
                <div className="border-t border-stone-200 pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600">Total</span>
                    <span className="text-2xl font-bold text-stone-900">{formatPrice(totalPrice)}</span>
                  </div>
                  <button
                    onClick={handleReserve}
                    disabled={!selectedSlot || slots.length === 0}
                    className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
                  >
                    Reserve Now
                  </button>
                  <p className="text-xs text-stone-400 text-center">
                    No payment required now · Pay on arrival or via admin
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''}?text=Hi, I'm interested in: ${encodeURIComponent(tour.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Ask a Question
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
