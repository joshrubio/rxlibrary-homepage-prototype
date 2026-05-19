'use client';

import type React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { MarketingNav } from '@/components/homepage/marketing-nav';
import { FadeUp } from '@/components/homepage/fade-up';
import { FooterCube } from '@/components/homepage/footer-cube';

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
    // Techy quirky geometric — distinct from classic rounded sans
    label: 'PharmacyTime', lines: ['Pharmacy', 'Time'],
    bg: 'linear-gradient(160deg,#FEC944 0%,#E09900 100%)', dark: true,
    fonts: ['Space Grotesk', 'Poppins', 'Outfit', 'Nunito'], activeFont: 0,
    layout: 'Rounded',
    colors: ['#A855F7', '#1E1E1E'],
  },
  {
    // Tall elegant geometric with wide tracking — distinct proportions
    label: 'HeyTides', lines: ['Hey', 'Tides'],
    bg: 'linear-gradient(160deg,#0B3D5E 0%,#1565A0 100%)', dark: false,
    fonts: ['Raleway', 'Montserrat', 'DM Sans'], activeFont: 0,
    layout: 'Classic',
    colors: ['#F97316', '#0B3D5E'],
  },
  {
    // Monospace — ultra-distinct, clinical/techy, unlike any other card
    label: 'CliniqFlow', lines: ['Cliniq', 'Flow'],
    bg: 'linear-gradient(160deg,#7C6FFF 0%,#5048CC 100%)', dark: false,
    fonts: ['IBM Plex Mono', 'Manrope', 'Outfit'], activeFont: 0,
    layout: 'Rounded',
    colors: ['#7C6FFF', '#F0EDFF'],
  },
  {
    // Optical serif with organic warmth — clear serif contrast vs sans cards
    label: 'VitaRx', lines: ['Vita', 'Rx'],
    bg: 'linear-gradient(160deg,#10B981 0%,#059669 100%)', dark: false,
    fonts: ['Fraunces', 'Lora', 'Merriweather'], activeFont: 0,
    layout: 'Classic',
    colors: ['#10B981', '#064E3B'],
  },
  {
    // Ultra-condensed display — completely different proportions, very impactful
    label: 'MedFlow', lines: ['Med', 'Flow'],
    bg: 'linear-gradient(160deg,#18102B 0%,#2D1A4A 100%)', dark: false,
    fonts: ['Bebas Neue', 'Barlow Condensed', 'Oswald'], activeFont: 0,
    layout: 'Classic',
    colors: ['#E94560', '#18102B'],
    titleSize: 56,
  },
  {
    // High-contrast transitional serif — luxury editorial, unmistakably different
    label: 'PureHealth', lines: ['Pure', 'Health'],
    bg: 'linear-gradient(160deg,#F0EDFF 0%,#E4DEFF 100%)', dark: true,
    fonts: ['Playfair Display', 'Cormorant Garamond', 'Fraunces'], activeFont: 0,
    layout: 'Rounded',
    colors: ['#06B6D4', '#F0EDFF'],
  },
];

// ─── Order tracking steps ─────────────────────────────────────────────────────
const TRACKING_STEPS = [
  { label: 'Intake Submitted',    color: '#7C6FFF' },
  { label: 'Provider Assigned',   color: '#7C6FFF' },
  { label: 'Consult Scheduled',   color: '#3B82F6' },
  { label: 'Consult Complete',    color: '#3B82F6' },
  { label: 'Rx Sent',            color: '#D4A017' },
  { label: 'Processing',          color: '#D4A017' },
  { label: 'Shipped',             color: '#10B981' },
  { label: 'Delivered',           color: '#10B981' },
];

// ─── See It In Action role data ───────────────────────────────────────────────

const SEE_IT_ROLES = [
  {
    label:    'Patient',
    headline: 'Care that fits\nyour life.',
    desc:     'Patients complete a quick intake, connect with a licensed provider, and receive their prescription — all from their phone. No waiting rooms, no paperwork, no friction.',
  },
  {
    label:    'Clinician',
    headline: 'Focus on care,\nnot admin.',
    desc:     'Clinicians get a clean queue, full patient context, and one-click eRx — no switching tools, no paperwork, no time wasted between patients.',
  },
  {
    label:    'Admin',
    headline: 'Full visibility.\nTotal control.',
    desc:     'Admins see every order, every provider, and every metric in one live dashboard. When something stalls, the system catches and fixes it before you notice.',
  },
] as const;

// ─── Adapts personas ──────────────────────────────────────────────────────────

const ADAPT_PERSONAS = [
  {
    key:       'employers',
    label:     'Employers',
    cardLabel: 'HR Dashboard',
    headline:  'Benefits that flex\nwith your team.',
    sub:       'Offer ICHRA-powered health benefits employees actually use. Configurable allowances, provider access, and pharmacy fulfillment — all on your terms.',
    bullets:   ['ICHRA administration built in', 'Employee enrollment & eligibility', 'Claims and reimbursement workflows', 'White-labeled for your brand'],
  },
  {
    key:       'providers',
    label:     'Retail Providers',
    cardLabel: 'Patient Queue',
    headline:  'Vertically integrated\ncare delivery.',
    sub:       'Launch a complete telemedicine experience — intake, clinical review, eRx, pharmacy fulfillment — branded for your practice and live in days.',
    bullets:   ['Intake-to-prescription in one flow', 'Connected to national provider networks', 'eRx via RXNT, direct pharmacy routing', 'Async + video telehealth modes'],
  },
  {
    key:       'pharmacies',
    label:     'Pharmacies',
    cardLabel: 'Fulfillment Pipeline',
    headline:  'Digital-first pharmacy\ninfrastructure.',
    sub:       'Expand your dispensing volume through embedded care infrastructure. Receive prescriptions from connected providers and fulfill seamlessly.',
    bullets:   ['Direct eRx ingestion pipeline', 'Fulfillment tracking and status APIs', 'Multi-pharmacy routing and failover', 'Compliant order management'],
  },
  {
    key:       'brands',
    label:     'Brands',
    cardLabel: 'Brand Config',
    headline:  'Your brand.\nEnterprise-grade stack.',
    sub:       'Deploy a fully branded healthcare ecosystem — patient portals, provider workflows, pharmacy network, compliance — without building the infrastructure.',
    bullets:   ['Full white-label across all touchpoints', 'Multi-tenant architecture per brand', 'HIPAA-ready infrastructure included', 'Launch in weeks, not quarters'],
  },
] as const;

// ─── Care network bento cards ─────────────────────────────────────────────────

