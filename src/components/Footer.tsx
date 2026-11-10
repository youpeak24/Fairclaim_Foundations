import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { hasConfirmedContact, organization } from '../data/organization';
import { footerNav, policyNav } from '../data/navigation';

const YEAR = new Date().getFullYear();

export function Footer() {
  const { contact, social } = organization;

  return (
    <footer className="on-navy relative isolate overflow-hidden bg-navy text-on-navy-soft">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/70 to-transparent" aria-hidden="true" />
      <div className="container-x pb-10 pt-16 sm:pt-20">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <BrandLogo onDark />
            <p className="mt-8 max-w-sm font-serif text-[1.6rem] leading-tight text-on-navy">
              {organization.tagline}
            </p>
            <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed">
              {organization.statusNote}
            </p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-3 lg:col-start-7">
            <h2 className="eyebrow">Explore</h2>
            <ul className="mt-6 space-y-1">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="footer-link">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="eyebrow">Contact</h2>
            <div className="mt-6 space-y-4 text-[0.9375rem] leading-relaxed">
              {hasConfirmedContact ? (
                <ul className="space-y-2">
                  {contact.email && (
                    <li>
                      <a className="footer-link !min-h-0" href={`mailto:${contact.email}`}>
                        {contact.email}
                      </a>
                    </li>
                  )}
                  {contact.phone && <li>{contact.phone}</li>}
                  {contact.address && <li>{contact.address}</li>}
                </ul>
              ) : (
                <p>Contact details will be published here once they are confirmed. For now, the contact page is the place to start.</p>
              )}
              <Link
                to="/contact"
                className="group inline-flex min-h-11 items-center gap-2 font-semibold text-gold hover:text-[#e6bd53]"
              >
                Start a conversation
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              {social.length > 0 && (
                <ul className="flex flex-wrap gap-4 pt-2">
                  {social.map((s) => (
                    <li key={s.url}>
                      <a className="footer-link !min-h-0" href={s.url} rel="noopener noreferrer" target="_blank">
                        {s.platform}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-7 text-[0.8125rem] sm:mt-20 lg:flex-row lg:items-center lg:justify-between">
          <p>
            &copy; {YEAR} {organization.name}. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-1">
            {policyNav.map((item) => (
              <Link key={item.href} to={item.href} className="footer-link !min-h-11 lg:!min-h-0">
                {item.name}
              </Link>
            ))}
          </nav>
          <p>{organization.developerCredit}</p>
        </div>
      </div>
    </footer>
  );
}
