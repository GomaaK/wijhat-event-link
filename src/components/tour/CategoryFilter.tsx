'use client';

import { useState } from 'react';
import { CATEGORIES } from '@/lib/types';

interface CategoryFilterProps {
  categories: string[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const [active, setActive] = useState('all');

  return (
    <div className="flex flex-wrap gap-2 mb-8" id="experiences">
      <button
        onClick={() => {
          setActive('all');
          // Dispatch custom event for TourGrid to listen to
          window.dispatchEvent(new CustomEvent('filter-category', { detail: 'all' }));
        }}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          active === 'all'
            ? 'bg-emerald-800 text-white shadow-md'
            : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
        }`}
      >
        All Experiences
      </button>
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => {
            setActive(cat);
            window.dispatchEvent(new CustomEvent('filter-category', { detail: cat }));
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            active === cat
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          {CATEGORIES[cat] || cat}
        </button>
      ))}
    </div>
  );
}
