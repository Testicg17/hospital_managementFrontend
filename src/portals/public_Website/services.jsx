import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck } from 'lucide-react';
import { services } from './siteData';

function Services() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Services</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-950">Departments and clinical support</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Choose a department and book an appointment for consultation, diagnosis, treatment planning, or follow-up review.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ title, description, icon: Icon }) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <Icon size={32} className="text-teal-700" />
              <h2 className="mt-4 text-xl font-bold text-slate-950">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-lg bg-teal-950 p-6 text-white md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold">Need help choosing the right department?</h2>
            <p className="mt-2 text-sm text-teal-50">Our front desk can guide you to the right doctor and appointment slot.</p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-teal-800 hover:bg-teal-50">
            <CalendarCheck size={18} />
            Book Appointment
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Services;
