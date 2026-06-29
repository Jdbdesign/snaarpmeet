"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const SERIF = "var(--font-instrument-serif), Georgia, serif";
const ANTON = "var(--font-anton), sans-serif";
const BARLOW = "var(--font-barlow), sans-serif";

/* ---- shared icon: the Snaarpmeet video glyph ---- */
function VideoGlyph({
  size,
  stroke = "#fff",
  strokeWidth = 2,
}: {
  size: number;
  stroke?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 8.5v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2Z" />
      <path d="m22 8-5 4 5 4V8Z" />
    </svg>
  );
}

/* ---- animated number that counts up the first time it scrolls into view ---- */
function CountUp({
  to,
  decimals = 0,
  duration = 1600,
  suffix,
}: {
  to: number;
  decimals?: number;
  duration?: number;
  suffix?: React.ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const format = (v: number) =>
      v.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || typeof IntersectionObserver === "undefined") {
      el.textContent = format(to);
      return;
    }

    el.textContent = format(0);
    let raf = 0;
    let started = false;

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        // easeOutExpo — fast start, gentle professional settle
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        el.textContent = format(to * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            run();
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [to, decimals, duration]);

  return (
    <>
      <span ref={ref}>{to.toFixed(decimals)}</span>
      {suffix}
    </>
  );
}

const featuresData: { icon: React.ReactNode; title: string; body: string }[] = [
  {
    icon: <VideoGlyph size={22} stroke="#FF4E10" strokeWidth={1.9} />,
    title: "HD Video & Audio",
    body: "Up to 1080p with AI-powered noise cancellation. Studio-quality, even from a noisy café.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF4E10" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="m9 21 3-3 3 3" />
      </svg>
    ),
    title: "Screen Sharing",
    body: "Share your full screen, a single app window, or a browser tab. Instant, no lag.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF4E10" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    title: "Breakout Rooms",
    body: "Split your team into focused sub-groups with one click. Bring them back just as fast.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF4E10" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
        <path d="M9 13h6M9 17h4" />
      </svg>
    ),
    title: "AI Meeting Notes",
    body: "Snaarpmeet summarises and sends a structured recap — action items, decisions, key quotes.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF4E10" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 11h2M7 15h6M13 11h4" />
      </svg>
    ),
    title: "Live Captions",
    body: "Real-time subtitles in 40+ languages. Everyone follows along, no matter the accent.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF4E10" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <rect x="7" y="11" width="3" height="6" />
        <rect x="13" y="7" width="3" height="10" />
      </svg>
    ),
    title: "Polls & Reactions",
    body: "Keep energy high. Run instant polls, hand raises, and emoji reactions without leaving the call.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF4E10" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3.2" fill="#FF4E10" stroke="none" />
      </svg>
    ),
    title: "Meeting Recording",
    body: "Record to the cloud or download locally. Auto-chapters and searchable transcripts included.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF4E10" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    ),
    title: "Custom Backgrounds",
    body: "Upload your own, blur the mess behind you, or pick from our curated library.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF4E10" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    title: "Calendar Integration",
    body: "One-click scheduling from Google Calendar or Outlook. Links auto-generated and attached.",
  },
];

const planFeatures = [
  "Unlimited meetings",
  "Up to 100 participants",
  "HD video & audio",
  "AI meeting notes & summaries",
  "Cloud recording",
  "Breakout rooms",
  "Live captions (40+ languages)",
  "Screen sharing",
  "Polls, reactions, Q&A",
  "Custom backgrounds",
  "Calendar integration",
  "End-to-end encryption",
  "Priority email support",
];

const trustedLogos = [
  { src: "/logos/notion.svg", alt: "Notion" },
  { src: "/logos/figma.svg", alt: "Figma" },
  { src: "/logos/vercel.svg", alt: "Vercel" },
  { src: "/logos/loom.svg", alt: "Loom" },
  { src: "/logos/stripe.svg", alt: "Stripe" },
  { src: "/logos/webflow.svg", alt: "Webflow" },
  { src: "/logos/intercom.svg", alt: "Intercom" },
];

const faqData = [
  {
    q: "Do participants need a Snaarpmeet account to join?",
    a: "No. Anyone with the meeting link can join directly from their browser. Only the host needs an account.",
  },
  {
    q: "Is my meeting data private?",
    a: "Yes. All meetings are end-to-end encrypted. We don't store audio, video, or meeting content. AI notes are processed ephemerally and sent only to the host.",
  },
  {
    q: "How does the free trial work?",
    a: "Start a 7-day trial with no credit card. All Pro features are available immediately. After 7 days you'll be asked to subscribe — or your account moves to a free tier with limited meeting length.",
  },
  {
    q: "What's the participant limit?",
    a: "Up to 100 participants per meeting on the Pro plan.",
  },
  {
    q: "Can I record my meetings?",
    a: "Yes. All recordings are saved to cloud storage and available for 30 days. Download them at any time.",
  },
  {
    q: "What happens if my internet drops mid-meeting?",
    a: "Snaarpmeet auto-reconnects and adjusts video quality in real time based on your connection. You won't fall out of a call for a brief blip.",
  },
  {
    q: "Is there a mobile app?",
    a: "Yes — iOS and Android apps are available. You can also join from any mobile browser without downloading anything.",
  },
  {
    q: "Do you offer team or enterprise plans?",
    a: "Not yet — we're focused on perfecting the individual and small-team experience first. Enterprise inquiries can be sent to hello@snaarpmeet.com.",
  },
];

