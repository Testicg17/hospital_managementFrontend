import { useMemo } from "react";
import SEO from "../../components/SEO";
import { doctorSchema, medicalClinicSchema, organizationSchema, seoPages, webPageSchema, websiteSchema } from "./seoData";
import { buildWhatsAppUrl } from "./whatsapp";

/**
 * ============================================================
 *  EDIT THIS CONFIG WITH REAL DETAILS
 *  Everything on the page is driven from here.
 * ============================================================
 */
const CONFIG = {
  name: "Eva Fertility and Laparoscopy",
  namemarathi: "(स्त्री क्लिनिक)",
  credentials: "Dr. Raveendra Gondhali",
  specialty: "MBBS, MS (Gynecology), F.MAS.",
  specialty1: "Fellowship & Ex. Asst. Professor in Reproductive Medicine (IVF) & Endoscopy Surgery.",
  photoUrl: "/images/seo/DrRaveendraGondhali.jpeg", // paste an image URL here, or leave blank for the monogram

areas: [
  {
    icon: "",
    text: "Fertility Evaluation & Infertility Treatment",
    
  },
  
  {
    icon: "",
    text: "Ovulation Induction & Monitoring",
    
  },
  {
    icon: "",
    text: "IUI/IVF Treatment, Guidance & Support ",
    
  },
  
  {
    icon: "",
    text: "PCOS/PCOD Management",
    
  },
  {
    icon: "",
    text: "Laparascopy/Hysteroscopy Diagnosis & Treatment",
    
  },
  
{
    icon: "",
    text: "Pregnancy Care & Antenatal Support",
    
  },
],

 hours: [
  {
    day: "Mon–Sat",
    slots: [
      ["9:00", "18:00", "By Appointment"],["18:00", "21:00", "OPD"]
    ]
  },
 
  {
    day: "Sunday",
    slots: [
      ["9:00", "14:00", "By Appointment"]
    ]
  }
],

  address: "Eva Fertility & Laparoscopy (स्त्री क्लिनिक), Silver Birch Multispeciality Hospital, Datta Mandir Road, Thergaon, Pimpri-Chinchwad, Pune 411033",
  mapsUrl: "https://maps.app.goo.gl/UyErkwtNR8UaDQCC6",

  phone: "+91 70661 04777",
  email: "evafertilitypune@gmail.com",
  whatsapp: "+91 86054 70491",
  website: "https://evafertilitypune.com",

  socials: [
    { label: "Instagram", url: "https://www.instagram.com/evafertilitypune", icon: "instagram" },
    { label: "Facebook", url: "https://www.facebook.com/share/18H2VYdFke/?mibextid=wwXIfr", icon: "facebook" },
    { label: "YouTube", url: "https://m.youtube.com/@evafertilitypune", icon: "youtube" },
    { label: "Google", url: "https://share.google/1zRkyyY6Q2zjwdlnD", icon: "google" },
  ],

  qrTargetUrl: "https://evafertilitypune.com/DrRaveendraGondhali",
};

/** ---------- helpers ---------- */

function useIsOpenNow(hours) {
  return useMemo(() => {
    const now = new Date();
    const dayIdx = now.getDay(); // 0 Sun ... 6 Sat
    const label = dayIdx === 0 ? "Sunday" : "Mon–Sat";

    const mins = now.getHours() * 60 + now.getMinutes();

    const todayHours = hours.filter((h) => h.day === label || h.day === "");

    return todayHours.some((h) =>
      h.slots.some(([start, end]) => {
        const [sh, sm] = start.split(":").map(Number);
        const [eh, em] = end.split(":").map(Number);

        const s = sh * 60 + sm;
        const e = eh * 60 + em;

        return mins >= s && mins <= e;
      })
    );
  }, [hours]);
}

