'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tour, CATEGORIES, SUSTAINABILITY_TAGS, formatPrice, formatDuration, DIFFICULTY } from '@/lib/types';

interface TourGridProps {
  tours: Tour[];
}

export default function TourGrid({ tours }: TourGridProps) {
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const handler = (e: Event) => {
      setFilter((e as CustomEvent).detail);
    };
    window.addEventListener('filter-category', handler);
    return () => window.removeEventListener('filter-category', handler);
  }, []);

  const filtered = filter === 'all' ? tours : tours.filter(t => t.category === filter);

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-stone-500 text-lg">No experiences found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((tour, i) => (
        <Link
          key={tour.id}
          href={`/tours/${tour.id}`}
          className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 animate-fade-in"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={tour.images[0] || 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=500&fit=crop'}
              alt={tour.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="px-2.5 py-1 bg-emerald-800 text-white text-xs font-semibold rounded-full">
                {CATEGORIES[tour.category] || tour.category}
              </span>
              {tour.difficulty !== 'easy' && (
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                  DIFFICULTY[tour.difficulty]?.color === 'yellow' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {DIFFICULTY[tour.difficulty]?.label}
                </span>
              )}
            </div>
            <div className="absolute bottom-3 right-3">
              <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-emerald-900 font-bold rounded-lg text-sm">
                {formatPrice(tour.price_sar)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
              {tour.title}
            </h3>
            <p className="text-sm text-stone-500 mt-1 line-clamp-2">{tour.subtitle}</p>

            {/* Meta */}
            <div className="flex items-center gap-4 mt-3 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatDuration(tour.duration_minutes)}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Max {tour.max_capacity}
              </span>
            </div>

            {/* Sustainability tags */}
            {tour.sustainability_tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {tour.sustainability_tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full flex items-center gap-1"
                  >
                    <span>{SUSTAINABILITY_TAGS[tag]?.icon}</span>
                    {SUSTAINABILITY_TAGS[tag]?.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
