"use client";

import { useState } from 'react';

const services = [
  {
    id: 'boys',
    title: 'Heavy duty (ovens & fridges)',
    desc: 'Boys crews specialize in deep kitchens and appliances.',
    price: '₪85 / hour per worker',
    filter: 'boys',
    icon: (
      <svg viewBox="0 0 64 64" className="h-10 w-10" fill="none">
        <rect x="8" y="12" width="48" height="40" rx="6" fill="#fefefe" stroke="#94b8ff" strokeWidth="2" />
        <rect x="16" y="20" width="32" height="24" rx="3" fill="#dbe8ff" />
        <line x1="16" y1="28" x2="48" y2="28" stroke="#94b8ff" strokeWidth="1.5" />
        <circle cx="32" cy="36" r="3.5" fill="#94b8ff" />
      </svg>
    )
  },
  {
    id: 'girls',
    title: 'Laundry & toy refresh',
    desc: 'Girls crews handle folded laundry, bookshelves, and toys with care.',
    price: '₪80 / hour per worker',
    filter: 'girls',
    icon: (
      <svg viewBox="0 0 64 64" className="h-10 w-10" fill="none">
        <rect x="12" y="16" width="14" height="32" rx="3" fill="#fefefe" stroke="#ffbda3" strokeWidth="2" />
        <rect x="28" y="16" width="14" height="32" rx="3" fill="#ffe1d7" stroke="#ffbda3" strokeWidth="2" />
        <rect x="44" y="16" width="8" height="32" rx="3" fill="#ffd1c9" stroke="#ffbda3" strokeWidth="2" />
        <path d="M18 22h10M18 30h10M18 38h10" stroke="#ff8a6a" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    id: 'general',
    title: 'General cleaning',
    desc: 'Every crew refreshes surfaces, floors, and shared spaces—boys & girls.',
    price: 'Boys & girls (85 / 80 per hour respectively)',
    filter: 'all',
    icon: (
      <svg viewBox="0 0 64 64" className="h-10 w-10" fill="none">
        <path d="M18 44h28v4H18z" fill="#e5f2ff" stroke="#4d7dff" strokeWidth="2" />
        <circle cx="26" cy="30" r="6" fill="#fefefe" stroke="#4d7dff" strokeWidth="2" />
        <path d="M36 22c6 0 10 4 10 10s-4 10-10 10" stroke="#4d7dff" strokeWidth="2" />
        <path d="M22 20l-4-8m0 0-4 8" stroke="#4d7dff" strokeWidth="2" />
      </svg>
    )
  }
];

export default function ServiceOptions() {
  const [active, setActive] = useState(services[0].id);
  const current = services.find((service) => service.id === active) ?? services[0];

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        {services.map((service) => (
          <button
            key={service.id}
            type="button"
            onClick={() => setActive(service.id)}
            className={`flex flex-col items-center gap-3 rounded-[24px] border p-4 transition ${active === service.id ? 'border-slate-900 bg-slate-50 shadow-lg' : 'border-slate-200 bg-white'}`}
          >
            <span className="text-slate-500">{service.icon}</span>
            <p className="text-center text-base font-semibold text-slate-900">{service.title}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Price</p>
            <p className="text-sm text-slate-600">{service.price}</p>
          </button>
        ))}
      </div>
      <div
        id={`service-${current.id}`}
        className="rounded-[26px] border border-slate-200 bg-white/90 p-6 shadow-sm"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">{current.title}</p>
            <p className="text-sm text-slate-600">{current.desc}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`/book?filter=${current.filter}`}
              className="rounded-full border border-[#0047ba] px-5 py-2 text-sm font-semibold text-[#0047ba] transition hover:bg-[#0047ba] hover:text-white"
            >
              Book now
            </a>
            <span className="text-xs uppercase tracking-[0.4em] text-slate-400">
              Filter: {current.filter.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