/** brand + utility icons (social row) */
const ICONS = {
 google: (
  <>
    <path fill="#EA4335" d="M12 10.2v3.8h5.4c-.23 1.22-.93 2.25-1.98 2.95l3.2 2.48c1.87-1.72 2.95-4.25 2.95-7.23 0-.68-.06-1.34-.17-1.98H12z"/>
    <path fill="#34A853" d="M12 22c2.67 0 4.91-.88 6.55-2.39l-3.2-2.48c-.89.6-2.03.96-3.35.96-2.58 0-4.77-1.74-5.55-4.08H3.14v2.56A9.99 9.99 0 0 0 12 22z"/>
    <path fill="#FBBC05" d="M6.45 14.01A5.98 5.98 0 0 1 6.14 12c0-.7.12-1.38.31-2.01V7.43H3.14A9.99 9.99 0 0 0 2 12c0 1.61.39 3.14 1.14 4.57l3.31-2.56z"/>
    <path fill="#4285F4" d="M12 5.91c1.45 0 2.75.5 3.78 1.48l2.84-2.84C16.9 2.95 14.67 2 12 2A9.99 9.99 0 0 0 3.14 7.43l3.31 2.56C7.23 7.65 9.42 5.91 12 5.91z"/>
  </>
),
  instagram: (
    <path d="M12 2.2c2.7 0 3 .01 4.1.06 1.05.05 1.62.22 2 .37.5.2.86.43 1.24.8.37.38.6.74.8 1.24.15.38.32.95.37 2 .05 1.1.06 1.4.06 4.1s-.01 3-.06 4.1c-.05 1.05-.22 1.62-.37 2-.2.5-.43.86-.8 1.24-.38.37-.74.6-1.24.8-.38.15-.95.32-2 .37-1.1.05-1.4.06-4.1.06s-3-.01-4.1-.06c-1.05-.05-1.62-.22-2-.37a3.3 3.3 0 0 1-1.24-.8 3.3 3.3 0 0 1-.8-1.24c-.15-.38-.32-.95-.37-2C2.21 15 2.2 14.7 2.2 12s.01-3 .06-4.1c.05-1.05.22-1.62.37-2 .2-.5.43-.86.8-1.24.38-.37.74-.6 1.24-.8.38-.15.95-.32 2-.37C9 2.21 9.3 2.2 12 2.2zm0 1.8c-2.65 0-2.96.01-4.01.06-.86.04-1.33.18-1.64.3-.41.16-.7.35-1.01.66-.31.31-.5.6-.66 1.01-.12.31-.26.78-.3 1.64C4.33 8.72 4.32 9.02 4.32 12s.01 3.28.06 4.33c.04.86.18 1.33.3 1.64.16.41.35.7.66 1.01.31.31.6.5 1.01.66.31.12.78.26 1.64.3 1.05.05 1.36.06 4.01.06s2.96-.01 4.01-.06c.86-.04 1.33-.18 1.64-.3.41-.16.7-.35 1.01-.66.31-.31.5-.6.66-1.01.12-.31.26-.78.3-1.64.05-1.05.06-1.36.06-4.33s-.01-3.28-.06-4.33c-.04-.86-.18-1.33-.3-1.64a2.7 2.7 0 0 0-.66-1.01 2.7 2.7 0 0 0-1.01-.66c-.31-.12-.78-.26-1.64-.3C14.96 4.01 14.65 4 12 4zm0 3.05a4.95 4.95 0 1 1 0 9.9 4.95 4.95 0 0 1 0-9.9zm0 1.8a3.15 3.15 0 1 0 0 6.3 3.15 3.15 0 0 0 0-6.3zm5.15-2a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0z" />
  ),
  facebook: (
    <path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93V8.53c0-.86.24-1.44 1.47-1.44h1.57V4.45c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9v2.18H7.99v2.96h2.47V21h3.04z" />
  ),
  linkedin: (
    <path d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 3.2a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92zM20.45 20h-3.37v-6.02c0-1.44-.03-3.28-2-3.28-2.01 0-2.32 1.57-2.32 3.18V20H9.4V8.5h3.24v1.57h.05c.45-.86 1.56-1.77 3.21-1.77 3.43 0 4.06 2.26 4.06 5.2V20z" />
  ),
  youtube: (
    <path d="M22 12s0-3.24-.41-4.8a2.75 2.75 0 0 0-1.94-1.95C18.1 5 12 5 12 5s-6.1 0-7.65.25a2.75 2.75 0 0 0-1.94 1.95C2 8.76 2 12 2 12s0 3.24.41 4.8a2.75 2.75 0 0 0 1.94 1.95C5.9 19 12 19 12 19s6.1 0 7.65-.25a2.75 2.75 0 0 0 1.94-1.95C22 15.24 22 12 22 12zM9.9 15.4V8.6l6 3.4-6 3.4z" />
  ),
  call: (
    <path d="M6.6 10.8c1.4 2.8 3.7 5.1 6.5 6.5l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4.2c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1z" />
  ),
  mail: (
    <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm0 2.3V17h16V7.3l-7.4 5.5a1 1 0 0 1-1.2 0L4 7.3zm.6-.3 7.4 5.5L19.4 7H4.6z" />
  ),
  whatsapp: (
    <path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.9-1.3A9.9 9.9 0 0 0 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.1-.3.2-.5.1-.2-.1-1-.4-2-1.2-.7-.6-1.2-1.4-1.4-1.7-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.1 0-.3 0-.4-.1-.1-.5-1.3-.7-1.8-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3 1 2.5c.1.1 1.6 2.5 3.9 3.5.5.2 1 .4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.3-.5 1.5-1 .2-.5.2-1 .1-1-.1-.1-.2-.1-.4-.2z" />
  ),
  globe: (
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 8h-3.1a15 15 0 0 0-1.2-4.6A8 8 0 0 1 18.9 10zM12 4.1c.7 1 1.4 2.7 1.7 5.9h-3.4C10.6 6.8 11.3 5.1 12 4.1zM4 12c0-.7.1-1.4.2-2h3.4c-.1.6-.1 1.3-.1 2s0 1.4.1 2H4.2c-.1-.6-.2-1.3-.2-2zm1.1 4h3.1a15 15 0 0 0 1.2 4.6A8 8 0 0 1 5.1 16zm3.1-8H5.1a8 8 0 0 1 4.3-4.6A15 15 0 0 0 8.2 8zM12 19.9c-.7-1-1.4-2.7-1.7-5.9h3.4c-.3 3.2-1 4.9-1.7 5.9zm-1.9-7.9c-.1-.6-.1-1.3-.1-2s0-1.4.1-2h3.8c.1.6.1 1.3.1 2s0 1.4-.1 2h-3.8zm4.1 7.5a15 15 0 0 0 1.2-4.6h3.1a8 8 0 0 1-4.3 4.6zM16.4 14c.1-.6.1-1.3.1-2s0-1.4-.1-2h3.4c.1.6.2 1.3.2 2s-.1 1.4-.2 2h-3.4z" />
  ),
  download: (
    <path d="M12 3a1 1 0 0 1 1 1v9.6l2.6-2.6a1 1 0 1 1 1.4 1.4l-4.3 4.3a1 1 0 0 1-1.4 0L7 12.4A1 1 0 1 1 8.4 11L11 13.6V4a1 1 0 0 1 1-1zM5 19a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1z" />
  ),
  calendar: (
    <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1zM4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9H4zm12.7 2.3a1 1 0 0 1 0 1.4l-4.5 4.5a1 1 0 0 1-1.4 0l-2-2a1 1 0 1 1 1.4-1.4l1.3 1.3 3.8-3.8a1 1 0 0 1 1.4 0z" />
  ),
  pin: (
    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 6.28 11.63 6.55 11.9a.63.63 0 0 0 .9 0C12.72 20.63 19 14.25 19 9a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
  ),
};

