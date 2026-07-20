import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, Clock, MapPin, MessageCircle, Phone } from 'lucide-react';
import { articles, carePromises, clinic, highlights, services } from './siteData';
import { useLanguage } from './LanguageContext';

function Home() {
  const { dictionary } = useLanguage();
  const localizedServices = services.map((service, index) => ({
    ...service,
    title: dictionary.services[index]?.[0] || service.title,
    description: dictionary.services[index]?.[1] || service.description,
  }));
  const localizedHighlights = highlights.map((item, index) => ({
    ...item,
    label: dictionary.highlights[index] || item.label,
  }));
  const localizedPromises = carePromises.map((promise, index) => ({
    ...promise,
    title: dictionary.promises[index]?.[0] || promise.title,
    text: dictionary.promises[index]?.[1] || promise.text,
  }));
  const localizedArticles = articles.map((article, index) => ({
    ...article,
    title: dictionary.articles[index]?.[0] || article.title,
    category: dictionary.articles[index]?.[1] || article.category,
    excerpt: dictionary.articles[index]?.[2] || article.excerpt,
  }));

  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
          <img
            src="/images/logo.jpeg"
            alt="Eva Fertility & Laparoscopy logo"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-white/10" />
        </div>
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative z-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#e84faf]">{dictionary.clinic.emergency}</p>
            <h1 className="mt-4 text-5xl font-bold leading-tight text-slate-950 sm:text-6xl">
              {dictionary.home.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              {dictionary.home.subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e84faf] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#d83d9f]"
              >
                <CalendarCheck size={19} />
                {dictionary.common.bookAppointment}
              </Link>
              <a
                href={`tel:${clinic.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-pink-200 bg-white px-5 py-3 text-sm font-semibold text-[#3157b7] hover:border-[#e84faf]"
              >
                <Phone size={19} />
                {dictionary.common.callClinic}
              </a>
              <a
                href={`https://wa.me/${clinic.whatsapp}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-pink-200 bg-white px-5 py-3 text-sm font-semibold text-[#3157b7] hover:border-[#e84faf]"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={19} />
                {dictionary.common.whatsapp}
              </a>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <span className="flex items-center gap-2"><Clock size={18} className="text-[#3157b7]" />{clinic.hours}</span>
              <span className="flex items-center gap-2"><MapPin size={18} className="text-[#3157b7]" />{clinic.address}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-pink-100 bg-[#fff7fc] py-8">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {localizedHighlights.map((item) => (
            <div key={item.label} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-pink-100">
              <p className="text-3xl font-bold text-[#3157b7]">{item.value}</p>
              <p className="mt-1 text-sm font-medium text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#e84faf]">{dictionary.home.programsEyebrow}</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950">{dictionary.home.programsTitle}</h2>
            </div>
            <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-[#3157b7] hover:text-[#e84faf]">
              {dictionary.common.viewAllServices} <ArrowRight size={17} />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {localizedServices.slice(0, 6).map(({ title, description, icon: Icon }) => (
              <article key={title} className="rounded-lg border border-pink-100 bg-white p-6 shadow-sm">
                <Icon size={30} className="text-[#e84faf]" />
                <h3 className="mt-4 text-lg font-bold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#17245c] py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {localizedPromises.map(({ title, text, icon: Icon }) => (
            <div key={title} className="rounded-lg border border-pink-200/30 p-6">
              <Icon size={30} className="text-pink-200" />
              <h3 className="mt-4 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-indigo-50">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#fff7fc] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#e84faf]">{dictionary.home.articlesEyebrow}</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950">{dictionary.home.articlesTitle}</h2>
            </div>
            <Link to="/articles" className="inline-flex items-center gap-2 text-sm font-semibold text-[#3157b7]">
              {dictionary.common.readArticles} <ArrowRight size={17} />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {localizedArticles.map((article) => (
              <article key={article.slug} className="overflow-hidden rounded-lg border border-pink-100 bg-white shadow-sm">
                <img src={article.image} alt="" className="h-48 w-full object-cover" />
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#e84faf]">{article.category}</p>
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
