import React from 'react';
import { PlayCircle } from 'lucide-react';
import { galleryItems } from './siteData';
import { useLanguage } from './LanguageContext';

function Gallery() {
  const { dictionary } = useLanguage();
  const localizedGallery = galleryItems.map((item, index) => ({
    ...item,
    title: dictionary.gallery[index] || item.title,
  }));

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#e84faf]">{dictionary.galleryPage.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-950">{dictionary.galleryPage.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {dictionary.galleryPage.body}
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {localizedGallery.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-lg border border-pink-100 bg-[#fff7fc] shadow-sm">
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
                {item.type === 'video' && <PlayCircle size={20} className="text-[#e84faf]" />}
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