/** signature element: animated ECG / pulse trace, used as thin dividers */
function PulseTrace({ id = "pt" }) {
  return (
    <svg className="pulse-trace" viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`fade-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--coral)" stopOpacity="0" />
          <stop offset="15%" stopColor="var(--coral)" stopOpacity="1" />
          <stop offset="85%" stopColor="var(--coral)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--coral)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 12 H130 L145 12 L155 3 L165 20 L175 12 L190 12 H400"
        fill="none"
        stroke={`url(#fade-${id})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DoctorLandingPage() {
 const isOpen = useIsOpenNow(CONFIG.hours);
const currentSession = useMemo(() => {
  const now = new Date();
  const dayIdx = now.getDay();
  const label = dayIdx === 0 ? "Sunday" : "Mon–Sat";

  const mins = now.getHours() * 60 + now.getMinutes();

  const todayHours = CONFIG.hours.filter(
    (h) => h.day === label || h.day === ""
  );

  for (const h of todayHours) {
    for (const [start, end, type] of h.slots) {
      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);

      const s = sh * 60 + sm;
      const e = eh * 60 + em;

      if (mins >= s && mins <= e) {
        return type;
      }
    }
  }

  return null;
}, []);
  const initials = CONFIG.name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const telHref = `tel:${CONFIG.phone.replace(/\s/g, "")}`;
  const waHref = buildWhatsAppUrl(CONFIG.whatsapp, "Dr. Raveendra Gondhali profile page");
  const bookingHref = "/contact#appointment-form";
 // const websiteHost = CONFIG.website.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div className="page">
      <SEO
        {...seoPages["/DrRaveendraGondhali"]}
        path="/DrRaveendraGondhali"
        schemas={[
          organizationSchema,
          websiteSchema,
          medicalClinicSchema,
          doctorSchema,
          webPageSchema({
            path: "/DrRaveendraGondhali",
            title: seoPages["/DrRaveendraGondhali"].title,
            description: seoPages["/DrRaveendraGondhali"].description,
          }),
        ]}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap');

        :root {
          --ink: #eaf7f3;
          --paper: #071614;
          --paper-2: #102420;
          --teal: #14b8a6;
          --pink: #ce0060;
          --teal-deep: #063b34;
          --coral: #f6c343;
          --blush: #123832;
          --line: rgba(255,255,255,0.10);
          --mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
          --serif: 'Fraunces', Georgia, serif;
          --sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          --shadow-sm: 0 1px 2px rgba(0,0,0,0.35), 0 1px 1px rgba(0,0,0,0.25);
          --shadow-md: 0 20px 50px -18px rgba(20,184,166,0.45), 0 0 0 1px rgba(255,255,255,0.05);
        }
        * { box-sizing: border-box; }
        html, body, #root { margin: 0; }

        .page {
          min-height: 100dvh;
          width: 100%;
          background:
            radial-gradient(900px 480px at 8% -8%, rgba(20,184,166,0.28), transparent 60%),
            radial-gradient(760px 420px at 108% 6%, rgba(246,195,67,0.15), transparent 55%),
            radial-gradient(1000px 600px at 50% 120%, rgba(20,184,166,0.14), transparent 60%),
            var(--paper);
          color: var(--ink);
          font-family: var(--sans);
          display: flex;
          justify-content: center;
          padding: clamp(16px, 4vw, 48px) clamp(14px, 4.5vw, 28px) clamp(48px, 8vw, 80px);
        }

        .wrap {
          width: 100%;
          max-width: 720px;
          display: flex;
          flex-direction: column;
          gap: clamp(14px, 2.6vw, 20px);
        }
        @media (min-width: 900px) {
          .wrap { max-width: 900px; gap: 22px; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
        .wrap > * { animation: fadeUp 0.55s ease both; }
        .wrap > *:nth-child(1) { animation-delay: 0.02s; }
        .wrap > *:nth-child(2) { animation-delay: 0.08s; }
        .wrap > *:nth-child(3) { animation-delay: 0.14s; }
        .wrap > *:nth-child(4) { animation-delay: 0.18s; }
        .wrap > *:nth-child(5) { animation-delay: 0.22s; }
        .wrap > *:nth-child(6) { animation-delay: 0.26s; }

        /* ---- hero ---- */
        .hero {
          display: flex;
          align-items: center;
          gap: clamp(14px, 3vw, 20px);
          background: linear-gradient(135deg, var(--teal) 0%, var(--teal-deep) 100%);
          border-radius: 22px;
          padding: clamp(18px, 3.6vw, 28px) clamp(18px, 4vw, 30px);
          color: #fff;
          box-shadow: var(--shadow-md);
          border: 1px solid rgba(255,255,255,0.08);
          flex-wrap: wrap;
        }
        .avatar {
          width: clamp(64px, 12vw, 84px);
          height: clamp(64px, 12vw, 84px);
          border-radius: 50%;
          background: rgba(255,255,255,0.16);
          border: 2px solid rgba(255,255,255,0.45);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--serif);
          font-weight: 600;
          font-size: clamp(22px, 4.3vw, 28px);
          flex-shrink: 0;
          overflow: hidden;
        }
        .avatar img { width: 100%; height: 100%; object-fit: cover; }
        .hero-text { min-width: 0; flex: 1; overflow: visible; }
        .name {
          font-family: var(--serif);
          font-weight: 600;
          font-size: clamp(21px, 3.9vw, 30px);
          line-height: 1.25;
          margin: 0;
        }
        .cred-spec {
          font-size: clamp(12px, 2.1vw, 15px);
          opacity: 0.92;
          margin-top: 6px;
          line-height: 1.4;
          max-width: 100%;
          overflow-wrap: anywhere;
          white-space: normal;
        }
        .status-row {
          display: inline-flex; align-items: center; gap: 7px;
          margin-top: 12px;
          font-family: var(--mono);
          font-size: clamp(11px, 2.1vw, 12px);
          letter-spacing: 0.06em;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.3);
          padding: 5px 12px 5px 9px;
          border-radius: 999px;
        }
        .status {
          display: inline-flex;
          flex-direction: column;
          gap: 1px;
          line-height: 1.1;
        }
        .status-main,
        .status-session {
          display: block;
          white-space: nowrap;
        }
        .status-session {
          font-size: 0.92em;
          opacity: 0.95;
        }
        @media (min-width: 701px) {
          .status {
            flex-direction: row;
            align-items: center;
            gap: 6px;
          }
          .status-session::before {
            content: "•";
            margin-right: 6px;
            opacity: 0.8;
          }
        }
        .status-legacy { display: none; }
        .dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: ${isOpen ? "#7CE0B8" : "#f2a7a7"};
          flex-shrink: 0;
        }
        .dot.open { animation: blip 1.6s ease-in-out infinite; }
        @keyframes blip {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124,224,184,0.55); }
          50% { box-shadow: 0 0 0 5px rgba(124,224,184,0); }
        }

        .pulse-trace { width: 100%; height: 20px; display: block; opacity: 0.85; }
        book-appointment{ display: inline-flex;
        justify-content: center;}
        .book-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          align-self: flex-start;
          margin-top: 10px;
          font-family: var(--sans);
          font-weight: 700;
          font-size: clamp(12.5px, 2.2vw, 14px);
          color: #fff;
          background: var(--pink);
          border: 1px solid rgba(255,255,255,0.28);
          border-radius: 999px;
          padding: 10px 20px;
          text-decoration: none;
          box-shadow: 0 10px 24px -8px color-mix(in srgb, var(--coral) 70%, transparent);
          transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
        }
        .book-btn svg { width: 16px; height: 16px; fill: currentColor; flex-shrink: 0; }
        .book-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.06);
          box-shadow: 0 14px 30px -8px color-mix(in srgb, var(--coral) 85%, transparent);
        }

        /* ---- cards ---- */
        .card {
          background: var(--paper-2);
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: clamp(16px, 3vw, 22px) clamp(16px, 3.4vw, 24px);
          box-shadow: var(--shadow-sm);
        }
        .eyebrow {
          font-family: var(--mono);
          font-size: clamp(10px, 1.9vw, 11px);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--teal);
          margin-bottom: clamp(10px, 2vw, 14px);
          font-weight: 600;
        }

        .card-divider {
          height: 1px;
          background: var(--line);
          margin: 18px 0 14px;
        }

        .grid2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(12px, 2.4vw, 18px);
        }
        @media (min-width: 620px) {
          .grid2 { grid-template-columns: 1fr 1fr; }
        }

        /* ---- areas list ---- */
        .areas-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        @media (min-width: 560px) {
          .areas-list { grid-template-columns: 1fr 1fr; }
        }
        .areas-list li {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 9px;
          padding: 5px 12px;
          font-size: clamp(13.5px, 2.1vw, 14.5px);
          line-height: 1.4;
          color: var(--ink);
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: 12px;
          transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
        }
        @media (hover: hover) {
          .areas-list li:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-sm);
            border-color: var(--coral);
          }
        }
        .areas-list li::before {
          content: "";
          margin-top: 6px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--coral);
          flex-shrink: 0;
        }

        /* ---- hours ---- */
        .hours-row {
          display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;
          padding: 10px 0;
          border-bottom: 1px dashed var(--line);
        }
        .hours-row:last-child { border-bottom: none; }
        .hours-day {
          font-family: var(--mono);
          font-weight: 700;
          font-size: clamp(12px, 2vw, 13px);
          letter-spacing: 0.02em;
          color: var(--ink);
          white-space: nowrap;
          flex-shrink: 0;
          padding-top: 4px;
        }
        .hours-slots {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 7px;
          min-width: 0;
        }
        .slot-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: nowrap;
        }
        .slot-time {
          font-family: var(--mono);
          font-weight: 600;
          font-size: clamp(12px, 2vw, 13px);
          color: var(--ink);
          white-space: nowrap;
        }
        .slot-type {
          font-family: var(--sans);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 3px 9px;
          border-radius: 999px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .slot-type.opd {
          color: var(--coral);
          background: color-mix(in srgb, var(--coral) 18%, transparent);
          border: 1px solid color-mix(in srgb, var(--coral) 45%, transparent);
        }
        .slot-type.appointment {
          color: var(--teal);
          background: color-mix(in srgb, var(--teal) 24%, transparent);
          border: 1px solid color-mix(in srgb, var(--teal) 55%, transparent);
        }
        .closed-tag {
          font-family: var(--mono);
          font-size: clamp(12px, 2vw, 13px);
          color: #f2a3ac;
        }

        /* ---- location ---- */
        .addr {
          font-size: clamp(13px, 2.1vw, 14.5px);
          line-height: 1.5;
          color: var(--ink);
          margin-bottom: 14px;
        }
        .mini-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--sans);
          font-weight: 600;
          font-size: clamp(12.5px, 2.1vw, 13.5px);
          color: #fff;
          background: var(--teal);
          border: none;
          border-radius: 10px;
          padding: 9px 16px;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .mini-btn:hover { background: var(--teal-deep); transform: translateY(-1px); }
        .mini-btn svg { width: 15px; height: 15px; fill: currentColor; flex-shrink: 0; }

        /* ---- contact chips ---- */
        .chip-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        @media (min-width: 480px) {
          .chip-row { grid-template-columns: repeat(4, 1fr); }
        }
        .chip {
          display: flex;
          //flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          // background: var(--paper-2);
          // border: 1px solid var(--line);
          background: linear-gradient(135deg, var(--teal) 0%, var(--teal-deep) 100%);
          box-shadow: var(--shadow-md);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 14px 6px;
          text-decoration: none;
          color: var(--ink);
          transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
        }
        .chip:active { background: var(--teal); color: #fff; }
        @media (hover: hover) {
          .chip:hover { transform: translateY(-2px); box-shadow: var(--shadow-sm); border-color: var(--teal); }
        }
        .chip svg { width: 19px; height: 19px; fill: currentColor; }
         .social-chip svg{fill:currentColor;}
        .chip span {
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.03em;
          font-weight: 600;
          white-space: nowrap;
        }

        /* ---- social + qr footer ---- */
        .bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .social-row { display: flex; gap: 9px;justify-content: center; flex-wrap: wrap; margin: 12px 0 0 0; }
        .social-chip {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--paper-2);
          border: 1px solid var(--line);
          display: flex; align-items: center; justify-content: center;
          color: var(--ink);
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
        }
        @media (hover: hover) {
          .social-chip:hover { background: var(--teal); color: #fff; transform: translateY(-2px); }
        }
        .social-chip svg { width: 65%; height: 65%; fill: currentColor; }
        /* Instagram */
        .social-chip.instagram{
            background:linear-gradient(
                45deg,
                #f09433,
                #e6683c,
                #dc2743,
                #cc2366,
                #bc1888
            );
            box-shadow:0 8px 20px rgba(220,39,67,.35);
        }

        /* Facebook */
        .social-chip.facebook{
            background:#1877F2;
            box-shadow:0 8px 20px rgba(24,119,242,.35);
        }

        /* LinkedIn */
        .social-chip.linkedin{
            background:#0A66C2;
            box-shadow:0 8px 20px rgba(10,102,194,.35);
        }

        /* YouTube */
        .social-chip.youtube{
            background:#FF0000;
            box-shadow:0 8px 20px rgba(255,0,0,.35);
        }
            /* Google */
        .social-chip.google{
            background:#ffffff;
            color:#4285F4;
            border:1px solid #e5e5e5;
            box-shadow:0 8px 20px rgba(0,0,0,.12);
        }

        .social-chip.google:hover{
            background:#4285F4;
            color:#fff;
            transform:translateY(-4px) scale(1.08);
        }

        .social-chip:hover{
            transform:translateY(-4px) scale(1.08);
            filter:brightness(1.05);
        }
        .developer-credit {
          align-self: center;
          position: relative;
          display: inline-flex;
          justify-content: center;
          color: rgba(255,255,255,0.72);
          font-size: 11px;
          letter-spacing: 0.02em;
          text-decoration: none;
        }
        .developer-credit strong {
          color: #fff;
          font-weight: 700;
        }
        .developer-credit::after {
          content: "Webicon Software Solutions";
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%) translateY(4px);
          white-space: nowrap;
          border-radius: 999px;
          background: rgba(2, 18, 17, 0.92);
          color: #fff;
          padding: 6px 10px;
          font-size: 11px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.16s ease, transform 0.16s ease;
          box-shadow: var(--shadow-sm);
        }
        .developer-credit:hover {
          color: #fff;
        }
        .developer-credit:hover::after {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        .qr-mini {
          display: flex; align-items: center; gap: 10px;
          min-width: 0;
          background: var(--paper-2);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 8px 12px 8px 8px;
          box-shadow: var(--shadow-sm);
        }
        .qr-mini > svg {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          border: 1px solid var(--line);
          background: #fff;
          padding: 3px;
          flex-shrink: 0;
        }
        .qr-mini-text {
          font-family: var(--mono);
          font-size: 10.5px;
          color: #a89fd1;
          line-height: 1.3;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .qr-mini-text a { color: var(--coral); text-decoration: none; font-weight: 600; }
        .qr-download-btn {
          appearance: none;
          border: 1px solid var(--line);
          background: var(--paper);
          color: var(--ink);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          padding: 0;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .qr-download-btn:hover, .qr-download-btn:active { background: var(--teal); color: #fff; }

        a:focus-visible, button:focus-visible {
          outline: 2px solid var(--teal);
          outline-offset: 2px;
        }

        /* ---- mobile: fit one screen, no scroll ---- */
        @media (max-width: 700px) {
          html, body, #root { height: 100%; }
          .page {
            height: 100dvh;
            min-height: 0;
            overflow: hidden;
            align-items: center;
            padding: clamp(8px, 3vh, 16px) clamp(12px, 4vw, 20px);
          }
          .wrap {
            height: 100%;
            max-width: 460px;
            justify-content: space-between;
            gap: clamp(6px, 1.3vh, 11px);
            min-height: 0;
          }
          .wrap > * { animation: none; flex: 0 0 auto; min-height: 0; }

          .hero {
            gap: clamp(10px, 3vw, 14px);
            padding: clamp(10px, 2.2vh, 16px) clamp(12px, 3.5vw, 18px);
            border-radius: 16px;
            flex-wrap: nowrap;
          }
          .avatar {
            width: clamp(44px, 12vw, 58px);
            height: clamp(44px, 12vw, 58px);
            font-size: clamp(16px, 4.2vw, 21px);
          }
          .name {
            font-size: clamp(16.5px, 4.7vw, 20.5px);
            line-height: 1.3;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .cred-spec {
            font-size: clamp(11px, 2.8vw, 13px);
            margin-top: 3px;
            white-space: normal;
            overflow: visible;
            text-overflow: clip;
            overflow-wrap: anywhere;
          }
          .status-row {
            font-size: clamp(10.5px, 2.4vw, 12px);
            margin-top: 6px;
            padding: 4px 10px 4px 8px;
          }

          .book-btn {
            margin-top: clamp(6px, 1.3vh, 10px);
            font-size: clamp(10.5px, 2.4vw, 12px);
            padding: clamp(6px, 1.2vh, 8px) clamp(12px, 3vw, 16px);
            gap: 6px;
          }
          .book-btn svg { width: 13px; height: 13px; }

          .pulse-trace { height: clamp(8px, 1.6vh, 14px); }

          .card {
            padding: clamp(8px, 1.8vh, 12px) clamp(10px, 3vw, 14px);
            border-radius: 14px;
            overflow: hidden;
          }
          .eyebrow {
            font-size: clamp(8.5px, 1.9vw, 9.5px);
            margin-bottom: clamp(4px, 1vh, 7px);
          }
          .card-divider {
            margin: clamp(8px, 1.8vh, 12px) 0 clamp(6px, 1.4vh, 9px);
          }

          .areas-list {
            grid-template-columns: 1fr 1fr;
            gap: clamp(4px, 1vh, 7px);
          }
          .areas-list li {
            padding: clamp(5px, 1.2vh, 8px) 8px;
            font-size: clamp(10.5px, 2.5vw, 12px);
            line-height: 1.25;
            border-radius: 9px;
          }
          .areas-list li::before { margin-top: 5px; width: 5px; height: 5px; }

          .grid2 { grid-template-columns: 1fr 1fr; gap: clamp(6px, 1.6vw, 10px); }

          .hours-row {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: clamp(3px, 0.8vh, 6px) 0;
            gap: 4px;
          }
          .hours-day {
            font-size: clamp(10px, 2.3vw, 11.5px);
            padding-top: 0;
          }
          .hours-slots {
            align-items: stretch;
            width: 100%;
            gap: clamp(3px, 0.8vh, 5px);
          }
          .slot-row { width: 100%; justify-content: space-between; gap: 6px; }
          .slot-time { font-size: clamp(10px, 2.3vw, 11.5px); }
          .slot-type {
            font-size: 8px;
            padding: 2px 6px;
            letter-spacing: 0.02em;
          }
          .closed-tag { font-size: clamp(10px, 2.3vw, 11.5px); }

          .addr {
            font-size: clamp(10.5px, 2.4vw, 12px);
            line-height: 1.3;
            margin-bottom: clamp(6px, 1.2vh, 10px);
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .mini-btn {
            font-size: clamp(10.5px, 2.3vw, 12px);
            padding: clamp(5px, 1.1vh, 7px) clamp(9px, 2vw, 12px);
          }

          .chip-row { grid-template-columns: repeat(4, 1fr); gap: clamp(5px, 1.5vw, 8px); }
          .chip { padding: clamp(6px, 1.4vh, 9px) 3px; gap: 3px; border-radius: 11px; }
          .chip svg { width: clamp(14px, 3.6vw, 17px); height: clamp(14px, 3.6vw, 17px); }
          .chip span { font-size: clamp(8.5px, 1.9vw, 10px); }

          .social-row { gap: clamp(5px, 1.6vw, 8px); }
          .social-chip { width: clamp(26px, 7vw, 32px); height: clamp(26px, 7vw, 32px); }

          .qr-mini { padding: clamp(5px, 1.2vh, 7px) clamp(8px, 2vw, 10px) clamp(5px, 1.2vh, 7px) 6px; }
          .qr-mini > svg { width: clamp(30px, 8vw, 38px); height: clamp(30px, 8vw, 38px); }
          .qr-mini-text { font-size: clamp(8.5px, 1.9vw, 10px); }
          .qr-download-btn { width: clamp(24px, 6vw, 28px); height: clamp(24px, 6vw, 28px); }
        }
      `}</style>

      <div className="wrap">
        {/* IDENTITY / HERO */}
        <header className="hero">
          <div className="avatar">
            {CONFIG.photoUrl ? <img src={CONFIG.photoUrl} alt={CONFIG.name} /> : initials}
          </div>
          <div className="hero-text">
            <h1 className="name">{CONFIG.name}</h1>
            <h1 className="name">{CONFIG.namemarathi}</h1>
            <div className="specialty">{CONFIG.credentials} </div>
             <div className="cred-spec">{CONFIG.specialty}</div>
               <div className="cred-spec">{CONFIG.specialty1}</div>
                <div className="grid2">
                  <div className="status-row">
                     <span className={`dot ${isOpen ? "open" : ""}`} />
                     <div className={`status ${isOpen ? "open" : "closed"}`}>
                       <span className="status-main">{isOpen ? "Open Now" : "Closed"}</span>
                       {isOpen && currentSession && <span className="status-session">{currentSession}</span>}
                       {!isOpen && <span className="status-session">Emergency only</span>}
                     </div>
           <div className={`status status-legacy ${isOpen ? "open" : "closed"}`}>
  <span className="dot"></span>

  {isOpen
    ? `Open Now${currentSession ? ` • ${currentSession}` : ""}`
    : "Closed - Emergency only"}
</div></div>
              <div className="social-row">
  {CONFIG.socials.map((s) => (
    <a
      key={s.label}
      className={`social-chip ${s.icon}`}
      href={s.url}
      target="_blank"
      rel="noreferrer"
      aria-label={s.label}
      title={s.label}
    >
      <svg viewBox="0 0 24 24">
        {ICONS[s.icon]}
      </svg>
    </a>
  ))}
</div>
            </div>
           
          </div>
        </header>
 {/* CONTACT CHIPS */}
        <div className="chip-row">
          <a className="chip" href={telHref}>
            <svg viewBox="0 0 24 24">{ICONS.call}</svg>
            <span>CALL</span>
          </a>
          <a className="chip" href={`mailto:${CONFIG.email}`}>
            <svg viewBox="0 0 24 24">{ICONS.mail}</svg>
            <span>EMAIL</span>
          </a>
          <a className="chip" href={waHref} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24">{ICONS.whatsapp}</svg>
            <span>WHATSAPP</span>
          </a>
          <a className="chip" href={CONFIG.website} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24">{ICONS.globe}</svg>
            <span>WEBSITE</span>
          </a>
        </div>
        <PulseTrace id="div1" />

        {/* AREAS OF CARE */}
        <section className="card">
          <div className="eyebrow">Dedicated to Providing Comprehensive Care in :</div>
          <ul className="areas-list">
            {CONFIG.areas.map((a) => (
              <li key={a.text}>{a.text}</li>
            ))}
          </ul>
        </section>

        {/* HOURS + LOCATION */}
        <div className="grid2">
          <section className="card">
            <div className="eyebrow">Hours</div>

            {CONFIG.hours.map((h, index) => (
              <div className="hours-row" key={index}>
                <span className="hours-day">
                  {h.day || ""}
                </span>

                <span className="hours-slots">
                  {h.slots.length === 0 ? (
                    <span className="closed-tag">Closed</span>
                  ) : (
                    h.slots.map(([start, end, type], i) => (
                      <div key={i} className="slot-row">
                        <span className="slot-time">{start}–{end}</span>
                        <span className={`slot-type ${type === "OPD" ? "opd" : "appointment"}`}>
                          {type}
                        </span>
                      </div>
                    ))
                  )}
                </span>
              </div>
            ))}
          
          </section>

          <section className="card">
            <div className="eyebrow">Location</div>
            <div className="addr">{CONFIG.address}</div>
            <a className="mini-btn" href={CONFIG.mapsUrl} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24">{ICONS.pin}</svg>
              Directions
            </a>
              <a className="book-btn" href={bookingHref}>
              <svg viewBox="0 0 24 24">{ICONS.calendar}</svg>
              Book Appointment
            </a>
          </section>
        </div>
        <div className="book-appointment">
</div>
        <a className="developer-credit" href="https://www.webiconss.com/" target="_blank" rel="noreferrer">
          Design & Developed by&nbsp;<strong>WSS</strong>
        </a>
        {/* SOCIAL + QR */}
       
      </div>
    </div>
  );
}
