import { useEffect, useMemo, useState } from "react";

/**
 * ============================================================
 *  EDIT THIS CONFIG WITH REAL DETAILS
 *  Everything on the page is driven from here.
 * ============================================================
 */
const CONFIG = {
  name: "Dr. Raveendra Gondhali",
  credentials: "MBBS, MD",
  specialty: "Consultant Physician",
  photoUrl: "", // paste an image URL here, or leave blank for the monogram

  hours: [
    { day: "Mon – Sat", slots: [["09:00", "13:00"], ["17:00", "20:00"]] },
    { day: "Sunday", slots: [] }, // empty = closed
  ],

  address: "123 MG Road, Camp, Pune, Maharashtra 411001",
  mapsUrl: "https://maps.google.com/?q=123+MG+Road+Camp+Pune",

  phone: "+91 98765 43210",
  email: "dr.gondhali@example.com",
  whatsapp: "+91 98765 43210",

  socials: [
    { label: "Instagram", url: "https://instagram.com/", icon: "instagram" },
    { label: "Facebook", url: "https://facebook.com/", icon: "facebook" },
    { label: "LinkedIn", url: "https://linkedin.com/", icon: "linkedin" },
    { label: "YouTube", url: "https://youtube.com/", icon: "youtube" },
  ],
  qrTargetUrl: "https://hospital-management-frontend-gold.vercel.app/DrRaveendraGondhali",
};

/** ---------- helpers ---------- */

function useIsOpenNow(hours) {
  return useMemo(() => {
    const now = new Date();
    const dayIdx = now.getDay(); // 0 Sun ... 6 Sat
    const label = dayIdx === 0 ? "Sunday" : "Mon – Sat";
    const today = hours.find((h) => h.day === label);
    if (!today || today.slots.length === 0) return false;
    const mins = now.getHours() * 60 + now.getMinutes();
    return today.slots.some(([start, end]) => {
      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);
      const s = sh * 60 + sm;
      const e = eh * 60 + em;
      return mins >= s && mins <= e;
    });
  }, [hours]);
}

const ICONS = {
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
};

