"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const services = [
  {
    id: "heavy-duty",
    title: "Heavy duty cleaning",
    summary: "Heavy duty",
    subtitle: "Ovens & fridges",
    icon: "/oven-icon.png",
    details:
      "Boys-only team deep cleans ovens and fridges to prep your kitchen for Pesach. Cost per hour is 85 shekel with degrease, polish, and inspection.",
    filter: "boys",
  },
  {
    id: "laundry",
    title: "Laundry + organization",
    summary: "Laundry + toys",
    subtitle: "Folded laundry, book stack & toy piles",
    icon: "/books-icon.png",
    details:
      "Girls-only crew folds laundry, tidies bookshelves, and refreshes toy piles and play areas. Cost per hour is 80 shekel with careful, methodical care.",
    filter: "girls",
  },
  {
    id: "general",
    title: "General refresh",
    summary: "General refresh",
    subtitle: "Every surface, broom, gloves, spray",
    icon: "/broom-icon.png",
    details:
      "Flexible crews (boys + girls) cover every surface with broom, gloves, sprays, and finishing touches. Each price is per usual: 85 shekel for boys and 80 shekel for girls.",
    filter: "all",
  },
];

const testimonials = [
  {
    name: "Yael, Jerusalem",
    quote: "“The boys team tackled the oven and fridge like clockwork—everything gleams.”",
  },
  {
    name: "Nada, Tel Aviv",
    quote: "“Laundry, books, and toys were reset in an hour. I felt calm after a hectic week.”",
  },
  {
    name: "Adi, Haifa",
    quote: "“General cleaning and sanitizing every surface—felt like a boutique hotel room.”",
  },
];

const sitemap = [
  {
    title: "Company",
    links: [
      { label: "About us", href: "#about" },
      { label: "Book a cleaner", href: "#book" },
      { label: "View availability", href: "#availability" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Heavy duty", href: "#heavy-duty" },
      { label: "Laundry + toys", href: "#laundry" },
      { label: "General clean", href: "#general" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Email hello@prep4pesach.com", href: "mailto:hello@prep4pesach.com" },
      { label: "Call +972 (0)1 234-5678", href: "tel:+972123456789" },
      { label: "FAQ & scheduling", href: "#book" },
    ],
  },
];

export default function HomePage() {
  const [active, setActive] = useState("general");
  const panelRefs = useRef<Record<string, HTMLElement | null>>({});

  const panels = useMemo(
    () =>
      services.map((service) => ({
        ...service,
        expanded: service.id === active,
      })),
    [active]
  );

  useEffect(() => {
    const panel = panelRefs.current[active];
    if (panel) {
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [active]);

  return (
    <div className="page">
      <header>
        <img src="/Prep4Pesach Logo.png" alt="Prep4Pesach Logo" />
        <nav>
          <ul className="nav-links">
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <a href="#book">Book a Cleaner</a>
            </li>
            <li>
              <a href="#availability">View Availability</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </nav>
        <div>
          <a className="btn-link" href="/login">
            Login
          </a>
          <a className="btn-link" href="/signup">
            Create Account
          </a>
        </div>
      </header>

      <section className="hero" aria-label="Hero banner with clean kitchen placeholder">
        <div className="hero-content">
          <p>Modern cleaning, tailored for prep, hosted by MaidMarines inspiration.</p>
          <h1>Effortless homes that feel ready for the season.</h1>
          <p>
            Transparent pricing, trusted teams with a focus on careful prep and thoughtful finishes. Book by the hour,
            select your service, and let us handle the heavy lifting.
          </p>
          <div className="hero-buttons">
            <button className="primary">Book now</button>
            <button className="btn-link">See availability</button>
          </div>
        </div>
      </section>

      <section className="services" id="book">
        <h2>Pick a service</h2>
        <div className="service-grid">
          {services.map((service) => (
            <button
              key={service.id}
              className="service-tile"
              type="button"
              data-service={service.id}
              aria-controls={`panel-${service.id}`}
              aria-expanded={active === service.id}
              onClick={() => setActive(service.id)}
            >
              <div className="service-icon" aria-hidden="true">
                <img src={service.icon} alt={`${service.summary} icon`} />
              </div>
              <strong>{service.summary}</strong>
              <span>{service.subtitle}</span>
            </button>
          ))}
        </div>

        <div>
          {panels.map((panel) => (
            <article
              key={panel.id}
              id={`panel-${panel.id}`}
              className={`service-details-panel${panel.expanded ? " expanded" : ""}`}
              role="region"
              aria-labelledby={`label-${panel.id}`}
              aria-hidden={!panel.expanded}
              ref={(node) => {
                panelRefs.current[panel.id] = node;
              }}
            >
              <div className="service-details-card">
                <div className="drawer-icon">
                  <img src={panel.icon} alt={`${panel.summary} icon`} />
                </div>
                <div className="drawer-content">
                  <h3 id={`label-${panel.id}`}>{panel.title}</h3>
                  <p className="drawer-details">{panel.details}</p>
                  <a href={`/book?filter=${panel.filter}`} className="primary">
                    Book now
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="testimonials" id="about">
        <h2>Testimonials</h2>
        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="testimonial">
              <strong>{testimonial.name}</strong>
              <p>{testimonial.quote}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sitemap" id="availability">
        <h2>Site map</h2>
        <div className="sitemap-grid">
          {sitemap.map((section) => (
            <div key={section.title} className="sitemap-column" id={section.title === "Support" ? "contact" : undefined}>
              <h3>{section.title}</h3>
              <ul>
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <p>© 2026 Prep4Pesach. Inspired by MaidMarines.com energy.</p>
      </footer>
    </div>
  );
}
