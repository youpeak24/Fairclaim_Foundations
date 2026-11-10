import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { formatRupees } from '../../lib/donation';
import { CopyButton } from './CopyButton';

export type Done =
  | { kind: 'paid'; name: string; amount: number; paymentId: string }
  /** Paid at the gateway but we could not confirm it on the server */
  | { kind: 'unverified'; name: string; paymentId: string; message: string }
  | { kind: 'qr'; name: string; amount: number; reference: string };

/** Animated tick: a ring bursts out, then the check draws itself. */
function Tick({ tone }: { tone: 'ok' | 'warn' }) {
  return (
    <span className={`tick tick-${tone} relative mx-auto grid h-20 w-20 place-items-center rounded-full`}>
      <span className="tick-burst" aria-hidden="true" />
      <svg viewBox="0 0 52 52" className="relative h-12 w-12" fill="none" aria-hidden="true">
        <circle className="tick-circle" cx="26" cy="26" r="23" strokeWidth="3" />
        {tone === 'ok' ? (
          <path className="tick-mark" d="M15 27.5l8 8L37.5 19" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path className="tick-mark" d="M26 15v14M26 36.5v.5" strokeWidth="3.5" strokeLinecap="round" />
        )}
      </svg>
    </span>
  );
}

export function DoneCard({ done, onAgain }: { done: Done; onAgain: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  const first = done.name.trim().split(/\s+/)[0] || 'friend';

  return (
    <div className="panel-in py-4 text-center" role="status">
      <Tick tone={done.kind === 'unverified' ? 'warn' : 'ok'} />

      {done.kind === 'paid' && (
        <>
          <h3 ref={headingRef} tabIndex={-1} className="mt-5 font-serif text-[1.75rem] leading-tight outline-none">
            Thank you, {first}.
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-ink-soft">
            Your gift of <strong className="text-navy">{formatRupees(done.amount)}</strong> was received and confirmed.
          </p>
          <Ref label="Payment ID" value={done.paymentId} />
          <p className="mx-auto mt-3 max-w-sm text-[0.8125rem] text-ink-soft">
            Keep this payment ID for your records. Your bank or payment app also shows a confirmation.
          </p>
        </>
      )}

      {done.kind === 'unverified' && (
        <>
          <h3 ref={headingRef} tabIndex={-1} className="mt-5 font-serif text-[1.75rem] leading-tight outline-none">
            We’re checking your payment
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-ink-soft">{done.message}</p>
          <Ref label="Payment ID" value={done.paymentId} />
          <p className="mt-4">
            <Link to="/contact" className="link-underline font-semibold text-brand">
              Contact us about this payment
            </Link>
          </p>
        </>
      )}

      {done.kind === 'qr' && (
        <>
          <h3 ref={headingRef} tabIndex={-1} className="mt-5 font-serif text-[1.75rem] leading-tight outline-none">
            Thank you, {first}.
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-ink-soft">
            Once we match your <strong className="text-navy">{formatRupees(done.amount)}</strong> payment to your screenshot, we’ll confirm it on
            WhatsApp.
          </p>
          <Ref label="Reference" value={done.reference} />
          <p className="mx-auto mt-3 max-w-sm text-[0.8125rem] text-ink-soft">
            Haven’t sent the screenshot yet? Open WhatsApp and send it with this reference so we can confirm your gift.
          </p>
        </>
      )}

      <button type="button" onClick={onAgain} className="btn btn-ghost mt-6">
        Make another gift
      </button>
    </div>
  );
}

function Ref({ label, value }: { label: string; value: string }) {
  return (
    <div className="mx-auto mt-5 inline-flex max-w-full items-center gap-1 rounded-xl border border-line bg-ivory py-1 pl-4 pr-1.5 text-[0.875rem]">
      <span className="text-ink-soft">{label}</span>
      <strong className="truncate font-mono tracking-wide text-navy">{value}</strong>
      <CopyButton value={value} label={label} />
    </div>
  );
}