/** signature element: an animated ECG / pulse trace, used as section dividers */
function PulseTrace({ id = "pt" }) {
  return (
    <svg
      className="pulse-trace"
      viewBox="0 0 400 40"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`fade-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--coral)" stopOpacity="0" />
          <stop offset="15%" stopColor="var(--coral)" stopOpacity="1" />
          <stop offset="85%" stopColor="var(--coral)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--coral)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 20 H130 L145 20 L155 5 L165 34 L175 20 L190 20 H400"
        fill="none"
        stroke={`url(#fade-${id})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Section({ eyebrow, children }) {
  return (
    <section className="card">
      <div className="eyebrow">{eyebrow}</div>
      {children}
    </section>
  );
}

export default function Dr_Raveendra_Gondhali() {
  const isOpen = useIsOpenNow(CONFIG.hours);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const initials = CONFIG.name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="page">
      <style>{`
        :root {
          --ink: #16241f;
          --paper: #eef2ed;
          --paper-2: #ffffff;
          --teal: #2f6f62;
          --teal-deep: #21534a;
          --coral: #e2543f;
          --line: #d7ded4;
          --mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
          --serif: 'Fraunces', Georgia, serif;
          --sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        * { box-sizing: border-box; }
        .page {
          min-height: 100vh;
          background: var(--paper);
          color: var(--ink);
          font-family: var(--sans);
          display: flex;
          justify-content: center;
          padding: 28px 14px 60px;
        }
        .shell { width: 100%; max-width: 420px; }

        .hero {
          background: linear-gradient(165deg, var(--teal) 0%, var(--teal-deep) 100%);
          border-radius: 22px;
          padding: 30px 24px 22px;
          color: var(--paper-2);
          position: relative;
          overflow: hidden;
        }
        .hero-bg-trace {
          position: absolute;
          inset: 0;
          opacity: 0.14;
          pointer-events: none;
        }
        .avatar {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: rgba(255,255,255,0.14);
          border: 1.5px solid rgba(255,255,255,0.4);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--serif);
          font-size: 26px;
          margin-bottom: 16px;
          overflow: hidden;
        }
        .avatar img { width: 100%; height: 100%; object-fit: cover; }
        .name {
          font-family: var(--serif);
          font-size: 26px;
          font-weight: 600;
          line-height: 1.15;
          margin: 0 0 4px;
        }
        .credentials {
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.06em;
          opacity: 0.75;
          margin-bottom: 6px;
        }
        .specialty {
          font-size: 14.5px;
          opacity: 0.92;
        }
        .status-row {
          display: flex; align-items: center; gap: 8px;
          margin-top: 18px;
          font-family: var(--mono);
          font-size: 12px;
          letter-spacing: 0.04em;
        }
        .dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: ${isOpen ? "#7CE0B8" : "#f2a7a7"};
        }
        .dot.open { animation: blip 1.6s ease-in-out infinite; }
        @keyframes blip {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124,224,184,0.55); }
          50% { box-shadow: 0 0 0 6px rgba(124,224,184,0); }
        }

        .pulse-trace { width: 100%; height: 28px; display: block; }
        .divider-wrap { margin: 6px 0 2px; }

        .card {
          background: var(--paper-2);
          border-radius: 18px;
          padding: 20px 22px 22px;
          margin-top: 14px;
          border: 1px solid var(--line);
        }
        .eyebrow {
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--teal-deep);
          margin-bottom: 14px;
        }

        .hours-row {
          display: flex; justify-content: space-between; align-items: baseline;
          padding: 9px 0;
          border-bottom: 1px dashed var(--line);
          font-family: var(--mono);
          font-size: 13.5px;
        }
        .hours-row:last-child { border-bottom: none; }
        .hours-day { color: var(--ink); font-weight: 500; }
        .hours-slots { color: #5b6b62; text-align: right; }
        .closed-tag { color: #b56464; }

        .addr {
          font-size: 14.5px;
          line-height: 1.55;
          margin-bottom: 14px;
          color: #2b3a34;
        }
        .btn-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .btn {
          appearance: none; border: none; cursor: pointer;
          font-family: var(--sans);
          font-size: 13.5px;
          font-weight: 600;
          padding: 11px 16px;
          border-radius: 11px;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 7px;
          transition: transform 0.15s ease, filter 0.15s ease;
        }
        .btn:active { transform: scale(0.97); }
        .btn-primary { background: var(--teal); color: #fff; }
        .btn-primary:hover { filter: brightness(1.08); }
        .btn-outline {
          background: transparent; color: var(--teal-deep);
          border: 1.5px solid var(--teal);
        }
        .contact-grid { display: flex; flex-direction: column; gap: 10px; }
        .contact-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 14px;
          background: var(--paper);
          border-radius: 12px;
          font-size: 14px;
        }
        .contact-label { font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.08em; color: #6a7a71; text-transform: uppercase; }
        .contact-value { font-weight: 600; margin-top: 2px; }
        .contact-action {
          font-family: var(--mono); font-size: 12px;
          color: var(--teal-deep); text-decoration: none;
          border: 1px solid var(--teal); border-radius: 8px;
          padding: 6px 10px;
          white-space: nowrap;
        }

        .social-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .social-chip {
          width: 42px; height: 42px;
          border-radius: 50%;
          background: var(--paper);
          border: 1px solid var(--line);
          display: flex; align-items: center; justify-content: center;
          color: var(--teal-deep);
          text-decoration: none;
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .social-chip:hover { background: var(--teal); color: #fff; transform: translateY(-2px); }
        .social-chip svg { width: 19px; height: 19px; fill: currentColor; }

        .qr-block {
          display: flex; align-items: center; gap: 16px;
        }
        .qr-block img {
          width: 96px; height: 96px;
          border-radius: 10px;
          border: 1px solid var(--line);
          background: #fff;
          padding: 6px;
        }
        .qr-note { font-size: 12.5px; color: #5b6b62; line-height: 1.5; }
        .qr-note code {
          font-family: var(--mono);
          background: var(--paper);
          padding: 1px 5px;
          border-radius: 5px;
          font-size: 11px;
          word-break: break-all;
        }

        footer.foot {
          text-align: center;
          margin-top: 24px;
          font-family: var(--mono);
          font-size: 11px;
          color: #7d8a82;
          letter-spacing: 0.04em;
        }

        @media (prefers-reduced-motion: reduce) {
          .dot.open { animation: none; }
        }
      `}</style>

      <div className="shell">
        {/* HERO */}
        <div className="hero">
          <div className="hero-bg-trace">
            <PulseTrace id="bg" />
          </div>
          <div className="avatar">
            {CONFIG.photoUrl ? (
              <img src={CONFIG.photoUrl} alt={CONFIG.name} />
            ) : (
              initials
            )}
          </div>
          <h1 className="name">{CONFIG.name}</h1>
          <div className="credentials">{CONFIG.credentials}</div>
          <div className="specialty">{CONFIG.specialty}</div>

          <div className="status-row">
            <span className={`dot ${isOpen ? "open" : ""}`} />
            {isOpen ? "OPEN NOW" : "CLOSED NOW"}
          </div>
        </div>

        <div className="divider-wrap">
          <PulseTrace id="div1" />
        </div>

        {/* HOURS */}
        <Section eyebrow="Opening Hours">
          {CONFIG.hours.map((h) => (
            <div className="hours-row" key={h.day}>
              <span className="hours-day">{h.day}</span>
              <span className="hours-slots">
                {h.slots.length === 0 ? (
                  <span className="closed-tag">Closed</span>
                ) : (
                  h.slots.map((s) => s.join("–")).join("  /  ")
                )}
              </span>
            </div>
          ))}
        </Section>

        {/* LOCATION */}
        <Section eyebrow="Location">
          <div className="addr">{CONFIG.address}</div>
          <div className="btn-row">
            <a
              className="btn btn-primary"
              href={CONFIG.mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Get Directions →
            </a>
          </div>
        </Section>

        {/* CONTACT */}
        <Section eyebrow="Contact">
          <div className="contact-grid">
            <div className="contact-item">
              <div>
                <div className="contact-label">Phone</div>
                <div className="contact-value">{CONFIG.phone}</div>
              </div>
              <a className="contact-action" href={`tel:${CONFIG.phone.replace(/\s/g, "")}`}>
                Call
              </a>
            </div>
            <div className="contact-item">
              <div>
                <div className="contact-label">Email</div>
                <div className="contact-value">{CONFIG.email}</div>
              </div>
              <a className="contact-action" href={`mailto:${CONFIG.email}`}>
                Email
              </a>
            </div>
            <div className="contact-item">
              <div>
                <div className="contact-label">WhatsApp</div>
                <div className="contact-value">{CONFIG.whatsapp}</div>
              </div>
              <a
                className="contact-action"
                href={`https://wa.me/${CONFIG.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
              >
                Message
              </a>
            </div>
          </div>
        </Section>

        {/* SOCIAL */}
        <Section eyebrow="Follow">
          <div className="social-row">
            {CONFIG.socials.map((s) => (
              <a
                key={s.label}
                className="social-chip"
                href={s.url}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                title={s.label}
              >
                <svg viewBox="0 0 24 24">{ICONS[s.icon]}</svg>
              </a>
            ))}
          </div>
        </Section>

        {/* QR (for reference / re-printing the card) */}
        <Section eyebrow="Card QR">
          <div className="qr-block">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(
                CONFIG.qrTargetUrl
              )}`}
              alt="QR code linking to this page"
            />
            <div className="qr-note">
              Points to <code>{CONFIG.qrTargetUrl}</code>. Replace with your
              deployed URL once this page is hosted publicly.
            </div>
          </div>
        </Section>

        <footer className="foot">SCAN · CONNECT · VISIT</footer>
      </div>
    </div>
  );
}