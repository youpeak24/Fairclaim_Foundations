import { useEffect, useState } from 'react';
import { ArrowRight, Smartphone } from 'lucide-react';
import { UPI_ID, UPI_PAYEE_NAME, qrEnabled } from '../../data/donation';
import { formatRupees, qrDataUrl, upiLink } from '../../lib/donation';
import { CopyButton } from './CopyButton';

interface QrPayProps {
  /** A valid amount in rupees, or null while the amount is missing or out of range */
  amount: number | null;
  reference: string;
  onPaid: () => void;
}

/** Flow B, step 1: a UPI QR for the chosen amount, then "I've paid". */
export function QrPay({ amount, reference, onPaid }: QrPayProps) {
  // The image is stored with the link it was made for, so a stale QR is never shown for a new amount
  const [made, setMade] = useState<{ link: string; url: string } | null>(null);
  const link = amount && reference && qrEnabled ? upiLink(amount, reference) : '';

  useEffect(() => {
    if (!link) return;
    let live = true;
    // Small delay so typing a custom amount does not redraw the QR on every keystroke
    const timer = window.setTimeout(() => {
      qrDataUrl(link)
        .then((url) => live && setMade({ link, url }))
        .catch(() => live && setMade(null));
    }, 140);
    return () => {
      live = false;
      window.clearTimeout(timer);
    };
  }, [link]);

  const image = made && made.link === link ? made.url : '';

  if (!qrEnabled) {
    return (
      <div className="panel-in rounded-2xl border border-dashed border-navy/20 bg-ivory p-6 text-center text-[0.9375rem] text-ink-soft">
        QR payments are not set up yet. Please use <strong className="text-navy">Pay online</strong>, or check back soon.
      </div>
    );
  }

  return (
    <div className="panel-in">
      <div className="grid items-center gap-5 sm:grid-cols-[auto_1fr]">
        <div className="qr-frame mx-auto" data-ready={Boolean(image)}>
          <i className="qr-corner qr-tl" aria-hidden="true" />
          <i className="qr-corner qr-tr" aria-hidden="true" />
          <i className="qr-corner qr-bl" aria-hidden="true" />
          <i className="qr-corner qr-br" aria-hidden="true" />
          {image ? (
            <img
              src={image}
              alt={`UPI QR code to pay ${formatRupees(amount ?? 0)} to ${UPI_PAYEE_NAME}`}
              width={176}
              height={176}
              className="qr-img block h-44 w-44 rounded-lg"
            />
          ) : (
            <div className="qr-skeleton grid h-44 w-44 place-items-center rounded-lg px-4 text-center text-[0.8125rem] text-ink-soft">
              {amount ? 'Making your QR…' : 'Choose an amount to see your QR'}
            </div>
          )}
          {image && <span className="scan-line" aria-hidden="true" />}
        </div>

        <div className="text-center sm:text-left">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-gold-ink">Scan with any UPI app</p>
          <p className="mt-1 font-serif text-[2rem] leading-none text-navy">{amount ? formatRupees(amount) : '₹ —'}</p>
          <p className="mt-2 text-[0.8125rem] text-ink-soft">to {UPI_PAYEE_NAME}</p>
          <div className="mt-3 inline-flex max-w-full items-center gap-1 rounded-lg bg-navy/[0.05] py-0.5 pl-3 pr-1 text-[0.8125rem]">
            <span className="truncate font-semibold text-navy">{UPI_ID}</span>
            <CopyButton value={UPI_ID} label="UPI ID" />
          </div>
          {link && (
            <a href={link} className="btn btn-ghost mt-3 hidden w-full !min-h-11 pointer-coarse:inline-flex sm:w-auto">
              <Smartphone className="h-4 w-4" aria-hidden="true" />
              Open my UPI app
            </a>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-[0.75rem] text-ink-soft">Works with Google Pay, PhonePe, Paytm, BHIM and any UPI app.</p>

      <button type="button" onClick={onPaid} disabled={!amount} className="btn btn-pay btn-shine mt-4 w-full">
        <span>I’ve paid. Send my screenshot</span>
        <ArrowRight className="arrow h-4 w-4 shrink-0" aria-hidden="true" />
      </button>
      <p className="mt-2 text-center text-[0.75rem] text-ink-soft">Pay first, then tap the button. We’ll guide you through sending the screenshot on WhatsApp.</p>
    </div>
  );
}
