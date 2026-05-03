import { getBookingByVoucher } from '@/lib/db';
import { mockBookings } from '@/lib/mock-data';
import { Booking } from '@/lib/types';
import VoucherClient from '@/components/booking/VoucherClient';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return mockBookings.map(b => ({ code: b.voucher_code }));
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: `Voucher — Wijhat` };
}

export default async function VoucherPage({ params }: { params: { code: string } }) {
  let booking: Booking | null = null;

  try {
    booking = await getBookingByVoucher(params.code);
  } catch {
    notFound();
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">Voucher Not Found</h1>
          <p className="text-stone-500">Please check the voucher code and try again.</p>
        </div>
      </div>
    );
  }

  return <VoucherClient booking={booking} />;
}
