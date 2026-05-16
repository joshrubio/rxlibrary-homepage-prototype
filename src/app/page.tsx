'use client';

import type React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { MarketingNav } from '@/components/homepage/marketing-nav';
import { FadeUp } from '@/components/homepage/fade-up';

const NarrativeCube = dynamic(
  () => import('@/components/homepage/narrative-cube').then((m) => ({ default: m.NarrativeCube })),
  { ssr: false },
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const BADGE_ICONS = {
  treatment: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 0 1 5 5v3H7V7a5 5 0 0 1 5-5Z"/>
      <path d="M7 10v7a5 5 0 0 0 10 0v-7"/>
      <line x1="12" y1="13" x2="12" y2="17"/>
      <line x1="10" y1="15" x2="14" y2="15"/>
    </svg>
  ),
  package: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  stethoscope: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
      <circle cx="20" cy="10" r="2"/>
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
};

interface Badge {
  text: string;
  sub: string;
  icon: React.ReactNode;
  side: 'left' | 'right';
  top: string;
  delay: string;
}

const BADGES: Badge[] = [
  { text: 'Plan my treatment', sub: 'AI-assisted intake', icon: BADGE_ICONS.treatment,   side: 'left',  top: '22%', delay: '0s'   },
  { text: 'Track my Rx',       sub: 'Ships in 24 hours',  icon: BADGE_ICONS.package,     side: 'right', top: '20%', delay: '0.3s' },
  { text: 'Free consultation', sub: 'Licensed providers', icon: BADGE_ICONS.stethoscope, side: 'left',  top: '36%', delay: '0.6s' },
  { text: 'All 50 states',     sub: 'HIPAA compliant',    icon: BADGE_ICONS.shield,      side: 'right', top: '34%', delay: '0.9s' },
];

interface TrustItem {
  label: string;
  icon: React.ReactNode;
}

const TRUST_ITEMS: TrustItem[] = [
  {
    label: 'HIPAA Compliant',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
  {
    label: 'LegitScript Certified',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9 12l2 2 4-4"/>
        <path d="M12 6v1M12 17v1M6 12h1M17 12h1"/>
      </svg>
    ),
  },
  {
    label: 'Licensed Providers',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/>
      </svg>
    ),
  },
  {
    label: 'All 50 States',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/>
      </svg>
    ),
  },
  {
    label: 'Local Pharmacy Partners',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>
        <path d="M9 22V12h6v10"/>
        <path d="M12 7v4M10 9h4"/>
      </svg>
    ),
  },
  {
    label: 'FDA-Registered Labs',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
      </svg>
    ),
  },
];

// ─── Bento palettes (fallback gradients when images aren't loaded yet) ────────
const BENTO_GRADIENTS = [
  'linear-gradient(135deg, #C97B3B 0%, #E8A84E 35%, #D4751F 60%, #8B4513 100%)', // amber desert
  'linear-gradient(135deg, #1A5F6A 0%, #2E9B8F 40%, #4FC3B5 70%, #1A7A8A 100%)', // teal sea
  'linear-gradient(135deg, #2C1810 0%, #5C2D1C 40%, #8B3A20 70%, #3D1E14 100%)', // dark canyon
  'linear-gradient(135deg, #B8956A 0%, #D4C5A0 35%, #7A9BC5 65%, #C4B07A 100%)', // icy gold
];

// ─── White-label brand carousel data ─────────────────────────────────────────

const BRAND_CARDS = [
  {
    label: 'PharmacyTime', lines: ['Pharmacy', 'Time'],
    bg: 'linear-gradient(160deg,#FEC944 0%,#E09900 100%)', dark: true,
    fonts: ['Poppins', 'Inter', 'Lato', 'Nunito'], activeFont: 0,
    layout: 'Rounded',
    colors: ['#A855F7', '#1E1E1E'],
  },
  {
    label: 'HeyTides', lines: ['Hey', 'Tides'],
    bg: 'linear-gradient(160deg,#0B3D5E 0%,#1565A0 100%)', dark: false,
    fonts: ['Montserrat', 'DM Sans', 'Nunito'], activeFont: 0,
    layout: 'Classic',
    colors: ['#F97316', '#0B3D5E'],
  },
  {
    label: 'CliniqFlow', lines: ['Cliniq', 'Flow'],
    bg: 'linear-gradient(160deg,#7C6FFF 0%,#5048CC 100%)', dark: false,
    fonts: ['Plus Jakarta', 'Manrope', 'Outfit'], activeFont: 0,
    layout: 'Rounded',
    colors: ['#7C6FFF', '#F0EDFF'],
  },
  {
    label: 'VitaRx', lines: ['Vita', 'Rx'],
    bg: 'linear-gradient(160deg,#10B981 0%,#059669 100%)', dark: false,
    fonts: ['Geist', 'Work Sans', 'Rubik', 'Inter'], activeFont: 0,
    layout: 'Classic',
    colors: ['#10B981', '#064E3B'],
  },
  {
    label: 'MedFlow', lines: ['Med', 'Flow'],
    bg: 'linear-gradient(160deg,#18102B 0%,#2D1A4A 100%)', dark: false,
    fonts: ['Satoshi', 'Neue Haas', 'Outfit'], activeFont: 0,
    layout: 'Classic',
    colors: ['#E94560', '#18102B'],
  },
  {
    label: 'PureHealth', lines: ['Pure', 'Health'],
    bg: 'linear-gradient(160deg,#F0EDFF 0%,#E4DEFF 100%)', dark: true,
    fonts: ['Lora', 'Cormorant', 'Fraunces', 'Garamond'], activeFont: 1,
    layout: 'Rounded',
    colors: ['#06B6D4', '#F0EDFF'],
  },
];

