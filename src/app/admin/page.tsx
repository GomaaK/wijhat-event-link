'use client';

import { useEffect } from 'react';

export default function AdminPage() {
  useEffect(() => {
    window.location.href = '/admin/bookings';
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700" />
    </div>
  );
}
