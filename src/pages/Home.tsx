import { Link } from 'react-router-dom';
import { ArrowRight, Heart, MessageCircle, QrCode, ShieldCheck, Smartphone } from 'lucide-react';
import { DonationWidget } from '../components/donate/DonationWidget';
import { Faq } from '../components/Faq';
import { CurveEdge, RingAccent, SunriseArcs, SunriseOnNavy } from '../components/Geometry';
import { ButtonLink, Rule } from '../components/ui';
import { idx } from '../lib/stagger';
import { focusAreas } from '../data/initiatives';
import {
  approachSteps,
  faqs,
  guidingPrinciples,
  mission,
  purposePrinciples,
  vision,
} from '../data/organization';

export function Home() {
  return (
    <>
      <Hero />
      <Purpose />
      <FocusAreas />
      <MissionVision />
      <Principles />
      <Approach />
      <Questions />
      <Closing />
    </>
  );
}

/* ------------------------------------------------------------------ A: Hero */

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-ivory">
      <div aria-hidden="true" className="orb -left-24 top-10 -z-10 h-72 w-72 bg-sky/15" />
      <div aria-hidden="true" className="orb -right-20 bottom-24 -z-10 h-80 w-80 bg-gold/20 [animation-delay:-6s]" />
      <div className="container-x grid items-start gap-12 pb-16 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_31rem] lg:gap-14 lg:pb-28 lg:pt-14 xl:grid-cols-[minmax(0,1fr)_33rem]">
        <div className="lg:pt-10">
          <p className="eyebrow enter" style={idx(0)}>
            Fairness. Dignity. Possibility.
          </p>
          <h1 id="hero-title" className="text-hero mt-6 sm:mt-7">
            <span className="enter block" style={idx(1)}>
              A fairer future.
            </span>
            <span className="enter block italic text-brand" style={idx(2)}>
              Built together.
            </span>
          </h1>
          <p className="text-lead enter mt-7 max-w-[34rem] text-ink-soft sm:mt-8" style={idx(3)}>
            Fairclaim Foundation aims to make fairness easier to understand and pursue—through public education,
            constructive dialogue, and a shared commitment to equitable opportunity.
          </p>
          <div className="enter mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4" style={idx(4)}>
            <a href="#donate" className="btn btn-gold">
              <Heart className="heart-beat h-4 w-4 shrink-0" aria-hidden="true" fill="currentColor" />
              <span>Donate now</span>
            </a>
            <ButtonLink to="/#focus-areas" variant="ghost">
              Explore our focus areas
            </ButtonLink>
          </div>
          <ul className="enter mt-10 grid max-w-[34rem] gap-3 text-[0.9375rem] text-ink-soft sm:grid-cols-2" style={idx(5)}>
            {[
              [ShieldCheck, 'Secure payment checkout'],
              [QrCode, 'Quick UPI scan-and-pay'],
              [Smartphone, 'Works with any UPI app'],
              [MessageCircle, 'Confirmation on WhatsApp'],
            ].map(([Icon, label]) => {
              const I = Icon as typeof ShieldCheck;
              return (
                <li key={label as string} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-brand shadow-[0_0_0_1px_rgb(7_31_70/0.08)]">
                    <I className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {label as string}
                </li>
              );
            })}
          </ul>
          <p className="enter mt-10 flex items-center gap-4 font-serif text-lg italic text-ink-soft" style={idx(6)}>
            <span aria-hidden="true" className="h-px w-10 bg-gold" />
            Rooted in dignity. Guided by fairness.
          </p>
        </div>

        {/* Donation widget, framed by the sunrise arcs */}
        <div className="relative mx-auto w-full max-w-[34rem] scroll-mt-28 lg:max-w-none">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-[22%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(0_159_227/0.2),rgb(7_93_168/0.07)_55%,transparent)]"
          />
          <div data-parallax className="parallax pointer-events-none absolute -inset-x-[14%] -inset-y-[6%] -z-10 hidden sm:block" aria-hidden="true">
            <SunriseArcs animated className="h-full w-full" />
          </div>
          <DonationWidget id="donate" />
        </div>
      </div>
      <CurveEdge fill="#ffffff" />
    </section>
  );
}

