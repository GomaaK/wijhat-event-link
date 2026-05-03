'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { store } from '@/lib/mock-data';

const CATEGORIES = ['cultural', 'heritage', 'adventure', 'culinary', 'sustainability', 'business'];
const SUSTAINABILITY_OPTIONS = ['eco-transport', 'local-community', 'carbon-neutral'];
const DIFFICULTIES = ['easy', 'moderate', 'challenging'];

export default function EditTourClient() {
  const router = useRouter();
  const params = useParams();
  const tourId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    highlights: '',
    duration_minutes: 120,
    max_capacity: 20,
    price_sar: 0,
    category: 'cultural',
    sustainability_tags: [] as string[],
    images: '',
    inclusions: '',
    exclusions: '',
    meeting_point: '',
    difficulty: 'easy',
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    loadTour();
  }, [tourId]);

  const loadTour = () => {
    const tour = store.tours.find(t => t.id === tourId);
    if (!tour) {
      setError('Tour not found');
      setLoading(false);
      return;
    }

    setForm({
      title: tour.title,
      subtitle: tour.subtitle || '',
      description: tour.description,
      highlights: (tour.highlights || []).join('\n'),
      duration_minutes: tour.duration_minutes,
      max_capacity: tour.max_capacity,
      price_sar: Number(tour.price_sar),
      category: tour.category,
      sustainability_tags: tour.sustainability_tags || [],
      images: (tour.images || []).join('\n'),
      inclusions: (tour.inclusions || []).join('\n'),
      exclusions: (tour.exclusions || []).join('\n'),
      meeting_point: tour.meeting_point || '',
      difficulty: tour.difficulty,
      sort_order: tour.sort_order,
      is_active: tour.is_active,
    });
    setLoading(false);
  };

  const update = (field: string, value: string | number | string[] | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      sustainability_tags: prev.sustainability_tags.includes(tag)
        ? prev.sustainability_tags.filter(t => t !== tag)
        : [...prev.sustainability_tags, tag],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const tour = store.tours.find(t => t.id === tourId);
      if (!tour) throw new Error('Tour not found');

      tour.title = form.title;
      tour.subtitle = form.subtitle;
      tour.description = form.description;
      tour.highlights = form.highlights.split('\n').filter(Boolean);
      tour.duration_minutes = form.duration_minutes;
      tour.max_capacity = form.max_capacity;
      tour.price_sar = form.price_sar;
      tour.category = form.category;
      tour.sustainability_tags = form.sustainability_tags;
      tour.images = form.images.split('\n').filter(Boolean);
      tour.inclusions = form.inclusions.split('\n').filter(Boolean);
      tour.exclusions = form.exclusions.split('\n').filter(Boolean);
      tour.meeting_point = form.meeting_point;
      tour.difficulty = form.difficulty as 'easy' | 'moderate' | 'challenging';
      tour.sort_order = form.sort_order;
      tour.is_active = form.is_active;

      setSuccess(true);
      setTimeout(() => router.push('/admin/tours'), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this tour? This cannot be undone.')) return;

    const idx = store.tours.findIndex(t => t.id === tourId);
    if (idx !== -1) {
      store.tours.splice(idx, 1);
      router.push('/admin/tours');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-stone-900">Tour Updated!</h2>
        <p className="text-stone-500 mt-2">Redirecting to tours...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Edit Tour</h1>
        <p className="text-sm text-stone-500 mt-1">{form.title}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-stone-200 space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">Title *</label>
            <input type="text" value={form.title} onChange={e => update('title', e.target.value)} required
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">Subtitle</label>
            <input type="text" value={form.subtitle} onChange={e => update('subtitle', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">Description *</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} required rows={4}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900 resize-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">Highlights (one per line)</label>
            <textarea value={form.highlights} onChange={e => update('highlights', e.target.value)} rows={3}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Duration (minutes)</label>
            <input type="number" value={form.duration_minutes} onChange={e => update('duration_minutes', parseInt(e.target.value) || 0)} min={15}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Max Capacity</label>
            <input type="number" value={form.max_capacity} onChange={e => update('max_capacity', parseInt(e.target.value) || 0)} min={1}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Price (SAR) *</label>
            <input type="number" value={form.price_sar} onChange={e => update('price_sar', parseFloat(e.target.value) || 0)} required min={0} step={0.01}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
            <select value={form.category} onChange={e => update('category', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900 bg-white">
              {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Difficulty</label>
            <select value={form.difficulty} onChange={e => update('difficulty', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900 bg-white">
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Sort Order</label>
            <input type="number" value={form.sort_order} onChange={e => update('sort_order', parseInt(e.target.value) || 0)} min={0}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-2">Sustainability Tags</label>
            <div className="flex flex-wrap gap-2">
              {SUSTAINABILITY_OPTIONS.map(tag => (
                <button key={tag} type="button" onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    form.sustainability_tags.includes(tag)
                      ? 'bg-emerald-800 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">Image URLs (one per line)</label>
            <textarea value={form.images} onChange={e => update('images', e.target.value)} rows={2}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900 resize-none font-mono text-xs" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">Inclusions (one per line)</label>
            <textarea value={form.inclusions} onChange={e => update('inclusions', e.target.value)} rows={3}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900 resize-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">Exclusions (one per line)</label>
            <textarea value={form.exclusions} onChange={e => update('exclusions', e.target.value)} rows={2}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900 resize-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">Meeting Point</label>
            <input type="text" value={form.meeting_point} onChange={e => update('meeting_point', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-200">
          <button type="button" onClick={() => router.push('/admin/tours')}
            className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleDelete}
            className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-xl transition-colors border border-red-200">
            Delete Tour
          </button>
          <div className="flex-1" />
          <button type="submit" disabled={saving}
            className="flex-1 sm:flex-none px-8 py-3 bg-emerald-800 hover:bg-emerald-900 disabled:bg-emerald-400 text-white font-semibold rounded-xl transition-colors">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
