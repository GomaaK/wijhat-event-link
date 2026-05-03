'use client';

import { useState, useEffect } from 'react';
import { getAnalytics } from '@/lib/db';
import { formatPrice } from '@/lib/types';

interface Analytics {
  totalBookings: number;
  totalRevenue: number;
  avgBookingValue: number;
  topTours: { tour_id: string; title: string; bookings: number; revenue: number }[];
  bookingsByNationality: { nationality: string; count: number }[];
  bookingsByDay: { date: string; count: number; revenue: number }[];
  activeTours: number;
  upcomingSlots: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const analytics = await getAnalytics();
        setData(analytics);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-12 text-stone-500">Failed to load analytics.</div>;
  }

  const maxDayCount = Math.max(...data.bookingsByDay.map(d => d.count), 1);

  const dayLabels = data.bookingsByDay.map(d => {
    const date = new Date(d.date + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Analytics</h1>
        <p className="text-sm text-stone-500 mt-1">Performance overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <p className="text-xs text-stone-500 uppercase tracking-wide">Total Bookings</p>
          <p className="text-3xl font-bold text-stone-900 mt-2">{data.totalBookings}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <p className="text-xs text-stone-500 uppercase tracking-wide">Total Revenue</p>
          <p className="text-3xl font-bold text-green-700 mt-2">{formatPrice(data.totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <p className="text-xs text-stone-500 uppercase tracking-wide">Avg. Booking Value</p>
          <p className="text-3xl font-bold text-stone-900 mt-2">{formatPrice(data.avgBookingValue)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <p className="text-xs text-stone-500 uppercase tracking-wide">Conversion Rate</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">
            {data.totalBookings > 0
              ? `${Math.round((data.totalBookings / (data.totalBookings + 5)) * 100)}%`
              : '0%'}
            <span className="text-xs font-normal text-stone-400 block">placeholder</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings by Day — Bar Chart */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h2 className="text-lg font-semibold text-stone-900 mb-6">Bookings (Last 7 Days)</h2>
          <div className="flex items-end gap-2 h-48">
            {data.bookingsByDay.map((day, i) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-stone-700">{day.count}</span>
                <div
                  className="w-full bg-emerald-500 rounded-t-md transition-all min-h-[4px]"
                  style={{ height: `${(day.count / maxDayCount) * 140}px` }}
                />
                <span className="text-[10px] text-stone-400 text-center leading-tight">{dayLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Tours */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h2 className="text-lg font-semibold text-stone-900 mb-4">Top Tours</h2>
          {data.topTours.length === 0 ? (
            <p className="text-sm text-stone-500 text-center py-8">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {data.topTours.map((tour, i) => (
                <div key={tour.tour_id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-900 text-sm truncate">{tour.title}</p>
                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span>{tour.bookings} booking{tour.bookings !== 1 ? 's' : ''}</span>
                      <span>·</span>
                      <span>{formatPrice(tour.revenue)}</span>
                    </div>
                  </div>
                  <div className="w-24 bg-stone-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${data.topTours[0]?.bookings ? (tour.bookings / data.topTours[0].bookings) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookings by Nationality */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold text-stone-900 mb-4">Bookings by Nationality</h2>
          {data.bookingsByNationality.length === 0 ? (
            <p className="text-sm text-stone-500 text-center py-8">No data available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="text-left px-4 py-2 text-xs font-semibold text-stone-500 uppercase">#</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-stone-500 uppercase">Nationality</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-stone-500 uppercase">Bookings</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-stone-500 uppercase">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {data.bookingsByNationality.map((nat, i) => (
                    <tr key={nat.nationality} className="hover:bg-stone-50/50">
                      <td className="px-4 py-2.5 text-stone-400">{i + 1}</td>
                      <td className="px-4 py-2.5 font-medium text-stone-900">{nat.nationality}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-stone-900">{nat.count}</td>
                      <td className="px-4 py-2.5 text-right text-stone-500">
                        {((nat.count / data.totalBookings) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