/* --------------------------------------------------------------- B: Purpose */

function Purpose() {
  return (
    <section id="purpose" aria-labelledby="purpose-title" className="section-y -mt-px bg-white">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="eyebrow" data-reveal>
            Why Fairclaim
          </p>
          <h2 id="purpose-title" className="text-section mt-6" data-reveal style={idx(1)}>
            Fairness should feel within reach.
          </h2>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="text-lead text-ink-soft" data-reveal style={idx(2)}>
            Understanding a process, expressing a concern, or finding a constructive way forward can feel
            complicated. Our purpose is to help make civic understanding clearer and meaningful participation more
            accessible.
          </p>
          <ul className="mt-12">
            {purposePrinciples.map((p, i) => (
              <li key={p.title} data-reveal style={idx(i + 3)}>
                <Rule />
                <div className="grid gap-1 py-6 sm:grid-cols-[11rem_1fr] sm:items-baseline sm:gap-6 sm:py-7">
                  <h3 className="font-serif text-[1.75rem] leading-tight">{p.title}</h3>
                  <p className="text-ink-soft">{p.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- C: Focus areas */

function FocusAreas() {
  return (
    <section id="focus-areas" aria-labelledby="focus-title" className="relative bg-ivory pt-[4.25rem] md:pt-24 lg:pt-[7.5rem]">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <p className="eyebrow" data-reveal>
              Where we aim to contribute
            </p>
            <h2 id="focus-title" className="text-section mt-6" data-reveal style={idx(1)}>
              <span className="block">Four focus areas.</span>
              <span className="block italic text-brand">One commitment to fairness.</span>
            </h2>
          </div>
          <p className="text-lead text-ink-soft lg:col-span-4 lg:col-start-9" data-reveal style={idx(2)}>
            Our proposed areas of work bring together knowledge, dialogue, and inquiry to support a more informed and
            equitable society.
          </p>
        </div>

        <ol className="mt-12 md:mt-16">
          {focusAreas.map((area, i) => (
            <li key={area.id} data-reveal style={idx(i + 1)}>
              <article className="group relative isolate grid gap-x-8 gap-y-3 border-t border-line py-9 before:absolute before:inset-y-0 before:-inset-x-4 before:-z-10 before:rounded-[6px] before:bg-brand/[0.05] before:opacity-0 before:transition-opacity before:duration-200 focus-within:before:opacity-100 hover:before:opacity-100 sm:-mx-0 md:grid-cols-[4.5rem_minmax(0,1fr)] md:py-11 lg:grid-cols-[6rem_minmax(0,1fr)_17rem]">
                <span
                  aria-hidden="true"
                  data-draw
                  style={idx(i)}
                  className="absolute -top-px left-0 h-px w-full bg-gold/70"
                />
                <span aria-hidden="true" className="font-serif text-[2rem] leading-none text-gold-ink md:text-[2.75rem]">
                  {area.number}
                </span>
                <div className="md:col-start-2">
                  <h3 className="font-serif text-[1.65rem] leading-[1.15] sm:text-[2rem] lg:text-[2.35rem]">{area.title}</h3>
                  <p className="mt-4 max-w-[38rem] text-ink-soft">{area.summary}</p>
                </div>
                <div className="mt-3 flex flex-col gap-4 md:col-start-2 lg:col-start-3 lg:row-start-1 lg:mt-0 lg:items-start lg:gap-3 lg:pt-3">
                  <p className="flex items-center gap-2.5 text-[0.8125rem] font-medium text-ink-soft">
                    <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full border-[1.5px] border-gold bg-gold-pale" />
                    {area.status}
                  </p>
                  <Link
                    to={`/initiatives#${area.id}`}
                    className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand outline-none after:absolute after:inset-0 after:rounded-[6px] after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-brand"
                  >
                    Explore this focus area
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-1 group-focus-within:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ol>
        <div className="border-t border-line" aria-hidden="true" />
      </div>
      <div className="mt-[4.25rem] md:mt-24 lg:mt-[7.5rem]">
        <CurveEdge fill="#071f46" />
      </div>
    </section>
  );
}

/* ----------------------------------------------------- D: Mission & vision */

function MissionVision() {
  return (
    <section
      aria-labelledby="direction-title"
      className="on-navy relative isolate -mt-px overflow-hidden bg-navy text-on-navy"
    >
      <div data-parallax className="parallax pointer-events-none absolute -right-32 -top-64 -z-10 w-[30rem] max-w-none opacity-90 sm:-right-40 sm:-top-56 sm:w-[36rem] lg:-right-16 lg:-top-72 lg:w-[46rem]">
        <SunriseOnNavy className="h-full w-full" />
      </div>

      <div className="container-x pb-20 pt-10 md:pb-28 md:pt-14 lg:pb-36 lg:pt-16">
        <p className="eyebrow" data-reveal>
          Our direction
        </p>
        <h2 id="direction-title" className="text-section mt-6 max-w-3xl text-on-navy" data-reveal style={idx(1)}>
          <span className="block">Clear in purpose.</span>
          <span className="block italic text-gold">Shared in possibility.</span>
        </h2>

        <div className="relative mt-14 md:mt-20">
          <div className="absolute left-0 top-0 h-px w-full bg-white/15" aria-hidden="true" />
          <div
            data-draw
            className="absolute left-0 top-0 h-px w-full bg-gold/80"
            aria-hidden="true"
          />
          <div className="grid gap-12 pt-10 md:grid-cols-2 md:gap-0 md:pt-14">
            <div className="md:pr-12 lg:pr-20" data-reveal style={idx(2)}>
              <h3 className="eyebrow !text-gold">Our mission</h3>
              <p className="mt-6 max-w-[30rem] font-serif text-[1.55rem] leading-[1.38] text-on-navy sm:text-[1.85rem]">
                {mission}
              </p>
            </div>
            <div className="relative md:border-l md:border-white/15 md:pl-12 lg:pl-20" data-reveal style={idx(3)}>
              <span
                aria-hidden="true"
                className="absolute -top-[calc(2.5rem+0.3rem)] left-0 hidden h-[0.6rem] w-[0.6rem] -translate-x-1/2 rounded-full bg-gold md:block md:-top-[calc(3.5rem+0.3rem)]"
              />
              <h3 className="eyebrow !text-gold">Our vision</h3>
              <p className="mt-6 max-w-[30rem] font-serif text-[1.55rem] leading-[1.38] text-on-navy sm:text-[1.85rem]">
                {vision}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 md:mt-20" data-reveal style={idx(4)}>
          <ButtonLink to="/mission-vision" variant="gold">
            Read our mission &amp; vision
          </ButtonLink>
        </div>
      </div>
      <CurveEdge fill="#faf9f5" />
    </section>
  );
}

/* --------------------------------------------------------- E: Principles */

function Principles() {
  return (
    <section aria-labelledby="principles-title" className="section-y -mt-px bg-ivory">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow" data-reveal>
              What guides us
            </p>
            <h2 id="principles-title" className="text-section mt-6" data-reveal style={idx(1)}>
              The principles behind every step.
            </h2>
          </div>
        </div>
        <ol className="lg:col-span-6 lg:col-start-7">
          {guidingPrinciples.map((p, i) => (
            <li key={p.title} className="relative border-t border-line py-8 first:pt-0 first:border-t-0 md:py-10 md:first:pt-0" data-reveal style={idx(i === 0 ? 1 : 0)}>
              <div className="grid grid-cols-[3.25rem_1fr] gap-x-3 sm:grid-cols-[4.5rem_1fr]">
                <span aria-hidden="true" className="font-serif text-[1.5rem] leading-[1.3] text-gold-ink sm:text-[1.75rem]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-serif text-[1.65rem] leading-tight sm:text-[2rem]">{p.title}</h3>
                  <p className="mt-3 max-w-md text-ink-soft">{p.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- F: Approach */

function Approach() {
  return (
    <section aria-labelledby="approach-title" className="section-y bg-white">
      <div className="container-x">
        <p className="eyebrow" data-reveal>
          From purpose to possibility
        </p>
        <h2 id="approach-title" className="text-section mt-6 max-w-3xl" data-reveal style={idx(1)}>
          <span className="block">Listen carefully.</span>
          <span className="block">Understand clearly.</span>
          <span className="block italic text-brand">Move forward together.</span>
        </h2>
        <p className="mt-6 text-sm font-semibold tracking-wide text-ink-soft" data-reveal style={idx(2)}>
          A proposed approach, not a guaranteed service process.
        </p>

        <ol className="relative mt-14 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-10">
          <span
            aria-hidden="true"
            data-draw
            className="absolute left-6 top-6 hidden h-px bg-gradient-to-r from-gold via-gold to-transparent md:block md:w-[calc(100%-1.5rem)]"
          />
          <span
            aria-hidden="true"
            data-draw="y"
            className="absolute bottom-10 left-6 top-6 w-px bg-gradient-to-b from-gold to-gold/20 md:hidden"
          />
          {approachSteps.map((step, i) => (
            <li key={step.title} className="relative pl-[4.5rem] md:pl-0 md:pt-[5rem]" data-reveal style={idx(i + 2)}>
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 grid h-12 w-12 place-items-center rounded-full border border-gold bg-white font-serif text-xl text-navy shadow-[0_0_0_6px_#fff]"
              >
                {i + 1}
              </span>
              <h3 className="font-serif text-[1.85rem] leading-tight sm:text-[2.1rem]">{step.title}</h3>
              <p className="mt-3 max-w-xs text-ink-soft">{step.description}</p>
            </li>
          ))}
        </ol>

        <p
          className="mt-14 max-w-2xl border-l-2 border-gold pl-5 text-[0.9375rem] text-ink-soft md:mt-20"
          data-reveal
        >
          Sending an enquiry does not open a legal case or guarantee assistance. Fairclaim Foundation’s focus areas are
          proposed, and this approach describes how it intends to work as they develop.
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- G: Questions */

function Questions() {
  return (
    <section aria-labelledby="faq-title" className="section-y bg-ivory">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <p className="eyebrow" data-reveal>
            Questions
          </p>
          <h2 id="faq-title" className="text-section mt-6" data-reveal style={idx(1)}>
            A little clarity before we connect.
          </h2>
        </div>
        <div className="lg:col-span-7 lg:col-start-6" data-reveal style={idx(2)}>
          <Faq items={faqs} />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- H: Closing */

function Closing() {
  return (
    <section aria-labelledby="closing-title" className="bg-ivory pb-[4.25rem] md:pb-24 lg:pb-[7.5rem]">
      <div className="container-x">
        <div
          className="relative isolate overflow-hidden rounded-[6px] border border-gold/40 bg-[linear-gradient(120deg,#f5e8bf_0%,#f8eecb_45%,#fbf4de_100%)] px-6 py-14 sm:px-12 sm:py-20 lg:px-20 lg:py-24"
          data-reveal="fade"
        >
          <RingAccent
            tone="gold"
            className="pointer-events-none absolute -right-20 -top-20 -z-10 h-56 w-56 sm:-bottom-48 sm:-right-24 sm:top-auto sm:h-[28rem] sm:w-[28rem] lg:-right-28 lg:bottom-auto lg:top-1/2 lg:h-[30rem] lg:w-[30rem] lg:-translate-y-1/2 xl:-right-16 xl:h-[34rem] xl:w-[34rem]"
          />
          <p className="eyebrow">An invitation</p>
          <h2 id="closing-title" className="text-section mt-6 max-w-2xl">
            <span className="block">A fairer future begins</span>
            <span className="block italic text-brand">with a conversation.</span>
          </h2>
          <p className="text-lead mt-7 max-w-lg text-ink">
            Interested in our purpose, proposed initiatives, or opportunities to collaborate? Share your perspective
            and help shape what comes next.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <ButtonLink to="/contact">Start a conversation</ButtonLink>
            <ButtonLink to="/about" variant="ghost" arrow={false}>
              Learn about the foundation
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
