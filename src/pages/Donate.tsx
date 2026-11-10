import { Link } from 'react-router-dom';
import { Camera, CreditCard, Heart, MessageCircle, Paperclip, QrCode, ShieldCheck, Smartphone } from 'lucide-react';
import { DonationWidget } from '../components/donate/DonationWidget';
import { Faq } from '../components/Faq';
import { CurveEdge, SunriseOnNavy } from '../components/Geometry';
import { donationFaqs } from '../data/donation';
import { organization } from '../data/organization';
import { idx } from '../lib/stagger';

export function Donate() {
  return (
    <>
      <DonateHero />
      <TwoWays />
      <ScreenshotGuideSection />
      <Questions />
    </>
  );
}

function DonateHero() {
  return (
    <section aria-labelledby="donate-title" className="on-navy relative isolate overflow-hidden bg-navy text-on-navy-soft">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_85%_10%,rgb(0_159_227/0.28),transparent_70%),radial-gradient(50%_50%_at_0%_100%,rgb(212_166_42/0.18),transparent_70%)]" />
      <div aria-hidden="true" className="orb -left-24 top-24 -z-10 h-80 w-80 bg-sky/20" />
      <div aria-hidden="true" className="orb -right-16 bottom-10 -z-10 h-72 w-72 bg-gold/20 [animation-delay:-7s]" />
      <SunriseOnNavy className="pointer-events-none absolute -left-32 -top-24 -z-10 hidden h-[34rem] w-[34rem] opacity-60 lg:block" />

      <div className="container-x grid items-start gap-12 pb-20 pt-12 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_31rem] lg:gap-14 lg:pb-32 lg:pt-20 xl:grid-cols-[minmax(0,1fr)_33rem]">
        <div className="lg:pt-8">
          <p className="eyebrow enter" style={idx(0)}>
            Donate
          </p>
          <h1 id="donate-title" className="text-page enter mt-6 !text-on-navy" style={idx(1)}>
            Give in the way that <span className="italic text-gold">suits you.</span>
          </h1>
          <p className="text-lead enter mt-7 max-w-xl text-on-navy-soft" style={idx(2)}>
            Pay securely online, or scan a UPI QR and be done in seconds. Either way, every gift helps Fairclaim
            Foundation make fairness easier to understand and pursue.
          </p>

          <ul className="enter mt-9 grid max-w-xl gap-4 sm:grid-cols-2" style={idx(3)}>
            {[
              { Icon: ShieldCheck, title: 'Secure checkout', text: 'Cards, UPI, net banking and wallets through Razorpay.' },
              { Icon: QrCode, title: 'Scan and pay', text: 'Any UPI app. Pay in seconds from your phone.' },
              { Icon: MessageCircle, title: 'Confirmed on WhatsApp', text: 'Send your screenshot and we’ll confirm your gift.' },
              { Icon: Heart, title: 'Every amount helps', text: 'Give from ₹100. Choose what feels right.' },
            ].map(({ Icon, title, text }) => (
              <li key={title} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm transition-colors duration-200 hover:border-gold/40 hover:bg-white/[0.07]">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <strong className="block text-[0.9375rem] text-on-navy">{title}</strong>
                  <span className="text-[0.875rem] leading-snug">{text}</span>
                </span>
              </li>
            ))}
          </ul>

          <p className="enter mt-8 max-w-xl text-[0.8125rem] leading-relaxed text-on-navy-soft/80" style={idx(4)}>
            {organization.statusNote}
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[34rem] scroll-mt-28 lg:max-w-none">
          <DonationWidget id="donate" />
        </div>
      </div>
      <CurveEdge fill="#ffffff" />
    </section>
  );
}

/* ----------------------------------------------------------- Two ways to give */

const WAYS = [
  {
    Icon: CreditCard,
    title: 'Pay online',
    tag: 'Instant confirmation',
    steps: [
      'Choose an amount and enter your name, mobile number and email.',
      'Pick UPI, card, net banking or wallet on the secure payment window.',
      'See your confirmation and payment ID right away.',
    ],
  },
  {
    Icon: QrCode,
    title: 'Scan & pay (UPI QR)',
    tag: 'Fastest on a phone',
    steps: [
      'Choose an amount. A QR code is made for exactly that amount.',
      'Scan it with Google Pay, PhonePe, Paytm, BHIM or any UPI app and pay.',
      'Send us the payment screenshot on WhatsApp and we’ll confirm your gift.',
    ],
  },
];

