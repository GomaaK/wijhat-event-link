'use client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const handleSignOut = () => {
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/admin-login';
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/admin/bookings" className="font-bold text-stone-900">Wijhat Admin</a>
            <div className="hidden sm:flex gap-4 text-sm">
              <a href="/admin/bookings" className="text-stone-600 hover:text-stone-900 font-medium">
                Bookings
              </a>
              <a href="/admin/tours/new" className="text-stone-600 hover:text-stone-900 font-medium">
                Add Tour
              </a>
              <a href="/" className="text-stone-400 hover:text-stone-600 font-medium">
                View Site →
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-stone-500 hidden sm:inline">admin@wijhat.com</span>
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 text-sm bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}