// ─── Care network bento cards ─────────────────────────────────────────────────

const CARE_CARDS = [
  {
    title: '10,000+ Licensed Providers',
    description: 'Physicians and nurse practitioners credentialed across every state, ready to see patients from day one — no recruiting required.',
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  },
  {
    title: 'All 50 States. No Exceptions.',
    description: 'Every state is fully staffed with licensed, credentialed providers. No geographic gaps, no holdups, no workarounds.',
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  },
  {
    title: 'DEA-Registered Across the Board',
    description: 'Every provider holds active DEA registration, covering controlled substance prescriptions without additional compliance overhead.',
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
  },
  {
    title: 'Zero Credentialing Work',
    description: "We've done the credentialing. You inherit a fully verified, compliant provider network on day one — no paperwork, no delays.",
    icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
  },
  {
    title: 'Multi-Specialty Coverage',
    description: 'Weight management, hormone therapy, men\'s health, dermatology, hair loss, and six more specialties — one network, all categories.',
    icon: 'M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  },
  {
    title: 'Async-Ready Providers',
    description: 'Providers support asynchronous intake flows. Patients submit, providers review and prescribe on a structured schedule.',
    icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  },
  {
    title: 'Same-Day Consultations',
    description: 'Providers available for same-day and next-day appointments across time zones. No waitlists, no patient drop-off.',
    icon: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
  },
  {
    title: 'Always On Coverage',
    description: 'Round-the-clock provider availability across time zones — no patient waits for care, no matter when they reach out.',
    icon: 'M22 12h-4l-3 9L9 3l-3 9H2',
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────

type TestimonialType = 'developer' | 'pharmacy' | 'team' | 'investor';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  type: TestimonialType;
}

const TESTIMONIAL_TYPE_LABELS: Record<TestimonialType, string> = {
  developer: 'Developer',
  pharmacy:  'Pharmacy Partner',
  team:      'RX Library Team',
  investor:  'Investor',
};

const TESTIMONIAL_TYPE_COLORS: Record<TestimonialType, { bg: string; text: string }> = {
  developer: { bg: 'rgba(59,130,246,0.12)',  text: 'rgba(147,197,253,0.85)' },
  pharmacy:  { bg: 'rgba(212,160,23,0.12)',  text: 'rgba(252,211,77,0.85)'  },
  team:      { bg: 'rgba(16,185,129,0.12)',  text: 'rgba(110,231,183,0.85)' },
  investor:  { bg: 'rgba(168,85,247,0.12)',  text: 'rgba(216,180,254,0.85)' },
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Spinning up a fully compliant telemedicine flow used to take six months. We shipped in three weeks.',
    name: 'Marcus T.',
    role: 'CTO',
    company: 'Forma Health',
    type: 'developer',
  },
  {
    quote: 'One API call and prescriptions were routing through a licensed provider network the same afternoon. The documentation is actually good.',
    name: 'Priya S.',
    role: 'Lead Engineer',
    company: 'Tide Health',
    type: 'developer',
  },
  {
    quote: 'GLP-1 demand hit us fast. We needed a compounded supply chain in 48 hours. RX Library had us live before the weekend.',
    name: 'Chris W.',
    role: 'Co-founder',
    company: 'Momentum Health',
    type: 'developer',
  },
  {
    quote: "We don't credential providers, negotiate pharmacy contracts, or chase DEA registrations. We build features. RX Library handles the rest.",
    name: 'Nathaniel P.',
    role: 'CTO',
    company: 'HealthStack',
    type: 'developer',
  },
  {
    quote: 'The API is refreshingly well-typed. I had our first prescription flow stubbed out in an afternoon — no mocks, real network calls.',
    name: 'Josh R.',
    role: 'Developer',
    company: 'RX Library',
    type: 'developer',
  },
  {
    quote: 'We went from servicing one clinic\'s overflow to patients across 12 states — without touching a single pharmacy license.',
    name: 'Daniel R.',
    role: 'Director of Operations',
    company: 'Summit Compounding',
    type: 'pharmacy',
  },
  {
    quote: 'The formulary integration just works. No manual reconciliation, no billing gaps. We stopped thinking about it entirely.',
    name: 'Angela M.',
    role: 'Pharmacy Owner',
    company: 'Clarity Rx',
    type: 'pharmacy',
  },
  {
    quote: 'Compounding with full compliance coverage used to mean months of state-by-state work. Now it\'s a configuration change.',
    name: 'Rachel O.',
    role: 'Clinical Operations Lead',
    company: 'PureScript Pharmacy',
    type: 'pharmacy',
  },
  {
    quote: 'Every partner we onboard saves months of regulatory groundwork. That\'s the entire product, and it never gets old.',
    name: 'James L.',
    role: 'Head of Partnerships',
    company: 'RX Library',
    type: 'team',
  },
  {
    quote: 'We built the compliance layer once so no one else has to build it again. When a partner launches in a new state, we\'ve already done the hard part.',
    name: 'Sofia K.',
    role: 'VP Engineering',
    company: 'RX Library',
    type: 'team',
  },
  {
    quote: 'We started with one clinical protocol and a small pharmacy network. Building that foundation once means every partner that comes after inherits everything.',
    name: 'Miguel L.',
    role: 'Co-founder',
    company: 'RX Library',
    type: 'team',
  },
  {
    quote: 'Healthcare infrastructure at the API layer is exactly where the market has been missing a durable layer. RX Library is building the rails.',
    name: 'Aaron V.',
    role: 'General Partner',
    company: 'Meridian Ventures',
    type: 'investor',
  },
  {
    quote: 'The network effects are real — every new partner strengthens the formulary and compliance coverage for everyone else on the platform.',
    name: 'Diana C.',
    role: 'Principal',
    company: 'Apex Health Capital',
    type: 'investor',
  },
  {
    quote: 'Pharmacy infrastructure has been severely underinvested at the distribution layer. This is the pick-and-shovel play for the next generation of digital health.',
    name: 'Robert M.',
    role: 'Managing Director',
    company: 'Foundry Health Partners',
    type: 'investor',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const isLoggedIn = false;
  const roleHome = { href: '/login' };

  // Brand carousel auto-advance
  const [activeBrand, setActiveBrand] = useState(0);
  // Track previous index to compute advance direction during render.
  // Updated in effect (after render) so prevActive.current = old value during render.
  const prevActive = useRef(activeBrand);
  useEffect(() => { prevActive.current = activeBrand; });
  useEffect(() => {
    const t = setInterval(() => setActiveBrand(p => (p + 1) % BRAND_CARDS.length), 3000);
    return () => clearInterval(t);
  }, []);

  // Section refs for NarrativeCube scroll tracking
  const heroSectionRef  = useRef<HTMLElement>(null);
  const orbitSectionRef = useRef<HTMLElement>(null);
  const section3Ref     = useRef<HTMLElement>(null);
  const careBentoRef    = useRef<HTMLDivElement>(null);

  // Blink energy stroke across Care Network bento cards — direct DOM, no re-render
  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    // Each card: 3 blinks × 1.8s = 5.4s on. 3 cards staggered 600ms apart.
    const BLINK_DUR = 1800;
    const BLINK_COUNT = 3;
    const TOTAL_ON  = BLINK_DUR * BLINK_COUNT; // 5400ms
    const BATCH     = 3;
    const STAGGER   = 600; // ms between each card's start

    function blink() {
      const grid = careBentoRef.current;
      if (!grid) return;
      const cards = Array.from(grid.children);

      // Pick BATCH unique random indices
      const picked = new Set<number>();
      while (picked.size < Math.min(BATCH, cards.length)) {
        picked.add(Math.floor(Math.random() * cards.length));
      }
      const batch = Array.from(picked).map(idx => cards[idx]!);

      // Stagger each card's start — each removes itself after TOTAL_ON
      batch.forEach((el, i) => {
        const addT = setTimeout(() => {
          el.classList.add('bento-energy');
          const removeT = setTimeout(() => el.classList.remove('bento-energy'), TOTAL_ON);
          timeouts.push(removeT);
        }, i * STAGGER);
        timeouts.push(addT);
      });

      // Next batch after last card finishes + random gap
      const batchDuration = (BATCH - 1) * STAGGER + TOTAL_ON;
      const nextT = setTimeout(() => {
        const gapT = setTimeout(blink, 600 + Math.random() * 600);
        timeouts.push(gapT);
      }, batchDuration);
      timeouts.push(nextT);
    }

    const initT = setTimeout(blink, 800);
    timeouts.push(initT);
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-9px); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes card-scroll-up {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .carousel-track > div:hover {
          animation-play-state: paused !important;
        }
        @keyframes bento-pulse {
          0%, 100% {
            box-shadow: 0 4px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04);
            border-color: #EBEBEB;
          }
          35%, 65% {
            box-shadow: 0 0 0 2px rgba(212,160,23,0.6), 0 0 28px rgba(212,160,23,0.28), inset 0 0 12px rgba(212,160,23,0.07);
            border-color: rgba(212,160,23,0.85);
          }
        }
        .bento-energy {
          animation: bento-pulse 1.8s ease-in-out 3 forwards !important;
        }
        .hero-badge {
          animation: floatY 4s ease-in-out infinite;
        }
        .hero-in {
          opacity: 0;
          animation: fadeSlideIn 0.85s cubic-bezier(0.22,1,0.36,1) forwards;
        }
      ` }} />

      {/* ── Sticky narrative canvas — one cube for the whole page ─────────────── */}
      <NarrativeCube
        heroRef={heroSectionRef}
        section2Ref={orbitSectionRef}
        section3Ref={section3Ref}
      />

      {/* ── Nav ────────────────────────────────────────────────────────────────── */}
      <MarketingNav isLoggedIn={isLoggedIn} dashboardHref={roleHome.href} />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section ref={heroSectionRef} style={{ position: 'relative', height: '100dvh', minHeight: 600, overflow: 'hidden' }}>

        {/* Yellow radial glow */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '-22%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '72vw',
            height: '72vw',
            background: 'radial-gradient(circle, rgba(212,160,23,0.13) 0%, rgba(212,160,23,0.04) 45%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Floating badge chips */}
        {BADGES.map((b) => (
          <div
            key={b.text}
            className="hero-badge"
            style={{
              position: 'absolute',
              top: b.top,
              ...(b.side === 'left'
                ? { left: 'clamp(16px, 6vw, 80px)' }
                : { right: 'clamp(16px, 6vw, 80px)' }),
              zIndex: 10,
              animationDelay: b.delay,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 14px',
              borderRadius: 14,
              background: 'rgba(20,20,20,0.75)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.45)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{b.icon}</span>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: 12, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                {b.text}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10, margin: 0, marginTop: 2, lineHeight: 1 }}>
                {b.sub}
              </p>
            </div>
          </div>
        ))}

        {/* Bottom gradient fade */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '38%',
            background: 'linear-gradient(to top, #080808 0%, transparent 100%)',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        />

        {/* Text + CTA — staggered fade-slide-in per element */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            left: 0,
            right: 0,
            zIndex: 10,
            textAlign: 'center',
            padding: '0 24px',
          }}
        >
          {/* Headline */}
          <h1
            className="hero-in"
            style={{
              color: '#FFFFFF',
              fontSize: 'clamp(34px, 5.5vw, 68px)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              margin: '0 auto',
              maxWidth: 720,
              animationDelay: '0.38s',
            }}
          >
            The operating system for modern healthcare distribution.
          </h1>

          {/* Subtitle */}
          <p
            className="hero-in"
            style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: 'clamp(14px, 1.8vw, 17px)',
              marginTop: 16,
              marginBottom: 32,
              maxWidth: 480,
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.6,
              animationDelay: '0.55s',
            }}
          >
            From ICHRA to telemedicine to pharmacy fulfillment, RX Library enables organizations to deploy healthcare experiences at enterprise scale.
          </p>

          {/* CTAs */}
          <div
            className="hero-in"
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              animationDelay: '0.72s',
            }}
          >
            {/* Login — phantom glass */}
            <Link
              href="/login"
              style={{
                padding: '11px 28px',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: 'none',
                display: 'inline-block',
                color: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(255,255,255,0.18)',
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            >
              Login
            </Link>
            {/* Book a demo — yellow */}
            <a
              href="/demo"
              style={{
                padding: '12px 28px',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: 'none',
                display: 'inline-block',
                background: '#D4A017',
                color: '#1A1200',
              }}
            >
              Book a demo →
            </a>
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 3 }}>
      <FadeUp>
        <div
          style={{
            padding: '48px 24px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: '#0C0C0C',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: 'rgba(255,255,255,0.22)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 28,
            }}
          >
            Trusted by patients across all 50 states
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px 36px' }}>
            {TRUST_ITEMS.map(({ label, icon }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: 'rgba(255,255,255,0.28)',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', opacity: 0.45 }}>
                  {icon}
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <main>

        {/* ── Section 2: Orchestration ────────────────────────────────────────── */}
        {/* First leg: hero black → mid grey */}
        <div style={{
          height: 320,
          background: `linear-gradient(to bottom,
            #0C0C0C 0%,
            #111111 20%,
            #1e1e1e 45%,
            #3a3a3a 70%,
            #686868 88%,
            #909090 100%
          )`,
        }} />

        {/* Section 2 picks up at mid-grey and fades all the way to white — the
            transition is intentionally long so the whole section starts tinted */}
        <section
          id="platform"
          ref={orbitSectionRef}
          style={{
            background: `linear-gradient(to bottom,
              #909090 0%,
              #b8b8b8 12%,
              #d4d4d4 26%,
              #e8e8e8 40%,
              #f4f4f4 58%,
              #fafafa 72%,
              #ffffff 88%
            )`,
            padding: '0 0 140px', position: 'relative', overflow: 'hidden',
          }}
        >
          <style>{`
            @keyframes node-in {
              from { opacity: 0; transform: translate(-50%, -50%) scale(0.78); }
              to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
          `}</style>

          {/* ── Bento bg — full section, behind everything ───────────────────── */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(4, 1fr)',
            gap: 16,
            padding: 16,
            opacity: 0.45,
            pointerEvents: 'none',
            zIndex: 0,
          }}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} style={{
                borderRadius: 28,
                background: '#E8E8E8',
                border: '1.5px solid #D4D4D4',
                boxShadow: '0 4px 20px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
              }} />
            ))}
          </div>

          {/* Composite white fade — top edge, bottom edge, radial under copy */}
          <div style={{
            position: 'absolute', inset: 0,
            background: [
              /* top edge fade — matches section's grey start colour */
              'linear-gradient(to bottom, #909090 0%, rgba(144,144,144,0) 10%)',
              /* bottom edge fade */
              'linear-gradient(to top,   #ffffff 0%, rgba(255,255,255,0) 10%)',
              /* radial halo behind the copy column — cards still peek left */
              'radial-gradient(ellipse 48% 70% at 22% 50%, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.45) 40%, rgba(255,255,255,0) 70%)',
            ].join(', '),
            pointerEvents: 'none',
            zIndex: 1,
          }} />

          <div style={{ position: 'relative', zIndex: 10, maxWidth: 1600, margin: '0 auto', padding: '0 64px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, alignItems: 'center', minHeight: 900 }}>

            {/* Left — copy */}
            <FadeUp>
              <div style={{ paddingRight: 48, position: 'relative', zIndex: 20 }}>
                <p style={{ color: '#D4A017', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16 }}>
                  Platform Architecture
                </p>
                <h2 style={{ fontSize: 'clamp(30px, 3.5vw, 50px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#111', marginBottom: 20 }}>
                  One platform.<br />Every stakeholder.<br />Every workflow.
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: '#666', marginBottom: 36 }}>
                  RX Library orchestrates the full care chain — employer benefits, provider consultations,
                  pharmacy fulfillment, and patient delivery — from a single infrastructure layer.
                </p>
              </div>
            </FadeUp>

            {/* Right — orbital overlay */}
            <div style={{ position: 'relative', height: 900 }}>

              {/* ── Orbital diagram — overlaid ───────────────────────────────── */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: 840, height: 840 }}>

                  {/* SVG rings + dashed lines — 840×840, center 420,420, r=315 */}
                  <svg
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
                    viewBox="0 0 840 840"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      {/* Energy glow filter — double-blur merge gives a soft corona */}
                      <filter id="energy-glow" x="-60%" y="-60%" width="220%" height="220%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1"/>
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2"/>
                        <feMerge>
                          <feMergeNode in="blur2"/>
                          <feMergeNode in="blur1"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="ring-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Outer ring — subtle amber glow */}
                    <circle cx="420" cy="420" r="315" fill="none"
                      stroke="rgba(212,160,23,0.22)" strokeWidth="1.5"
                      filter="url(#ring-glow)" />
                    {/* Inner ring — dashed */}
                    <circle cx="420" cy="420" r="195" fill="none"
                      stroke="rgba(212,160,23,0.14)" strokeWidth="1" strokeDasharray="4 6"
                      filter="url(#ring-glow)" />

                  </svg>

                {/* Orbital nodes — bento card style (white rim + deep shadow + dark inside) */}
                {([
                  { label: 'ICHRA',     sub: 'Employer',          accent: '#D4A017', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', pct: [50,   12.5] },
                  { label: 'Clinician', sub: 'Provider Portal',   accent: '#3B82F6', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',                                                             pct: [76.2, 25]   },
                  { label: 'eRx',       sub: 'Prescriptions',     accent: '#8B5CF6', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',            pct: [87.5, 50]   },
                  { label: 'Pharmacy',  sub: 'Fulfillment',       accent: '#F59E0B', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',                                                                 pct: [76.2, 75]   },
                  { label: 'Provider',  sub: 'Network',           accent: '#10B981', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0',  pct: [50,   87.5] },
                  { label: 'Payments',  sub: 'Stripe',            accent: '#06B6D4', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',                                         pct: [23.8, 75]   },
                  { label: 'Patient',   sub: 'Experience',        accent: '#EC4899', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',    pct: [12.5, 50]   },
                  { label: 'Admin',     sub: 'Merchant Dashboard', accent: '#64748B', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', pct: [23.8, 25] },
                ] as { label: string; sub: string; accent: string; icon: string; pct: [number, number] }[]).map(({ label, sub, accent, icon, pct }, i) => (
                  /* Bento card: white rim + deep shadow + image bg with baked dark tint */
                  <div key={label} style={{
                    position: 'absolute',
                    left: `${pct[0]}%`, top: `${pct[1]}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 8,
                    animation: 'node-in 0.55s cubic-bezier(0.22,1,0.36,1) both',
                    animationDelay: `${0.1 + i * 0.07}s`,
                    borderRadius: 22,
                    overflow: 'hidden',           /* clips inner image to outer radius */
                    outline: '3px solid rgba(255,255,255,0.92)',
                    outlineOffset: 0,
                    boxShadow: [
                      '0 2px 0 3px rgba(0,0,0,0.07)',
                      '0 16px 48px rgba(0,0,0,0.32)',
                      '0 4px 12px rgba(0,0,0,0.16)',
                    ].join(', '),
                  }}>
                    {/* Inner card */}
                    <div style={{
                      width: 116,
                      borderRadius: 20,
                      border: '1px solid rgba(255,255,255,0.12)',
                      padding: '16px 12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 9,
                      position: 'relative',
                      overflow: 'hidden',
                    }}>
                      {/* Blurred image layer — scale(1.15) hides blur edge artifacts */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: `url('/bento/${(i % 4) + 1}.jpg') center/cover, ${BENTO_GRADIENTS[i % 4]}`,
                        filter: 'blur(14px)',
                        transform: 'scale(1.15)',
                        borderRadius: 20,
                      }} />
                      {/* Dark frost overlay */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(8,8,8,0.52)',
                        borderRadius: 20,
                      }} />
                      {/* Icon circle */}
                      <div style={{
                        position: 'relative', zIndex: 1,
                        width: 40, height: 40, borderRadius: 12,
                        background: `${accent}22`,
                        border: `1px solid ${accent}50`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 0 16px ${accent}35`,
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                          stroke={accent} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                          <path d={icon} />
                        </svg>
                      </div>
                      {/* Text */}
                      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.92)', margin: 0, lineHeight: 1.25 }}>{label}</p>
                        <p style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.42)', margin: 0, marginTop: 2, lineHeight: 1 }}>{sub}</p>
                      </div>
                    </div>
                  </div>
                ))}
                </div>{/* end orbital 560×560 */}
              </div>{/* end orbital flex center */}
            </div>{/* end right relative 720 */}
          </div>{/* end grid */}
        </section>


        {/* ── Section 3: White Label ───────────────────────────────────────────── */}
        <section ref={section3Ref} style={{ background: '#ffffff', padding: '0 0 100px', overflow: 'hidden', position: 'relative' }}>

          {/* Two-col header: left = copy (above canvas), right = empty cube space (behind canvas) */}
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '100px 64px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>

            {/* Left — elevated above canvas (zIndex: 5 in root) */}
            <div style={{ position: 'relative', zIndex: 5 }}>
              <FadeUp>
                <div>
                  <p style={{ color: '#D4A017', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 14 }}>
                    White Label
                  </p>
                  <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.03em', color: '#111', marginBottom: 16 }}>
                    Your brand.<br />Your experience.<br />Live in days.
                  </h2>
                  <p style={{ fontSize: 16, lineHeight: 1.7, color: '#888', maxWidth: 460 }}>
                    Give your patients a healthcare experience that feels entirely yours. RX Library runs underneath, invisibly.
                  </p>
                </div>
              </FadeUp>
            </div>

            {/* Right — transparent cube space, no z-index so canvas paints above */}
            <div style={{ height: 420 }} />
          </div>

          {/* Carousel — elevated above canvas */}
          <div style={{ position: 'relative', zIndex: 5 }}>

          {/* Elliptic 3D carousel — cards grow as they reach screen edges (near side of ring) */}
          <div style={{ position: 'relative', height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}>

            {/* Perspective wrapper — no overflow clip so edge cards show */}
            <div style={{ position: 'relative', width: '100%', height: '100%', perspective: 900, perspectiveOrigin: '50% 50%' }}>
              {(() => {
                // Compute advance direction during render (prevActive.current = old value).
                // Forward (+1): hidden card pre-positioned on right → short slide-in from right.
                // Backward (-1): hidden card pre-positioned on left → short slide-in from left.
                // All cards share one transition — consistent smooth feel.
                const len = BRAND_CARDS.length;
                const rawDiff = activeBrand - prevActive.current;
                const wrapped = ((rawDiff % len) + len) % len;
                const carouselDir = rawDiff === 0 ? 1 : (wrapped <= len / 2 ? 1 : -1);
                return BRAND_CARDS.map((card, i) => {
                const rel = ((i - activeBrand) % len + len) % len;
                const pos = rel <= 2 ? rel : rel - len;
                const abs = Math.abs(pos);
                const sign = Math.sign(pos) || 1;

                // Hidden cards pre-positioned on the correct side (direction-aware).
                // They travel only ~160px when appearing instead of ~1280px cross-screen.
                const TX = abs >= 3
                  ? 720 * carouselDir
                  : ([0, 250, 560] as const)[abs]! * sign;
                const SC  = [0.80, 0.91, 1.02, 0.0][Math.min(abs, 3)]!;
                const RY  = [0,    26,   46,   58][Math.min(abs, 3)]! * -sign;
                const TZ  = [-50,  20,   85,   0][Math.min(abs, 3)]!;
                const OP  = [0.74, 0.90, 1.0,  0][Math.min(abs, 3)]!;
                const ZI  = [4,    6,    9,    0][Math.min(abs, 3)]!;

                const hex    = card.colors[0]!;
                const accent = hex;                             // brand name
                const tcDim    = 'rgba(255,255,255,0.32)';      // eyebrow / secondary
                const tcMuted  = 'rgba(255,255,255,0.18)';      // inactive pills

                return (
                  <div key={card.label} style={{
                    position: 'absolute',
                    left: '50%', top: '50%',
                    width: 230, height: 390,
                    marginLeft: -115, marginTop: -195,
                    borderRadius: 9,
                    background: '#0D0D0D',
                    boxShadow: '0 32px 72px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.30)',
                    transform: `translateX(${TX}px) rotateY(${RY}deg) translateZ(${TZ}px) scale(${SC})`,
                    opacity: OP,
                    zIndex: ZI,
                    transition: 'transform 0.85s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.55s ease',
                    overflow: 'hidden',
                    cursor: 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px 20px 18px',
                  }}>

                    {/* Top eyebrow label */}
                    <p style={{
                      fontSize: 8, fontWeight: 700, letterSpacing: '0.13em',
                      textTransform: 'uppercase', color: tcDim, margin: '0 0 10px',
                    }}>
                      RX Library · White Label
                    </p>

                    {/* Huge brand name — accent color */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: 4 }}>
                      {card.lines.map((line: string, li: number) => (
                        <p key={li} style={{
                          fontSize: 36, fontWeight: 900, color: accent,
                          margin: 0, lineHeight: 1, letterSpacing: '-0.04em',
                          fontFamily: `${card.fonts[card.activeFont]}, sans-serif`,
                          whiteSpace: 'nowrap', overflow: 'hidden',
                        }}>
                          {line}
                        </p>
                      ))}
                    </div>

                    {/* Divider */}
                    <div style={{
                      height: 1,
                      background: 'rgba(255,255,255,0.10)',
                      margin: '12px 0 10px',
                    }} />

                    {/* Font pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 9, overflow: 'hidden', maxHeight: 36 }}>
                      {card.fonts.map((font: string, fi: number) => (
                        <span key={font} style={{
                          fontSize: 8, fontWeight: 600, padding: '2.5px 6px', borderRadius: 5,
                          background: fi === card.activeFont ? 'rgba(255,255,255,0.08)' : 'transparent',
                          border: fi === card.activeFont
                            ? '1px solid rgba(255,255,255,0.18)'
                            : '1px solid transparent',
                          color: fi === card.activeFont ? accent : tcMuted,
                        }}>
                          {font}
                        </span>
                      ))}
                    </div>

                    {/* Layout toggle + color swatches */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                      {/* Rounded / Classic toggle */}
                      <div style={{ display: 'flex', gap: 3 }}>
                        {(['Rounded', 'Classic'] as const).map(opt => (
                          <span key={opt} style={{
                            fontSize: 7.5, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                            background: opt === card.layout ? 'rgba(255,255,255,0.08)' : 'transparent',
                            border: opt === card.layout
                              ? '1px solid rgba(255,255,255,0.18)'
                              : '1px solid transparent',
                            color: opt === card.layout ? accent : tcMuted,
                          }}>
                            {opt}
                          </span>
                        ))}
                      </div>

                      {/* Color swatches */}
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {card.colors.map((swatchHex: string) => (
                          <div key={swatchHex} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <div style={{
                              width: 11, height: 11, borderRadius: 3, background: swatchHex,
                              border: '1px solid rgba(255,255,255,0.12)',
                              flexShrink: 0,
                            }} />
                            <span style={{ fontSize: 6.5, color: tcDim, fontFamily: 'monospace', letterSpacing: '0.01em' }}>{swatchHex}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
            </div>
          </div>

          {/* Dot indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
            {BRAND_CARDS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBrand(i)}
                style={{
                  width: i === activeBrand ? 24 : 8, height: 8,
                  borderRadius: 4, border: 'none', cursor: 'pointer', padding: 0,
                  background: i === activeBrand ? '#D4A017' : '#E0E0E0',
                  transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
                }}
              />
            ))}
          </div>

          </div>{/* end carousel zIndex wrapper */}
        </section>

        {/* ── Section 4: Care Network ──────────────────────────────────────────── */}
        <section
          style={{
            background: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '100vh',
            display: 'grid',
            gridTemplateColumns: '1fr 900px',
          }}
        >
          {/* ── Bento bg — content cards ─────────────────────────────────────────── */}
          <div ref={careBentoRef} style={{
            position: 'absolute', inset: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 356px)',
            gridTemplateRows: 'repeat(4, 240px)',
            gap: 16,
            padding: 16,
            pointerEvents: 'none',
            zIndex: 0,
          }}>
            {Array.from({ length: 24 }).map((_, i) => {
              const card = CARE_CARDS[i % CARE_CARDS.length]!;
              return (
                <div key={i} style={{
                  borderRadius: 28,
                  background: '#ffffff',
                  border: '1.5px solid #EBEBEB',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
                  padding: '28px 28px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  boxSizing: 'border-box',
                }}>
                  {/* Icon badge */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: '#F7F7F7',
                    border: '1px solid #E8E8E8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    marginBottom: 20,
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="#AAAAAA" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d={card.icon} />
                    </svg>
                  </div>
                  {/* Text */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#444', margin: 0, lineHeight: 1.35 }}>
                      {card.title}
                    </p>
                    <p style={{ fontSize: 12.5, lineHeight: 1.7, color: '#B0B0B0', margin: 0 }}>
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Left edge fade */}
          <div aria-hidden style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 140,
            background: 'linear-gradient(to right, #ffffff 0%, transparent 100%)',
            zIndex: 1, pointerEvents: 'none',
          }} />

          {/* Right fade — below fixed canvas (z:2), above bento cards (z:0) */}
          <div aria-hidden style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '90%',
            background: 'linear-gradient(to right, transparent 0%, #ffffff 70%)',
            zIndex: 1, pointerEvents: 'none',
          }} />

          {/* Left column spacer */}
          <div style={{ position: 'relative', zIndex: 3 }} />

          {/* Right — copy. zIndex 5 above canvas. */}
          <div style={{
            position: 'relative', zIndex: 5,
            display: 'flex', alignItems: 'center',
            padding: '100px 80px 100px 0px',
          }}>
            <FadeUp>
              <div style={{ textAlign: 'right' }}>
                <p style={{
                  color: '#D4A017', fontSize: 10, fontWeight: 800,
                  letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16,
                }}>
                  Care Network
                </p>
                <h2 style={{
                  fontSize: 'clamp(38px, 4.2vw, 60px)', fontWeight: 800,
                  lineHeight: 1.06, letterSpacing: '-0.03em', margin: '0 0 20px',
                }}>
                  <span style={{ color: '#D4A017' }}>Every provider</span>
                  <br />
                  <span style={{ color: '#111111' }}>already connected.</span>
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.7, color: '#888', margin: 0, maxWidth: 360, marginLeft: 'auto' }}>
                  Inherit the full network — providers, pharmacies, compliance — live from day one.
                </p>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── Placeholder — scroll buffer ──────────────────────────────────── */}
        <section style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <p style={{ color: '#ccc', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Section 5 — Pricing</p>
        </section>

        {/* ── Section 4: Testimonials ──────────────────────────────────────── */}
        <section
          style={{
            background: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '100vh',
            display: 'grid',
            gridTemplateColumns: '1000px 1fr',
          }}
        >
          {/* Left — copy. z-index 5 above canvas. */}
          <div style={{
            position: 'relative',
            zIndex: 5,
            display: 'flex',
            alignItems: 'flex-start',
            padding: '120px 20px 80px 380px',
          }}>
            <FadeUp>
              <div>
                <p style={{
                  color: '#D4A017', fontSize: 10, fontWeight: 800,
                  letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16,
                }}>
                  Testimonials
                </p>
                <h2 style={{
                  fontSize: 'clamp(38px, 4.2vw, 64px)', fontWeight: 800,
                  lineHeight: 1.06, letterSpacing: '-0.03em', margin: '0 0 20px',
                }}>
                  <span style={{ color: '#D4A017' }}>Builders ship.</span>
                  <br />
                  <span style={{ color: '#111111' }}>Partners scale.</span>
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.7, color: '#888', margin: 0 }}>
                  From developers to pharmacy operators — here's what the network says.
                </p>
              </div>
            </FadeUp>
          </div>

          {/* Right — testimonial carousel. No z-index: cube floats above. */}
          <div style={{ position: 'relative' }}>
            <div className="carousel-track" style={{
              position: 'absolute',
              top: -200, bottom: -200, left: -20, right: -60,
              transform: 'rotate(-8deg)',
              transformOrigin: 'center right',
              display: 'grid',
              gridTemplateColumns: '240px 240px 240px',
              gap: 12,
              alignItems: 'start',
              justifyContent: 'end',
            }}>

              {[
                { delay: undefined, duration: '28s' },
                { delay: '-17s',    duration: '36s' },
                { delay: '-9s',     duration: '31s' },
              ].map(({ delay, duration }, col) => (
                <div key={col} style={{ animation: `card-scroll-up ${duration} linear infinite`, animationDelay: delay, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => {
                    const typeStyle = TESTIMONIAL_TYPE_COLORS[t.type];
                    return (
                      <div key={i} style={{
                        background: '#1C1C1C',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 14,
                        padding: '24px 22px',
                        minHeight: 320,
                        flexShrink: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}>
                        {/* Top */}
                        <div>
                          {/* Type pill */}
                          <span style={{
                            display: 'inline-block',
                            fontSize: 9, fontWeight: 700,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            background: typeStyle.bg, color: typeStyle.text,
                            padding: '3px 9px', borderRadius: 5, marginBottom: 18,
                          }}>
                            {TESTIMONIAL_TYPE_LABELS[t.type]}
                          </span>
                          {/* Quote mark */}
                          <p style={{ fontSize: 28, lineHeight: 1, color: 'rgba(255,255,255,0.10)', margin: '0 0 8px', fontFamily: 'Georgia, serif', fontWeight: 900 }}>"</p>
                          {/* Quote text */}
                          <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.78)', margin: 0, fontStyle: 'italic' }}>
                            {t.quote}
                          </p>
                        </div>
                        {/* Author */}
                        <div style={{
                          marginTop: 20,
                          paddingTop: 16,
                          borderTop: '1px solid rgba(255,255,255,0.07)',
                        }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.88)', margin: '0 0 3px' }}>
                            {t.name}
                          </p>
                          <p style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                            {t.role} · {t.company}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

            </div>
          </div>

        </section>

        {/* ── CTA + Footer ─────────────────────────────────────────────────── */}
        <section style={{ background: '#1E1E1E' }} className="px-6 md:px-16 py-28">
          <div className="max-w-4xl mx-auto text-center">
            <FadeUp>
              {/* Compliance badges */}
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {['HIPAA', 'SOC2', 'FHIR R4', 'API-first', 'AWS ECS Fargate', 'Enterprise-ready'].map((badge) => (
                  <div
                    key={badge}
                    className="rounded-full px-4 py-1.5 text-xs font-bold"
                    style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.45)' }}
                  >
                    {badge}
                  </div>
                ))}
              </div>
              <h2
                className="text-[clamp(32px,5vw,60px)] font-bold leading-[1.08] mb-6"
                style={{ letterSpacing: '-0.04em', color: '#fff' }}
              >
                Start Building.
              </h2>
              <p className="text-lg mb-10 mx-auto" style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '480px', lineHeight: 1.6 }}>
                Deploy healthcare infrastructure for your organization. Launch in weeks, not quarters.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl text-sm font-bold px-8 py-4 transition-all"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.14)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
                >
                  Login
                </a>
                <a
                  href="/demo"
                  className="inline-flex items-center justify-center rounded-xl text-sm font-bold px-8 py-4 transition-all"
                  style={{ background: '#FEC944', color: '#1E1E1E' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#D4A017'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#FEC944'; }}
                >
                  Book a demo →
                </a>
              </div>
            </FadeUp>

            {/* Footer */}
            <FadeUp delay={100}>
              <div className="mt-20 pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-2 font-bold" style={{ letterSpacing: '-0.04em', color: '#fff' }}>
                    <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: '#FEC944' }} />
                    Rx Library
                  </div>
                  <div className="flex flex-wrap justify-center gap-6">
                    {['Privacy Policy', 'Terms of Service', 'HIPAA Notice', 'Contact'].map((link) => (
                      <a key={link} href="#" className="text-xs transition-colors" style={{ color: 'rgba(255,255,255,0.35)' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    © 2026 RX Library. All rights reserved.
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

      </main>
    </div>
  );
}
