'use client'

import { useState } from 'react';

export default function ShopFilters({ filters, setFilters }) {
  const handleCheckbox = (group, value) => {
    setFilters(prev => {
      const values = new Set(prev[group]);
      values.has(value) ? values.delete(value) : values.add(value);
      return { ...prev, [group]: Array.from(values) };
    });
  };

  return (
    <aside className="lg:w-1/4 p-4 bg-base-100 rounded-xl shadow-sm self-start">
      <h3 className="text-lg font-semibold text-neutral mb-4 pb-2 border-b border-base-300">
        Filter By
      </h3>

      {/* Paint Type */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-neutral mb-2">Paint Type</h4>
        <div className="flex flex-col gap-1.5">
          {['Interior', 'Exterior', 'Specialty', 'Primer'].map(type => (
            <label key={type} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.type.includes(type)}
                onChange={() => handleCheckbox('type', type)}
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-neutral mb-2">Brand</h4>
        <div className="flex flex-col gap-1.5">
          {['Behr', 'Sherwin-Williams', 'Valspar', 'Benjamin Moore'].map(brand => (
            <label key={brand} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.brand.includes(brand)}
                onChange={() => handleCheckbox('brand', brand)}
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Finish */}
      <div>
        <h4 className="text-sm font-semibold text-neutral mb-2">Finish</h4>
        <div className="flex flex-col gap-1.5">
          {['Matte', 'Eggshell', 'Satin', 'Semi-Gloss'].map(finish => (
            <label key={finish} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.finish.includes(finish)}
                onChange={() => handleCheckbox('finish', finish)}
              />
              {finish}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
