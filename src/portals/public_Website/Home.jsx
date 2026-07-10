import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, Clock, MapPin, Phone } from 'lucide-react';
import { articles, carePromises, clinic, highlights, services } from './siteData';

function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1400&q=80"
            alt="Doctor speaking with a patient"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent" />
        </div>
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative z-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">{clinic.emergency}</p>
            <h1 className="mt-4 text-5xl font-bold leading-tight text-slate-950 sm:text-6xl">
              Trusted hospital care for your whole family
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Book consultations, meet experienced specialists, access diagnostics, and follow clear care plans from one patient-friendly clinic.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
              >
                <CalendarCheck size={19} />
                Book Appointment
              </Link>
              <a
                href={`tel:${clinic.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-teal-500"
              >
                <Phone size={19} />
                Call Clinic
              </a>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <span className="flex items-center gap-2"><Clock size={18} className="text-teal-700" />{clinic.hours}</span>
              <span className="flex items-center gap-2"><MapPin size={18} className="text-teal-700" />{clinic.address}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {highlights.map((item) => (
            <div key={item.label} className="rounded-lg bg-white p-5 shadow-sm">
              <p className="text-3xl font-bold text-teal-700">{item.value}</p>
              <p className="mt-1 text-sm font-medium text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Departments</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950">Care available at our clinic</h2>
            </div>
            <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800">
              View all services <ArrowRight size={17} />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map(({ title, description, icon: Icon }) => (
              <article key={title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <Icon size={30} className="text-teal-700" />
                <h3 className="mt-4 text-lg font-bold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-teal-950 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {carePromises.map(({ title, text, icon: Icon }) => (
            <div key={title} className="rounded-lg border border-teal-800 p-6">
              <Icon size={30} className="text-teal-200" />
              <h3 className="mt-4 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-teal-50">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Health articles</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950">Latest patient education</h2>
            </div>
            <Link to="/articles" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
              Read articles <ArrowRight size={17} />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {articles.map((article) => (
              <article key={article.slug} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <img src={article.image} alt="" className="h-48 w-full object-cover" />
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{article.category}</p>
                  <h3 className="mt-2 text-lg font-bold text-slate-950">{article.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{article.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
