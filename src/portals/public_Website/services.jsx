import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck } from 'lucide-react';
import { doctor, services } from './siteData';
import { useLanguage } from './LanguageContext';

function Services() {
  const { dictionary } = useLanguage();
  const localizedDoctor = dictionary.doctor || doctor;
  const localizedServices = services.map((service, index) => ({
    ...service,
    title: dictionary.services[index]?.[0] || service.title,
    description: dictionary.services[index]?.[1] || service.description,
  }));

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#e84faf]">{dictionary.servicesPage.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-950">{dictionary.servicesPage.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {dictionary.servicesPage.body}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {localizedServices.map(({ title, description, icon: Icon }) => (
            <article key={title} className="rounded-lg border border-pink-100 bg-[#fff7fc] p-6">
              <Icon size={32} className="text-[#e84faf]" />
              <h2 className="mt-4 text-xl font-bold text-slate-950">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-pink-100 bg-[#fff7fc] p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#e84faf]">{dictionary.labels?.clinicalFocusAreas || 'Clinical focus areas'}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{localizedDoctor.name}</h2>
          <p className="mt-2 text-sm font-semibold text-[#3157b7]">{localizedDoctor.role} | {localizedDoctor.qualifications}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {localizedDoctor.expertise.map((item) => (
              <span key={item} className="rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-pink-100">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-lg bg-[#17245c] p-6 text-white md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold">{dictionary.servicesPage.ctaTitle}</h2>
            <p className="mt-2 text-sm text-indigo-50">{dictionary.servicesPage.ctaBody}</p>
          </div>
          <Link to="/contact#appointment-form" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#3157b7] hover:bg-pink-50">
            <CalendarCheck size={18} />
            {dictionary.common.bookAppointment}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Services;
