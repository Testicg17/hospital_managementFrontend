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
        </div>
        <div className="overflow-hidden rounded-lg">
          <img
            src="/images/seo/care-consultation.svg"
            alt="Eva Fertility consultation care illustration"
            loading="lazy"
            width="1200"
            height="800"
            className="h-full min-h-[420px] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default About;
