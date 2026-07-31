import React, { useEffect, useState } from 'react';
import { Pause, PlayCircle, RotateCcw, Volume2 } from 'lucide-react';
import { galleryItems } from './siteData';
import { useLanguage } from './LanguageContext';

const walkthroughFrames = [
  '/images/logo-optimized.jpg',
  '/images/seo/DrRaveendraGondhali.jpeg',
  '/images/logo-optimized.jpg',
];

function GeneratedWalkthrough({ title, introVideo }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [runId, setRunId] = useState(0);

  useEffect(() => () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const startVoiceOver = (restart = false) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(introVideo?.voiceover || '');
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    if (restart) setRunId((current) => current + 1);
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      return;
    }
    setIsPlaying(true);
    startVoiceOver(true);
  };

  const replay = () => {
    setIsPlaying(true);
    startVoiceOver(true);
  };

  return (
    <div className="relative aspect-video overflow-hidden bg-[#17245c]" aria-label={title}>
      <style>{`
        @keyframes galleryWalkthroughFade {
          0%, 27% { opacity: 1; transform: scale(1); }
          33%, 94% { opacity: 0; transform: scale(1.07); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes galleryWalkthroughProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .gallery-walkthrough-frame,
          .gallery-walkthrough-progress { animation: none !important; }
        }
      `}</style>
      {walkthroughFrames.map((src, index) => (
        <img
          key={`${src}-${runId}`}
          src={src}
          alt=""
          loading={index === 0 ? 'eager' : 'lazy'}
          width="1200"
          height="675"
          className={`gallery-walkthrough-frame absolute inset-0 h-full w-full opacity-0 ${index === 1 ? 'object-cover object-top' : 'bg-white object-contain p-8'}`}
          style={{
            animation: isPlaying ? 'galleryWalkthroughFade 12s ease-in-out infinite' : 'none',
            animationDelay: `${index * 4}s`,
            opacity: !isPlaying && index === 0 ? 1 : undefined,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#17245c]/90 via-[#17245c]/25 to-transparent" />
      <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-xs font-bold text-[#3157b7] shadow-sm">
        <Volume2 size={16} className="text-[#e84faf]" />
        {introVideo?.voiceLabel || 'Voice over'}
      </div>
      <div className="absolute right-4 top-4 flex gap-2">
        <button
          type="button"
          onClick={togglePlay}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#3157b7] shadow-sm hover:bg-pink-50"
          aria-label={isPlaying ? (introVideo?.pause || 'Pause') : (introVideo?.play || 'Play')}
        >
          {isPlaying ? <Pause size={18} /> : <PlayCircle size={20} />}
        </button>
        <button
          type="button"
          onClick={replay}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 text-[#3157b7] shadow-sm hover:bg-pink-50"
          aria-label={introVideo?.replay || 'Replay'}
        >
          <RotateCcw size={18} />
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="max-w-xl text-xl font-bold leading-snug text-white">{title}</h3>
        <p className="mt-2 max-w-xl text-sm leading-5 text-indigo-50">
          {introVideo?.subtitle || 'Tap play to hear a brief introduction.'}
        </p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/25">
          <span
            key={`progress-${runId}`}
            className="gallery-walkthrough-progress block h-full rounded-full bg-[#e84faf]"
            style={{ animation: isPlaying ? 'galleryWalkthroughProgress 12s linear infinite' : 'none', width: isPlaying ? undefined : '0%' }}
          />
        </div>
      </div>
    </div>
  );
}

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
              {item.type === 'walkthrough' ? (
                <GeneratedWalkthrough title={item.title} introVideo={dictionary.introVideo} />
              ) : item.type === 'video' ? (
                <div className="aspect-video bg-slate-900">
                  <iframe
                    className="h-full w-full"
                    src={item.src}
                    title={item.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <img src={item.src} alt={item.title} className="h-72 w-full object-cover" loading="lazy" width="600" height="360" />
              )}
              <div className="flex items-center gap-2 p-4">
                {['video', 'walkthrough'].includes(item.type) && <PlayCircle size={20} className="text-[#e84faf]" />}
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
