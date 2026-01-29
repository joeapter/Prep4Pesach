"use client";

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

const services = [
  {
    id: 'boys',
    title: 'Heavy duty kitchens',
    price: '₪85 / hour · boys crew',
    description:
      'Dig into ovens, fridges, and cabinets with industrial-grade cleaners. Boys crews bring the strength for stubborn grease.',
    filter: 'boys',
    icon: '/oven-icon.png'
  },
  {
    id: 'girls',
    title: 'Laundry, books & toys',
    price: '₪80 / hour · girls crew',
    description:
      'Bookshelves, folded laundry, and toy organization handled with gentle detail so everything feels calm.',
    filter: 'girls',
    icon: '/books-icon.png'
  },
  {
    id: 'general',
    title: 'General refresh',
    price: 'Boys + girls as usual',
    description:
      'Full home refresh with sweeping, dusting, and polishing—mixed crews let you see each price reflected in the schedule.',
    filter: 'all',
    icon: '/broom-icon.png'
  }
];

const testimonials = [
  {
    quote:
      '“Prep4Pesach pairs transparent booking with payroll—clients see when crews arrive and admins approve time.”',
    author: 'Tova Z., homeowner'
  },
  {
    quote:
      '“I submit availability once, and the app schedules me seamlessly. Punching in/out is reliable and fast.”',
    author: 'Shira L., cleaner'
  },
  {
    quote:
      '“Invoices auto-generate from approved time entries, so we can focus on operations instead of chasing spreadsheets.”',
    author: 'Menachem R., admin'
  }
];

const sitemapSections = [
  {
    heading: 'Company',
    links: [
      { label: 'About us', href: '#about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' }
    ]
  },
  {
    heading: 'Services',
    links: [
      { label: 'Book a cleaner', href: '/book' },
      { label: 'View availability', href: '/worker/availability' },
      { label: 'Contact', href: '/contact' }
    ]
  },
  {
    heading: 'Support',
    links: [
      { label: 'Client login', href: '/login' },
      { label: 'Employee login', href: '/mobile' },
      { label: 'Admin console', href: '/admin' }
    ]
  }
];

export default function HomePage() {
  const [activeService, setActiveService] = useState(services[0]);
  const tiles = useMemo(
    () => services.map((service) => ({ ...service, active: service.id === activeService.id })),
    [activeService]
  );

  return (
    <div className="space-y-20 pb-16">
      <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-6 py-6">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">Pesach cleaning with clarity</p>
          <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">
            Book a slot, coordinate crews, and automate payroll in one refined workspace.
          </h1>
          <p className="text-lg text-slate-600">
            Prep4Pesach merges client booking, worker availability, time tracking, and invoicing so every Pesach prep
            plan stays visible and secure.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button>Book a cleaner</Button>
            <Button variant="ghost">View availability</Button>
          </div>
          <div className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.4em] text-slate-400">
            <span>Secure auth</span>
            <span>Hourly billing</span>
            <span>Instant invoices</span>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[28px] border border-slate-100 bg-slate-50 shadow-2xl shadow-slate-200">
          <Image
            src="/banner.png"
            alt="Kitchen being cleaned"
            width={1200}
            height={600}
            className="h-full w-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90" />
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Pick a service</p>
          <h2 className="text-3xl font-semibold text-slate-900">Select the crew you need</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {tiles.map((tile) => (
            <button
              key={tile.id}
              type="button"
              onClick={() => setActiveService(tile)}
              className={`flex flex-col items-center gap-4 rounded-[26px] border p-6 text-center transition hover:-translate-y-1 hover:border-[#3297e2] ${
                tile.active ? 'border-[#3297e2] bg-[#f2f8ff]' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="h-32 w-32 rounded-[22px] border border-slate-100 bg-[#f8fafc] p-4">
                <Image src={tile.icon} alt={tile.title} width={120} height={120} className="h-full w-full object-contain" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-semibold text-slate-900">{tile.title}</p>
                <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Price</p>
                <p className="text-sm text-slate-600">{tile.price}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Details</p>
              <h3 className="text-2xl font-semibold text-slate-900">{activeService.title}</h3>
              <p className="text-sm text-slate-600">{activeService.description}</p>
            </div>
            <div className="flex flex-col gap-3 text-right">
              <a
                href={`/book?filter=${activeService.filter}`}
                className="rounded-full border border-[#3297e2] px-5 py-2 text-sm font-semibold text-[#3297e2] transition hover:bg-[#3297e2] hover:text-white"
              >
                Book now
              </a>
              <span className="text-xs uppercase tracking-[0.4em] text-slate-400">
                Filter: {activeService.filter.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Testimonials</p>
          <h2 className="text-3xl font-semibold text-slate-900">Families and cleaners trust Prep4Pesach</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.quote} className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm leading-relaxed text-slate-600">“{item.quote}”</p>
              <p className="pt-4 text-xs uppercase tracking-[0.3em] text-slate-400">{item.author}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Site map</p>
            <h2 className="text-2xl font-semibold text-slate-900">Navigation</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button>Book a cleaner</Button>
            <Button variant="ghost">Employee login</Button>
          </div>
        </div>
        <div className="mt-8 grid gap-6 border-t border-slate-100 pt-6 md:grid-cols-3">
          {sitemapSections.map((section) => (
            <div key={section.heading} className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{section.heading}</p>
              <ul className="space-y-2 text-sm text-slate-600">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="transition hover:text-slate-900">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
