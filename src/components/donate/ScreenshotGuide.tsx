import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { ArrowLeft, BadgeCheck, Camera, Check, ImageUp, MessageCircle, Paperclip, Share2, TriangleAlert } from 'lucide-react';
import { whatsappEnabled } from '../../data/donation';
import { formatRupees, qrDataUrl, whatsappLink, whatsappMessage } from '../../lib/donation';
import { CopyButton } from './CopyButton';

interface ScreenshotGuideProps {
  amount: number;
  name: string;
  reference: string;
  onBack: () => void;
  onSent: () => void;
}

const SHOULD_SHOW = ['The amount you paid', 'The word “Successful” (or “Completed”)', 'The UTR / transaction ID', 'The date and time'];

/** Flow B, step 2: a guided hand-off of the payment screenshot to WhatsApp. */
export function ScreenshotGuide({ amount, name, reference, onBack, onSent }: ScreenshotGuideProps) {
  const message = whatsappMessage(amount, name, reference);
  const link = whatsappEnabled ? whatsappLink(message) : '';

  const [waQr, setWaQr] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  // Sharing a picture straight to WhatsApp only works where the browser supports file sharing (mostly phones).
  // This component only renders after a click, so reading browser features during the first render is safe.
  const [canShareFile] = useState(() => {
    try {
      return Boolean(navigator.canShare?.({ files: [new File([''], 'screenshot.png', { type: 'image/png' })] }));
    } catch {
      return false;
    }
  });
  const [notice, setNotice] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  // A QR of the chat link, so someone paying from a computer can continue on their phone
  useEffect(() => {
    if (!link) return;
    let live = true;
    qrDataUrl(link, 240)
      .then((url) => live && setWaQr(url))
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [link]);

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null;
    setNotice('');
    if (!picked) return;
    if (!picked.type.startsWith('image/')) {
      setNotice('Please choose the screenshot image from your gallery.');
      return;
    }
    if (picked.size > 12 * 1024 * 1024) {
      setNotice('That image is very large. Please choose the screenshot, not a full-size photo.');
      return;
    }
    setFile(picked);
    // A data URL (not a blob URL) keeps the site's Content-Security-Policy strict
    const reader = new FileReader();
    reader.onload = () => setPreview(typeof reader.result === 'string' ? reader.result : '');
    reader.readAsDataURL(picked);
  };

  const shareImage = async () => {
    if (!file) return;
    setNotice('');
    try {
      await navigator.share({ files: [file], text: message });
      setNotice('');
    } catch (error) {
      if ((error as DOMException)?.name !== 'AbortError') {
        setNotice('Your browser could not share the image. Use “Open WhatsApp chat” below and attach it there.');
      }
    }
  };

  return (
    <div className="panel-in">
      <button
        type="button"
        onClick={onBack}
        className="-ml-2 inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-[0.8125rem] font-semibold text-ink-soft transition-colors hover:bg-navy/5 hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to the QR
      </button>

      <div className="mt-2 flex items-start gap-3">
        <span className="check-badge mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e6f6ec] text-[#1a7f45]">
          <BadgeCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 ref={headingRef} tabIndex={-1} className="font-serif text-[1.5rem] leading-tight outline-none">
            Last step: send us your payment screenshot
          </h3>
          <p className="mt-1 text-[0.9375rem] text-ink-soft">
            This is how we match your {formatRupees(amount)} gift to you and confirm it.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gold/50 bg-gold-pale/50 py-1.5 pl-4 pr-2 text-[0.875rem]">
        <span>
          Your reference: <strong className="font-mono tracking-wider text-navy">{reference}</strong>
        </span>
        <CopyButton value={reference} label="reference" />
      </div>

      <ol className="step-list mt-5 space-y-4">
        <li className="step-item" style={{ ['--i' as string]: 0 }}>
          <span className="step-num" aria-hidden="true">
            <Camera className="h-4 w-4" />
          </span>
          <div>
            <p className="font-semibold text-navy">1. Take a screenshot of the success screen</p>
            <p className="text-[0.875rem] text-ink-soft">
              Do it in your UPI app right after paying. Press power + volume down (Android) or side button + volume up (iPhone).
            </p>
          </div>
        </li>
        <li className="step-item" style={{ ['--i' as string]: 1 }}>
          <span className="step-num" aria-hidden="true">
            <MessageCircle className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-navy">2. Open our WhatsApp chat</p>
            <p className="text-[0.875rem] text-ink-soft">The message is already written for you. Don’t change the reference.</p>
            {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-shine mt-3 w-full sm:w-auto">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Open WhatsApp chat
              </a>
            ) : (
              <p className="mt-3 flex gap-2 rounded-lg border border-[#b3261e]/30 bg-[#fdf1ef] p-3 text-[0.8125rem] text-[#7a1a14]" role="alert">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                WhatsApp is not set up on this site yet. Please contact us and quote {reference}.
              </p>
            )}
          </div>
        </li>
        <li className="step-item" style={{ ['--i' as string]: 2 }}>
          <span className="step-num" aria-hidden="true">
            <Paperclip className="h-4 w-4" />
          </span>
          <div>
            <p className="font-semibold text-navy">3. Attach the screenshot and press send</p>
            <p className="text-[0.875rem] text-ink-soft">
              In the chat tap the <strong className="text-navy">paperclip</strong> (Android) or the <strong className="text-navy">+</strong>{' '}
              (iPhone), choose <strong className="text-navy">Gallery / Photos</strong>, pick the screenshot, then send.
            </p>
          </div>
        </li>
      </ol>

      {link && waQr && (
        <div className="mt-5 hidden items-center gap-4 rounded-xl border border-line bg-ivory p-3 sm:flex pointer-coarse:!hidden">
          <img src={waQr} alt="QR code that opens our WhatsApp chat" width={84} height={84} className="h-[5.25rem] w-[5.25rem] rounded-lg bg-white" />
          <p className="text-[0.875rem] text-ink-soft">
            <strong className="block text-navy">On a computer?</strong>
            Scan this with your phone’s camera to open the WhatsApp chat on your phone, then attach the screenshot there.
          </p>
        </div>
      )}

      {link && canShareFile && (
        <div className="mt-5 rounded-xl border border-line p-4">
          <p className="text-[0.875rem] font-semibold text-navy">Or share the image straight from here</p>
          <p className="mt-0.5 text-[0.8125rem] text-ink-soft">
            Choose the screenshot, then pick WhatsApp and our chat in the share sheet.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="btn btn-ghost !min-h-11 cursor-pointer">
              <ImageUp className="h-4 w-4" aria-hidden="true" />
              {file ? 'Choose a different image' : 'Choose screenshot'}
              <input type="file" accept="image/*" className="sr-only" onChange={onPick} />
            </label>
            {preview && <img src={preview} alt="Your chosen screenshot" className="h-14 w-14 rounded-lg border border-line object-cover object-top" />}
            {file && (
              <button type="button" onClick={shareImage} className="btn btn-primary !min-h-11">
                <Share2 className="h-4 w-4" aria-hidden="true" />
                Share on WhatsApp
              </button>
            )}
          </div>
        </div>
      )}
      {notice && (
        <p role="alert" className="mt-3 text-[0.8125rem] font-semibold text-[#7a1a14]">
          {notice}
        </p>
      )}

      <div className="mt-5 rounded-xl bg-navy/[0.04] p-4">
        <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-navy">Your screenshot should show</p>
        <ul className="mt-2 grid gap-1.5 text-[0.875rem] text-ink-soft sm:grid-cols-2">
          {SHOULD_SHOW.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-[#1a7f45]" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <button type="button" onClick={onSent} className="btn btn-primary mt-5 w-full">
        I’ve sent the screenshot
      </button>
    </div>
  );
}