const EASE = "cubic-bezier(.22,1,.36,1)";

/* Scroll-reveal: starts hidden, flipped visible by the shared IntersectionObserver.
   Slides up + fades. Use for any block that doesn't need its transform for hover. */
const reveal = (delay = 0): CSSProperties => {
  const s: Record<string, string | number> = {
    opacity: 0,
    transform: "translateY(30px)",
    transition: `opacity .85s ${EASE} ${delay}s, transform .85s ${EASE} ${delay}s`,
    willChange: "opacity, transform",
    "--reveal": 1,
  };
  return s as CSSProperties;
};

/* Opacity-only reveal that keeps `transform` free for hover lifts (e.g. feature cards).
   `extra` lets callers prepend their own transitions (hover transform, background…). */
const revealFade = (delay = 0, extra = ""): CSSProperties => {
  const s: Record<string, string | number> = {
    opacity: 0,
    transition: `${extra}${extra ? ", " : ""}opacity .85s ${EASE} ${delay}s`,
    "--reveal": 1,
  };
  return s as CSSProperties;
};

export default function Home() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number>(0);

  const typedRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const full = "to show up for";
    let i = 0;
    let iv: ReturnType<typeof setInterval>;
    let end: ReturnType<typeof setTimeout>;

    const start = setTimeout(() => {
      iv = setInterval(() => {
        i++;
        if (typedRef.current) typedRef.current.textContent = full.slice(0, i);
        if (i >= full.length) {
          clearInterval(iv);
          end = setTimeout(() => {
            if (cursorRef.current) cursorRef.current.style.display = "none";
          }, 1400);
        }
      }, 62);
    }, 680);

    return () => {
      clearTimeout(start);
      clearTimeout(end);
      clearInterval(iv);
    };
  }, []);

  /* Scroll-reveal: reveal every [--reveal] block once as it enters the viewport,
     cascading smoothly from hero to footer. Honours reduced-motion. */
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>('[style*="--reveal"]')
    );
    const show = (el: HTMLElement) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    };

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || typeof IntersectionObserver === "undefined") {
      nodes.forEach(show);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target as HTMLElement);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    nodes.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const priceBig = yearly ? "€5" : "€7";
  const priceNote = yearly ? "or €60 billed yearly — save 40%" : "billed monthly";

  return (
    <div style={{ overflowX: "hidden" }}>
      {/* ============ NAV ============ */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(12px)",
          background: "rgba(245,244,241,0.78)",
          borderBottom: "1px solid rgba(26,26,26,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "16px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em" }}>
              Snaarpmeet
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 36,
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            <a href="#features" className="nav-link" style={{ color: "#3a3a3a", textDecoration: "none" }}>
              Features
            </a>
            <a href="#how" className="nav-link" style={{ color: "#3a3a3a", textDecoration: "none" }}>
              How it Works
            </a>
            <a href="#pricing" className="nav-link" style={{ color: "#3a3a3a", textDecoration: "none" }}>
              Pricing
            </a>
            <a href="#faq" className="nav-link" style={{ color: "#3a3a3a", textDecoration: "none" }}>
              FAQ
            </a>
          </div>
          <a
            href="#pricing"
            className="btn-dark"
            style={{
              background: "#1A1A1A",
              color: "#fff",
              padding: "11px 22px",
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            Start for Free <span style={{ fontSize: 15 }}>&rarr;</span>
          </a>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section style={{ position: "relative", padding: "78px 32px 96px" }}>
        {/* background arcs */}
        <div
          style={{
            position: "absolute",
            top: 90,
            left: "50%",
            transform: "translateX(-50%)",
            width: 760,
            height: 760,
            border: "1px solid rgba(26,26,26,0.07)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 170,
            left: "50%",
            transform: "translateX(-50%)",
            width: 540,
            height: 540,
            border: "1px solid rgba(26,26,26,0.06)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 920, margin: "0 auto", textAlign: "center", position: "relative", ...reveal() }}>
          {/* trust badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              background: "#fff",
              border: "1px solid rgba(26,26,26,0.1)",
              padding: "7px 16px 7px 13px",
              borderRadius: 999,
              fontSize: 13.5,
              fontWeight: 500,
              marginBottom: 30,
            }}
          >
            <span style={{ color: "#FF4E10", letterSpacing: "1px" }}>★★★★★</span>
            <span style={{ color: "#3a3a3a" }}>4.9/5 · Rated #1 for simplicity on G2</span>
          </div>

          {/* headline */}
          <h1
            style={{
              fontWeight: 800,
              fontSize: 74,
              lineHeight: 1.04,
              letterSpacing: "-0.035em",
              margin: "0 0 0",
              color: "#1A1A1A",
            }}
          >
            <span style={{ display: "block" }}>Meetings your team</span>
            <span style={{ display: "block" }}>actually wants</span>
            <span
              style={{
                display: "block",
                minHeight: 88,
                fontFamily: SERIF,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 84,
                lineHeight: 1.0,
                color: "#FF4E10",
                letterSpacing: "-0.01em",
              }}
            >
              <span ref={typedRef}></span>
              <span
                ref={cursorRef}
                style={{
                  display: "inline-block",
                  width: 3,
                  height: "0.78em",
                  background: "#FF4E10",
                  marginLeft: 4,
                  transform: "translateY(0.1em)",
                  animation: "blink 1s step-end infinite",
                  verticalAlign: "baseline",
                }}
              ></span>
            </span>
          </h1>

          <p
            style={{
              fontSize: 19,
              lineHeight: 1.55,
              color: "#6B6B6B",
              maxWidth: 560,
              margin: "26px auto 0",
            }}
          >
            HD video, AI notes, screen sharing, and breakout rooms — all in your browser. No
            downloads. No friction.
          </p>

          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              marginTop: 34,
              flexWrap: "wrap",
            }}
          >
            <a
              href="#pricing"
              className="btn-dark"
              style={{
                background: "#1A1A1A",
                color: "#fff",
                padding: "16px 28px",
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 15.5,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Start Free — No Card Needed <span>&rarr;</span>
            </a>
            <a
              href="#how"
              className="hero-btn-secondary"
              style={{
                background: "#fff",
                color: "#1A1A1A",
                padding: "16px 28px",
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 15.5,
                textDecoration: "none",
                border: "1.5px solid rgba(26,26,26,0.16)",
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#FF4E10",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              Watch a 90-sec Demo
            </a>
          </div>

          {/* app window mockup */}
          <div style={{ marginTop: 64, position: "relative" }}>
            <div
              style={{
                background: "#1A1A1A",
                borderRadius: 22,
                padding: 14,
                boxShadow: "0 40px 80px -30px rgba(26,26,26,0.4)",
                maxWidth: 840,
                margin: "0 auto",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 8px 12px" }}>
                <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57" }} />
                <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#febc2e" }} />
                <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840" }} />
                <span style={{ marginLeft: 14, color: "#777", fontSize: 12.5, fontFamily: "monospace" }}>
                  snaarpmeet.com/room/standup-q3
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  borderRadius: 13,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    aspectRatio: "16/10",
                    background: "linear-gradient(135deg,#2b3a4a,#1b2530)",
                    position: "relative",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: 12,
                  }}
                >
                  <video
                    src="/videos/participant1.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <span
                    style={{
                      position: "relative",
                      zIndex: 1,
                      color: "#cfd6dd",
                      fontSize: 12,
                      fontWeight: 600,
                      background: "rgba(0,0,0,0.4)",
                      padding: "3px 9px",
                      borderRadius: 7,
                    }}
                  >
                    Lena H.
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      zIndex: 1,
                      top: 12,
                      right: 12,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#28c840",
                      boxShadow: "0 0 0 3px rgba(40,200,64,0.25)",
                    }}
                  />
                </div>
                <div
                  style={{
                    aspectRatio: "16/10",
                    background: "linear-gradient(135deg,#3a2b3f,#241b2c)",
                    position: "relative",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: 12,
                  }}
                >
                  <video
                    src="/videos/participant2.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <span
                    style={{
                      position: "relative",
                      zIndex: 1,
                      color: "#cfd6dd",
                      fontSize: 12,
                      fontWeight: 600,
                      background: "rgba(0,0,0,0.4)",
                      padding: "3px 9px",
                      borderRadius: 7,
                    }}
                  >
                    Yuki T.
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  padding: "14px 0 6px",
                }}
              >
                <span
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: "#2a2a2a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  </svg>
                </span>
                <span
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: "#2a2a2a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <VideoGlyph size={18} />
                </span>
                <span
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: "#2a2a2a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="14" rx="2" />
                    <path d="M8 21h8" />
                  </svg>
                </span>
                <span
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: "#FF4E10",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LOGO BAR ============ */}
      <section
        style={{
          borderTop: "1px solid rgba(26,26,26,0.07)",
          borderBottom: "1px solid rgba(26,26,26,0.07)",
          padding: "30px 32px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center", ...reveal() }}>
          <p
            style={{
              fontSize: 12.5,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "#9a9a9a",
              fontWeight: 600,
              margin: "0 0 18px",
            }}
          >
            Trusted by teams at
          </p>
          <div className="marquee">
            <div className="marquee-track">
              {Array.from({ length: 4 }).flatMap((_, rep) =>
                trustedLogos.map((logo) => (
                  <img
                    key={`${rep}-${logo.alt}`}
                    src={logo.src}
                    alt={rep === 0 ? logo.alt : ""}
                    aria-hidden={rep === 0 ? undefined : true}
                    className={`logo-img${rep === 0 ? "" : " logo-dup"}`}
                    style={{ height: 24, width: "auto", display: "block", flex: "0 0 auto" }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ VALUE PROPS ============ */}
      <section style={{ padding: "96px 32px 40px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 56px", ...reveal() }}>
            <p
              style={{
                fontSize: 12.5,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#FF4E10",
                fontWeight: 700,
                margin: "0 0 16px",
              }}
            >
              Why Snaarpmeet
            </p>
            <h2 style={{ fontSize: 46, lineHeight: 1.1, letterSpacing: "-0.03em", fontWeight: 800, margin: 0 }}>
              Everything Google Meet does. Built for teams who actually{" "}
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: "#FF4E10" }}>
                need to move fast.
              </span>
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {/* ROW 1: text · visual */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
              {/* text card */}
              <div
                style={{
                  background: "#fff",
                  border: "1px solid rgba(26,26,26,0.07)",
                  borderRadius: 22,
                  padding: 38,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 330,
                  ...reveal(),
                }}
              >
                <h3
                  style={{
                    fontSize: 27,
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.15,
                    margin: "0 0 12px",
                  }}
                >
                  Join from any browser,
                  <br />
                  in seconds
                </h3>
                <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "#6B6B6B", margin: "0 0 22px", maxWidth: 380 }}>
                  No installs, no plugins, no waiting-room friction. Share a link and your whole team
                  is in — on any device.
                </p>
                <a
                  href="#how"
                  className="btn-outline"
                  style={{
                    alignSelf: "flex-start",
                    border: "1.5px solid rgba(26,26,26,0.18)",
                    color: "#1A1A1A",
                    padding: "10px 20px",
                    borderRadius: 999,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  See How It Works
                </a>
                <div style={{ display: "flex", gap: 56, marginTop: "auto", paddingTop: 34 }}>
                  <div>
                    <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em" }}>
                      &lt;2<span style={{ color: "#FF4E10" }}>s</span>
                    </div>
                    <div style={{ fontSize: 13.5, color: "#9a9a9a", marginTop: 2 }}>Average join time</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em" }}>
                      0<span style={{ color: "#FF4E10" }}> apps</span>
                    </div>
                    <div style={{ fontSize: 13.5, color: "#9a9a9a", marginTop: 2 }}>Downloads required</div>
                  </div>
                </div>
              </div>
              {/* visual card */}
              <div
                style={{
                  position: "relative",
                  minHeight: 330,
                  borderRadius: 22,
                  overflow: "hidden",
                  background: "linear-gradient(160deg,#ff7a45 0%,#FF4E10 42%,#7a1f0c 100%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 32,
                  ...reveal(0.08),
                }}
              >
                <img
                  src="/images/card-open.jpg"
                  alt=""
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(160deg,#ff7a45 0%,#FF4E10 42%,#7a1f0c 100%)",
                    opacity: 0.72,
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle at 30% 20%,rgba(255,255,255,0.18),transparent 55%), repeating-linear-gradient(115deg,rgba(255,255,255,0.05) 0 2px,transparent 2px 22px)",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                    background: "#1A1A1A",
                    padding: "9px 16px 9px 13px",
                    borderRadius: 999,
                    marginBottom: 26,
                  }}
                >
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em" }}>
                    Snaarpmeet
                  </span>
                </div>
                <div
                  style={{
                    position: "relative",
                    fontFamily: ANTON,
                    fontWeight: 400,
                    textTransform: "uppercase",
                    textAlign: "center",
                    fontSize: 42,
                    lineHeight: 0.98,
                    letterSpacing: "0.01em",
                    color: "#FFF1E9",
                    textShadow: "0 2px 30px rgba(0,0,0,0.25)",
                  }}
                >
                  Open a link.
                  <br />
                  You&apos;re in.
                </div>
              </div>
            </div>

            {/* ROW 2: visual · text */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
              {/* visual card */}
              <div
                style={{
                  position: "relative",
                  minHeight: 330,
                  borderRadius: 22,
                  overflow: "hidden",
                  background: "linear-gradient(160deg,#ff8a52 0%,#FF4E10 40%,#5e1707 100%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 32,
                  ...reveal(),
                }}
              >
                <img
                  src="/images/card-notes.jpg"
                  alt=""
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(160deg,#ff8a52 0%,#FF4E10 40%,#5e1707 100%)",
                    opacity: 0.72,
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle at 70% 25%,rgba(255,255,255,0.16),transparent 55%), repeating-linear-gradient(115deg,rgba(255,255,255,0.05) 0 2px,transparent 2px 22px)",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                    background: "#1A1A1A",
                    padding: "9px 16px 9px 13px",
                    borderRadius: 999,
                    marginBottom: 26,
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 7,
                      background: "#FF4E10",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
                      <path d="m12 2 2.4 6.9L21 11l-6.6 2.1L12 20l-2.4-6.9L3 11l6.6-2.1z" />
                    </svg>
                  </span>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em" }}>
                    Snaarpmeet AI
                  </span>
                </div>
                <div
                  style={{
                    position: "relative",
                    fontFamily: ANTON,
                    fontWeight: 400,
                    textTransform: "uppercase",
                    textAlign: "center",
                    fontSize: 38,
                    lineHeight: 0.98,
                    letterSpacing: "0.01em",
                    color: "#FFF1E9",
                    textShadow: "0 2px 30px rgba(0,0,0,0.25)",
                  }}
                >
                  Notes in your inbox
                  <br />
                  before you stand up.
                </div>
              </div>
              {/* text card */}
              <div
                style={{
                  background: "#fff",
                  border: "1px solid rgba(26,26,26,0.07)",
                  borderRadius: 22,
                  padding: 38,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 330,
                  ...reveal(0.08),
                }}
              >
                <h3 style={{ fontSize: 27, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 12px" }}>
                  AI that captures
                  <br />
                  every decision
                </h3>
                <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "#6B6B6B", margin: "0 0 22px", maxWidth: 380 }}>
                  Snaarpmeet listens, transcribes, and summarises — action items and key quotes
                  delivered the moment your call ends. Encrypted end-to-end, processed ephemerally.
                </p>
                <a
                  href="#features"
                  className="btn-outline"
                  style={{
                    alignSelf: "flex-start",
                    border: "1.5px solid rgba(26,26,26,0.18)",
                    color: "#1A1A1A",
                    padding: "10px 20px",
                    borderRadius: 999,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Explore AI Notes
                </a>
                <div style={{ display: "flex", gap: 56, marginTop: "auto", paddingTop: 34 }}>
                  <div>
                    <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em" }}>
                      <CountUp to={40} suffix={<span style={{ color: "#FF4E10" }}>+</span>} />
                    </div>
                    <div style={{ fontSize: 13.5, color: "#9a9a9a", marginTop: 2 }}>Languages supported</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em" }}>
                      <CountUp to={99.97} decimals={2} suffix={<span style={{ color: "#FF4E10" }}>%</span>} />
                    </div>
                    <div style={{ fontSize: 13.5, color: "#9a9a9a", marginTop: 2 }}>Uptime guaranteed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" style={{ padding: "80px 32px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 54, ...reveal() }}>
            <p
              style={{
                fontSize: 12.5,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#FF4E10",
                fontWeight: 700,
                margin: "0 0 16px",
              }}
            >
              Features
            </p>
            <h2 style={{ fontSize: 46, lineHeight: 1.08, letterSpacing: "-0.03em", fontWeight: 800, margin: 0 }}>
              Every tool your meeting{" "}
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: "#FF4E10" }}>
                deserves.
              </span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {featuresData.map((f, idx) => (
              <div
                key={f.title}
                className="feature-card"
                style={{
                  background: "#EDECEA",
                  borderRadius: 18,
                  padding: 30,
                  ...revealFade(
                    (idx % 3) * 0.06,
                    "transform .25s ease, background .25s ease"
                  ),
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 13,
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 18.5, fontWeight: 700, margin: "0 0 9px" }}>{f.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#6B6B6B", margin: 0 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how" style={{ padding: "80px 32px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60, ...reveal() }}>
            <p
              style={{
                fontSize: 12.5,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#FF4E10",
                fontWeight: 700,
                margin: "0 0 16px",
              }}
            >
              How it Works
            </p>
            <h2 style={{ fontSize: 46, lineHeight: 1.08, letterSpacing: "-0.03em", fontWeight: 800, margin: 0 }}>
              Up and running in{" "}
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: "#FF4E10" }}>
                three clicks.
              </span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 26, position: "relative" }}>
            {[
              {
                n: "01",
                t: "Create your meeting",
                p: "Sign up free and open a new room. Get a permanent link you can reuse, or generate a fresh one-time link.",
              },
              {
                n: "02",
                t: "Invite your team",
                p: "Copy the link or send invites from your calendar. Guests join from their browser — no account needed.",
              },
              {
                n: "03",
                t: "Meet with clarity",
                p: "HD video, AI notes and collaboration tools are waiting. The summary lands in your inbox before you stand up.",
              },
            ].map((s, idx) => (
              <div
                key={s.n}
                style={{ ...reveal(idx * 0.09) }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontStyle: "italic",
                    fontSize: 64,
                    color: "#FF4E10",
                    lineHeight: 1,
                    marginBottom: 16,
                  }}
                >
                  {s.n}
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 11px", letterSpacing: "-0.01em" }}>
                  {s.t}
                </h3>
                <p style={{ fontSize: 15.5, lineHeight: 1.62, color: "#6B6B6B", margin: 0 }}>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section style={{ padding: "80px 32px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div
            style={{
              background: "#fff",
              border: "1px solid rgba(26,26,26,0.06)",
              borderRadius: 24,
              padding: "64px 64px 58px",
              boxShadow: "0 30px 60px -38px rgba(26,26,26,0.18)",
              ...reveal(),
            }}
          >
            <p
              style={{
                fontSize: 27,
                lineHeight: 1.42,
                fontWeight: 600,
                letterSpacing: "-0.015em",
                color: "#1A1A1A",
                textAlign: "center",
                maxWidth: 760,
                margin: "0 auto 52px",
              }}
            >
              Snaarpmeet runs HD video, <span style={{ color: "#FF4E10" }}>AI notes</span>, and screen
              sharing right <span style={{ color: "#FF4E10" }}>in your browser</span> — no downloads, no
              friction, just meetings that <span style={{ color: "#FF4E10" }}>actually start on time.</span>
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 40 }}>
              <div>
                <div style={{ fontSize: 56, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1 }}>
                  <CountUp to={99.97} decimals={2} suffix={<span style={{ color: "#FF4E10" }}>%</span>} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 14 }}>Uptime guaranteed</div>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "#9a9a9a", margin: "8px 0 0", maxWidth: 240 }}>
                  Enterprise-grade reliability, so your calls never drop when it matters most.
                </p>
              </div>
              <div>
                <div style={{ fontSize: 56, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1 }}>
                  <CountUp to={40} suffix={<span style={{ color: "#FF4E10" }}>+</span>} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 14 }}>Languages supported</div>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "#9a9a9a", margin: "8px 0 0", maxWidth: 240 }}>
                  Real-time captions and transcripts that keep global teams perfectly in sync.
                </p>
              </div>
              <div>
                <div style={{ fontSize: 56, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1 }}>
                  &lt;<CountUp to={2} suffix={<span style={{ color: "#FF4E10" }}>s</span>} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 14 }}>Average join time</div>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "#9a9a9a", margin: "8px 0 0", maxWidth: 240 }}>
                  From link to live in under two seconds — no lobbies, no loading spinners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" style={{ padding: "80px 32px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 38, ...reveal() }}>
            <p
              style={{
                fontSize: 12.5,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#FF4E10",
                fontWeight: 700,
                margin: "0 0 16px",
              }}
            >
              Pricing
            </p>
            <h2 style={{ fontSize: 46, lineHeight: 1.08, letterSpacing: "-0.03em", fontWeight: 800, margin: "0 0 14px" }}>
              One plan.{" "}
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: "#FF4E10" }}>
                All features. Always.
              </span>
            </h2>
            <p style={{ fontSize: 17, color: "#6B6B6B", maxWidth: 480, margin: "0 auto" }}>
              No tiers, no locked features. Everything Snaarpmeet can do is yours from day one.
            </p>
          </div>

          {/* toggle */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#EDECEA",
                borderRadius: 999,
                padding: 5,
              }}
            >
              <button
                onClick={() => setYearly(false)}
                style={{
                  border: "none",
                  cursor: "pointer",
                  padding: "9px 20px",
                  borderRadius: 999,
                  fontFamily: BARLOW,
                  fontWeight: 600,
                  fontSize: 14,
                  transition: "all .25s ease",
                  background: yearly ? "transparent" : "#fff",
                  color: yearly ? "#6B6B6B" : "#1A1A1A",
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                style={{
                  border: "none",
                  cursor: "pointer",
                  padding: "9px 20px",
                  borderRadius: 999,
                  fontFamily: BARLOW,
                  fontWeight: 600,
                  fontSize: 14,
                  transition: "all .25s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  background: yearly ? "#fff" : "transparent",
                  color: yearly ? "#1A1A1A" : "#6B6B6B",
                }}
              >
                Yearly{" "}
                <span
                  style={{
                    fontSize: 11,
                    background: "#FF4E10",
                    color: "#fff",
                    padding: "2px 7px",
                    borderRadius: 999,
                    fontWeight: 700,
                  }}
                >
                  SAVE 40%
                </span>
              </button>
            </div>
          </div>

          <div
            style={{
              maxWidth: 440,
              margin: "0 auto",
              background: "#fff",
              border: "1px solid rgba(26,26,26,0.08)",
              borderRadius: 24,
              padding: 40,
              boxShadow: "0 30px 60px -30px rgba(26,26,26,0.2)",
              ...reveal(),
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontWeight: 700, fontSize: 19 }}>Snaarpmeet Pro</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#FF4E10",
                  background: "#FFE6D6",
                  padding: "5px 12px",
                  borderRadius: 999,
                  letterSpacing: "0.5px",
                }}
              >
                EVERYTHING INCLUDED
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 62, fontWeight: 800, letterSpacing: "-0.04em", transition: "opacity .3s ease" }}>
                {priceBig}
              </span>
              <span style={{ fontSize: 18, color: "#6B6B6B", fontWeight: 500 }}>/ month</span>
            </div>
            <p style={{ fontSize: 14, color: "#9a9a9a", margin: "0 0 26px" }}>{priceNote}</p>

            <div style={{ display: "grid", gap: 12, marginBottom: 30 }}>
              {planFeatures.map((feat) => (
                <div key={feat} style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 14.5, color: "#2a2a2a" }}>
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#FFE6D6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FF4E10" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  {feat}
                </div>
              ))}
            </div>

            <a
              href="#"
              className="btn-dark"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "#1A1A1A",
                color: "#fff",
                padding: 16,
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 16,
                textDecoration: "none",
              }}
            >
              Start Free Trial <span>&rarr;</span>
            </a>
            <p style={{ textAlign: "center", fontSize: 13, color: "#9a9a9a", margin: "14px 0 0" }}>
              7-day free trial · Cancel anytime · Billed in EUR
            </p>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section style={{ padding: "90px 32px", position: "relative" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 54, ...reveal() }}>
            <p
              style={{
                fontSize: 12.5,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#FF4E10",
                fontWeight: 700,
                margin: "0 0 16px",
              }}
            >
              What People Say
            </p>
            <h2 style={{ fontSize: 46, lineHeight: 1.08, letterSpacing: "-0.03em", fontWeight: 800, margin: 0 }}>
              Meetings people{" "}
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: "#FF4E10" }}>
                stop dreading.
              </span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {[
              {
                quote:
                  "“We switched from Zoom three months ago. The AI notes alone saved us hours of follow-up emails every week.”",
                initials: "LH",
                grad: "linear-gradient(135deg,#FF4E10,#ff8a5c)",
                name: "Lena Hoffmann",
                role: "Head of Product, Remotify",
                delay: 0,
              },
              {
                quote:
                  "“Snaarpmeet is the first conferencing tool where my non-technical co-founders never complain about joining a call.”",
                initials: "AO",
                grad: "linear-gradient(135deg,#3b6fd4,#7aa0e6)",
                name: "Adebayo Okonkwo",
                role: "CEO, Credr",
                delay: 0.08,
              },
              {
                quote:
                  "“The browser-first approach is a game changer. Our clients never have to download anything — calls actually start on time.”",
                initials: "SR",
                grad: "linear-gradient(135deg,#1f9d63,#5fcf95)",
                name: "Sophie Renard",
                role: "Freelance UX Consultant",
                delay: 0.16,
              },
            ].map((t) => (
              <div
                key={t.initials}
                style={{
                  background: "#fff",
                  border: "1px solid rgba(26,26,26,0.06)",
                  borderRadius: 18,
                  padding: 30,
                  ...reveal(t.delay),
                }}
              >
                <div style={{ color: "#FF4E10", fontSize: 15, letterSpacing: "2px", marginBottom: 16 }}>★★★★★</div>
                <p style={{ fontSize: 16.5, lineHeight: 1.62, color: "#2a2a2a", margin: "0 0 22px", fontWeight: 500 }}>
                  {t.quote}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: t.grad,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14.5 }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: "#9a9a9a" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ============ FAQ ============ */}
      <section id="faq" style={{ padding: "80px 32px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48, ...reveal() }}>
            <p
              style={{
                fontSize: 12.5,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#FF4E10",
                fontWeight: 700,
                margin: "0 0 16px",
              }}
            >
              FAQ
            </p>
            <h2 style={{ fontSize: 46, lineHeight: 1.08, letterSpacing: "-0.03em", fontWeight: 800, margin: 0 }}>
              Questions,{" "}
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: "#FF4E10" }}>
                answered.
              </span>
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqData.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={item.q}
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(26,26,26,0.07)",
                    borderRadius: 16,
                    overflow: "hidden",
                    ...reveal(idx * 0.05),
                  }}
                >
                  <button
                    onClick={() => setOpenFaq((cur) => (cur === idx ? -1 : idx))}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                      padding: "22px 24px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: BARLOW,
                    }}
                  >
                    <span style={{ fontSize: 17, fontWeight: 600, color: "#1A1A1A" }}>{item.q}</span>
                    <span
                      style={{
                        flexShrink: 0,
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "#EDECEA",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        fontWeight: 400,
                        color: "#FF4E10",
                        transition: "transform .3s ease",
                        transform: `rotate(${isOpen ? "45deg" : "0deg"})`,
                      }}
                    >
                      +
                    </span>
                  </button>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition: "grid-template-rows .32s ease",
                    }}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <p style={{ margin: 0, padding: "0 24px 24px", fontSize: 15.5, lineHeight: 1.62, color: "#6B6B6B" }}>
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section style={{ padding: "40px 32px 80px" }}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            background: "#1A1A1A",
            borderRadius: 30,
            padding: "80px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            ...reveal(),
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -60,
              left: -60,
              width: 260,
              height: 260,
              borderRadius: "50%",
              background: "radial-gradient(circle,rgba(255,78,16,0.22),transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -80,
              right: -40,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "radial-gradient(circle,rgba(255,78,16,0.16),transparent 70%)",
            }}
          />
          <div style={{ position: "relative" }}>
            <div
              style={{
                display: "inline-flex",
                width: 60,
                height: 60,
                borderRadius: 18,
                background: "#FFE6D6",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 28,
                animation: "floatY 4s ease-in-out infinite",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#FF4E10">
                <path d="m12 2 2.4 6.9L21 11l-6.6 2.1L12 20l-2.4-6.9L3 11l6.6-2.1z" />
              </svg>
            </div>
            <h2 style={{ fontSize: 54, lineHeight: 1.08, letterSpacing: "-0.03em", fontWeight: 800, color: "#fff", margin: "0 0 18px" }}>
              Your next great meeting starts{" "}
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: "#FF4E10" }}>
                right now.
              </span>
            </h2>
            <p style={{ fontSize: 18, color: "#b8b8b8", maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.55 }}>
              Join thousands of teams who&apos;ve made meetings worth showing up for.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="#pricing"
                className="cta-primary"
                style={{
                  background: "#FF4E10",
                  color: "#fff",
                  padding: "16px 30px",
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 16,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Start Free — No Card Needed <span>&rarr;</span>
              </a>
              <a
                href="#features"
                className="cta-secondary"
                style={{
                  background: "transparent",
                  color: "#fff",
                  padding: "16px 30px",
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 16,
                  textDecoration: "none",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                }}
              >
                See All Features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer style={{ borderTop: "1px solid rgba(26,26,26,0.08)", padding: "60px 32px 36px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 40, marginBottom: 48, ...reveal() }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
                <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.02em" }}>Snaarpmeet</span>
              </div>
              <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 20, color: "#6B6B6B", margin: "0 0 14px" }}>
                Meet without friction.
              </p>
              <p style={{ fontSize: 13, color: "#9a9a9a", margin: 0 }}>
                © 2026 Snaarpmeet. All rights reserved.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#1A1A1A", marginBottom: 16 }}>
                Product
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: 14.5 }}>
                <a href="#features" className="footer-link" style={{ color: "#6B6B6B", textDecoration: "none" }}>Features</a>
                <a href="#how" className="footer-link" style={{ color: "#6B6B6B", textDecoration: "none" }}>How It Works</a>
                <a href="#pricing" className="footer-link" style={{ color: "#6B6B6B", textDecoration: "none" }}>Pricing</a>
                <a href="#" className="footer-link" style={{ color: "#6B6B6B", textDecoration: "none" }}>Changelog</a>
                <a href="#" className="footer-link" style={{ color: "#6B6B6B", textDecoration: "none" }}>Download App</a>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#1A1A1A", marginBottom: 16 }}>
                Company
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: 14.5 }}>
                <a href="#" className="footer-link" style={{ color: "#6B6B6B", textDecoration: "none" }}>About</a>
                <a href="#" className="footer-link" style={{ color: "#6B6B6B", textDecoration: "none" }}>Blog</a>
                <a href="#" className="footer-link" style={{ color: "#6B6B6B", textDecoration: "none" }}>Careers</a>
                <a href="#" className="footer-link" style={{ color: "#6B6B6B", textDecoration: "none" }}>Press</a>
                <a href="#" className="footer-link" style={{ color: "#6B6B6B", textDecoration: "none" }}>Contact</a>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#1A1A1A", marginBottom: 16 }}>
                Legal
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: 14.5 }}>
                <a href="#" className="footer-link" style={{ color: "#6B6B6B", textDecoration: "none" }}>Privacy Policy</a>
                <a href="#" className="footer-link" style={{ color: "#6B6B6B", textDecoration: "none" }}>Terms of Service</a>
                <a href="#" className="footer-link" style={{ color: "#6B6B6B", textDecoration: "none" }}>Cookie Policy</a>
                <a href="#" className="footer-link" style={{ color: "#6B6B6B", textDecoration: "none" }}>Security</a>
              </div>
            </div>
          </div>
          <div
            style={{
              borderTop: "1px solid rgba(26,26,26,0.08)",
              paddingTop: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <span style={{ fontSize: 13.5, color: "#9a9a9a" }}>🌐 English (US)</span>
            <div style={{ display: "flex", gap: 14 }}>
              <a href="#" className="social-icon" style={{ width: 34, height: 34, borderRadius: 9, background: "#EDECEA", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#1A1A1A">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.65l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="social-icon" style={{ width: 34, height: 34, borderRadius: 9, background: "#EDECEA", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#1A1A1A">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.34 17V10.21H6.09V17zm-1.12-7.72a1.3 1.3 0 1 0 0-2.61 1.3 1.3 0 0 0 0 2.61zM18 17v-3.86c0-2.06-1.1-3.02-2.57-3.02a2.22 2.22 0 0 0-2.01 1.1V10.2h-2.25V17h2.25v-3.6c0-.95.18-1.86 1.35-1.86s1.18 1.08 1.18 1.92V17z" />
                </svg>
              </a>
              <a href="#" className="social-icon" style={{ width: 34, height: 34, borderRadius: 9, background: "#EDECEA", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#1A1A1A">
                  <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.21 11.19.6.11.82-.25.82-.56v-2.1c-3.34.71-4.04-1.57-4.04-1.57-.55-1.36-1.34-1.72-1.34-1.72-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.22 1.84 1.22 1.07 1.8 2.81 1.28 3.5.98.11-.76.42-1.28.76-1.58-2.67-.3-5.47-1.31-5.47-5.83 0-1.29.47-2.34 1.24-3.17-.12-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.21a11.5 11.5 0 0 1 6.01 0c2.29-1.53 3.3-1.21 3.3-1.21.66 1.64.24 2.86.12 3.16.77.83 1.23 1.88 1.23 3.17 0 4.53-2.81 5.53-5.49 5.82.43.37.81 1.1.81 2.22v3.29c0 .31.22.68.83.56A12.04 12.04 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
