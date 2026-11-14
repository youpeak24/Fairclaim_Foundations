interface SocialItem {
  name: string;
  url: string;
  ariaLabel: string;
  tooltip: string;
  className: string;
  hoverShadow: string;
  icon: (props: { className?: string }) => import('react').ReactNode;
}

const SOCIAL_ITEMS: SocialItem[] = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/fairclaimfoundations/',
    ariaLabel: 'Visit Fairclaim Foundation on Instagram',
    tooltip: 'Follow on Instagram',
    className:
      'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white focus-visible:ring-[#ee2a7b]',
    hoverShadow: 'hover:shadow-[0_8px_20px_rgba(238,42,123,0.45)]',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@FairclaimFoundations',
    ariaLabel: 'Visit Fairclaim Foundation on YouTube',
    tooltip: 'Subscribe on YouTube',
    className: 'bg-[#FF0000] text-white hover:bg-[#E60000] focus-visible:ring-[#FF0000]',
    hoverShadow: 'hover:shadow-[0_8px_20px_rgba(255,0,0,0.45)]',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61595937069935',
    ariaLabel: 'Visit Fairclaim Foundation on Facebook',
    tooltip: 'Connect on Facebook',
    className: 'bg-[#1877F2] text-white hover:bg-[#166fe5] focus-visible:ring-[#1877F2]',
    hoverShadow: 'hover:shadow-[0_8px_20px_rgba(24,119,242,0.45)]',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

/**
 * Modern floating social action buttons fixed in the bottom-right corner.
 * Links to Fairclaim Foundation's verified Instagram, YouTube, and Facebook profiles.
 */
export function FloatingSocialButtons() {
  return (
    <aside
      aria-label="Social media links"
      className="fixed bottom-6 right-4 sm:bottom-7 sm:right-6 z-40 flex flex-col items-center gap-2.5 sm:gap-3 print:hidden pointer-events-auto"
    >
      {SOCIAL_ITEMS.map((item) => (
        <a
          key={item.name}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.ariaLabel}
          className={`group relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${item.className} ${item.hoverShadow}`}
        >
          {item.icon({ className: 'h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem] transition-transform duration-300 group-hover:scale-110' })}

          {/* Desktop tooltip */}
          <span
            role="tooltip"
            className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md bg-[#071f46] px-2.5 py-1 text-xs font-semibold tracking-wide text-white opacity-0 shadow-md backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 group-hover:-translate-x-1 sm:inline-block"
          >
            {item.tooltip}
          </span>
        </a>
      ))}
    </aside>
  );
}
