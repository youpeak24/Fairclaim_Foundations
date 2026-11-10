import type { Faq } from './organization';

/**
 * Donation settings. Public values only (they are bundled into the site).
 * Secrets (Razorpay key secret) live in server env vars: see .env.example.
 *
 * Keep MIN_AMOUNT / MAX_AMOUNT in step with api/create-order.ts.
 */

const env = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export const MIN_AMOUNT = 100;
export const MAX_AMOUNT = 100000;
export const PRESET_AMOUNTS = [250, 500, 1000, 2500, 5000, 10000] as const;
export const POPULAR_AMOUNT = 1000;
export const DEFAULT_AMOUNT = 1000;

/**
 * UPI account behind the QR in public/brand/upi-qr.jpg (read from the QR itself).
 * VITE_UPI_ID / VITE_UPI_PAYEE_NAME override them, e.g. once the foundation has its own account.
 */
export const UPI_ID = env(import.meta.env.VITE_UPI_ID) || 'directorvijay225@okicici';
/** Name donors will see in their UPI app after scanning. It must match what the QR shows. */
export const UPI_PAYEE_NAME = env(import.meta.env.VITE_UPI_PAYEE_NAME) || 'kevin vijay';
/** The foundation's own UPI QR image. It is a static QR (no amount), so donors type the amount in their app. */
export const UPI_QR_IMAGE = '/brand/upi-qr.jpg';
/** WhatsApp number that receives payment screenshots: digits only with country code, e.g. 919876543210. */
export const WHATSAPP_NUMBER = env(import.meta.env.VITE_WHATSAPP_NUMBER).replace(/\D/g, '');

export const whatsappEnabled = Boolean(WHATSAPP_NUMBER);

export const donationFaqs: Faq[] = [
  {
    question: 'Is my payment safe?',
    answer:
      'Card, UPI and net banking payments are handled on the secure checkout of our payment partner, Razorpay. Your card or UPI details go to them directly and never pass through this website.',
  },
  {
    question: 'How does the QR option work?',
    answer:
      'Scan the QR with any UPI app (Google Pay, PhonePe, Paytm, BHIM and others) and pay. Then take a screenshot of the success screen and send it to us on WhatsApp so we can match your payment to the right donor.',
  },
  {
    question: 'What if my payment fails or money is deducted?',
    answer:
      'A failed payment is normally returned to your account by your bank within a few working days. If something looks wrong, contact us with your payment ID or UPI transaction ID and we will help.',
    links: [{ label: 'Contact us', to: '/contact' }],
  },
  {
    question: 'Will I get a receipt or a tax benefit?',
    answer:
      'Your payment app or bank shows a confirmation for every payment. Fairclaim Foundation has not published any tax-exemption details (such as 80G) yet, so please do not assume a gift is tax-deductible. Ask us first if this matters to you.',
    links: [{ label: 'Ask a question', to: '/contact' }],
  },
  {
    question: 'Can I give a larger amount?',
    answer: `Online gifts are accepted from ₹${MIN_AMOUNT.toLocaleString('en-IN')} to ₹${MAX_AMOUNT.toLocaleString('en-IN')}. For anything larger, please get in touch and we will arrange it with you directly.`,
    links: [{ label: 'Get in touch', to: '/contact' }],
  },
];
