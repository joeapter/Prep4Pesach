"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { readJson } from "@/lib/http";

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
  const [modal, setModal] = useState<"signup" | "signin" | null>(null);
  const [signupForm, setSignupForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [signupMessage, setSignupMessage] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signinForm, setSigninForm] = useState({
    email: "",
    password: "",
  });
  const [signinMessage, setSigninMessage] = useState<string | null>(null);
  const [signinLoading, setSigninLoading] = useState(false);
  const panelRefs = useRef<Record<string, HTMLElement | null>>({});
  const router = useRouter();

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

  useEffect(() => {
    if (!modal) {
      return;
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModal(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [modal]);

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignupLoading(true);
    setSignupMessage(null);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: signupForm.fullName,
          email: signupForm.email,
          password: signupForm.password,
          phone: signupForm.phone,
        }),
      });
      const payload = await readJson<{ error?: string }>(response);

      setSignupLoading(false);
      if (!response.ok) {
        setSignupMessage(payload?.error ?? "Unable to create account.");
        return;
      }

      setSignupMessage("Account created. You can now sign in.");
    } catch {
      setSignupLoading(false);
      setSignupMessage("Failed to fetch. Please try again.");
    }
  };

  const handleSignin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSigninLoading(true);
    setSigninMessage(null);
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: signinForm.email, password: signinForm.password }),
    });
    const payload = await readJson<{ error?: string; role?: string }>(response);

    setSigninLoading(false);
    if (!response.ok) {
      setSigninMessage(payload?.error ?? "Unable to sign in.");
      return;
    }

    if (payload?.role === "admin") {
      router.push("/admin");
      return;
    }
    if (payload?.role === "worker") {
      router.push("/worker/jobs");
      return;
    }
    router.push("/client/jobs");
  };

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
          <button
            className="btn-link"
            type="button"
            aria-haspopup="dialog"
            aria-controls="signin-panel"
            aria-expanded={modal === "signin"}
            onClick={() => {
              setModal("signin");
              setSigninMessage(null);
            }}
          >
            Login
          </button>
          <button
            className="btn-link"
            type="button"
            aria-haspopup="dialog"
            aria-controls="signup-panel"
            aria-expanded={modal === "signup"}
            onClick={() => {
              setModal("signup");
              setSignupMessage(null);
            }}
          >
            Create Account
          </button>
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

      <section
        className={`modal-overlay${modal ? " open" : ""}`}
        id="modal-overlay"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setModal(null);
          }
        }}
      >
        <div
          className={`modal${modal === "signup" ? " active" : ""}`}
          id="signup-panel"
          aria-hidden={modal !== "signup"}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-header">
            <h3>Create an account</h3>
            <button className="modal-close" type="button" onClick={() => setModal(null)}>
              &times;
            </button>
          </div>
          <p className="modal-intro">Join Prep4Pesach and schedule your personalized clean in a few clicks.</p>
          <form className="modal-form" onSubmit={handleSignup}>
            <label>
              Full name
              <input
                type="text"
                placeholder="Sarah Cohen"
                required
                value={signupForm.fullName}
                onChange={(event) => setSignupForm((prev) => ({ ...prev, fullName: event.target.value }))}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={signupForm.email}
                onChange={(event) => setSignupForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </label>
            <label>
              Phone
              <input
                type="tel"
                placeholder="+972 50 123 4567"
                value={signupForm.phone}
                onChange={(event) => setSignupForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                placeholder="Create a password"
                required
                minLength={8}
                value={signupForm.password}
                onChange={(event) => setSignupForm((prev) => ({ ...prev, password: event.target.value }))}
              />
            </label>
            <button type="submit" className="primary full" disabled={signupLoading}>
              {signupLoading ? "Creating account..." : "Create account"}
            </button>
            {signupMessage && (
              <p className="modal-footnote modal-message" aria-live="polite">
                {signupMessage}
              </p>
            )}
            <p className="modal-footnote">
              We’ll email you confirmation and allow you to manage bookings inside the Prep4Pesach portal.
            </p>
          </form>
        </div>

        <div
          className={`modal${modal === "signin" ? " active" : ""}`}
          id="signin-panel"
          aria-hidden={modal !== "signin"}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-header">
            <h3>Sign in</h3>
            <button className="modal-close" type="button" onClick={() => setModal(null)}>
              &times;
            </button>
          </div>
          <p className="modal-intro">Continue to your account to manage bookings, availability, and payments.</p>
          <form className="modal-form" onSubmit={handleSignin}>
            <label>
              Email
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={signinForm.email}
                onChange={(event) => setSigninForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                placeholder="Password"
                required
                value={signinForm.password}
                onChange={(event) => setSigninForm((prev) => ({ ...prev, password: event.target.value }))}
              />
            </label>
            <button type="submit" className="primary full" disabled={signinLoading}>
              {signinLoading ? "Signing in..." : "Sign in"}
            </button>
            {signinMessage && (
              <p className="modal-footnote modal-message" aria-live="polite">
                {signinMessage}
              </p>
            )}
            <p className="modal-footnote">
              Forgot your password? <a href="#">Reset it here</a>.
            </p>
          </form>
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
