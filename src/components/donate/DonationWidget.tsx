import { cloneElement, useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent, ReactElement } from 'react';
import { CreditCard, LoaderCircle, Lock, QrCode, ShieldCheck, TriangleAlert } from 'lucide-react';
import { DEFAULT_AMOUNT, MIN_AMOUNT, POPULAR_AMOUNT, PRESET_AMOUNTS } from '../../data/donation';
import {
  amountError,
  formatRupees,
  makeReference,
  parseAmount,
  payWithCheckout,
  validateDonor,
} from '../../lib/donation';
import type { Donor, DonorErrors } from '../../lib/donation';
import { DoneCard } from './DoneCard';
import type { Done } from './DoneCard';
import { QrPay } from './QrPay';
import { ScreenshotGuide } from './ScreenshotGuide';

type Method = 'online' | 'qr';
type View = 'form' | 'proof' | 'done';

const EMPTY_DONOR: Donor = { name: '', phone: '', email: '' };
const METHODS: { id: Method; label: string; hint: string; Icon: typeof CreditCard }[] = [
  { id: 'online', label: 'Pay online', hint: 'Cards, UPI, net banking and wallets on our secure payment partner’s checkout.', Icon: CreditCard },
  { id: 'qr', label: 'Scan & pay', hint: 'Fastest on a phone: scan the UPI QR, pay, then send us the screenshot on WhatsApp.', Icon: QrCode },
];

/**
 * The donation widget, used in the home hero and on /donate.
 *
 * Two flows share one amount + name form:
 *  A) "Pay online": Razorpay checkout, verified on the server.
 *  B) "Scan & pay": UPI QR, then a guided hand-off of the screenshot to WhatsApp.
 */
