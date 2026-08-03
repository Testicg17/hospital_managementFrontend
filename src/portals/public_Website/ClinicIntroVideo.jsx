import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Pause, Play, RotateCcw } from 'lucide-react';

const defaultContent = {
  eyebrow: 'Doctor introduction',
  title: 'Eva Fertility & Laparoscopy (स्त्री क्लिनिक) walkthrough',
  subtitle: 'A brief introduction to Eva Fertility & Laparoscopy, Dr. Raveendra Gondhali, specialist care areas, achievements, and appointment support.',
  cta: 'Book Appointment',
  play: 'Play',
  pause: 'Pause',
  replay: 'Replay',
  voiceLabel: 'Voice over',
  voiceUnsupported: 'Voice over is not supported in this browser.',
  voiceover: 'Welcome to Eva Fertility and Laparoscopy, Stree Clinic. Care is led by Dr. Raveendra Gondhali, Consultant Obstetrician, Gynaecologist and IVF Specialist, with MBBS, MS OBGY and F MAS qualifications. The clinic supports fertility evaluation, IVF and IUI guidance, PCOS care, pregnancy planning, hysteroscopy and laparoscopy. Dr. Gondhali has participated in Fertility Carnival Goa, Urogynaec Ahmedabad, STAR Pune and Yuva FOGSI East Zone. For appointments, patients can contact the clinic or book online.',
  scenes: [
    {
      title: 'Eva Fertility & Laparoscopy (स्त्री क्लिनिक)',
      body: 'Fertility, women care, pregnancy planning, and advanced laparoscopy support in Thergaon, Pune.',
      image: '/images/logo-optimized.jpg',
      fit: 'contain',
      points: ['Patient-first care', 'Privacy and clear counseling', 'Online appointment support'],
    },
    {
      title: 'Dr. Raveendra Gondhali',
      body: 'Consultant Obstetrician, Gynaecologist and IVF Specialist with focused fertility and minimally invasive gynecology care.',
      image: '/images/seo/DrRaveendraGondhali.jpeg',
      fit: 'cover',
      points: ['MBBS, MS (OBGY), F. MAS', '25+ years experience', 'IVF, IUI, laparoscopy and hysteroscopy guidance'],
    },
    {
      title: 'Clinical focus areas',
      body: 'Structured consultation and care planning for common fertility and women health needs.',
      image: '/images/logo-optimized.jpg',
      fit: 'contain',
      points: ['Fertility evaluation and infertility treatment', 'PCOS and menstrual health care', 'Pregnancy and antenatal support'],
    },
    {
      title: 'Achievements and academic participation',
      body: 'Active participation in fertility and gynecology academic platforms, conferences, and professional discussions.',
      image: '/images/seo/DrRaveendraGondhali.jpeg',
      fit: 'cover',
      points: ['Fertility Carnival Goa - Oct 2025', 'Urogynaec Ahmedabad - speaker and panellist', 'STAR Pune and Yuva FOGSI East Zone faculty roles'],
    },
  ],
};

