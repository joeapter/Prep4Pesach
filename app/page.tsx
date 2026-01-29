"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "boys",
    name: "Heavy duty kitchens",
    subtitle: "Ovens & fridges",
    price: "₪85 / hour · boys crew",
    icon: "/oven-icon.png",
    detail:
      "Dig into ovens, fridges, and cabinets with industrial-grade cleaners. Boys crews bring strength for stubborn grease.",
    filter: "boys",
  },
  {
    id: "girls",
    name: "Laundry + toys",
    subtitle: "Folded laundry, book stack & toy piles",
    price: "₪80 / hour · girls crew",
    icon: "/books-icon.png",
    detail:
      "Bookshelves, laundry, and toys reset in an hour with caring hands so your home feels calm after a hectic week.",
    filter: "girls",
  },
  {
    id: "general",
    name: "General refresh",
    subtitle: "Every surface · broom · gloves · spray",
    price: "Boys & girls as usual (priced above)",
    icon: "/broom-icon.png",
    detail:
      "Flexible crews cover every surface with broom, gloves, sprays, and finishing touches so the space sparkles for Pesach.",
    filter: "all",
  },
];

const testimonials = [
  {
    quote: "“Prep4Pesach pairs modern booking with transparent payroll—clients instantly see when crews arrive and admins approve time.”",
    author: "Tova Z., homeowner",
  },
  {
    quote: "“I submit availability once and the app schedules me seamlessly. Punching in/out has never been easier.”",
    author: "Shira L., cleaner",
  },
  {
    quote: "“Invoices build from approved entries and send immediately. No spreadsheets after Pesach.”",
    author: "Menachem R., admin",
  },
];

const sitemap = [
  {
    title: "Company",
    items: ["About us", "Careers", "Press"],
  },
  {
    title: "Services",
    items: ["Heavy duty", "Laundry + toys", "General clean"],
  },
  {
    title: "Support",
    items: ["Email hello@prep4pesach.com", "Call +972 2 123 5678", "FAQ & scheduling"],
  },
];

export default function HomePage() {
  const [activeService, setActiveService] = useState(services[0]);
  const tiles = useMemo(
    () => services.map((service) => ({ ...service, active: service.id === activeService.id })),
    [activeService]
  );
  return (
    <div className="min-h-screen bg-[#fefefe] px-4">
      <main className="mx-auto max-w-6xl space-y-20 py-10">
        <section className="relative rounded-[32px] border border-slate-100 bg-gradient-to-r from-[#e7f1ff] to-white p-8 shadow-2xl shadow-slate-200">
          <div className="absolute inset-0 rounded-[32px] bg-[url('/banner.png')] bg-cover bg-center opacity-70" />
          <div className="relative space-y-6 text-white max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white/80">Modern cleaning, tailored for prep</p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Effortless homes that feel ready for the season.
            </h1>
            <p className="text-base text-white/90">
              Transparent pricing, trusted teams, and thoughtful finishes—book by the hour, select your service, and let us
              handle the heavy lifting.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button>Book now</Button>
              <Button variant="ghost">See availability</Button>
            </div>
          </div>
        </section>

        <section id="book" className="space-y-8">
          <div className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Pick a service</p>
            <h2 className="text-3xl font-semibold text-slate-900">Select the crew you need</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {tiles.map((service) => (
              <button
                key={service.id}
                type="button"
                className={`rounded-[32px] border p-6 text-center shadow-lg shadow-slate-100 transition ${
                  service.active
                    ? "border-[#3297e2] bg-[#f2f8ff]"
                    : "border-slate-200 bg-white hover:-translate-y-1 hover:border-[#3297e2]"
                }`}
                onClick={() => setActiveService(service)}
              >
                <div className="mx-auto h-28 w-28 rounded-[24px] border border-slate-100 bg-[#f8fafc] p-4">
                  <Image src={service.icon} alt={service.name} width={110} height={110} className="object-contain" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">{service.name}</h3>
                <p className="text-sm text-slate-500">{service.subtitle}</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Price</p>
                <p className="text-sm text-slate-600">{service.price}</p>
              </button>
            ))}
          </div>
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 text-center text-slate-600 shadow-md shadow-slate-100">
            <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Details</p>
            <h3 className="text-2xl font-semibold text-slate-900">{activeService.name}</h3>
            <p className="py-4 text-base">{activeService.detail}</p>
            <div className="flex justify-center gap-4">
              <a
                href={`/book?filter=${activeService.filter}`}
                className="rounded-full bg-[#3297e2] px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-[#3297e2]/40"
              >
                Book now
              </a>
              <span className="text-xs uppercase tracking-[0.4em] text-slate-400">
                Filter: {activeService.filter}
              </span>
            </div>
          </div>
        </section>

        <section id="testimonials" className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Testimonials</p>
            <h2 className="text-3xl font-semibold text-slate-900">Families and cleaners trust Prep4Pesach</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.quote} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm leading-relaxed text-slate-600">{testimonial.quote}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.4em] text-slate-400">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
            {sitemap.map((section) => (
              <div key={section.title} className="space-y-3">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{section.title}</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {section.items.map((item) => (
                    <li key={item}>
                      <span className="hover:text-slate-900">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
