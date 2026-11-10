import { ArrowRight, Download, Smartphone } from 'lucide-react';
import { UPI_ID, UPI_PAYEE_NAME, UPI_QR_IMAGE } from '../../data/donation';
import { formatRupees, upiLink } from '../../lib/donation';
import { CopyButton } from './CopyButton';

interface QrPayProps {
  /** A valid amount in rupees, or null while the amount is missing or out of range */
  amount: number | null;
  reference: string;
  onPaid: () => void;
}

/**
 * Flow B, step 1: the foundation's own UPI QR, then "I've paid".
 * The QR is static (no amount inside it), so the amount is shown large and the donor types it in their app.
 * On phones, "Open my UPI app" opens the payment with the amount already filled in.
 */
export function QrPay({ amount, reference, onPaid }: QrPayProps) {
  const link = amount && reference ? upiLink(amount, reference) : '';

  return (
    <div className="panel-in">
      <div className="grid items-center gap-5 sm:grid-cols-[auto_1fr]">
        <div className="qr-frame mx-auto" data-ready="true">
          <i className="qr-corner qr-tl" aria-hidden="true" />
          <i className="qr-corner qr-tr" aria-hidden="true" />
          <i className="qr-corner qr-bl" aria-hidden="true" />
          <i className="qr-corner qr-br" aria-hidden="true" />
          <img
            src={UPI_QR_IMAGE}
            alt={`UPI QR code for ${UPI_PAYEE_NAME} (${UPI_ID})`}
            width={176}
            height={176}
            className="qr-img block h-44 w-44 rounded-lg"
          />
          <span className="scan-line" aria-hidden="true" />
        </div>

        <div className="text-center sm:text-left">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-gold-ink">Scan with any UPI app</p>
          <p className="mt-1 text-[0.8125rem] text-ink-soft">Then enter this amount when asked</p>
          <p className="font-serif text-[2rem] leading-none text-navy">{amount ? formatRupees(amount) : '₹ —'}</p>
          <p className="mt-2 text-[0.8125rem] text-ink-soft">
            You’ll see the name <strong className="text-navy">{UPI_PAYEE_NAME}</strong> in your app. That’s us.
          </p>
          <div className="mt-3 inline-flex max-w-full items-center gap-1 rounded-lg bg-navy/[0.05] py-0.5 pl-3 pr-1 text-[0.8125rem]">
            <span className="truncate font-semibold text-navy">{UPI_ID}</span>
            <CopyButton value={UPI_ID} label="UPI ID" />
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            {link && (
              <a href={link} className="btn btn-ghost hidden w-full !min-h-11 pointer-coarse:inline-flex sm:w-auto">
                <Smartphone className="h-4 w-4" aria-hidden="true" />
                Open my UPI app
              </a>
            )}
            <a href={UPI_QR_IMAGE} download="fairclaim-upi-qr.jpg" className="btn btn-ghost w-full !min-h-11 sm:w-auto">
              <Download className="h-4 w-4" aria-hidden="true" />
              Save QR
            </a>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-[0.75rem] text-ink-soft">
        On the same phone? Tap “Open my UPI app”, or save the QR and choose it from your gallery in the UPI app. Optional: add <strong>{reference}</strong> in
        the payment note.
      </p>

      <button type="button" onClick={onPaid} disabled={!amount} className="btn btn-pay btn-shine mt-4 w-full">
        <span>I’ve paid. Send my screenshot</span>
        <ArrowRight className="arrow h-4 w-4 shrink-0" aria-hidden="true" />
      </button>
      <p className="mt-2 text-center text-[0.75rem] text-ink-soft">Pay first, then tap the button. We’ll guide you through sending the screenshot on WhatsApp.</p>
    </div>
  );
}
