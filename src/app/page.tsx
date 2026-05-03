import { getEvent, getToursByEvent } from '@/lib/db';
import { Event, Tour } from '@/lib/types';
import TourGrid from '@/components/tour/TourGrid';
import HeroSection from '@/components/layout/HeroSection';
import CategoryFilter from '@/components/tour/CategoryFilter';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wijhat — Experiences',
  description: 'Curated tours and experiences for LEAP 2026 attendees.',
};

export default async function HomePage() {
  const eventSlug = process.env.NEXT_PUBLIC_EVENT_SLUG || 'leap-2026';
  let event: Event | null = null;
  let tours: Tour[] = [];

  try {
    event = await getEvent(eventSlug);
    tours = event ? await getToursByEvent(event.id) : [];
  } catch {
    event = null;
    tours = [];
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-2">Event Not Found</h1>
          <p className="text-stone-500">Configure NEXT_PUBLIC_EVENT_SLUG in .env.local</p>
        </div>
      </div>
    );
  }

  const categories = Array.from(new Set(tours.map(t => t.category)));

  return (
    <main>
      <HeroSection event={event} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-stone-900">Curated Experiences</h2>
            <p className="text-stone-500 mt-1">
              {tours.length} experiences available · {event.start_date} — {event.end_date}
            </p>
          </div>
        </div>
        <CategoryFilter categories={categories} />
        <TourGrid tours={tours} />
      </div>
    </main>
  );
}
