import { mockTours } from '@/lib/mock-data';
import EditTourClient from '@/components/admin/EditTourClient';

export function generateStaticParams() {
  return mockTours.map(tour => ({ id: tour.id }));
}

export default function EditTourPage() {
  return <EditTourClient />;
}