function ClinicIntroVideo({ content = defaultContent }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState('');

  const intro = useMemo(() => ({
    ...defaultContent,
    ...content,
    scenes: defaultContent.scenes.map((scene, index) => ({
      ...scene,
      ...(content.scenes?.[index] || {}),
      image: scene.image,
      fit: scene.fit,
      points: content.scenes?.[index]?.points || scene.points,
    })),
  }), [content]);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % intro.scenes.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [intro.scenes.length, playing]);

  useEffect(() => () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const activeScene = intro.scenes[activeIndex];

  const speakIntro = () => {
    if (!('speechSynthesis' in window)) {
      setVoiceMessage(intro.voiceUnsupported);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(intro.voiceover);
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.onend = () => setPlaying(false);
    window.speechSynthesis.speak(utterance);
    setVoiceMessage(intro.voiceLabel);
  };

  const togglePlayback = () => {
    if (playing) {
      setPlaying(false);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      return;
    }

    setPlaying(true);
    speakIntro();
  };

  const restart = () => {
    setActiveIndex(0);
    setPlaying(true);
    speakIntro();
  };

  return (
    <section className="mt-10 overflow-hidden rounded-lg bg-[#17245c] text-white shadow-sm" aria-labelledby="clinic-intro-video-title">
      <style>{`
        @keyframes clinicIntroZoom {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        @media (prefers-reduced-motion: reduce) {
          .clinic-intro-motion { animation: none !important; transition: none !important; }
        }
      `}</style>
      <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
        <div className="relative aspect-video min-h-[320px] overflow-hidden bg-slate-950">
          {intro.scenes.map((scene, index) => (
            <img
              key={scene.image}
              src={scene.image}
              alt={scene.title}
              loading={index === 0 ? 'eager' : 'lazy'}
              width="1200"
              height="675"
              className={`clinic-intro-motion absolute inset-0 h-full w-full transition-opacity duration-700 ${scene.fit === 'contain' ? 'bg-white object-contain p-8 sm:p-12' : 'object-cover object-top'} ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
              style={{
                animation: index === activeIndex && playing ? 'clinicIntroZoom 4.2s ease-out both' : 'none',
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#17245c]/95 via-[#17245c]/62 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <div className="inline-flex items-center gap-3 rounded-lg bg-white/12 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-pink-100 ring-1 ring-white/15">
              <img src="/images/logo-optimized.jpg" alt="" className="h-8 w-8 rounded-md bg-white object-cover" width="32" height="32" />
              {intro.eyebrow}
            </div>
            <h2 id="clinic-intro-video-title" className="mt-5 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
              {intro.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-50 sm:text-base">
              {intro.subtitle}
            </p>
            {voiceMessage && (
              <p className="mt-3 inline-flex rounded-lg bg-white/12 px-3 py-2 text-xs font-semibold text-pink-100 ring-1 ring-white/15">
                {voiceMessage}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 p-5 sm:p-7">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-pink-200">{String(activeIndex + 1).padStart(2, '0')} / {String(intro.scenes.length).padStart(2, '0')}</p>
            <h3 className="mt-3 text-2xl font-bold">{activeScene.title}</h3>
            <p className="mt-3 text-sm leading-6 text-indigo-50">{activeScene.body}</p>
            {activeScene.points?.length > 0 && (
              <ul className="mt-4 space-y-2">
                {activeScene.points.map((point) => (
                  <li key={point} className="rounded-lg bg-white/8 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/10">
                    {point}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 space-y-3">
              {intro.scenes.map((scene, index) => (
                <button
                  key={scene.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${index === activeIndex ? 'border-pink-200 bg-white text-[#17245c]' : 'border-white/15 bg-white/5 text-indigo-50 hover:bg-white/10'}`}
                  aria-current={index === activeIndex ? 'step' : undefined}
                >
                  {scene.title}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2" aria-label="Intro video controls">
              <button
                type="button"
                onClick={togglePlayback}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#17245c] hover:bg-pink-50"
                aria-label={playing ? intro.pause : intro.play}
              >
                {playing ? <Pause size={17} /> : <Play size={17} />}
                <span className="hidden sm:inline">{playing ? intro.pause : intro.play}</span>
              </button>
              <button
                type="button"
                onClick={restart}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
                aria-label={intro.replay}
              >
                <RotateCcw size={17} />
                <span className="hidden sm:inline">{intro.replay}</span>
              </button>
              <Link
                to="/contact#appointment-form"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e84faf] px-3 py-2 text-sm font-semibold text-white hover:bg-[#d83d9f]"
              >
                <CalendarCheck size={17} />
                <span className="hidden sm:inline">{intro.cta}</span>
              </Link>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${intro.scenes.length}, minmax(0, 1fr))` }}>
              {intro.scenes.map((scene, index) => (
                <span key={`${scene.title}-progress`} className="h-1.5 overflow-hidden rounded-full bg-white/15">
                  <span className={`block h-full rounded-full bg-[#e84faf] transition-all duration-500 ${index <= activeIndex ? 'w-full' : 'w-0'}`} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ClinicIntroVideo;
