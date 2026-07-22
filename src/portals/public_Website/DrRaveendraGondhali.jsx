import { useMemo,  } from "react";

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
    { day: "Mon–Sat", slots: [["09:00", "13:00"], ["17:00", "20:00"]] },
    { day: "Sunday", slots: [] }, // empty = closed
  ],

  address: "Silver Birch Multispeciality Hospital, Datta Mandir Road Thergoan Pune, Maharashtra 411033",
  mapsUrl: "https://maps.google.com/?q=123+MG+Road+Camp+Pune",

  phone: "+91 98765 43210",
  email: "evafertilitypune@gmail.com",
  whatsapp: "+91 98765 43210",
  website: "https://evafertilitypune.com",

  socials: [
    { label: "Instagram", url: "https://instagram.com/", icon: "instagram" },
    { label: "Facebook", url: "https://facebook.com/", icon: "facebook" },
    { label: "LinkedIn", url: "https://linkedin.com/", icon: "linkedin" },
    { label: "YouTube", url: "https://youtube.com/", icon: "youtube" },
  ],

  qrTargetUrl: "https://hospital-management-frontend-gold.vercel.app/DrRaveendraGondhali/",
};

/** ---------- helpers ---------- */

function useIsOpenNow(hours) {
  return useMemo(() => {
    const now = new Date();
    const dayIdx = now.getDay(); // 0 Sun ... 6 Sat
    const label = dayIdx === 0 ? "Sunday" : "Mon–Sat";
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

/** brand + utility icons (social row) */
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

  const initials = CONFIG.name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const telHref = `tel:${CONFIG.phone.replace(/\s/g, "")}`;
  const waHref = `https://wa.me/${CONFIG.whatsapp.replace(/[^0-9]/g, "")}`;
  const websiteHost = CONFIG.website.replace(/^https?:\/\//, "").replace(/\/$/, "");

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
        html, body, #root { height: 100%; margin: 0; }

        .page {
          height: 100dvh;
          width: 100vw;
          background: var(--paper);
          color: var(--ink);
          font-family: var(--sans);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
        }

        .shell {
          width: 100%;
          height: 100%;
          max-width: 460px;
          max-height: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: clamp(10px, 3vh, 22px) clamp(14px, 4.5vw, 24px);
          gap: clamp(6px, 1.4vh, 12px);
          min-height: 0;
          overflow: hidden;
        }

        /* ---- identity bar ---- */
        .identity {
          display: flex;
          align-items: center;
          gap: clamp(10px, 3vw, 14px);
          background: linear-gradient(135deg, var(--teal) 0%, var(--teal-deep) 100%);
          border-radius: 16px;
          padding: clamp(10px, 2.2vh, 16px) clamp(12px, 3.5vw, 18px);
          color: #fff;
          flex: 0 0 auto;
        }
        .avatar {
          width: clamp(44px, 12vw, 58px);
          height: clamp(44px, 12vw, 58px);
          border-radius: 50%;
          background: rgba(255,255,255,0.16);
          border: 1.5px solid rgba(255,255,255,0.4);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--serif);
          font-size: clamp(15px, 4vw, 20px);
          flex-shrink: 0;
          overflow: hidden;
        }
        .avatar img { width: 100%; height: 100%; object-fit: cover; }
        .identity-text { min-width: 0; flex: 1; }
        .name {
          font-family: var(--serif);
          font-weight: 600;
          font-size: clamp(15px, 4.6vw, 20px);
          line-height: 1.15;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cred-spec {
          font-size: clamp(10.5px, 2.8vw, 12.5px);
          opacity: 0.9;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .status-row {
          display: flex; align-items: center; gap: 6px;
          margin-top: 5px;
          font-family: var(--mono);
          font-size: clamp(9.5px, 2.4vw, 11px);
          letter-spacing: 0.04em;
        }
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

        .pulse-trace { width: 100%; height: clamp(10px, 2vh, 16px); display: block; flex: 0 0 auto; }

        /* ---- generic mini card ---- */
        .grid2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(8px, 2.2vw, 12px);
          flex: 1 1 auto;
          min-height: 0;
        }
        .mini-card {
          background: var(--paper-2);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: clamp(9px, 2vh, 13px) clamp(10px, 2.5vw, 14px);
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow: hidden;
        }
        .eyebrow {
          font-family: var(--mono);
          font-size: clamp(8.5px, 2vw, 9.5px);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--teal-deep);
          margin-bottom: clamp(5px, 1.2vh, 8px);
        }

        .hours-row {
          display: flex; justify-content: space-between; align-items: baseline;
          padding: clamp(3px, 0.8vh, 6px) 0;
          border-bottom: 1px dashed var(--line);
          font-family: var(--mono);
          font-size: clamp(10.5px, 2.6vw, 12.5px);
        }
        .hours-row:last-child { border-bottom: none; }
        .hours-day { font-weight: 600; }
        .hours-slots { color: #5b6b62; text-align: right; }
        .closed-tag { color: #b56464; }

        .addr {
          font-size: clamp(10.5px, 2.6vw, 12.5px);
          line-height: 1.4;
          color: #2b3a34;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .mini-btn {
          margin-top: 6px;
          align-self: flex-start;
          font-family: var(--sans);
          font-weight: 600;
          font-size: clamp(10px, 2.4vw, 11.5px);
          color: #fff;
          background: var(--teal);
          border: none;
          border-radius: 8px;
          padding: clamp(5px, 1.2vh, 7px) clamp(9px, 2vw, 12px);
          text-decoration: none;
          white-space: nowrap;
        }

        /* ---- contact chips row ---- */
        .chip-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(6px, 1.8vw, 10px);
          flex: 0 0 auto;
        }
        .chip {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          background: var(--paper-2);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: clamp(7px, 1.6vh, 10px) 4px;
          text-decoration: none;
          color: var(--teal-deep);
          transition: background 0.15s ease, color 0.15s ease;
        }
        .chip:active { background: var(--teal); color: #fff; }
        .chip svg { width: clamp(15px, 4vw, 18px); height: clamp(15px, 4vw, 18px); fill: currentColor; }
        .chip span {
          font-family: var(--mono);
          font-size: clamp(8px, 2vw, 9.5px);
          letter-spacing: 0.02em;
        }

        /* ---- social + footer row ---- */
        .bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex: 0 0 auto;
        }
        .social-row { display: flex; gap: clamp(6px, 1.8vw, 9px); }
        .social-chip {
          width: clamp(28px, 7.5vw, 34px);
          height: clamp(28px, 7.5vw, 34px);
          border-radius: 50%;
          background: var(--paper-2);
          border: 1px solid var(--line);
          display: flex; align-items: center; justify-content: center;
          color: var(--teal-deep);
          text-decoration: none;
        }
        .social-chip svg { width: 45%; height: 45%; fill: currentColor; }

        .qr-mini {
          display: flex; align-items: center; gap: 8px;
        }
        .qr-mini img {
          width: clamp(34px, 9vw, 42px);
          height: clamp(34px, 9vw, 42px);
          border-radius: 6px;
          border: 1px solid var(--line);
          background: #fff;
          padding: 3px;
          flex-shrink: 0;
        }
        .qr-mini-text {
          font-family: var(--mono);
          font-size: clamp(8px, 2vw, 9.5px);
          color: #6a7a71;
          line-height: 1.3;
        }
        .qr-mini-text a { color: var(--teal-deep); text-decoration: none; font-weight: 600; }
      `}</style>

      <div className="shell">
        {/* IDENTITY BAR */}
        <div className="identity">
          <div className="avatar">
            {CONFIG.photoUrl ? <img src={CONFIG.photoUrl} alt={CONFIG.name} /> : initials}
          </div>
          <div className="identity-text">
            <h1 className="name">{CONFIG.name}</h1>
            <div className="cred-spec">{CONFIG.credentials} · {CONFIG.specialty}</div>
            <div className="status-row">
              <span className={`dot ${isOpen ? "open" : ""}`} />
              {isOpen ? "OPEN NOW" : "CLOSED NOW"}
            </div>
          </div>
        </div>

        <PulseTrace id="div1" />

        {/* HOURS + LOCATION */}
        <div className="grid2">
          <div className="mini-card">
            <div className="eyebrow">Hours</div>
            {CONFIG.hours.map((h) => (
              <div className="hours-row" key={h.day}>
                <span className="hours-day">{h.day}</span>
                <span className="hours-slots">
                  {h.slots.length === 0 ? (
                    <span className="closed-tag">Closed</span>
                  ) : (
                    h.slots.map((s) => s.join("–")).join(" / ")
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className="mini-card">
            <div className="eyebrow">Location</div>
            <div className="addr">{CONFIG.address}</div>
            <a className="mini-btn" href={CONFIG.mapsUrl} target="_blank" rel="noreferrer">
              Directions →
            </a>
          </div>
        </div>

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

        {/* SOCIAL + QR */}
        <div className="bottom-row">
          <div className="social-row">
            {CONFIG.socials.map((s) => (
              <a key={s.label} className="social-chip" href={s.url} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label}>
                <svg viewBox="0 0 24 24">{ICONS[s.icon]}</svg>
              </a>
            ))}
          </div>
          <div className="qr-mini">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=6&data=${encodeURIComponent(CONFIG.qrTargetUrl)}`}
              alt="QR code linking to this page"
            />
            <div className="qr-mini-text">
              <a href={CONFIG.website} target="_blank" rel="noreferrer">{websiteHost}</a>
              <br />scan · connect · visit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}