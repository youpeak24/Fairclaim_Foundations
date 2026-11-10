import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { mainNav } from '../data/navigation';

const FOCUSABLE = 'a[href], button:not([disabled])';


export function Header() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  /* The menu belongs to a route: navigating anywhere closes it. */
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const setOpen = useCallback((v: boolean) => setOpenAt(v ? pathname : null), [pathname]);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Border and background appear on scroll. Both are always present (transparent
     at the top) so nothing shifts. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = useCallback(
    (restoreFocus: boolean) => {
      setOpen(false);
      if (restoreFocus) toggleRef.current?.focus();
    },
    [setOpen],
  );

  /* Leaving the mobile breakpoint closes the menu */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [setOpen]);

  /* Lock page scroll while the menu is open and move focus into it */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (!open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
      return;
    }
    if (e.key !== 'Tab') return;
    const items = Array.from(headerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (!items.length) return;
    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    if (e.shiftKey && document.activeElement === firstItem) {
      e.preventDefault();
      lastItem.focus();
    } else if (!e.shiftKey && document.activeElement === lastItem) {
      e.preventDefault();
      firstItem.focus();
    }
  };

  return (
    <header
      ref={headerRef}
      onKeyDown={onKeyDown}
      data-scrolled={scrolled || open}
      className="sticky top-0 z-50 border-b border-transparent bg-ivory transition-[background-color,border-color,box-shadow] duration-200 data-[scrolled=true]:border-line data-[scrolled=true]:bg-ivory/90 data-[scrolled=true]:shadow-[0_8px_24px_-18px_rgb(7_31_70/0.35)] data-[scrolled=true]:backdrop-blur-md"
    >
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-4 lg:h-20">
        <BrandLogo />

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex xl:gap-8">
          {mainNav.map((item) => (
            <NavLink key={item.href} to={item.href} end={item.href === '/'} className="nav-link">
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/donate" className="btn btn-gold btn-shine hidden !min-h-11 !px-5 sm:inline-flex">
            <Heart className="heart-beat h-4 w-4" fill="currentColor" aria-hidden="true" />
            Donate
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 grid h-12 w-12 place-items-center rounded-[var(--radius-ui)] text-navy transition-colors hover:bg-navy/5 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => (open ? close(true) : setOpen(true))}
          >
            {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-b border-line bg-ivory shadow-[0_30px_50px_-30px_rgb(7_31_70/0.45)] lg:hidden"
      >
        <nav aria-label="Main mobile" className="container-x py-3">
          <ul>
            {mainNav.map((item) => (
              <li key={item.href} className="border-b border-line last:border-0">
                <NavLink
                  to={item.href}
                  end={item.href === '/'}
                  className="mobile-link flex min-h-[3.25rem] items-center justify-between font-serif text-[1.5rem] text-navy"
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="pb-4 pt-4">
            <Link to="/donate" className="btn btn-gold btn-shine w-full">
              <Heart className="heart-beat h-4 w-4" fill="currentColor" aria-hidden="true" />
              Donate
            </Link>
          </div>
        </nav>
      </div>
      {open && (
        <div
          aria-hidden="true"
          onClick={() => close(true)}
          className="fixed inset-0 top-[4.5rem] -z-10 bg-navy/40 lg:hidden"
        />
      )}
    </header>
  );
}
