'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { store } from '@/lib/mock-data';
import { Tour, TourSlot } from '@/lib/types';

export default function SlotManagementClient() {
  const params = useParams();
  const tourId = params.id as string;

  const [tour, setTour] = useState<Tour | null>(null);
  const [slots, setSlots] = useState<TourSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSlot, setNewSlot] = useState({
    date: '',
    start_time: '',
    end_time: '',
    available_seats: 20,
  });

  useEffect(() => {
    loadData();
  }, [tourId]);

  const loadData = () => {
    const t = store.tours.find(x => x.id === tourId);
    const s = store.slots.filter(x => x.tour_id === tourId)
      .sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time));

    if (t) setTour(t);
    else setError('Tour not found');

    setSlots(s);
    setLoading(false);
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlot.date || !newSlot.start_time || !newSlot.end_time) return;

    setSaving(true);
    setError('');

    const slot: TourSlot = {
      id: `slot-${Date.now()}`,
      tour_id: tourId,
      date: newSlot.date,
      start_time: newSlot.start_time,
      end_time: newSlot.end_time,
      available_seats: newSlot.available_seats,
      is_open: true,
      created_at: new Date().toISOString(),
    };

    store.slots.push(slot);
    setNewSlot({ date: '', start_time: '', end_time: '', available_seats: 20 });
    setShowAddForm(false);
    setSuccess('Slot added successfully!');
    setTimeout(() => setSuccess(''), 3000);
    setSlots(store.slots.filter(x => x.tour_id === tourId)
      .sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time)));
    setSaving(false);
  };

  const handleToggleSlot = async (slot: TourSlot) => {
    const s = store.slots.find(x => x.id === slot.id);
    if (s) {
      s.is_open = !s.is_open;
      setSlots(store.slots.filter(x => x.tour_id === tourId)
        .sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time)));
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm('Delete this slot?')) return;
    const idx = store.slots.findIndex(s => s.id === slotId);
    if (idx !== -1) {
      store.slots.splice(idx, 1);
      setSlots(store.slots.filter(x => x.tour_id === tourId)
        .sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time)));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700" />
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-stone-500 mb-4">
        <Link href="/admin/tours" className="hover:text-emerald-700">Tours</Link>
        <span>/</span>
        <span className="text-stone-900 font-medium">{tour?.title || 'Loading...'}</span>
        <span>/</span>
        <span className="text-stone-900 font-medium">Slots</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Time Slots</h1>
          <p className="text-sm text-stone-500 mt-1">{slots.length} slots configured</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Slot
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-4">{error}</div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm mb-4">{success}</div>
      )}

      {/* Add Slot Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6">
          <h3 className="font-semibold text-stone-900 mb-4">New Time Slot</h3>
          <form onSubmit={handleAddSlot} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Date *</label>
              <input
                type="date"
                value={newSlot.date}
                onChange={e => setNewSlot(prev => ({ ...prev, date: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Start Time *</label>
              <input
                type="time"
                value={newSlot.start_time}
                onChange={e => setNewSlot(prev => ({ ...prev, start_time: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">End Time *</label>
              <input
                type="time"
                value={newSlot.end_time}
                onChange={e => setNewSlot(prev => ({ ...prev, end_time: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Available Seats</label>
              <input
                type="number"
                value={newSlot.available_seats}
                onChange={e => setNewSlot(prev => ({ ...prev, available_seats: parseInt(e.target.value) || 20 }))}
                min={1}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900 text-sm"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:bg-emerald-400 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                {saving ? 'Adding...' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Slots Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {slots.length === 0 ? (
          <div className="p-8 text-center text-stone-500 text-sm">
            No time slots configured yet. Add your first slot above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Time</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Seats</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {slots.map(slot => (
                  <tr key={slot.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-stone-900">
                      {formatDate(slot.date)}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {formatTime(slot.start_time)} — {formatTime(slot.end_time)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${slot.available_seats <= 5 ? 'text-red-600' : 'text-stone-900'}`}>
                        {slot.available_seats}
                      </span>
                      <span className="text-stone-400 text-xs ml-1">seats</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleSlot(slot)}
                        className={`px-2 py-0.5 rounded-full text-xs font-bold transition-colors ${
                          slot.is_open
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        {slot.is_open ? 'Open' : 'Closed'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Slot"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tour info */}
      {tour && (
        <div className="mt-6 flex items-center gap-4">
          <Link
            href={`/admin/tours/${tourId}/edit`}
            className="text-sm text-emerald-700 hover:text-emerald-800 font-medium"
          >
            ← Edit Tour Details
          </Link>
          <span className="text-stone-300">|</span>
          <Link
            href={`/tours/${tourId}`}
            target="_blank"
            className="text-sm text-stone-500 hover:text-stone-700"
          >
            View on site →
          </Link>
        </div>
      )}
    </div>
  );
}
