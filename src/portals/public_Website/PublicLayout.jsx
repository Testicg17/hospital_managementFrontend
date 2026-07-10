import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CalendarCheck, HeartPulse, Menu, Phone, X } from 'lucide-react';
import { clinic } from './siteData';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Articles', to: '/articles' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
];

function PublicLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const linkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition ${isActive ? 'text-teal-700' : 'text-slate-600 hover:text-teal-700'}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-600 text-white">
              <HeartPulse size={26} />
            </span>
            <span>
              <span className="block text-lg font-bold leading-tight text-slate-950">{clinic.name}</span>
              <span className="block text-xs font-medium text-slate-500">{clinic.tagline}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.label} to={item.to} end={item.to === '/'} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a href={`tel:${clinic.phone}`} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Phone size={17} className="text-teal-700" />
              {clinic.phone}
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
            >
              <CalendarCheck size={18} />
              Book Appointment
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
            <nav className="mx-auto grid max-w-7xl gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={linkClass}
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-3 text-sm font-semibold text-white"
              >
                <CalendarCheck size={18} />
                Book Appointment
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <HeartPulse className="text-teal-300" size={30} />
              <span className="text-xl font-bold">{clinic.name}</span>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
              Patient-first hospital and clinic care with accessible appointments, specialist consultation, diagnostics, and follow-up support.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-teal-200">Contact</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-300">
              <p>{clinic.phone}</p>
              <p>{clinic.email}</p>
              <p>{clinic.address}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-teal-200">Social</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {clinic.socials.map((social) => (
                <a key={social.label} href={social.href} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-teal-300">
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
