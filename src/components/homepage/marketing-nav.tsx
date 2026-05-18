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
          background: '#1F1F22',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          transition: 'box-shadow 0.25s ease',
          boxShadow: scrolled
            ? '0 8px 32px rgba(0,0,0,0.55), 0 -1px 0 rgba(255,255,255,0.04) inset'
            : '0 4px 20px rgba(0,0,0,0.40), 0 -1px 0 rgba(255,255,255,0.04) inset',
        }}
      >
        <div className="flex items-center justify-between h-16 px-6 lg:px-12 max-w-8xl mx-auto">

          {/* Logo */}
          <button
            onClick={() => scrollTo('hero')}
            className="flex items-center text-xl select-none focus:outline-none"
            style={{ letterSpacing: '-0.04em', textTransform: 'none' }}
          >
            <span style={{ color: '#FEC944', fontWeight: 400 }}>rx</span>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>library</span>
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
              className="btn-login text-sm font-semibold px-4 py-2 rounded-lg"
            >
              {isLoggedIn ? 'Dashboard' : 'Log In'}
            </Link>
            <a
              href="/demo"
              className="btn-demo text-sm font-semibold px-5 py-2.5 rounded-[9px]"
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
              className="btn-login text-sm font-semibold py-3 text-center rounded-xl"
            >
              {isLoggedIn ? 'Dashboard' : 'Log In'}
            </Link>
            <a
              href="/demo"
              onClick={() => setMenuOpen(false)}
              className="btn-demo text-sm font-semibold py-3 text-center rounded-xl"
            >
              Book a demo →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
