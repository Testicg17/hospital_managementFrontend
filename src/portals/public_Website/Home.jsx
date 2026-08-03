import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, Clock, MapPin, MessageCircle, Phone, Quote, Star } from 'lucide-react';
import { articles, carePromises, clinic, doctor, highlights, services, successStories } from './siteData';
import { useLanguage } from './LanguageContext';
import { buildWhatsAppUrl } from './whatsapp';

function Home() {
  const { dictionary } = useLanguage();
  const localizedDoctor = dictionary.doctor || doctor;
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
  const localizedStories = successStories.map((story, index) => ({
    ...story,
    title: dictionary.successStories?.[index]?.[0] || story.title,
    quote: dictionary.successStories?.[index]?.[1] || story.quote,
    result: dictionary.successStories?.[index]?.[2] || story.result,
  }));

  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
          <img
            src="/images/logo-optimized.jpg"
            alt="Eva Fertility & Laparoscopy logo"
            width="1200"
            height="800"
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
                to="/contact#appointment-form"
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
                href={buildWhatsAppUrl(clinic.whatsapp, 'Public website home page')}
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
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div className="rounded-lg border border-pink-100 bg-[#fff7fc] p-6">
            <span className="flex h-28 w-28 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-pink-100">
              <img src={localizedDoctor.photoUrl || doctor.photoUrl} alt={localizedDoctor.name} className="h-full w-full object-cover object-top" loading="lazy" width="112" height="112" />
            </span>
            <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-[#e84faf]">{dictionary.labels?.leadConsultant || 'Lead Consultant'}</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">{localizedDoctor.name}</h2>
            <p className="mt-2 text-lg font-semibold text-[#3157b7]">{localizedDoctor.role}</p>
            <p className="mt-2 text-sm font-medium text-slate-600">{localizedDoctor.qualifications}</p>
            <div className="mt-5 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#3157b7] ring-1 ring-pink-100">
              {localizedDoctor.experience} {dictionary.labels?.experienceSuffix || 'experience'}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#e84faf]">{dictionary.labels?.careFocus || 'Eva care focus'}</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">{localizedDoctor.focusTitle}</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">{localizedDoctor.note}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {localizedDoctor.expertise.map((item) => (
                <span key={item} className="rounded-lg border border-pink-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
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

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#e84faf]">
                {dictionary.home.successEyebrow || 'Patient thoughts'}
              </p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950">
                {dictionary.home.successTitle || 'Our Success Stories'}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                {dictionary.home.successSubtitle || 'Anonymized patient feedback focused on communication, comfort, and guided follow-up care.'}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ['Private', 'consultations'],
                ['Clear', 'treatment steps'],
                ['Guided', 'follow-up care'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-pink-100 bg-[#fff7fc] p-4">
                  <p className="text-2xl font-bold text-[#3157b7]">{value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {localizedStories.map((story) => (
              <article key={`${story.initials}-${story.careType}`} className="flex h-full flex-col rounded-lg border border-pink-100 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#fff7fc] text-sm font-bold text-[#3157b7] ring-1 ring-pink-100">
                      {story.initials}
                    </span>
                    <div>
                      <p className="font-bold text-slate-950">{story.careType}</p>
                      <p className="text-sm text-slate-500">{story.location}</p>
                    </div>
                  </div>
                  <Quote size={24} className="shrink-0 text-pink-200" aria-hidden="true" />
                </div>

                <div className="mt-5 flex gap-1" aria-label={`${story.rating} out of 5 rating`}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={17}
                      className={index < story.rating ? 'fill-[#e84faf] text-[#e84faf]' : 'text-slate-200'}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-950">{story.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">"{story.quote}"</p>
                <div className="mt-5 rounded-lg bg-[#fff7fc] px-4 py-3 text-sm font-semibold text-[#3157b7] ring-1 ring-pink-100">
                  {story.result}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-lg bg-[#17245c] p-6 text-white sm:flex-row sm:items-center">
            <div>
              <p className="text-lg font-bold">Start with a private consultation</p>
              <p className="mt-1 text-sm text-indigo-50">The clinic team will help you choose an available appointment slot.</p>
            </div>
            <Link
              to="/contact#appointment-form"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#e84faf] px-5 py-3 text-sm font-semibold text-white hover:bg-[#d83d9f]"
            >
              <CalendarCheck size={18} />
              {dictionary.common.bookAppointment}
            </Link>
          </div>
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
                <img src={article.image} alt={article.title} className="h-48 w-full object-cover" loading="lazy" width="600" height="300" />
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
