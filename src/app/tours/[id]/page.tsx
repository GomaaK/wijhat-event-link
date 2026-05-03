import { getTourWithSlots, getSlotsForTour } from '@/lib/db';
import { mockTours } from '@/lib/mock-data';
import { Tour } from '@/lib/types';
import TourDetailClient from '@/components/tour/TourDetailClient';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return mockTours.map(tour => ({ id: tour.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const tour = await getTourWithSlots(params.id);
    if (!tour) return { title: 'Tour Not Found' };
    return {
      title: `${tour.title} — Wijhat`,
      description: tour.subtitle || tour.description.slice(0, 160),
    };
  } catch {
    return { title: 'Tour Not Found' };
  }
}

export default async function TourDetailPage({ params }: { params: { id: string } }) {
  let tour: Tour | null = null;
  let slots = [];

  try {
    tour = await getTourWithSlots(params.id);
    slots = await getSlotsForTour(params.id);
  } catch {
    notFound();
  }

  if (!tour) notFound();

  const openSlots = slots.length > 0 ? slots : (tour.slots?.filter(s => s.is_open) || []);

  return <TourDetailClient tour={tour} slots={openSlots} />;
}
