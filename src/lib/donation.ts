import { MAX_AMOUNT, MIN_AMOUNT, UPI_ID, UPI_PAYEE_NAME, WHATSAPP_NUMBER } from '../data/donation';

/* ------------------------------------------------------------ formatting */

export const formatRupees = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

/** Parses a typed amount ("1,500", "₹750") into whole rupees, or null when it is not a number. */
export function parseAmount(raw: string): number | null {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return null;
  const n = Number(digits);
  return Number.isSafeInteger(n) ? n : null;
}

export function amountError(amount: number | null): string | null {
  if (amount === null) return 'Enter an amount to give.';
  if (amount < MIN_AMOUNT) return `The minimum gift is ${formatRupees(MIN_AMOUNT)}.`;
  if (amount > MAX_AMOUNT) return `Online gifts go up to ${formatRupees(MAX_AMOUNT)}. For more, please contact us.`;
  return null;
}

/* ---------------------------------------------------------- donor fields */

export interface Donor {
  name: string;
  phone: string;
  email: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type DonorErrors = Partial<Record<keyof Donor, string>>;

export function validateDonor(donor: Donor, mode: 'online' | 'qr'): DonorErrors {
  const errors: DonorErrors = {};
  if (donor.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (mode === 'online') {
    if (!/^[6-9]\d{9}$/.test(donor.phone.replace(/\s/g, ''))) errors.phone = 'Enter a 10-digit mobile number.';
    if (!EMAIL.test(donor.email.trim())) errors.email = 'Enter a valid email address.';
  }
  return errors;
}

/* ------------------------------------------------------------- UPI & QR */

/** Short reference the donor sees in their UPI note and quotes on WhatsApp, e.g. "FC-K3X9Q2". */
export function makeReference(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return `FC-${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')}`;
}

export function upiLink(amount: number, reference: string): string {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: UPI_PAYEE_NAME,
    am: amount.toFixed(2),
    cu: 'INR',
    tn: `Donation ${reference}`,
  });
  // URLSearchParams writes spaces as "+", which UPI apps do not decode.
  return `upi://pay?${params.toString().replace(/\+/g, '%20')}`;
}

/** Renders text as a QR code image (data URL). The library is loaded only when needed. */
export async function qrDataUrl(text: string, size = 320): Promise<string> {
  const { toDataURL } = await import('qrcode');
  return toDataURL(text, {
    width: size,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#071f46', light: '#ffffff' },
  });
}

/* ------------------------------------------------------------- WhatsApp */

export function whatsappMessage(amount: number, name: string, reference: string): string {
  return [
    'Hello FAIRCLAIM FOUNDATION,',
    `I have donated ${formatRupees(amount)} by UPI.`,
    `Name: ${name.trim() || '-'}`,
    `Reference: ${reference}`,
    'My payment screenshot is attached (it shows the UTR / transaction ID).',
  ].join('\n');
}

export const whatsappLink = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

/* -------------------------------------------------- Razorpay (secure checkout) */

interface RazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  modal?: { ondismiss?: () => void; confirm_close?: boolean };
  handler: (response: RazorpaySuccess) => void;
}

interface RazorpayInstance {
  open(): void;
  on(event: 'payment.failed', cb: (response: { error?: { description?: string } }) => void): void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

let checkoutScript: Promise<void> | null = null;

/** Loads Razorpay's checkout.js on first use, so visitors who never donate never download it. */
function loadCheckout(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  checkoutScript ??= new Promise<void>((resolve, reject) => {
    const el = document.createElement('script');
    el.src = 'https://checkout.razorpay.com/v1/checkout.js';
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => {
      checkoutScript = null;
      el.remove();
      reject(new Error('Could not load the secure payment window. Check your connection and try again.'));
    };
    document.head.appendChild(el);
  });
  return checkoutScript;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.');
  }
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    /* fall through to the generic message below */
  }
  const message = (data as { message?: string } | null)?.message;
  if (!res.ok) throw new Error(message || 'Something went wrong. Please try again.');
  return data as T;
}

export interface PaidReceipt {
  paymentId: string;
  amount: number;
}

export type CheckoutResult =
  | { status: 'paid'; receipt: PaidReceipt }
  | { status: 'dismissed' }
  | { status: 'failed'; message: string }
  /** Money may have been taken but we could not confirm it: show the payment ID. */
  | { status: 'unverified'; paymentId: string; message: string };

/**
 * Full gateway flow: create an order on the server, open Razorpay's modal,
 * then have the server verify the signature before we show any success.
 */
export async function payWithCheckout(amount: number, donor: Donor): Promise<CheckoutResult> {
  const order = await postJson<{ orderId: string; amount: number; currency: string; keyId: string }>(
    '/api/create-order',
    { amount, name: donor.name.trim(), email: donor.email.trim(), phone: donor.phone.replace(/\s/g, '') },
  );
  await loadCheckout();
  const Razorpay = window.Razorpay;
  if (!Razorpay) throw new Error('Could not load the secure payment window. Please try again.');

  return new Promise<CheckoutResult>((resolve) => {
    let settled = false;
    let paymentSubmitted = false;
    let lastFailure = '';
    const finish = (result: CheckoutResult) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    const rzp = new Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: 'FAIRCLAIM FOUNDATION',
      description: 'Donation',
      image: `${window.location.origin}/brand/fairclaim-emblem-sm.png`,
      prefill: { name: donor.name.trim(), email: donor.email.trim(), contact: donor.phone.replace(/\s/g, '') },
      notes: { purpose: 'donation' },
      theme: { color: '#071f46' },
      modal: {
        // The modal can close right after a successful payment while we are still verifying it,
        // so only treat a close as "cancelled" when no payment was submitted.
        ondismiss: () => {
          if (paymentSubmitted) return;
          finish(lastFailure ? { status: 'failed', message: lastFailure } : { status: 'dismissed' });
        },
      },
      handler: (response) => {
        paymentSubmitted = true;
        postJson<{ ok: true; amount: number }>('/api/verify-payment', {
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        })
          .then((verified) =>
            finish({ status: 'paid', receipt: { paymentId: response.razorpay_payment_id, amount: verified.amount } }),
          )
          .catch((error: Error) =>
            finish({ status: 'unverified', paymentId: response.razorpay_payment_id, message: error.message }),
          );
      },
    });
    // A failed attempt leaves the modal open so the donor can retry; remember why, report it if they give up.
    rzp.on('payment.failed', (response) => {
      lastFailure = response.error?.description || 'The payment did not go through. You have not been charged.';
    });
    rzp.open();
  });
}