export function DonationWidget({ id }: { id?: string }) {
  const uid = useId();
  const [method, setMethod] = useState<Method>('online');
  const [view, setView] = useState<View>('form');
  const [preset, setPreset] = useState<number | null>(DEFAULT_AMOUNT);
  const [custom, setCustom] = useState('');
  const [donor, setDonor] = useState<Donor>(EMPTY_DONOR);
  const [errors, setErrors] = useState<DonorErrors>({});
  const [touchedAmount, setTouchedAmount] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState('');
  const [reference, setReference] = useState('');
  const [done, setDone] = useState<Done | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const formRef = useRef<HTMLDivElement>(null);

  // Generated after mount so the prerendered HTML and the first client render match
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- must run client-side only (hydration)
    setReference(makeReference());
  }, []);

  const rawAmount = preset ?? parseAmount(custom);
  const amountMessage = amountError(rawAmount);
  const amount = amountMessage ? null : rawAmount;
  const showAmountError = !preset && touchedAmount && custom.length > 0 && amountMessage;

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? METHODS.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + METHODS.length) % METHODS.length;
    setMethod(METHODS[next].id);
    setFailure('');
    tabRefs.current[next]?.focus();
  };

  const onDonor = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDonor((d) => ({ ...d, [name]: value }));
    if (errors[name as keyof Donor]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const onCustom = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^\d]/g, '').slice(0, 7);
    setCustom(digits ? Number(digits).toLocaleString('en-IN') : '');
    setPreset(null);
  };

  /** Returns true when the form is good to go; otherwise shows what to fix and focuses the first problem. */
  const check = (mode: Method): boolean => {
    setTouchedAmount(true);
    if (amountMessage) {
      formRef.current?.querySelector<HTMLElement>('[data-amount-input]')?.focus();
      return false;
    }
    const found = validateDonor(donor, mode);
    setErrors(found);
    const first = (['name', 'phone', 'email'] as const).find((k) => found[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return false;
    }
    return true;
  };

  const payOnline = async () => {
    if (busy || !check('online') || !amount) return;
    setBusy(true);
    setFailure('');
    try {
      const result = await payWithCheckout(amount, donor);
      if (result.status === 'paid') {
        setDone({ kind: 'paid', name: donor.name, amount: result.receipt.amount || amount, paymentId: result.receipt.paymentId });
        setView('done');
      } else if (result.status === 'unverified') {
        setDone({ kind: 'unverified', name: donor.name, paymentId: result.paymentId, message: result.message });
        setView('done');
      } else if (result.status === 'failed') {
        setFailure(result.message);
      }
    } catch (error) {
      setFailure(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const toProof = () => {
    if (check('qr')) setView('proof');
  };

  const reset = () => {
    setView('form');
    setDone(null);
    setFailure('');
    setErrors({});
    setTouchedAmount(false);
    setReference(makeReference());
  };

  const activeIndex = METHODS.findIndex((m) => m.id === method);
  const showForm = view === 'form';

  return (
    <div id={id} className="donate-ring">
      <div className="donate-card relative overflow-hidden rounded-[1.35rem] bg-white p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-gold-ink">Give today</p>
            <h2 className="mt-1 font-serif text-[1.65rem] leading-tight text-navy sm:text-[1.85rem]">Support Fairclaim Foundation</h2>
          </div>
          <span className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#e6f6ec] px-2.5 py-1 text-[0.6875rem] font-semibold text-[#1a7f45]">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Secure
          </span>
        </div>

        {view === 'done' && done && <DoneCard done={done} onAgain={reset} />}

        {view === 'proof' && amount && (
          <div className="mt-4">
            <ScreenshotGuide
              amount={amount}
              name={donor.name}
              reference={reference}
              onBack={() => setView('form')}
              onSent={() => {
                setDone({ kind: 'qr', name: donor.name, amount, reference });
                setView('done');
              }}
            />
          </div>
        )}

        {showForm && (
          <div ref={formRef} className="mt-5">
            {/* Method tabs */}
            <div role="tablist" aria-label="How would you like to give?" className="relative grid grid-cols-2 rounded-xl bg-navy/[0.06] p-1">
              <span
                aria-hidden="true"
                className="tab-pill pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-[0.6rem] bg-white shadow-[0_1px_2px_rgb(7_31_70/0.1),0_6px_14px_-6px_rgb(7_31_70/0.25)]"
                style={{ transform: `translateX(${activeIndex * 100}%)` }}
              />
              {METHODS.map(({ id: mid, label, Icon }, i) => (
                <button
                  key={mid}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${uid}-tab-${mid}`}
                  aria-selected={method === mid}
                  aria-controls={`${uid}-panel`}
                  tabIndex={method === mid ? 0 : -1}
                  onKeyDown={(e) => onTabKey(e, i)}
                  onClick={() => {
                    setMethod(mid);
                    setFailure('');
                  }}
                  className={`relative z-10 inline-flex min-h-11 items-center justify-center gap-2 rounded-[0.6rem] px-2 text-[0.875rem] font-semibold transition-colors duration-200 ${
                    method === mid ? 'text-navy' : 'text-ink-soft hover:text-navy'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-[0.8125rem] leading-snug text-ink-soft" aria-live="polite">
              {METHODS[activeIndex].hint}
            </p>

            {/* Amount */}
            <fieldset className="mt-5">
              <legend className="mb-2.5 text-[0.8125rem] font-semibold text-navy">Choose an amount</legend>
              <div role="radiogroup" aria-label="Donation amount" className="grid grid-cols-3 gap-2.5">
                {PRESET_AMOUNTS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={preset === value}
                    onClick={() => {
                      setPreset(value);
                      setCustom('');
                    }}
                    className="amount-chip"
                    data-selected={preset === value}
                  >
                    {value === POPULAR_AMOUNT && <span className="chip-badge">Most popular</span>}
                    {formatRupees(value)}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-4">
              <label htmlFor={`${uid}-custom`} className="mb-1.5 block text-[0.8125rem] font-semibold text-navy">
                Or enter another amount <span className="font-normal text-ink-soft">(minimum {formatRupees(MIN_AMOUNT)})</span>
              </label>
              <div className="relative">
                <span aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-navy">
                  ₹
                </span>
                <input
                  id={`${uid}-custom`}
                  data-amount-input
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="For example, 750"
                  value={custom}
                  onChange={onCustom}
                  onBlur={() => setTouchedAmount(true)}
                  aria-invalid={Boolean(showAmountError)}
                  aria-describedby={showAmountError ? `${uid}-amount-err` : undefined}
                  className="field-input !pl-8"
                />
              </div>
              {showAmountError && (
                <p id={`${uid}-amount-err`} className="mt-1.5 text-[0.8125rem] font-semibold text-[#9a1f17]">
                  {amountMessage}
                </p>
              )}
            </div>

            {/* Donor details */}
            <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
              <DonorField label="Full name" name="name" error={errors.name} className={method === 'online' ? '' : 'sm:col-span-2'}>
                <input name="name" autoComplete="name" placeholder="Your name" value={donor.name} onChange={onDonor} className="field-input" />
              </DonorField>
              {method === 'online' && (
                <DonorField label="Mobile number" name="phone" error={errors.phone}>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={14}
                    placeholder="10-digit number"
                    value={donor.phone}
                    onChange={onDonor}
                    className="field-input"
                  />
                </DonorField>
              )}
              {method === 'online' && (
                <DonorField label="Email for your receipt" name="email" error={errors.email} className="sm:col-span-2">
                  <input
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={donor.email}
                    onChange={onDonor}
                    className="field-input"
                  />
                </DonorField>
              )}
            </div>

            {/* Method panel */}
            <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${method}`} className="mt-5" key={method}>
              {method === 'online' ? (
                <div className="panel-in">
                  <div aria-live="polite">
                    {failure && (
                      <p role="alert" className="mb-3 flex gap-2.5 rounded-xl border border-[#b3261e]/30 bg-[#fdf1ef] p-3 text-[0.875rem] text-[#7a1a14]">
                        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        {failure}
                      </p>
                    )}
                  </div>
                  <button type="button" onClick={payOnline} disabled={busy} className="btn btn-pay btn-shine w-full">
                    {busy ? (
                      <>
                        <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
                        <span>Opening secure checkout…</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" aria-hidden="true" />
                        <span>{amount ? `Donate ${formatRupees(amount)} securely` : 'Donate securely'}</span>
                      </>
                    )}
                  </button>
                  <p className="mt-3 text-center text-[0.75rem] leading-relaxed text-ink-soft">
                    Payments are processed by Razorpay, a licensed payment gateway. We never see your card or UPI details.
                  </p>
                </div>
              ) : (
                <QrPay amount={amount} reference={reference} onPaid={toProof} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DonorField({
  label,
  name,
  error,
  className = '',
  children,
}: {
  label: string;
  name: string;
  error?: string;
  className?: string;
  children: ReactElement<Record<string, unknown>>;
}) {
  const uid = useId();
  const errId = `${uid}-err`;
  return (
    <div className={className}>
      <label htmlFor={uid} className="mb-1.5 block text-[0.8125rem] font-semibold text-navy">
        {label}
      </label>
      {/* Wire the label and error message to the input without every caller repeating it */}
      <div data-field={name}>
        {cloneElement(children, { id: uid, 'aria-invalid': Boolean(error), 'aria-describedby': error ? errId : undefined })}
      </div>
      {error && (
        <p id={errId} className="mt-1.5 text-[0.8125rem] font-semibold text-[#9a1f17]">
          {error}
        </p>
      )}
    </div>
  );
}
