import React from 'react';
import { Award, HeartHandshake, UsersRound } from 'lucide-react';
import { clinic, doctor } from './siteData';
import { useLanguage } from './LanguageContext';

function About() {
  const { dictionary } = useLanguage();
  const localizedDoctor = dictionary.doctor || doctor;
  const cards = [
    { title: dictionary.about.cards[0], icon: HeartHandshake },
    { title: dictionary.about.cards[1], icon: UsersRound },
    { title: dictionary.about.cards[2], icon: Award },
  ];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#e84faf]">{dictionary.about.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-950">
            {dictionary.about.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            {dictionary.about.body}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {cards.map(({ title, icon: Icon }) => (
              <div key={title} className="rounded-lg border border-pink-100 p-5">
                <Icon size={28} className="text-[#e84faf]" />
                <p className="mt-3 font-semibold text-slate-900">{title}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-lg border border-pink-100 bg-[#fff7fc] p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#e84faf]">{dictionary.labels?.doctorProfile || 'Doctor profile'}</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">{localizedDoctor.name}</h2>
            <p className="mt-1 font-semibold text-[#3157b7]">{localizedDoctor.role}</p>
            <p className="mt-1 text-sm text-slate-600">{localizedDoctor.qualifications} | {localizedDoctor.experience} {dictionary.labels?.experienceSuffix || 'experience'}</p>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              {localizedDoctor.aboutNote || `Practicing at ${clinic.address}.`}
            </p>
          </div>
          <div className="mt-6 rounded-lg border border-pink-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#e84faf]">
              {dictionary.labels?.achievements || 'Achievements'}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              {dictionary.labels?.conferencesAttended || 'Conferences Attended'}
            </h2>
            <div className="mt-5 grid gap-3">
              {(localizedDoctor.conferencesAttended || doctor.conferencesAttended || []).map((conference) => (
                <article key={`${conference.title}-${conference.year}`} className="rounded-lg border border-pink-100 bg-[#fff7fc] p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-bold text-slate-950">{conference.title}</h3>
                      <p className="mt-1 text-sm font-medium text-slate-600">{conference.location}</p>
                    </div>
                    <span className="inline-flex w-fit rounded-lg bg-white px-3 py-1 text-xs font-bold text-[#3157b7] ring-1 ring-pink-100">
                      {conference.year}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{conference.role}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="mx-auto max-w-md overflow-hidden rounded-lg border border-pink-100 bg-[#fff7fc] p-3 shadow-sm">
            <img
              src={localizedDoctor.photoUrl || doctor.photoUrl}
              alt={localizedDoctor.name}
              loading="lazy"
              width="720"
              height="895"
              className="aspect-[4/5] w-full rounded-lg object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
