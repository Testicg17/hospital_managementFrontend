import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CalendarCheck, Menu, Phone, X } from 'lucide-react';
import { clinic } from './siteData';
import { languageOptions, useLanguage } from './LanguageContext';

const navItems = [
  { key: 'home', to: '/' },
  { key: 'about', to: '/about' },
  { key: 'services', to: '/services' },
  { key: 'articles', to: '/articles' },
  { key: 'gallery', to: '/gallery' },
  { key: 'contact', to: '/contact' },
];

function PublicLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage, dictionary } = useLanguage();
  const linkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition ${isActive ? 'text-[#e84faf]' : 'text-slate-600 hover:text-[#e84faf]'}`;
  const LanguageSelect = ({ compact = false }) => (
    <label className={`flex items-center gap-2 text-sm font-semibold text-slate-600 ${compact ? 'px-3 py-2' : ''}`}>
      <span>{dictionary.languageLabel}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        className="rounded-lg border border-pink-100 bg-white px-2 py-1 text-sm text-[#3157b7] outline-none focus:border-[#e84faf] focus:ring-2 focus:ring-pink-100"
      >
        {languageOptions.map((option) => (
          <option key={option.code} value={option.code}>{option.label}</option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="min-h-screen bg-[#fff7fc] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-pink-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-pink-100">
              <img
                src="/images/logo.jpeg"
                alt="Eva Fertility & Laparoscopy logo"
                className="h-full w-full object-cover"
              />
            </span>
            <span>
              <span className="block text-lg font-bold leading-tight text-[#3157b7]">{clinic.name}</span>
              <span className="block text-xs font-medium text-pink-500">{dictionary.clinic.tagline}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.key} to={item.to} end={item.to === '/'} className={linkClass}>
                {dictionary.nav[item.key]}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSelect />
            <a href={`tel:${clinic.phone}`} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Phone size={17} className="text-[#3157b7]" />
              {clinic.phone}
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-[#e84faf] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#d83d9f]"
            >
              <CalendarCheck size={18} />
              {dictionary.common.bookAppointment}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-pink-100 text-[#3157b7] lg:hidden"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-pink-100 bg-white px-4 py-3 lg:hidden">
            <nav className="mx-auto grid max-w-7xl gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={linkClass}
                >
                  {dictionary.nav[item.key]}
                </NavLink>
              ))}
              <LanguageSelect compact />
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[#e84faf] px-4 py-3 text-sm font-semibold text-white"
              >
                <CalendarCheck size={18} />
                {dictionary.common.bookAppointment}
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="bg-[#17245c] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 overflow-hidden rounded-lg bg-white shadow-sm">
                <img src="/images/logo.jpeg" alt="Eva Fertility & Laparoscopy logo" className="h-full w-full object-cover" />
              </span>
              <span className="text-xl font-bold">{clinic.name}</span>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
              {dictionary.clinic.footer}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-pink-200">{dictionary.common.contact}</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-300">
              <p>{clinic.phone}</p>
              <p>{clinic.email}</p>
              <p>{clinic.address}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-pink-200">{dictionary.common.social}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {clinic.socials.map((social) => (
                <a key={social.label} href={social.href} className="rounded-lg border border-indigo-300/30 px-3 py-2 text-sm text-slate-200 hover:border-pink-300">
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
