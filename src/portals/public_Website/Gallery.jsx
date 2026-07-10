import React from 'react';
import { PlayCircle } from 'lucide-react';
import { galleryItems } from './siteData';

function Gallery() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Gallery</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-950">Clinic spaces, patient areas, and care moments</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            View our hospital environment and a short video walkthrough before you visit.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {galleryItems.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
              {item.type === 'video' ? (
                <div className="aspect-video bg-slate-900">
                  <iframe
                    className="h-full w-full"
                    src={item.src}
                    title={item.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <img src={item.src} alt={item.title} className="h-72 w-full object-cover" />
              )}
              <div className="flex items-center gap-2 p-4">
                {item.type === 'video' && <PlayCircle size={20} className="text-teal-700" />}
                <h2 className="font-semibold text-slate-900">{item.title}</h2>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Gallery;
