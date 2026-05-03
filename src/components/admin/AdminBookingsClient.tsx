'use client';

import { useState } from 'react';
import { updateBookingStatus, checkInBooking } from '@/lib/db';
import { Booking, formatPrice, formatDate, formatTime } from '@/lib/types';

interface AdminBookingsClientProps {
  bookings: Booking[];
}

export default function AdminBookingsClient({ bookings }: AdminBookingsClientProps) {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = bookings.filter(b => {
    const matchesFilter = filter === 'all' || b.payment_status === filter;
    const matchesSearch = search === '' ||
      b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      b.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      b.voucher_code.toLowerCase().includes(search.toLowerCase()) ||
      (b.tour?.title || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-stone-100 text-stone-600',
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.payment_status === 'pending').length,
    paid: bookings.filter(b => b.payment_status === 'paid').length,
    revenue: bookings.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + Number(b.total_price), 0),
  };

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      await updateBookingStatus(bookingId, status as 'pending' | 'paid' | 'failed' | 'refunded');
      window.location.reload();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleCheckIn = async (bookingId: string) => {
    try {
      await checkInBooking(bookingId);
      window.location.reload();
    } catch (err) {
      console.error('Failed to check in:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <p className="text-xs text-stone-500 uppercase tracking-wide">Total Bookings</p>
          <p className="text-2xl font-bold text-stone-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <p className="text-xs text-stone-500 uppercase tracking-wide">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <p className="text-xs text-stone-500 uppercase tracking-wide">Paid</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.paid}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <p className="text-xs text-stone-500 uppercase tracking-wide">Revenue</p>
          <p className="text-2xl font-bold text-stone-900 mt-1">{formatPrice(stats.revenue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, voucher, or tour..."
          className="flex-1 px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900 text-sm"
        />
        <div className="flex gap-2">
          {['all', 'pending', 'paid', 'failed', 'refunded'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                filter === status
                  ? 'bg-emerald-800 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-stone-500">
          No bookings found.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(booking => (
            <div key={booking.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                className="w-full text-left p-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <p className="font-mono font-bold text-emerald-800 text-sm">{booking.voucher_code}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-stone-900 text-sm truncate">{booking.customer_name}</p>
                    <p className="text-xs text-stone-500 truncate">
                      {booking.tour?.title || 'Unknown tour'} · {booking.num_guests} guest{booking.num_guests > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[booking.payment_status]}`}>
                    {booking.payment_status}
                  </span>
                  <span className="text-sm font-bold text-stone-900">{formatPrice(booking.total_price)}</span>
                  {booking.checked_in && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded-full font-bold">✓ IN</span>
                  )}
                  <svg className={`w-4 h-4 text-stone-400 transition-transform ${expandedId === booking.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {expandedId === booking.id && (
                <div className="border-t border-stone-200 p-4 bg-stone-50 animate-fade-in">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-xs text-stone-500">Email</p>
                      <p className="text-stone-900">{booking.customer_email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Phone</p>
                      <p className="text-stone-900">{booking.customer_phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Nationality</p>
                      <p className="text-stone-900">{booking.customer_nationality}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Date & Time</p>
                      <p className="text-stone-900">
                        {booking.slot ? `${formatDate(booking.slot.date)}, ${formatTime(booking.slot.start_time)}` : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {booking.special_requests && (
                    <div className="mb-4">
                      <p className="text-xs text-stone-500">Special Requests</p>
                      <p className="text-stone-700 text-sm bg-amber-50 p-2 rounded-lg mt-1">{booking.special_requests}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {booking.payment_status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'paid')}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Mark as Paid
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'failed')}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Mark as Failed
                        </button>
                      </>
                    )}
                    {booking.payment_status === 'paid' && !booking.checked_in && (
                      <button
                        onClick={() => handleCheckIn(booking.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Check In
                      </button>
                    )}
                    {booking.payment_status === 'paid' && (
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'refunded')}
                        className="px-4 py-2 bg-stone-600 hover:bg-stone-700 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Refund
                      </button>
                    )}
                    <a
                      href={`/voucher/${booking.voucher_code}`}
                      target="_blank"
                      className="px-4 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      View Voucher
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