function TwoWays() {
  return (
    <section aria-labelledby="ways-title" className="section-y -mt-px bg-white">
      <div className="container-x">
        <p className="eyebrow" data-reveal>
          How it works
        </p>
        <h2 id="ways-title" className="text-section mt-6 max-w-3xl" data-reveal style={idx(1)}>
          Two simple ways to <span className="italic text-brand">give.</span>
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {WAYS.map(({ Icon, title, tag, steps }, i) => (
            <article
              key={title}
              data-reveal
              style={idx(i + 2)}
              className="group relative overflow-hidden rounded-[1.25rem] border border-line bg-ivory p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[var(--shadow-soft)] sm:p-9"
            >
              <span aria-hidden="true" className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gold/10 transition-transform duration-500 group-hover:scale-125" />
              <div className="relative flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy text-gold shadow-[0_12px_22px_-12px_rgb(7_31_70/0.7)]">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-serif text-[1.65rem] leading-tight">{title}</h3>
                  <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-gold-ink">{tag}</p>
                </div>
              </div>
              <ol className="relative mt-7 space-y-4">
                {steps.map((step, n) => (
                  <li key={step} className="flex gap-4">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-[0.8125rem] font-bold text-navy shadow-[0_0_0_1px_rgb(7_31_70/0.12)]">
                      {n + 1}
                    </span>
                    <span className="text-ink-soft">{step}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------- WhatsApp screenshot guide */

const SHOT_STEPS = [
  {
    Icon: Smartphone,
    title: 'Pay with the QR',
    text: 'Scan, check the amount and our name, then pay. Wait for the green “Successful” screen.',
  },
  {
    Icon: Camera,
    title: 'Take a screenshot',
    text: 'On that success screen. Android: power + volume down. iPhone: side button + volume up.',
  },
  {
    Icon: MessageCircle,
    title: 'Open our WhatsApp chat',
    text: 'Tap “Open WhatsApp chat” in the widget. The message with your amount and reference is already written.',
  },
  {
    Icon: Paperclip,
    title: 'Attach and send',
    text: 'Tap the paperclip (Android) or + (iPhone), choose Gallery or Photos, pick the screenshot and press send.',
  },
];

function ScreenshotGuideSection() {
  return (
    <section id="send-screenshot" aria-labelledby="shot-title" className="section-y relative isolate overflow-hidden bg-ivory">
      <div aria-hidden="true" className="orb -right-24 top-10 -z-10 h-80 w-80 bg-sky/10" />
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow" data-reveal>
              Paid by QR?
            </p>
            <h2 id="shot-title" className="text-section mt-6" data-reveal style={idx(1)}>
              Send your screenshot on <span className="italic text-brand">WhatsApp.</span>
            </h2>
          </div>
          <p className="text-lead text-ink-soft lg:col-span-5" data-reveal style={idx(2)}>
            A UPI payment doesn’t carry your name to us. The screenshot is how we match the money to you and confirm
            your gift, so it takes less than a minute and matters.
          </p>
        </div>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SHOT_STEPS.map(({ Icon, title, text }, i) => (
            <li
              key={title}
              data-reveal
              style={idx(i)}
              className="relative rounded-[1.25rem] border border-line bg-white p-6 shadow-[var(--shadow-soft)] transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="absolute right-5 top-4 font-serif text-[3rem] leading-none text-gold/30" aria-hidden="true">
                {i + 1}
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gold-pale text-navy">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-serif text-[1.35rem] leading-snug">{title}</h3>
              <p className="mt-2 text-[0.9375rem] text-ink-soft">{text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-[1.25rem] border border-gold/50 bg-gold-pale/50 p-6 sm:p-8" data-reveal>
          <h3 className="font-serif text-[1.35rem]">Make sure the screenshot shows</h3>
          <ul className="mt-3 grid gap-2 text-ink-soft sm:grid-cols-2 lg:grid-cols-4">
            {['The amount you paid', '“Successful” or “Completed”', 'The UTR / transaction ID', 'The date and time'].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[0.875rem] text-ink-soft">
            Trouble sending it? <Link to="/contact" className="link-underline font-semibold text-brand">Contact us</Link> and quote your reference (it looks like
            FC-XXXXXX).
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Questions */

function Questions() {
  return (
    <section aria-labelledby="donate-faq-title" className="section-y bg-white">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <p className="eyebrow" data-reveal>
            Good to know
          </p>
          <h2 id="donate-faq-title" className="text-section mt-6" data-reveal style={idx(1)}>
            Questions about giving.
          </h2>
        </div>
        <div className="lg:col-span-7 lg:col-start-6" data-reveal="fade">
          <Faq items={donationFaqs} />
        </div>
      </div>
    </section>
  );
}
