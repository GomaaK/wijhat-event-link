import { mockTours } from '@/lib/mock-data';
import SlotManagementClient from '@/components/admin/SlotManagementClient';

export function generateStaticParams() {
  return mockTours.map(tour => ({ id: tour.id }));
}

export default function SlotManagementPage() {
  return <SlotManagementClient />;
}