const CARE_CARDS = [
  {
    title: '10,000+ Credentialed Clinicians',
    description: 'Board-certified physicians and NPs — fully credentialed, state-licensed, and DEA-registered. No recruiting. No paperwork. Inherited on day one.',
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  },
  {
    title: 'All 50 States. No Gaps.',
    description: 'Every state is covered with licensed, credentialed clinicians. Geographic restrictions never block a patient from care.',
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  },
  {
    title: 'Real Partner Pharmacies',
    description: 'Dispensing through licensed, accredited compounding and retail pharmacies — not fulfillment abstractions. Every script routes to a real pharmacy.',
    icon: 'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18',
  },
  {
    title: 'HIPAA-Compliant Labs',
    description: 'Integrated diagnostic lab partners operate under full HIPAA compliance. Requisitions, results, and PHI handled end-to-end within the network.',
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
  },
  {
    title: 'DEA-Registered Network',
    description: 'Active DEA registration across the provider base. Controlled substance prescriptions covered without building your own compliance layer.',
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M8 11h8M8 15h5',
  },
  {
    title: 'Multi-Specialty Coverage',
    description: 'Weight management, hormone therapy, men\'s health, dermatology, hair loss, and more — one network, every category your product needs.',
    icon: 'M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  },
  {
    title: 'Async & Sync Visits',
    description: 'Providers handle both structured async intakes and live synchronous consults. You define the flow — the network supports both.',
    icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  },
  {
    title: 'Zero Credentialing Overhead',
    description: 'Every clinician in the network is already verified, insured, and compliant. You ship — we maintain the credentials.',
    icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
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

  // Order tracking auto-advance — step 7 (Delivered) holds longer
  const [trackingStep, setTrackingStep] = useState(1);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const advance = (current: number) => {
      const delay = current === 7 ? 11000 : 2500;
      t = setTimeout(() => {
        const next = (current + 1) % TRACKING_STEPS.length;
        setTrackingStep(next);
        advance(next);
      }, delay);
    };
    advance(1);
    return () => clearTimeout(t);
  }, []);

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
  const section4Ref     = useRef<HTMLElement>(null);
  const section5Ref     = useRef<HTMLElement>(null);
  const footerRef       = useRef<HTMLElement>(null);
  const careBentoRef    = useRef<HTMLDivElement>(null);
  const careStatsRef    = useRef<HTMLDivElement>(null);
  const [careVisible, setCareVisible] = useState(false);
  const [statVals, setStatVals]       = useState([0, 0, 0, 90]);

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

  // Care Network stats — IntersectionObserver + RAF counter
  useEffect(() => {
    const el = careStatsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) { setCareVisible(true); obs.disconnect(); } },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!careVisible) return;
    const DURATION = 1400;
    const STAGGER  = DURATION; // next cell only starts after previous finishes
    const froms    = [0,     0,  0,   90];
    const targets  = [10000, 50, 200, 0 ];
    const rafIds: number[]                         = [];
    const timers:  ReturnType<typeof setTimeout>[] = [];

    froms.forEach((from, i) => {
      const t = setTimeout(() => {
        const start = performance.now();
        const tick  = (now: number) => {
          const raw  = Math.min((now - start) / DURATION, 1);
          const ease = 1 - Math.pow(1 - raw, 3);
          setStatVals(prev => {
            const next = [...prev];
            next[i] = from + (targets[i]! - from) * ease;
            return next;
          });
          if (raw < 1) rafIds[i] = requestAnimationFrame(tick);
          else setStatVals(prev => { const n = [...prev]; n[i] = targets[i]!; return n; });
        };
        rafIds[i] = requestAnimationFrame(tick);
      }, 820 + i * STAGGER);
      timers.push(t);
    });

    return () => {
      timers.forEach(clearTimeout);
      rafIds.forEach(id => id && cancelAnimationFrame(id));
    };
  }, [careVisible]);

  // ── Section 7: adapts persona auto-cycle ──────────────────────────────────
  const [adaptPersona, setAdaptPersona]   = useState(0);
  const [adaptProgress, setAdaptProgress] = useState(0);
  const [adaptHovered, setAdaptHovered]   = useState(false);
  const [adaptCardOut, setAdaptCardOut]   = useState(false);

  useEffect(() => {
    if (adaptHovered) return;
    const DURATION = 5000;
    const TICK     = 40;
    let elapsed    = 0;
    setAdaptProgress(0);
    const t = setInterval(() => {
      elapsed += TICK;
      if (elapsed >= DURATION) {
        clearInterval(t);
        setAdaptCardOut(true);
        setTimeout(() => {
          setAdaptPersona(p => (p + 1) % ADAPT_PERSONAS.length);
          setAdaptCardOut(false);
        }, 220);
      } else {
        setAdaptProgress((elapsed / DURATION) * 100);
      }
    }, TICK);
    return () => clearInterval(t);
  }, [adaptHovered, adaptPersona]);

  const switchAdaptPersona = (i: number) => {
    if (i === adaptPersona) return;
    setAdaptCardOut(true);
    setTimeout(() => {
      setAdaptPersona(i);
      setAdaptCardOut(false);
    }, 220);
  };

  // ── Section 8: Command Center story auto-advance ───────────────────────────
  const [storyStep, setStoryStep] = useState(0);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const DURATIONS = [3200, 3200, 3200, 4500];
    const advance = (current: number) => {
      t = setTimeout(() => {
        const next = (current + 1) % 4;
        setStoryStep(next);
        advance(next);
      }, DURATIONS[current]!);
    };
    advance(0);
    return () => clearTimeout(t);
  }, []);

  // ── Section "See It In Action" — sticky scroll ────────────────────────────
  const seeItScrollRef    = useRef<HTMLDivElement>(null);
  const prevSeeItRoleRef  = useRef(0);
  const [seeItRole, setSeeItRole]         = useState(0);
  const [seeItRotateX, setSeeItRotateX]   = useState(20);
  const [seeItScale, setSeeItScale]       = useState(0.92);
  const [seeItTilting, setSeeItTilting]   = useState(false);
  const [seeItProgress, setSeeItProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = seeItScrollRef.current;
      if (!el) return;
      const rect        = el.getBoundingClientRect();
      const totalScroll = el.offsetHeight - window.innerHeight;
      const scrolled    = Math.max(0, -rect.top);
      const progress    = Math.min(1, scrolled / totalScroll);
      setSeeItProgress(progress);

      // Initial tilt-in: 20→0 over first 20% of scroll
      const tiltP = Math.min(1, progress / 0.20);
      setSeeItRotateX(20 * (1 - tiltP));
      setSeeItScale(0.92 + 0.08 * tiltP);

      // Role: 0→1→2 at 33%/66%
      const newRole = progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2;
      if (newRole !== prevSeeItRoleRef.current) {
        prevSeeItRoleRef.current = newRole;
        setSeeItTilting(true);
        setTimeout(() => setSeeItTilting(false), 750);
      }
      setSeeItRole(newRole);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Raleway:wght@700;800;900&family=IBM+Plex+Mono:wght@700&family=Fraunces:opsz,wght@9..144,700;9..144,900&family=Bebas+Neue&family=Playfair+Display:wght@700;800;900&family=Cormorant+Garamond:wght@700&family=Poppins:wght@700;800;900&family=Outfit:wght@700;800;900&family=Nunito:wght@700;800;900&family=Montserrat:wght@700;800;900&family=DM+Sans:wght@700;800;900&family=Manrope:wght@700;800;900&family=Lora:wght@700&family=Merriweather:wght@700;900&family=Barlow+Condensed:wght@700;800;900&family=Oswald:wght@700&display=swap');

        @keyframes palette-blip {
          0%, 100% { color: #FEC944; }
          17%      { color: #7C6FFF; }
          33%      { color: #4CAAFF; }
          50%      { color: #10B981; }
          67%      { color: #E94560; }
          83%      { color: #7B2FBE; }
        }
        .palette-blip {
          animation: palette-blip 10s ease-in-out infinite;
          display: inline;
        }

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
            box-shadow: 8px 8px 22px rgba(13,39,80,0.16), -6px -6px 18px rgba(255,255,255,0.72);
            border-color: transparent;
          }
          35%, 65% {
            box-shadow: 8px 8px 22px rgba(13,39,80,0.16), -6px -6px 18px rgba(255,255,255,0.72), 0 0 0 2px rgba(212,160,23,0.6), 0 0 28px rgba(212,160,23,0.28);
            border-color: rgba(212,160,23,0.85);
          }
        }
        .bento-energy {
          animation: bento-pulse 1.8s ease-in-out 3 forwards !important;
        }
        @keyframes complete-pop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.5); }
          70%  { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .complete-pop { animation: complete-pop 0.6s cubic-bezier(0.22,1,0.36,1) forwards; }

        @keyframes header-slide-up {
          from { opacity: 0; transform: translateY(7px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .header-delivered { animation: header-slide-up 0.35s cubic-bezier(0.22,1,0.36,1) forwards; }

        @keyframes card-complete-scale {
          0%   { transform: scale(1); }
          35%  { transform: scale(1.055); }
          65%  { transform: scale(0.98); }
          100% { transform: scale(1); }
        }
        @keyframes card-stroke-pulse {
          0%, 100% { border-color: transparent; box-shadow: 8px 8px 22px rgba(13,39,80,0.16), -6px -6px 18px rgba(255,255,255,0.82); }
          40%, 60% { border-color: rgba(16,185,129,0.9); box-shadow: 8px 8px 22px rgba(13,39,80,0.16), -6px -6px 18px rgba(255,255,255,0.82), 0 0 32px rgba(16,185,129,0.32), 0 0 8px rgba(16,185,129,0.5); }
        }
        .card-at-complete {
          animation:
            card-complete-scale 0.65s cubic-bezier(0.22,1,0.36,1) forwards,
            card-stroke-pulse 1.8s ease-in-out 0.5s infinite;
        }

        @keyframes dot-cascade-green {
          0%   { background: #E8EAEC; box-shadow: inset 3px 3px 6px rgba(13,39,80,0.12), inset -2px -2px 5px rgba(255,255,255,0.88); }
          40%  { background: #10B981; box-shadow: 0 0 14px rgba(16,185,129,0.7), 0 0 4px rgba(16,185,129,0.9); }
          100% { background: #E8EAEC; box-shadow: inset 3px 3px 6px rgba(13,39,80,0.12), inset -2px -2px 5px rgba(255,255,255,0.88); }
        }
        .dot-cascade-green { animation: dot-cascade-green 1.1s ease-in-out forwards; }

        @keyframes pill-flash {
          0%   { transform: scale(1.07); box-shadow: inset 2px 2px 5px rgba(13,39,80,0.10), inset -2px -2px 4px rgba(255,255,255,0.88), 0 0 14px rgba(255,255,255,0.55); }
          100% { transform: scale(1);   box-shadow: inset 2px 2px 5px rgba(13,39,80,0.10), inset -2px -2px 4px rgba(255,255,255,0.88); }
        }
        .pill-flash { animation: pill-flash 0.5s cubic-bezier(0.22,1,0.36,1) forwards; }

        @keyframes dot-blip {
          0%, 100% { box-shadow: 3px 3px 8px rgba(212,160,23,0.35), -2px -2px 5px rgba(255,255,255,0.5); }
          50%       { box-shadow: 0 0 0 5px rgba(254,201,68,0.15), 0 0 14px rgba(254,201,68,0.35), 3px 3px 8px rgba(212,160,23,0.35), -2px -2px 5px rgba(255,255,255,0.5); }
        }
        .dot-blip { animation: dot-blip 2.8s ease-in-out infinite; }
        @keyframes dot-blip-green {
          0%, 100% { box-shadow: 3px 3px 8px rgba(16,185,129,0.35), -2px -2px 5px rgba(255,255,255,0.5); }
          50%       { box-shadow: 0 0 0 5px rgba(16,185,129,0.18), 0 0 16px rgba(16,185,129,0.5), 3px 3px 8px rgba(16,185,129,0.35), -2px -2px 5px rgba(255,255,255,0.5); }
        }
        .dot-blip-green { animation: dot-blip-green 2.8s ease-in-out infinite; }

        @keyframes stat-cell-lift {
          0%   { transform: translateY(18px); opacity: 0; }
          65%  { transform: translateY(-5px); opacity: 1; }
          100% { transform: translateY(0);    opacity: 1; }
        }
        .stat-lift { animation: stat-cell-lift 1s cubic-bezier(0.22,1,0.36,1) both; }

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
        section4Ref={section4Ref}
        section5Ref={section5Ref}
        footerRef={footerRef}
      />

      {/* ── Nav ────────────────────────────────────────────────────────────────── */}
      <MarketingNav isLoggedIn={isLoggedIn} dashboardHref={roleHome.href} />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section ref={heroSectionRef} style={{
        position: 'relative', height: '100dvh', minHeight: 600, overflow: 'hidden',
        background: '#1A1A1C',
      }}>

        {/* Yellow radial glow */}
        <div aria-hidden style={{
          position: 'absolute', top: '-22%', left: '50%', transform: 'translateX(-50%)',
          width: '72vw', height: '72vw',
          background: 'radial-gradient(circle, rgba(212,160,23,0.16) 0%, rgba(212,160,23,0.05) 45%, transparent 70%)',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Floating badge chips — hidden */}
        {false && BADGES.map((b) => (
          <div key={b.text} className="hero-badge" style={{
            position: 'absolute', top: b.top,
            ...(b.side === 'left' ? { left: 'clamp(16px, 6vw, 80px)' } : { right: 'clamp(16px, 6vw, 80px)' }),
            zIndex: 10, animationDelay: b.delay,
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 14,
            background: 'rgba(20,20,20,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.45)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{b.icon}</span>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: 12, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{b.text}</p>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10, margin: 0, marginTop: 2, lineHeight: 1 }}>{b.sub}</p>
            </div>
          </div>
        ))}

        {/* Bottom gradient fade — matches dark base */}
        <div aria-hidden style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '38%',
          background: 'linear-gradient(to top, #1A1A1C 0%, transparent 100%)',
          zIndex: 5, pointerEvents: 'none',
        }} />

        {/* Text + CTA */}
        <div style={{
          position: 'absolute', top: '50%', transform: 'translateY(-50%)',
          left: 0, right: 0, zIndex: 10, textAlign: 'center', padding: '0 24px',
        }}>
          <h1 className="hero-in" style={{
            color: '#FFFFFF',
            fontSize: 'clamp(34px, 5.5vw, 68px)',
            fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em',
            margin: '0 auto', maxWidth: 720, animationDelay: '0.38s',
          }}>
            The operating system for modern healthcare distribution.
          </h1>

          <p className="hero-in" style={{
            color: 'rgba(255,255,255,0.42)',
            fontSize: 'clamp(14px, 1.8vw, 17px)',
            marginTop: 16, marginBottom: 36,
            maxWidth: 480, marginLeft: 'auto', marginRight: 'auto',
            lineHeight: 1.6, animationDelay: '0.55s',
          }}>
            From ICHRA to telemedicine to pharmacy fulfillment, RX Library enables organizations to deploy healthcare experiences at enterprise scale.
          </p>

          <div className="hero-in" style={{
            display: 'flex', gap: 14, justifyContent: 'center',
            alignItems: 'center', flexWrap: 'wrap', animationDelay: '0.72s',
          }}>
            {/* Login — dark neumorphic raised */}
            <Link href="/login" className="btn-login" style={{
              padding: '12px 30px', borderRadius: 12,
              fontWeight: 600, fontSize: 15, display: 'inline-block',
            }}>
              Login
            </Link>
            {/* Book a demo — yellow neumorphic */}
            <a href="/demo" className="btn-demo" style={{
              padding: '12px 30px', borderRadius: 12,
              fontWeight: 700, fontSize: 15, display: 'inline-block',
            }}>
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
            background: '#1A1A1C',
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
              #e2e4e6 40%,
              #E8EAEC 58%,
              #E8EAEC 100%
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
            opacity: 0.72,
            pointerEvents: 'none',
            zIndex: 0,
          }}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} style={{
                borderRadius: 28,
                background: '#E8EAEC',
                boxShadow: '10px 10px 28px rgba(13,39,80,0.16), -10px -10px 28px rgba(255,255,255,0.92)',
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
              'linear-gradient(to top,   #E8EAEC 0%, rgba(232,234,236,0) 10%)',
              /* radial halo behind the copy column — cards still peek left */
              'radial-gradient(ellipse 48% 70% at 22% 50%, rgba(232,234,236,0.72) 0%, rgba(232,234,236,0.45) 40%, rgba(232,234,236,0) 70%)',
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
                  <span style={{ color: '#FEC944' }}>One platform.</span><br />Every stakeholder.<br />Every workflow.
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
                  { label: 'Clinician', sub: 'Provider Portal',   accent: '#3B82F6', icon: 'M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4M22 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0', pct: [76.2, 25]   },
                  { label: 'eRx',       sub: 'Prescriptions',     accent: '#8B5CF6', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',            pct: [87.5, 50]   },
                  { label: 'Pharmacy',  sub: 'Fulfillment',       accent: '#F59E0B', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',                                                                 pct: [76.2, 75]   },
                  { label: 'Provider',  sub: 'Network',           accent: '#10B981', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0',  pct: [50,   87.5] },
                  { label: 'Payments',  sub: 'Stripe',            accent: '#06B6D4', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',                                         pct: [23.8, 75]   },
                  { label: 'Patient',   sub: 'Experience',        accent: '#EC4899', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',                                                          pct: [12.5, 50]   },
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
                  }}>
                    {/* Inner card — black */}
                    <div style={{
                      width: 116,
                      borderRadius: 20,
                      background: '#1C1C1E',
                      boxShadow: '8px 8px 20px rgba(0,0,0,0.55), -8px -8px 20px rgba(255,255,255,0.06)',
                      padding: '16px 12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 9,
                    }}>
                      {/* Icon circle */}
                      <div style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: '#1C1C1E',
                        boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.45), inset -4px -4px 8px rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                          stroke={accent} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                          <path d={icon} />
                        </svg>
                      </div>
                      {/* Text */}
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.88)', margin: 0, lineHeight: 1.25 }}>{label}</p>
                        <p style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.38)', margin: 0, marginTop: 2, lineHeight: 1 }}>{sub}</p>
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
        <section ref={section3Ref} style={{ background: '#E8EAEC', padding: '0 0 200px', overflow: 'hidden', position: 'relative' }}>

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
                    <span className="palette-blip">Your brand.</span><br />Your experience.<br />Live in days.
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
                const OP  = [1.0,  1.0,  1.0,  0][Math.min(abs, 3)]!;
                const ZI  = [4,    6,    9,    0][Math.min(abs, 3)]!;

                const hex    = card.colors[0]!;
                const accent = hex;                             // brand name
                const tcDim    = 'rgba(0,0,0,0.45)';            // eyebrow / secondary
                const tcMuted  = 'rgba(0,0,0,0.22)';            // inactive pills

                return (
                  <div key={card.label} style={{
                    position: 'absolute',
                    left: '50%', top: '50%',
                    width: 230, height: 390,
                    marginLeft: -115, marginTop: -195,
                    borderRadius: 24,
                    background: '#E8EAEC',
                    boxShadow: '28px 28px 50px rgba(13,39,80,0.22), -23px -23px 45px rgba(255,255,255,1.0)',
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
                          fontSize: (card as { titleSize?: number }).titleSize ?? 36, fontWeight: 900, color: accent,
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
                      background: 'rgba(0,0,0,0.08)',
                      margin: '12px 0 10px',
                    }} />

                    {/* Font pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 9, overflow: 'hidden', maxHeight: 36 }}>
                      {card.fonts.map((font: string, fi: number) => (
                        <span key={font} style={{
                          fontSize: 8, fontWeight: 600, padding: '2.5px 6px', borderRadius: 5,
                          background: fi === card.activeFont ? 'rgba(0,0,0,0.07)' : 'transparent',
                          border: fi === card.activeFont
                            ? '1px solid rgba(0,0,0,0.14)'
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
                            background: opt === card.layout ? 'rgba(0,0,0,0.07)' : 'transparent',
                            border: opt === card.layout
                              ? '1px solid rgba(0,0,0,0.14)'
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
                              border: '1px solid rgba(0,0,0,0.10)',
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

        {/* ── Section 5: Care Network ───────────────────────────────────────────── */}
        <section
          ref={section5Ref}
          style={{
            background: '#E8EAEC',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 1050,
            display: 'grid',
            gridTemplateColumns: '1fr 800px',
            marginTop: -1,
          }}
        >
          {/* ── Bento bg — content cards ─────────────────────────────────────────── */}
          <div ref={careBentoRef} style={{
            position: 'absolute', inset: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 356px)',
            gridTemplateRows: 'repeat(3, 240px)',
            gap: 16,
            padding: 16,
            alignContent: 'center',
            pointerEvents: 'none',
            zIndex: 0,
          }}>
            {Array.from({ length: 18 }).map((_, i) => {
              const card = CARE_CARDS[i % CARE_CARDS.length]!;
              return (
                <div key={i} style={{
                  borderRadius: 28,
                  background: '#E8EAEC',
                  borderWidth: '1.5px',
                  borderStyle: 'solid',
                  borderColor: 'transparent',
                  boxShadow: '8px 8px 22px rgba(13,39,80,0.16), -6px -6px 18px rgba(255,255,255,0.72)',
                  padding: '28px 28px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  boxSizing: 'border-box',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: '#E8EAEC',
                    boxShadow: 'inset 4px 4px 8px rgba(13,39,80,0.12), inset -4px -4px 8px rgba(255,255,255,0.85)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginBottom: 20,
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="#AAAAAA" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d={card.icon} />
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#444', margin: 0, lineHeight: 1.35 }}>{card.title}</p>
                    <p style={{ fontSize: 12.5, lineHeight: 1.7, color: '#B0B0B0', margin: 0 }}>{card.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right fade */}
          <div aria-hidden style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '90%',
            background: 'linear-gradient(to right, transparent 0%, #E8EAEC 70%)',
            zIndex: 1, pointerEvents: 'none',
          }} />

          {/* Left column spacer */}
          <div style={{ position: 'relative', zIndex: 3 }} />

          {/* Right — neumorphic card. zIndex 5 above canvas. */}
          <div style={{
            position: 'absolute', right: 0, top: 0, width: 800,
            zIndex: 5,
            display: 'flex', justifyContent: 'center',
            paddingTop: 266,
          }}>
            <FadeUp>
              <div style={{
                width: 420,
                borderRadius: 28,
                background: '#1F1F22',
                boxShadow: '12px 12px 32px rgba(0,0,0,0.55), -8px -8px 22px rgba(255,255,255,0.05)',
                padding: '48px 44px 52px',
                display: 'flex',
                flexDirection: 'column',
              }}>
                {/* Eyebrow row: label + rxlibrary pill */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <p style={{
                    color: '#D4A017', fontSize: 10, fontWeight: 800,
                    letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0,
                  }}>
                    Care Network
                  </p>
                  {/* rxlibrary pill */}
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    padding: '5px 13px', borderRadius: 999,
                    background: '#1F1F22',
                    boxShadow: 'inset 3px 3px 7px rgba(0,0,0,0.55), inset -3px -3px 7px rgba(255,255,255,0.04)',
                    fontSize: 12, letterSpacing: '-0.03em',
                  }}>
                    <span style={{ color: '#FEC944', fontWeight: 400 }}>rx</span>
                    <span style={{ color: '#ffffff', fontWeight: 700 }}>library</span>
                  </div>
                </div>

                {/* H2 */}
                <h2 style={{
                  fontSize: 'clamp(26px, 2.6vw, 36px)', fontWeight: 800,
                  lineHeight: 1.12, letterSpacing: '-0.03em', color: '#ffffff', margin: '0 0 18px',
                }}>
                  <span style={{ color: '#D4A017' }}>Every provider</span><br />
                  already connected.
                </h2>

                {/* Body */}
                <p style={{ fontSize: 15, lineHeight: 1.78, color: 'rgba(255,255,255,0.45)', margin: '0 0 30px' }}>
                  Inherit the full network on day one — credentialed clinicians, 50-state licensing,
                  accredited compounding pharmacies, and DEA-registered providers. No recruiting,
                  no credentialing overhead. Just API calls.
                </p>

                {/* Divider — draws in on entry */}
                <div style={{
                  height: 1, margin: '0 0 30px',
                  background: 'rgba(255,255,255,0.28)',
                  boxShadow: careVisible ? '0 0 6px rgba(255,255,255,0.18)' : 'none',
                  width: careVisible ? '100%' : '0%',
                  transition: 'width 0.8s ease 0.1s, box-shadow 0.8s ease 0.1s',
                }} />

                {/* 2 × 2 stat grid */}
                <div ref={careStatsRef} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px 28px' }}>
                  {([
                    { label: 'Credentialed Clinicians', format: (v: number) => Math.round(v) >= 10000 ? '10,000+' : Math.round(v).toLocaleString() },
                    { label: 'States Covered',          format: (v: number) => String(Math.round(v)) },
                    { label: 'Partner Pharmacies',      format: (v: number) => Math.round(v) >= 200 ? '200+' : String(Math.round(v)) },
                    { label: 'to Credential',           format: (v: number) => `${Math.round(v)} days` },
                  ] as { label: string; format: (v: number) => string }[]).map(({ label, format }, i) => (
                    <div
                      key={label}
                      className={careVisible ? 'stat-lift' : undefined}
                      style={{ animationDelay: careVisible ? `${820 + i * 1400}ms` : undefined }}
                    >
                      <p style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff', margin: '0 0 5px', lineHeight: 1 }}>
                        {format(statVals[i] ?? 0)}
                      </p>
                      <p style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.35)', margin: 0, letterSpacing: '0.02em' }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── Section 6: End to End Automation ─────────────────────────────── */}
        <section style={{
          background: '#E8EAEC',
          position: 'relative',
          padding: '120px 80px',
        }}>
          <div style={{
            maxWidth: 1280, margin: '0 auto',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center',
          }}>

            {/* Right — app cards (order:2 pushes to right) */}
            <div style={{ order: 2 }}>
            <FadeUp>
              <div>

                {/* Top row: product + order details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

                  {/* Product card */}
                  <div style={{
                    borderRadius: 20, background: '#E8EAEC',
                    boxShadow: '8px 8px 22px rgba(13,39,80,0.16), -6px -6px 18px rgba(255,255,255,0.82)',
                    padding: '24px 22px',
                    animation: 'floatY 5s ease-in-out infinite',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1C', margin: 0 }}>Semaglutide</p>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 8, fontWeight: 700, color: '#D4A017', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 1px' }}>FROM</p>
                        <p style={{ fontSize: 20, fontWeight: 800, color: '#1A1A1C', margin: 0, letterSpacing: '-0.02em' }}>$299</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                      {['injection', 'Injectable Solution', '3 options'].map((tag) => (
                        <span key={tag} style={{
                          fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 999,
                          background: '#E8EAEC', color: '#999',
                          boxShadow: 'inset 2px 2px 5px rgba(13,39,80,0.10), inset -2px -2px 4px rgba(255,255,255,0.88)',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p style={{ fontSize: 11.5, lineHeight: 1.65, color: '#AAAAAA', margin: 0 }}>
                      Flexible dose injectable medication reviewed in medically supervised weight management care
                    </p>
                  </div>

                  {/* Order Details card */}
                  <div style={{
                    borderRadius: 20, background: '#E8EAEC',
                    boxShadow: '8px 8px 22px rgba(13,39,80,0.16), -6px -6px 18px rgba(255,255,255,0.82)',
                    padding: '24px 22px',
                  }}>
                    <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#AAAAAA', margin: '0 0 18px' }}>
                      Order Details
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 10px' }}>
                      {([
                        { label: 'ORDER ID',  value: '#35c39363',         mono: true,  badge: false },
                        { label: 'PLACED',    value: 'May 3, 2026',       mono: false, badge: false },
                        { label: 'CATEGORY',  value: 'Weight Management', mono: false, badge: false },
                        { label: 'STATUS',    value: 'Provider Assigned', mono: false, badge: true  },
                      ] as { label: string; value: string; mono: boolean; badge: boolean }[]).map(({ label, value, mono, badge }) => (
                        <div key={label}>
                          <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C0C0C0', margin: '0 0 5px' }}>{label}</p>
                          {badge ? (
                            <span
                              key={trackingStep}
                              className="pill-flash"
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                fontSize: 10, fontWeight: 700,
                                padding: '4px 10px', borderRadius: 999,
                                background: '#E8EAEC',
                                boxShadow: 'inset 2px 2px 5px rgba(13,39,80,0.10), inset -2px -2px 4px rgba(255,255,255,0.88)',
                                color: TRACKING_STEPS[trackingStep]!.color,
                              }}
                            >
                              <span style={{ width: 5, height: 5, borderRadius: '50%', background: TRACKING_STEPS[trackingStep]!.color, flexShrink: 0 }} />
                              {TRACKING_STEPS[trackingStep]!.label}
                            </span>
                          ) : (
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#555', margin: 0, fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Tracking card */}
                <div
                  className={trackingStep === 7 ? 'card-at-complete' : undefined}
                  style={{
                  borderRadius: 20, background: '#E8EAEC',
                  boxShadow: '8px 8px 22px rgba(13,39,80,0.16), -6px -6px 18px rgba(255,255,255,0.82)',
                  border: '1.5px solid transparent',
                  padding: '28px 26px',
                }}>
                  {/* Header + percentage */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    {trackingStep === 7 ? (
                      <p key="delivered" className="header-delivered" style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#10B981', margin: 0 }}>
                        ✓ Delivered
                      </p>
                    ) : (
                      <p key="tracking" style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#AAAAAA', margin: 0 }}>
                        Order Tracking
                      </p>
                    )}
                    <p
                      key={trackingStep}
                      className={trackingStep === 7 ? 'complete-pop' : undefined}
                      style={{ fontSize: 11, fontWeight: 700, margin: 0, letterSpacing: '-0.01em', transition: 'color 0.4s ease', color: trackingStep === 7 ? '#10B981' : '#D4A017' }}
                    >
                      {Math.round((trackingStep / 7) * 100)}%
                    </p>
                  </div>
                  {/* Progress bar */}
                  <div style={{
                    height: 3, borderRadius: 2, marginBottom: 20,
                    background: '#E8EAEC',
                    boxShadow: 'inset 2px 2px 4px rgba(13,39,80,0.10), inset -1px -1px 3px rgba(255,255,255,0.9)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${(trackingStep / 7) * 100}%`,
                      background: trackingStep === 7
                        ? 'linear-gradient(to right, #10B981, #059669)'
                        : 'linear-gradient(to right, #FEC944, #D4A017)',
                      borderRadius: 2,
                      transition: 'width 0.5s ease, background 0.4s ease',
                      boxShadow: trackingStep === 7 ? '0 0 18px rgba(16,185,129,0.7), 0 0 6px rgba(16,185,129,0.9)' : '0 0 6px rgba(254,201,68,0.45)',
                    }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
                    {/* Background line */}
                    <div style={{
                      position: 'absolute', left: 10, top: 11, bottom: 11, width: 2,
                      background: 'rgba(13,39,80,0.07)', borderRadius: 1, overflow: 'hidden', zIndex: 0,
                    }}>
                      {/* Gold fill */}
                      <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0,
                        height: `${(trackingStep / 7) * 100}%`,
                        background: trackingStep === 7
                          ? 'linear-gradient(to bottom, #10B981, rgba(16,185,129,0.4))'
                          : 'linear-gradient(to bottom, #FEC944, rgba(254,201,68,0.35))',
                        transition: 'height 0.5s ease',
                        borderRadius: 1,
                      }} />
                    </div>
                    {[
                      'Intake submitted',
                      'Provider assigned',
                      'Consult scheduled',
                      'Consult complete',
                      'Rx sent to pharmacy',
                      'Pharmacy processing',
                      'Shipped',
                      'Delivered',
                    ].map((label, idx) => {
                      const state = idx < trackingStep ? 'done' : idx === trackingStep ? 'active' : 'pending';
                      return (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
                          {/* Fixed 22px wrapper keeps line centered regardless of dot size */}
                          <div style={{ width: 22, height: 22, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div
                              className={
                                trackingStep === 7 && state === 'done' ? 'dot-cascade-green'
                                : state === 'active' ? (trackingStep === 7 ? 'dot-blip-green' : 'dot-blip')
                                : undefined
                              }
                              style={{
                                width: state === 'active' ? 14 : 22,
                                height: state === 'active' ? 14 : 22,
                                borderRadius: '50%',
                                background: state === 'active'
                                  ? (trackingStep === 7 ? '#10B981' : '#FEC944')
                                  : '#E8EAEC',
                                boxShadow: state === 'active'
                                  ? trackingStep === 7
                                    ? '3px 3px 8px rgba(16,185,129,0.35), -2px -2px 5px rgba(255,255,255,0.5)'
                                    : '3px 3px 8px rgba(212,160,23,0.35), -2px -2px 5px rgba(255,255,255,0.5)'
                                  : 'inset 3px 3px 6px rgba(13,39,80,0.12), inset -2px -2px 5px rgba(255,255,255,0.88)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'background 0.4s ease, box-shadow 0.4s ease, width 0.3s ease, height 0.3s ease',
                                animationDelay: trackingStep === 7 && state === 'done' ? `${idx * 80}ms` : undefined,
                              }}
                            >
                              {state === 'done' && (
                                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                  <path d="M2 6l3 3 5-5" stroke="#BBBBBB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <p style={{
                            fontSize: 13, margin: 0, lineHeight: 1,
                            fontWeight: state === 'active' ? 700 : 400,
                            color: state === 'active' ? '#1A1A1C' : state === 'done' ? '#C0C0C0' : '#BBBBBB',
                            transition: 'color 0.4s ease',
                          }}>
                            {label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px solid rgba(13,39,80,0.07)', display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                    <p style={{ fontSize: 10, color: '#C0C0C0', margin: 0, fontWeight: 500 }}>
                      Fully automated · Zero manual steps · Audit logged
                    </p>
                  </div>
                </div>

              </div>
            </FadeUp>
            </div>

            {/* Left — copy (order:1 keeps on left) */}
            <div style={{ order: 1 }}>
            <FadeUp>
              <div>
                <p style={{ color: '#D4A017', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16 }}>
                  End to End Automation
                </p>
                <h2 style={{ fontSize: 'clamp(32px, 3.8vw, 54px)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.03em', color: '#111', marginBottom: 20 }}>
                  From intake to delivery<br />
                  <span style={{ color: '#FEC944' }}>without lifting a finger.</span>
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: '#888', marginBottom: 40, maxWidth: 460 }}>
                  Access a nationwide network of licensed clinicians and pharmacy partners, ready to see your patients and fulfill prescriptions the day you launch.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
                  {[
                    { title: 'Automatic patient routing to available providers',         desc: 'The right clinician, the right network — assigned instantly.'                      },
                    { title: 'Prescriptions transmitted and fulfilled end-to-end',       desc: 'From approval to pharmacy to doorstep with zero manual steps.'                    },
                    { title: 'Built-in refill reminders, stall alerts, and renewal flows', desc: 'Nothing falls through the cracks. Ever.'                                       },
                  ].map(({ title, desc }) => (
                    <div key={title} style={{ display: 'flex', gap: 14 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                        background: '#E8EAEC',
                        boxShadow: 'inset 3px 3px 6px rgba(13,39,80,0.12), inset -2px -2px 5px rgba(255,255,255,0.88)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="#AAAAAA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1C', margin: '0 0 5px', lineHeight: 1.4 }}>{title}</p>
                        <p style={{ fontSize: 13, lineHeight: 1.65, color: '#AAAAAA', margin: 0 }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
            </div>

          </div>
        </section>

        {/* ── Section: See It In Action ────────────────────────────────────── */}
        <section style={{ background: '#E8EAEC' }}>
          <style>{`
            @keyframes role-tilt-reveal {
              0%   { transform: perspective(1400px) rotateX(0deg)  scale(1);    }
              28%  { transform: perspective(1400px) rotateX(14deg) scale(0.97); }
              100% { transform: perspective(1400px) rotateX(0deg)  scale(1);    }
            }
            .role-tilt { animation: role-tilt-reveal 0.75s cubic-bezier(0.22,1,0.36,1) forwards; }
            @keyframes role-copy-in {
              from { opacity: 0; transform: translateY(14px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            .role-copy-in { animation: role-copy-in 0.5s cubic-bezier(0.22,1,0.36,1) both; }
          `}</style>

          <div ref={seeItScrollRef} style={{ height: '320vh', position: 'relative' }}>
            <div style={{
              position: 'sticky', top: 0, height: '100vh',
              display: 'flex', flexDirection: 'column',
              padding: '52px 80px 48px', boxSizing: 'border-box',
            }}>

              {/* ── Header — always visible ── */}
              <div style={{ marginBottom: 32 }}>
                <p style={{ color: '#D4A017', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                  See It In Action
                </p>
                <h2 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.03em', color: '#111827', margin: 0 }}>
                  Built for <span style={{ color: '#FEC944' }}>every role</span> in the care chain.
                </h2>
              </div>

              {/* ── Card (60%) + right content (40%) ── */}
              <div style={{ display: 'flex', gap: 48, flex: 1, minHeight: 0 }}>

                {/* Browser card — 60% width, natural image height */}
                <div
                  key={seeItTilting ? `tilt-${seeItRole}` : 'idle'}
                  className={seeItTilting ? 'role-tilt' : undefined}
                  style={{
                    width: '60%', flexShrink: 0,
                    borderRadius: 16,
                    background: '#16161A',
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 16px 16px 48px rgba(0,0,0,0.45), -6px -6px 20px rgba(255,255,255,0.55)',
                    overflow: 'hidden',
                    alignSelf: 'flex-start',
                    maxHeight: 'calc(100vh - 180px)',
                    position: 'relative',
                    transform: seeItTilting ? undefined : `perspective(1400px) rotateX(${seeItRotateX}deg) scale(${seeItScale})`,
                  }}
                >
                  {/* Chrome bar */}
                  <div style={{
                    background: '#111113', padding: '10px 16px',
                    display: 'flex', alignItems: 'center', gap: 7,
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    {['#EF4444', '#FEC944', '#10B981'].map((c) => (
                      <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.55 }} />
                    ))}
                    <div style={{
                      flex: 1, maxWidth: 220, margin: '0 auto', height: 19, borderRadius: 5,
                      background: '#1F1F22',
                      boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.6), inset -1px -1px 3px rgba(255,255,255,0.03)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', fontWeight: 500 }}>app.rxlibrary.com</span>
                    </div>
                  </div>
                  {/* Images — natural width, stacked */}
                  <div style={{ position: 'relative' }}>
                    {['/patient-preview.png', '/clinician-preview.png', '/dashboard-preview.png'].map((src, i) => (
                      <img key={src} src={src} alt="" style={{
                        width: '100%', display: 'block',
                        position: i === 0 ? 'relative' : 'absolute',
                        top: 0, left: 0,
                        opacity: seeItRole === i ? 1 : 0,
                        transition: 'opacity 0.55s ease',
                        transform: i === 0 ? 'scale(1.015)' : undefined,
                      }} />
                    ))}
                  </div>
                  {/* Bottom fade — masks image cutoff at maxHeight */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: '28%', pointerEvents: 'none',
                    background: 'linear-gradient(to bottom, transparent, #E8EAEC)',
                  }} />
                </div>

                {/* Right content panel */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 0 }}>

                  {/* Role copy — remounts on change to replay animation */}
                  <div key={`role-copy-${seeItRole}`} className="role-copy-in">
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D4A017', margin: '0 0 18px', opacity: 0.9 }}>
                      {SEE_IT_ROLES[seeItRole]!.label}
                    </p>
                    <h3 style={{
                      fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 800, lineHeight: 1.06,
                      letterSpacing: '-0.03em', color: '#111827', margin: '0 0 24px',
                    }}>
                      {seeItRole === 0 && <>Care that fits<br /><span style={{ color: '#FEC944' }}>your life.</span></>}
                      {seeItRole === 1 && <>Focus on <span style={{ color: '#FEC944' }}>care,</span><br />not admin.</>}
                      {seeItRole === 2 && <>Full visibility.<br /><span style={{ color: '#FEC944' }}>Total control.</span></>}
                    </h3>
                    <p style={{ fontSize: 16, lineHeight: 1.8, color: '#555', margin: 0, fontWeight: 500 }}>
                      {SEE_IT_ROLES[seeItRole]!.desc}
                    </p>
                  </div>

                  {/* 01 / 02 / 03 progress stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    {SEE_IT_ROLES.map((r, i) => {
                      const active   = seeItRole === i;
                      const done     = seeItRole > i;
                      const segStart = i / 3;
                      const segEnd   = (i + 1) / 3;
                      const segPct   = done ? 1 : active ? Math.min(1, (seeItProgress - segStart) / (segEnd - segStart)) : 0;
                      return (
                        <div key={r.label} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
                            <span style={{
                              fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
                              color: active ? '#D4A017' : done ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.15)',
                              transition: 'color 0.4s ease',
                            }}>
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span style={{
                              fontSize: 12, fontWeight: 700,
                              color: active ? '#111827' : done ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.2)',
                              transition: 'color 0.4s ease',
                            }}>
                              {r.label}
                            </span>
                          </div>
                          {i < 2 && (
                            <div style={{ flex: 1, height: 1, margin: '0 16px', background: 'rgba(13,39,80,0.10)', position: 'relative', overflow: 'hidden' }}>
                              <div style={{
                                position: 'absolute', top: 0, left: 0, bottom: 0,
                                width: `${segPct * 100}%`,
                                background: '#FEC944',
                                transition: 'width 0.1s linear',
                              }} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* ── When something stalls: Alert → Resolution story ─────────── */}
          <div style={{ padding: '80px 80px 100px', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>

              <div style={{ marginBottom: 40 }}>
                <p style={{ color: '#D4A017', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                  When something stalls
                </p>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40 }}>
                  <h2 style={{ fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.03em', color: '#111827', margin: 0 }}>
                    From stall to resolved —<br /><span style={{ color: '#FEC944' }}>automatically.</span>
                  </h2>
                  <p style={{ fontSize: 15, lineHeight: 1.75, color: '#888', margin: 0, maxWidth: 380 }}>
                    rxlibrary monitors every order in real time. When a consult stalls, the system catches it, flags it, and fixes it — with zero manual steps.
                  </p>
                </div>
              </div>

              {/* 4 story cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>

                {/* ── Card 0: Stall Detected ── */}
                <div
                  className={storyStep === 0 ? 'story-card-active' : undefined}
                  style={{
                    borderRadius: 20, background: '#E8EAEC', padding: '24px 20px',
                    boxShadow: '8px 8px 22px rgba(13,39,80,0.14), -6px -6px 18px rgba(255,255,255,0.82)',
                    border: '1.5px solid transparent',
                    transition: 'box-shadow 0.4s ease, opacity 0.4s ease',
                    opacity: storyStep === 0 ? 1 : 0.55,
                    display: 'flex', flexDirection: 'column', gap: 0,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#AAAAAA', margin: 0 }}>
                      Stall Detected
                    </p>
                    <div
                      className={storyStep === 0 ? 'dot-blip-red' : undefined}
                      style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444', boxShadow: '2px 2px 5px rgba(239,68,68,0.3), -1px -1px 3px rgba(255,255,255,0.5)' }}
                    />
                  </div>
                  <div style={{ padding: '12px 14px', borderRadius: 12, background: '#E8EAEC', boxShadow: 'inset 3px 3px 7px rgba(13,39,80,0.10), inset -2px -2px 5px rgba(255,255,255,0.88)', marginBottom: 14 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1C', margin: '0 0 3px' }}>Marcus Torres</p>
                    <p style={{ fontSize: 10, color: '#AAAAAA', margin: 0 }}>Consult overdue · 47m</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'auto' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
                      background: '#E8EAEC', color: '#EF4444',
                      boxShadow: 'inset 2px 2px 5px rgba(13,39,80,0.10), inset -2px -2px 4px rgba(255,255,255,0.88)',
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#EF4444' }} />
                      Stalled
                    </span>
                  </div>
                  <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid rgba(13,39,80,0.07)' }}>
                    <p style={{ fontSize: 10, color: '#BBBBBB', margin: 0 }}>Provider unavailable</p>
                  </div>
                </div>

                {/* ── Card 1: Auto-Flagged ── */}
                <div
                  className={storyStep === 1 ? 'story-card-active' : undefined}
                  style={{
                    borderRadius: 20, background: '#E8EAEC', padding: '24px 20px',
                    boxShadow: '8px 8px 22px rgba(13,39,80,0.14), -6px -6px 18px rgba(255,255,255,0.82)',
                    border: '1.5px solid transparent',
                    transition: 'box-shadow 0.4s ease, opacity 0.4s ease',
                    opacity: storyStep === 1 ? 1 : 0.55,
                    display: 'flex', flexDirection: 'column', gap: 0,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#AAAAAA', margin: 0 }}>
                      Auto-Flagged
                    </p>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEC944', boxShadow: '2px 2px 5px rgba(212,160,23,0.3), -1px -1px 3px rgba(255,255,255,0.5)' }} />
                  </div>
                  <div key={`alert2-${storyStep}`} style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                    {[
                      { text: 'Stall threshold exceeded',   delay: '0ms'   },
                      { text: 'Clinician unavailable',       delay: '180ms' },
                      { text: 'Escalating automatically',    delay: '360ms' },
                    ].map(({ text, delay }) => (
                      <div
                        key={text}
                        className={storyStep === 1 ? 'alert-row' : undefined}
                        style={{
                          animationDelay: delay,
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '9px 12px', borderRadius: 10,
                          background: '#E8EAEC',
                          boxShadow: 'inset 2px 2px 5px rgba(13,39,80,0.10), inset -2px -2px 4px rgba(255,255,255,0.88)',
                          opacity: storyStep === 1 ? undefined : 0.5,
                        }}
                      >
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#FEC944', flexShrink: 0 }} />
                        <p style={{ fontSize: 11, fontWeight: 600, color: '#555', margin: 0 }}>{text}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid rgba(13,39,80,0.07)' }}>
                    <p style={{ fontSize: 10, color: '#BBBBBB', margin: 0 }}>0 manual steps required</p>
                  </div>
                </div>

                {/* ── Card 2: Reassigned ── */}
                <div
                  className={storyStep === 2 ? 'story-card-active' : undefined}
                  style={{
                    borderRadius: 20, background: '#E8EAEC', padding: '24px 20px',
                    boxShadow: '8px 8px 22px rgba(13,39,80,0.14), -6px -6px 18px rgba(255,255,255,0.82)',
                    border: '1.5px solid transparent',
                    transition: 'box-shadow 0.4s ease, opacity 0.4s ease',
                    opacity: storyStep === 2 ? 1 : 0.55,
                    display: 'flex', flexDirection: 'column', gap: 0,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#AAAAAA', margin: 0 }}>
                      Reassigned
                    </p>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEC944', boxShadow: '2px 2px 5px rgba(212,160,23,0.3), -1px -1px 3px rgba(255,255,255,0.5)' }} />
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1C', margin: '0 0 12px' }}>Marcus Torres</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
                      background: '#E8EAEC',
                      boxShadow: 'inset 2px 2px 5px rgba(13,39,80,0.10), inset -2px -2px 4px rgba(255,255,255,0.88)',
                      color: storyStep >= 2 ? '#10B981' : '#EF4444',
                      transition: 'color 0.8s ease 0.5s',
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: storyStep >= 2 ? '#10B981' : '#EF4444', transition: 'background 0.8s ease 0.5s' }} />
                      {storyStep >= 2 ? 'Assigned' : 'Stalled'}
                    </span>
                  </div>
                  <div style={{ padding: '10px 12px', borderRadius: 10, background: '#E8EAEC', boxShadow: 'inset 2px 2px 5px rgba(13,39,80,0.10), inset -2px -2px 4px rgba(255,255,255,0.88)', flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1C', margin: '0 0 2px' }}>Dr. Sarah K.</p>
                    <p style={{ fontSize: 10, color: '#AAAAAA', margin: 0 }}>Available · State licensed</p>
                  </div>
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(13,39,80,0.07)' }}>
                    <p style={{ fontSize: 10, color: '#BBBBBB', margin: 0 }}>Next-available match</p>
                  </div>
                </div>

                {/* ── Card 3: Resolved ── */}
                <div
                  className={storyStep === 3 ? 'story-card-active' : undefined}
                  style={{
                    borderRadius: 20, background: '#E8EAEC', padding: '24px 20px',
                    boxShadow: '8px 8px 22px rgba(13,39,80,0.14), -6px -6px 18px rgba(255,255,255,0.82)',
                    border: '1.5px solid transparent',
                    transition: 'box-shadow 0.4s ease, opacity 0.4s ease',
                    opacity: storyStep === 3 ? 1 : 0.55,
                    display: 'flex', flexDirection: 'column', gap: 0,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: storyStep === 3 ? '#10B981' : '#AAAAAA', margin: 0, transition: 'color 0.4s ease' }}>
                      {storyStep === 3 ? '✓ Resolved · 3 min' : 'Resolved'}
                    </p>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981', boxShadow: storyStep === 3 ? '0 0 8px rgba(16,185,129,0.6), 2px 2px 5px rgba(16,185,129,0.3)' : '2px 2px 5px rgba(16,185,129,0.2)', transition: 'box-shadow 0.4s ease' }} />
                  </div>
                  <div
                    key={`check2-${storyStep}`}
                    className={storyStep === 3 ? 'story-pop' : undefined}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}
                  >
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%',
                      background: '#E8EAEC',
                      boxShadow: storyStep === 3
                        ? '0 0 0 3px rgba(16,185,129,0.3), 6px 6px 16px rgba(16,185,129,0.2), -4px -4px 12px rgba(255,255,255,0.9)'
                        : '4px 4px 10px rgba(13,39,80,0.12), -3px -3px 8px rgba(255,255,255,0.88)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'box-shadow 0.5s ease',
                    }}>
                      <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                        <path d="M2 9l6 6L20 2" stroke={storyStep === 3 ? '#10B981' : '#CCCCCC'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.4s ease' }} />
                      </svg>
                    </div>
                  </div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5, alignSelf: 'flex-start',
                    fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
                    background: '#E8EAEC',
                    boxShadow: 'inset 2px 2px 5px rgba(13,39,80,0.10), inset -2px -2px 4px rgba(255,255,255,0.88)',
                    color: '#10B981', marginBottom: 'auto',
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981' }} />
                    Consult Scheduled
                  </span>
                  <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid rgba(13,39,80,0.07)' }}>
                    <p style={{ fontSize: 10, color: '#BBBBBB', margin: 0 }}>0 delays · Fully automated</p>
                  </div>
                </div>

              </div>

              {/* Step progress indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                {[0, 1, 2, 3].map((s) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', flex: s < 3 ? '1' : 'none' }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      background: s <= storyStep ? '#FEC944' : '#E8EAEC',
                      boxShadow: s <= storyStep
                        ? '0 0 8px rgba(254,201,68,0.5), 2px 2px 4px rgba(13,39,80,0.12)'
                        : 'inset 2px 2px 4px rgba(13,39,80,0.12), inset -1px -1px 3px rgba(255,255,255,0.88)',
                      transition: 'background 0.4s ease, box-shadow 0.4s ease',
                    }} />
                    {s < 3 && (
                      <div style={{ flex: 1, height: 2, background: '#E8EAEC', boxShadow: 'inset 1px 1px 2px rgba(13,39,80,0.10)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', background: '#FEC944',
                          width: s < storyStep ? '100%' : '0%',
                          transition: 'width 0.6s ease',
                        }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>

        </section>

        {/* ── Section 7: rxlibrary adapts ─────────────────────────────────── */}
        <section
          style={{ background: '#E8EAEC', padding: '120px 80px' }}
          onMouseEnter={() => setAdaptHovered(true)}
          onMouseLeave={() => setAdaptHovered(false)}
        >
          <style>{`
            @keyframes adapt-in {
              from { opacity: 0; transform: translateY(12px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            .adapt-in { animation: adapt-in 0.45s cubic-bezier(0.22,1,0.36,1) both; }
            @keyframes adapt-bullet-in {
              from { opacity: 0; transform: translateX(-10px); }
              to   { opacity: 1; transform: translateX(0); }
            }
            .adapt-bullet { animation: adapt-bullet-in 0.45s cubic-bezier(0.22,1,0.36,1) both; }
          `}</style>

          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

            {/* ── Left: copy ──────────────────────────────────────────────── */}
            <div>
              <p style={{ color: '#D4A017', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 20, margin: '0 0 20px' }}>
                Built For Your World
              </p>

              {/* Headline — remount on persona change triggers adapt-in */}
              <h2
                key={`adapt-h-${adaptPersona}`}
                className="adapt-in"
                style={{ fontSize: 'clamp(32px, 3.8vw, 52px)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.03em', color: '#111827', margin: '0 0 18px' }}
              >
                {ADAPT_PERSONAS[adaptPersona]!.headline.split('\n').map((line, i, arr) => (
                  <span key={i} style={{ color: i === arr.length - 1 ? '#FEC944' : '#111827' }}>
                    {line}{i < arr.length - 1 && <br />}
                  </span>
                ))}
              </h2>

              {/* Sub-copy */}
              <p
                key={`adapt-sub-${adaptPersona}`}
                className="adapt-in"
                style={{ fontSize: 15, lineHeight: 1.75, color: '#666', margin: '0 0 36px', maxWidth: 420, animationDelay: '0.06s' }}
              >
                {ADAPT_PERSONAS[adaptPersona]!.sub}
              </p>

              {/* Bullets — sequential fly-in */}
              <div key={`adapt-bl-${adaptPersona}`} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 48 }}>
                {ADAPT_PERSONAS[adaptPersona]!.bullets.map((b, i) => (
                  <div
                    key={b}
                    className="adapt-bullet"
                    style={{ animationDelay: `${i * 110}ms`, display: 'flex', alignItems: 'center', gap: 12 }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      background: '#E8EAEC',
                      boxShadow: 'inset 2px 2px 5px rgba(13,39,80,0.12), inset -2px -2px 4px rgba(255,255,255,0.88)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="8" height="7" viewBox="0 0 10 9" fill="none">
                        <path d="M1.5 4.5l2.5 2.5 4.5-5" stroke="#D4A017" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#555', margin: 0 }}>{b}</p>
                  </div>
                ))}
              </div>

              {/* Persona pills + progress bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {ADAPT_PERSONAS.map((persona, i) => (
                    <button
                      key={persona.key}
                      onClick={() => switchAdaptPersona(i)}
                      style={{
                        fontSize: 11, fontWeight: 700, padding: '7px 16px', borderRadius: 999,
                        border: 'none', cursor: 'pointer',
                        background: i === adaptPersona ? '#FEC944' : '#E8EAEC',
                        color: i === adaptPersona ? '#1A1200' : 'rgba(0,0,0,0.35)',
                        boxShadow: i === adaptPersona
                          ? '4px 4px 10px rgba(13,39,80,0.18), -2px -2px 6px rgba(255,255,255,0.7)'
                          : 'inset 2px 2px 5px rgba(13,39,80,0.12), inset -2px -2px 4px rgba(255,255,255,0.88)',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      {persona.label}
                    </button>
                  ))}
                </div>
                {/* Progress bar */}
                <div style={{ height: 2, borderRadius: 1, background: 'rgba(13,39,80,0.10)', overflow: 'hidden', maxWidth: 340 }}>
                  <div style={{
                    height: '100%', width: `${adaptProgress}%`,
                    background: 'linear-gradient(to right, #FEC944, #D4A017)',
                    borderRadius: 1, transition: 'width 0.04s linear',
                  }} />
                </div>
              </div>
            </div>

            {/* ── Right: morphing UI card ──────────────────────────────────── */}
            <div style={{
              opacity: adaptCardOut ? 0 : 1,
              transform: adaptCardOut ? 'scale(0.96) translateY(8px)' : 'scale(1) translateY(0)',
              transition: 'opacity 0.22s ease, transform 0.22s ease',
            }}>
              <div style={{
                borderRadius: 24, background: '#1F1F22',
                boxShadow: '10px 10px 28px rgba(0,0,0,0.6), -6px -6px 18px rgba(255,255,255,0.04)',
                padding: '28px 26px',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                {/* Card header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                  <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                    {ADAPT_PERSONAS[adaptPersona]!.cardLabel}
                  </p>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.6)' }} />
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>live</span>
                  </span>
                </div>

                {/* ── Employers: HR Dashboard ── */}
                {adaptPersona === 0 && (
                  <div>
                    {/* 2 stat tiles */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
                      {[
                        { value: '124',  label: 'Enrolled Employees' },
                        { value: '$280', label: 'Avg Allowance / mo'  },
                      ].map(({ value, label }) => (
                        <div key={label} style={{
                          borderRadius: 14, padding: '16px 14px',
                          background: '#1F1F22',
                          boxShadow: 'inset 3px 3px 8px rgba(0,0,0,0.55), inset -3px -3px 7px rgba(255,255,255,0.04)',
                        }}>
                          <p style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', margin: '0 0 4px', letterSpacing: '-0.03em' }}>{value}</p>
                          <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{label}</p>
                        </div>
                      ))}
                    </div>
                    {/* Utilization bars */}
                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', margin: '0 0 12px' }}>Benefit Utilization</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
                      {[
                        { label: 'Medical',   pct: 72, color: '#FEC944' },
                        { label: 'Pharmacy',  pct: 58, color: '#4CAAFF' },
                        { label: 'Vision',    pct: 41, color: '#7C6FFF' },
                      ].map(({ label, pct, color }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', width: 56, flexShrink: 0 }}>{label}</span>
                          <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', width: 28, textAlign: 'right' }}>{pct}%</span>
                        </div>
                      ))}
                    </div>
                    {/* Recent */}
                    <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', margin: 0 }}>Sofia G. — $85 reimbursed · 2h ago</p>
                    </div>
                  </div>
                )}

                {/* ── Providers: Patient Queue ── */}
                {adaptPersona === 1 && (
                  <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
                      {[
                        { name: 'Sofia García',   status: 'Consult',   color: '#3B82F6' },
                        { name: 'Marcus Torres',  status: 'Intake',    color: '#FEC944' },
                        { name: 'Ana Ruiz',       status: 'Rx Sent',   color: '#4CAAFF' },
                        { name: 'John Park',      status: 'Delivered', color: '#10B981' },
                      ].map(({ name, status, color }) => (
                        <div key={name} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '10px 14px', borderRadius: 12,
                          background: '#1F1F22',
                          boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5), inset -2px -2px 4px rgba(255,255,255,0.04)',
                        }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{name}</p>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                            background: '#1F1F22',
                            boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.5), inset -1px -1px 3px rgba(255,255,255,0.04)',
                            color,
                          }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
                            {status}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FEC944', flexShrink: 0 }} />
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', margin: 0 }}>4 active · 2 pending clinical review</p>
                    </div>
                  </div>
                )}

                {/* ── Pharmacies: Fulfillment Pipeline ── */}
                {adaptPersona === 2 && (
                  <div>
                    {/* Big number */}
                    <div style={{ marginBottom: 22 }}>
                      <p style={{ fontSize: 42, fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.04em', lineHeight: 1 }}>284</p>
                      <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', margin: '4px 0 0' }}>orders today</p>
                    </div>
                    {/* Funnel bars */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
                      {[
                        { label: 'Received',   count: 284, pct: 100, color: '#FEC944' },
                        { label: 'Dispensed',  count: 261, pct: 92,  color: '#4CAAFF' },
                        { label: 'Shipped',    count: 178, pct: 63,  color: '#7C6FFF' },
                        { label: 'Delivered',  count: 152, pct: 54,  color: '#10B981' },
                      ].map(({ label, count, pct, color }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', width: 60, flexShrink: 0 }}>{label}</span>
                          <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', width: 28, textAlign: 'right' }}>{count}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4CAAFF', flexShrink: 0 }} />
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', margin: 0 }}>eRx from RXNT · 3m ago</p>
                    </div>
                  </div>
                )}

                {/* ── Brands: Config Panel ── */}
                {adaptPersona === 3 && (
                  <div>
                    {/* Fields */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                      {[
                        { label: 'Brand Name', value: 'PharmacyTime'      },
                        { label: 'Domain',     value: 'pharmacytime.com'  },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', margin: '0 0 6px' }}>{label}</p>
                          <div style={{
                            padding: '9px 14px', borderRadius: 10,
                            background: '#1F1F22',
                            boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.55), inset -2px -2px 4px rgba(255,255,255,0.04)',
                          }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.65)', margin: 0 }}>{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Color swatches */}
                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', margin: '0 0 10px' }}>Primary Color</p>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
                      {['#FEC944', '#7C6FFF', '#4CAAFF'].map((c, i) => (
                        <div key={c} style={{
                          width: 28, height: 28, borderRadius: '50%', background: c,
                          boxShadow: i === 0
                            ? `0 0 0 2px rgba(255,255,255,0.2), 0 0 12px ${c}55`
                            : '3px 3px 7px rgba(0,0,0,0.45), -2px -2px 5px rgba(255,255,255,0.04)',
                          cursor: 'pointer',
                        }} />
                      ))}
                    </div>
                    {/* Preview pill */}
                    <div style={{ marginBottom: 20 }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 7,
                        padding: '7px 14px', borderRadius: 999,
                        background: '#1F1F22',
                        boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.55), inset -2px -2px 4px rgba(255,255,255,0.04)',
                      }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FEC944' }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.65)' }}>PharmacyTime</span>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>· running on</span>
                        <span style={{ fontSize: 11, fontWeight: 700 }}><span style={{ color: '#FEC944', fontWeight: 400 }}>rx</span><span style={{ color: 'rgba(255,255,255,0.65)' }}>library</span></span>
                      </span>
                    </div>
                    <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', margin: 0 }}>Active · 12 brands configured</p>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </section>

        {/* COMMAND CENTER DELETED */}
        {false && <section style={{ background: '#E8EAEC', padding: '120px 80px' }}>
          <style>{`
            @keyframes dot-blip-red {
              0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.0), 3px 3px 8px rgba(239,68,68,0.3), -2px -2px 5px rgba(255,255,255,0.5); }
              50%       { box-shadow: 0 0 0 6px rgba(239,68,68,0.18), 0 0 14px rgba(239,68,68,0.45), 3px 3px 8px rgba(239,68,68,0.3), -2px -2px 5px rgba(255,255,255,0.5); }
            }
            .dot-blip-red   { animation: dot-blip-red   2.4s ease-in-out infinite; }
            @keyframes alert-row-in {
              from { opacity: 0; transform: translateX(-14px); }
              to   { opacity: 1; transform: translateX(0); }
            }
            .alert-row { animation: alert-row-in 0.4s cubic-bezier(0.22,1,0.36,1) both; }
            @keyframes pill-to-green {
              0%   { color: #EF4444; box-shadow: inset 2px 2px 5px rgba(13,39,80,0.10), inset -2px -2px 4px rgba(255,255,255,0.88); }
              60%  { color: #FEC944; }
              100% { color: #10B981; box-shadow: inset 2px 2px 5px rgba(13,39,80,0.10), inset -2px -2px 4px rgba(255,255,255,0.88); }
            }
            .pill-to-assigned { animation: pill-to-green 1s ease forwards; }
            @keyframes story-pop {
              0%   { transform: scale(0.85); opacity: 0; }
              60%  { transform: scale(1.06); opacity: 1; }
              100% { transform: scale(1);    opacity: 1; }
            }
            .story-pop { animation: story-pop 0.55s cubic-bezier(0.22,1,0.36,1) both; }
            .story-card-active {
              box-shadow: 8px 8px 22px rgba(13,39,80,0.18), -6px -6px 18px rgba(255,255,255,0.88), 0 0 0 1.5px rgba(254,201,68,0.5) !important;
            }
          `}</style>

          <div style={{ maxWidth: 1280, margin: '0 auto' }}>

            {/* Header */}
            <div style={{ marginBottom: 64 }}>
              <p style={{ color: '#D4A017', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 16px' }}>
                Command Center
              </p>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40 }}>
                <h2 style={{ fontSize: 'clamp(32px, 3.8vw, 52px)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.03em', color: '#111', margin: 0 }}>
                  Full visibility.<br />Total control.
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: '#888', margin: 0, maxWidth: 420 }}>
                  Every order, every patient, every metric — in one view. When something breaks, rxlibrary catches and fixes it before you notice.
                </p>
              </div>
            </div>

            {/* Dashboard screenshot */}
            <div style={{ position: 'relative', marginBottom: 40 }}>
              <div style={{ borderRadius: 20, overflow: 'hidden' }}>
                <img
                  src="/dashboard-preview.png"
                  alt="rxlibrary admin dashboard"
                  style={{ width: '100%', display: 'block' }}
                />
              </div>
              {/* Bottom fade */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '40%',
                background: 'linear-gradient(to bottom, transparent, #E8EAEC)',
                pointerEvents: 'none',
              }} />
            </div>

            {/* 4 story cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>

              {/* ── Card 0: Stall Detected ── */}
              <div
                className={storyStep === 0 ? 'story-card-active' : undefined}
                style={{
                  borderRadius: 20, background: '#E8EAEC', padding: '24px 20px',
                  boxShadow: '8px 8px 22px rgba(13,39,80,0.14), -6px -6px 18px rgba(255,255,255,0.82)',
                  border: '1.5px solid transparent',
                  transition: 'box-shadow 0.4s ease, opacity 0.4s ease',
                  opacity: storyStep === 0 ? 1 : 0.55,
                  display: 'flex', flexDirection: 'column', gap: 0,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#AAAAAA', margin: 0 }}>
                    Stall Detected
                  </p>
                  <div
                    className={storyStep === 0 ? 'dot-blip-red' : undefined}
                    style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444', boxShadow: '2px 2px 5px rgba(239,68,68,0.3), -1px -1px 3px rgba(255,255,255,0.5)' }}
                  />
                </div>
                {/* Patient row */}
                <div style={{ padding: '12px 14px', borderRadius: 12, background: '#E8EAEC', boxShadow: 'inset 3px 3px 7px rgba(13,39,80,0.10), inset -2px -2px 5px rgba(255,255,255,0.88)', marginBottom: 14 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1C', margin: '0 0 3px' }}>Marcus Torres</p>
                  <p style={{ fontSize: 10, color: '#AAAAAA', margin: 0 }}>Consult overdue · 47m</p>
                </div>
                {/* Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'auto' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
                    background: '#E8EAEC', color: '#EF4444',
                    boxShadow: 'inset 2px 2px 5px rgba(13,39,80,0.10), inset -2px -2px 4px rgba(255,255,255,0.88)',
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#EF4444' }} />
                    Stalled
                  </span>
                </div>
                <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid rgba(13,39,80,0.07)' }}>
                  <p style={{ fontSize: 10, color: '#BBBBBB', margin: 0 }}>Provider unavailable</p>
                </div>
              </div>

              {/* ── Card 1: System Flags It ── */}
              <div
                className={storyStep === 1 ? 'story-card-active' : undefined}
                style={{
                  borderRadius: 20, background: '#E8EAEC', padding: '24px 20px',
                  boxShadow: '8px 8px 22px rgba(13,39,80,0.14), -6px -6px 18px rgba(255,255,255,0.82)',
                  border: '1.5px solid transparent',
                  transition: 'box-shadow 0.4s ease, opacity 0.4s ease',
                  opacity: storyStep === 1 ? 1 : 0.55,
                  display: 'flex', flexDirection: 'column', gap: 0,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#AAAAAA', margin: 0 }}>
                    Auto-Flagged
                  </p>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEC944', boxShadow: '2px 2px 5px rgba(212,160,23,0.3), -1px -1px 3px rgba(255,255,255,0.5)' }} />
                </div>
                {/* Alert rows — slide in when active */}
                <div key={`alert-${storyStep}`} style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  {[
                    { text: 'Stall threshold exceeded',   delay: '0ms'   },
                    { text: 'Clinician unavailable',       delay: '180ms' },
                    { text: 'Escalating automatically',    delay: '360ms' },
                  ].map(({ text, delay }) => (
                    <div
                      key={text}
                      className={storyStep === 1 ? 'alert-row' : undefined}
                      style={{
                        animationDelay: delay,
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '9px 12px', borderRadius: 10,
                        background: '#E8EAEC',
                        boxShadow: 'inset 2px 2px 5px rgba(13,39,80,0.10), inset -2px -2px 4px rgba(255,255,255,0.88)',
                        opacity: storyStep === 1 ? undefined : 0.5,
                      }}
                    >
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#FEC944', flexShrink: 0 }} />
                      <p style={{ fontSize: 11, fontWeight: 600, color: '#555', margin: 0 }}>{text}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid rgba(13,39,80,0.07)' }}>
                  <p style={{ fontSize: 10, color: '#BBBBBB', margin: 0 }}>0 manual steps required</p>
                </div>
              </div>

              {/* ── Card 2: Reassigned ── */}
              <div
                className={storyStep === 2 ? 'story-card-active' : undefined}
                style={{
                  borderRadius: 20, background: '#E8EAEC', padding: '24px 20px',
                  boxShadow: '8px 8px 22px rgba(13,39,80,0.14), -6px -6px 18px rgba(255,255,255,0.82)',
                  border: '1.5px solid transparent',
                  transition: 'box-shadow 0.4s ease, opacity 0.4s ease',
                  opacity: storyStep === 2 ? 1 : 0.55,
                  display: 'flex', flexDirection: 'column', gap: 0,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#AAAAAA', margin: 0 }}>
                    Reassigned
                  </p>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEC944', boxShadow: '2px 2px 5px rgba(212,160,23,0.3), -1px -1px 3px rgba(255,255,255,0.5)' }} />
                </div>
                {/* Patient */}
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1C', margin: '0 0 12px' }}>Marcus Torres</p>
                {/* Pill flips */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
                    background: '#E8EAEC',
                    boxShadow: 'inset 2px 2px 5px rgba(13,39,80,0.10), inset -2px -2px 4px rgba(255,255,255,0.88)',
                    color: storyStep >= 2 ? '#10B981' : '#EF4444',
                    transition: 'color 0.8s ease 0.5s',
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: storyStep >= 2 ? '#10B981' : '#EF4444', transition: 'background 0.8s ease 0.5s' }} />
                    {storyStep >= 2 ? 'Assigned' : 'Stalled'}
                  </span>
                </div>
                {/* New provider */}
                <div style={{ padding: '10px 12px', borderRadius: 10, background: '#E8EAEC', boxShadow: 'inset 2px 2px 5px rgba(13,39,80,0.10), inset -2px -2px 4px rgba(255,255,255,0.88)', flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1C', margin: '0 0 2px' }}>Dr. Sarah K.</p>
                  <p style={{ fontSize: 10, color: '#AAAAAA', margin: 0 }}>Available · State licensed</p>
                </div>
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(13,39,80,0.07)' }}>
                  <p style={{ fontSize: 10, color: '#BBBBBB', margin: 0 }}>Next-available match</p>
                </div>
              </div>

              {/* ── Card 3: Resolved ── */}
              <div
                className={storyStep === 3 ? 'story-card-active' : undefined}
                style={{
                  borderRadius: 20, background: '#E8EAEC', padding: '24px 20px',
                  boxShadow: '8px 8px 22px rgba(13,39,80,0.14), -6px -6px 18px rgba(255,255,255,0.82)',
                  border: '1.5px solid transparent',
                  transition: 'box-shadow 0.4s ease, opacity 0.4s ease',
                  opacity: storyStep === 3 ? 1 : 0.55,
                  display: 'flex', flexDirection: 'column', gap: 0,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: storyStep === 3 ? '#10B981' : '#AAAAAA', margin: 0, transition: 'color 0.4s ease' }}>
                    {storyStep === 3 ? '✓ Resolved · 3 min' : 'Resolved'}
                  </p>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981', boxShadow: storyStep === 3 ? '0 0 8px rgba(16,185,129,0.6), 2px 2px 5px rgba(16,185,129,0.3)' : '2px 2px 5px rgba(16,185,129,0.2)', transition: 'box-shadow 0.4s ease' }} />
                </div>
                {/* Big check */}
                <div
                  key={`check-${storyStep}`}
                  className={storyStep === 3 ? 'story-pop' : undefined}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: '#E8EAEC',
                    boxShadow: storyStep === 3
                      ? '0 0 0 3px rgba(16,185,129,0.3), 6px 6px 16px rgba(16,185,129,0.2), -4px -4px 12px rgba(255,255,255,0.9)'
                      : '4px 4px 10px rgba(13,39,80,0.12), -3px -3px 8px rgba(255,255,255,0.88)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'box-shadow 0.5s ease',
                  }}>
                    <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                      <path d="M2 9l6 6L20 2" stroke={storyStep === 3 ? '#10B981' : '#CCCCCC'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.4s ease' }} />
                    </svg>
                  </div>
                </div>
                {/* Status */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5, alignSelf: 'flex-start',
                  fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
                  background: '#E8EAEC',
                  boxShadow: 'inset 2px 2px 5px rgba(13,39,80,0.10), inset -2px -2px 4px rgba(255,255,255,0.88)',
                  color: '#10B981', marginBottom: 'auto',
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981' }} />
                  Consult Scheduled
                </span>
                <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid rgba(13,39,80,0.07)' }}>
                  <p style={{ fontSize: 10, color: '#BBBBBB', margin: 0 }}>0 delays · Fully automated</p>
                </div>
              </div>

            </div>

            {/* Step progress indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {[0, 1, 2, 3].map((s) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', flex: s < 3 ? '1' : 'none' }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: s <= storyStep ? '#FEC944' : '#E8EAEC',
                    boxShadow: s <= storyStep
                      ? '0 0 8px rgba(254,201,68,0.5), 2px 2px 4px rgba(13,39,80,0.12)'
                      : 'inset 2px 2px 4px rgba(13,39,80,0.12), inset -1px -1px 3px rgba(255,255,255,0.88)',
                    transition: 'background 0.4s ease, box-shadow 0.4s ease',
                  }} />
                  {s < 3 && (
                    <div style={{ flex: 1, height: 2, background: '#E8EAEC', boxShadow: 'inset 1px 1px 2px rgba(13,39,80,0.10)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', background: '#FEC944',
                        width: s < storyStep ? '100%' : '0%',
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </section>}

        {/* ── Testimonials + CTA ───────────────────────────────────────────── */}
        <section style={{ background: '#E8EAEC', padding: '120px 0 140px', overflow: 'hidden' }}>
          <style>{`
            @keyframes t-scroll-left {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
            @keyframes t-scroll-right {
              from { transform: translateX(-50%); }
              to   { transform: translateX(0); }
            }
            .t-r1 { animation: t-scroll-left  44s linear infinite; display: flex; gap: 20px; width: max-content; }
            .t-r2 { animation: t-scroll-right 58s linear infinite; display: flex; gap: 20px; width: max-content; }
            .t-wrapper:hover .t-r1,
            .t-wrapper:hover .t-r2 { animation-play-state: paused; }
          `}</style>

          {/* Header — padded */}
          <div style={{ padding: '0 80px', marginBottom: 72, textAlign: 'center' }}>
            <p style={{
              fontSize: 10, fontWeight: 800, letterSpacing: '0.18em',
              textTransform: 'uppercase', margin: '0 0 20px',
              color: '#D4A017',
            }}>
              Don&apos;t take our word for it
            </p>
            <h2 style={{
              fontSize: 'clamp(52px, 8vw, 100px)', fontWeight: 800,
              letterSpacing: '-0.04em', lineHeight: 1, margin: 0,
              color: '#E8EAEC',
              textShadow: '6px 6px 14px rgba(13,39,80,0.18), -4px -4px 10px rgba(255,255,255,0.92)',
            }}>
              The network<br />speaks.
            </h2>
          </div>

          {/* 2-row carousel — full-width, no side padding */}
          <div className="t-wrapper" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {([
              { cls: 't-r1', offset: 0 },
              { cls: 't-r2', offset: 5 },
            ] as const).map(({ cls, offset }) => {
              const items = [...TESTIMONIALS.slice(offset), ...TESTIMONIALS.slice(0, offset)];
              const doubled = [...items, ...items];
              return (
                <div key={cls} className={cls}>
                  {doubled.map((t, idx) => (
                    <div key={idx} style={{
                      width: 300, flexShrink: 0,
                      borderRadius: 20, background: '#E8EAEC', padding: '24px 22px',
                      boxShadow: '8px 8px 22px rgba(13,39,80,0.14), -6px -6px 18px rgba(255,255,255,0.82)',
                      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                      minHeight: 190,
                    }}>
                      <div>
                        <p style={{ fontSize: 22, lineHeight: 1, color: 'rgba(13,39,80,0.10)', margin: '0 0 8px', fontFamily: 'Georgia, serif', fontWeight: 900 }}>"</p>
                        <p style={{ fontSize: 13, lineHeight: 1.65, color: '#444', margin: 0, fontStyle: 'italic' }}>
                          {t.quote}
                        </p>
                      </div>
                      <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(13,39,80,0.07)' }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1C', margin: '0 0 2px' }}>{t.name}</p>
                        <p style={{ fontSize: 10, fontWeight: 500, color: '#AAAAAA', margin: 0 }}>{t.role} · {t.company}</p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>


        </section>

        {/* ── CTA + Footer ─────────────────────────────────────────────────── */}
        <section
          ref={footerRef}
          style={{ background: '#1F1F22', position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '80vh' }}
        >
          {/* Left — footer cube, self-contained */}
          <div style={{ position: 'relative' }}>
            <FooterCube />
          </div>

          {/* Right — copy above canvas, left-aligned, vertically centered */}
          <div style={{ position: 'relative', zIndex: 5, padding: '80px 80px 100px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', textAlign: 'left' }}>
            <FadeUp>
              {/* Eyebrow */}
              <p style={{
                fontSize: 10, fontWeight: 800, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: '#D4A017', margin: '0 0 20px',
              }}>
                Early access
              </p>

              <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 58px)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.04em', color: '#fff', margin: '0 0 24px' }}>
                Start Building.<br /><span style={{ color: '#FEC944' }}>Join the Beta.</span>
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', maxWidth: 400, margin: '0 0 16px' }}>
                We&apos;ve built the infrastructure we wish existed when we started — and we&apos;re just getting started. Be among the first teams to go live on rxlibrary.
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.28)', maxWidth: 380, margin: '0 0 40px', fontStyle: 'italic' }}>
                HIPAA · SOC2 · FHIR R4 · API-first · Enterprise-ready
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                <a
                  href="/login"
                  className="btn-login"
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 12, fontSize: 14, fontWeight: 700, padding: '14px 32px',
                  }}
                >
                  Log In
                </a>
                <a
                  href="/demo"
                  className="btn-demo"
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 12, fontSize: 14, fontWeight: 700, padding: '14px 32px',
                  }}
                >
                  Book a demo →
                </a>
              </div>
            </FadeUp>
          </div>

          {/* Footer bar — full-width, spans both columns, above canvas */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            zIndex: 5,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '28px 80px',
            display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 18, letterSpacing: '-0.04em' }}>
              <span style={{ color: '#FEC944', fontWeight: 400 }}>rx</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>library</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 24px' }}>
              {['Privacy Policy', 'Terms of Service', 'HIPAA Notice', 'Contact'].map((link) => (
                <a key={link} href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
                >
                  {link}
                </a>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 4 }}>
              © 2026
              <span style={{ letterSpacing: '-0.03em' }}>
                <span style={{ fontWeight: 400 }}>rx</span>
                <span style={{ fontWeight: 700 }}>library</span>
              </span>
              All rights reserved.
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
