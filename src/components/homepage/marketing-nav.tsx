'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NavLink {
  id: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { id: 'platform',     label: 'Platform'      },
  { id: 'demo',         label: 'See It Live'   },
  { id: 'for-who',      label: "Who It's For"  },
  { id: 'integrations', label: 'Integrations'  },
];

interface MarketingNavProps {
  isLoggedIn: boolean;
  dashboardHref: string;
}

export function MarketingNav({ isLoggedIn, dashboardHref }: MarketingNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: scrolled ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.10)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          transition: 'background 0.25s ease, box-shadow 0.25s ease',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.2)' : 'none',
        }}
      >
        <div className="flex items-center justify-between h-16 px-6 lg:px-12 max-w-8xl mx-auto">

          {/* Logo */}
          <button
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-2 font-bold text-xl select-none focus:outline-none"
            style={{ letterSpacing: '-0.04em', color: '#fff' }}
          >
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: '#FEC944' }} />
            Rx Library
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-sm font-medium transition-colors hover:text-white focus:outline-none"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href={isLoggedIn ? dashboardHref : '/login'}
              className="text-sm font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-70"
              style={{ color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.22)' }}
            >
              {isLoggedIn ? 'Dashboard' : 'Log In'}
            </Link>
            <a
              href="/demo"
              className="text-sm font-semibold px-5 py-2.5 rounded-[9px] transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: '#FEC944', color: '#1E1E1E' }}
            >
              Book a demo →
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10 focus:outline-none"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span
              className="block h-[2px] w-5 rounded-full transition-all duration-200"
              style={{
                background: '#fff',
                transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
              }}
            />
            <span
              className="block h-[2px] w-5 rounded-full transition-all duration-200"
              style={{
                background: '#fff',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-[2px] w-5 rounded-full transition-all duration-200"
              style={{
                background: '#fff',
                transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu — drops below nav */}
      <div
        className="fixed top-16 left-0 right-0 z-40 md:hidden overflow-hidden"
        style={{
          maxHeight: menuOpen ? '400px' : '0',
          transition: 'max-height 0.3s ease',
          background: 'rgba(10,10,15,0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: menuOpen ? '1px solid rgba(255,255,255,0.08)' : 'none',
        }}
      >
        <div className="px-6 py-6 flex flex-col gap-1">
          {NAV_LINKS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-left text-base font-medium py-3 px-2 rounded-xl transition-colors hover:bg-white/10 focus:outline-none w-full"
              style={{ color: 'rgba(255,255,255,0.75)' }}
            >
              {label}
            </button>
          ))}

          <div className="mt-4 pt-4 flex flex-col gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Link
              href={isLoggedIn ? dashboardHref : '/login'}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-semibold py-3 text-center rounded-xl transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}
            >
              {isLoggedIn ? 'Dashboard' : 'Log In'}
            </Link>
            <a
              href="/demo"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-semibold py-3 text-center rounded-xl transition-all hover:opacity-90"
              style={{ background: '#FEC944', color: '#1E1E1E' }}
            >
              Book a demo →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
