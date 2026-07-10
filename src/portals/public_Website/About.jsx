import React from 'react';
import { Award, HeartHandshake, UsersRound } from 'lucide-react';
import { clinic } from './siteData';

function About() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">About us</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-950">
            A hospital and clinic built around clear, compassionate care
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            {clinic.name} brings consultations, diagnostics, specialist follow-up, and preventive care into one coordinated experience. Our team focuses on careful listening, accurate records, and treatment plans patients can understand.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { title: 'Patient-first', icon: HeartHandshake },
              { title: 'Qualified team', icon: UsersRound },
              { title: 'Quality care', icon: Award },
            ].map(({ title, icon: Icon }) => (
              <div key={title} className="rounded-lg border border-slate-200 p-5">
                <Icon size={28} className="text-teal-700" />
                <p className="mt-3 font-semibold text-slate-900">{title}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-lg">
          <img
            src="https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=1200&q=80"
            alt="Hospital team in consultation"
            className="h-full min-h-[420px] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default About;
