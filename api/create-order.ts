/**
 * Vercel serverless function: POST /api/create-order
 *
 * Creates a Razorpay order for a donation. The amount is validated here (never
 * trusted from the browser alone) and the Razorpay key secret never leaves the
 * server. Returns only what the checkout window needs.
 */

interface ApiRequest {
  method?: string;
  body?: unknown;
}
interface ApiResponse {
  status(code: number): ApiResponse;
  setHeader(name: string, value: string): void;
  json(body: unknown): void;
}

// Keep in step with src/data/donation.ts
const MIN_AMOUNT = 100;
const MAX_AMOUNT = 100000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const env = (name: string) => process.env[name]?.trim() ?? '';
const asString = (value: unknown) => (typeof value === 'string' ? value : '');
const oneLine = (value: string) => value.replace(/[\r\n]+/g, ' ').trim();

function parseBody(body: unknown): Record<string, unknown> {
  if (typeof body === 'string') {
    try {
      const parsed: unknown = JSON.parse(body);
      return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }
  return body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const keyId = env('RAZORPAY_KEY_ID');
  const keySecret = env('RAZORPAY_KEY_SECRET');
  if (!keyId || !keySecret) {
    console.error('Donations: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set.');
    return res.status(503).json({
      message: 'Secure online payment is not available right now. Please use the QR option or try again later.',
    });
  }

  const body = parseBody(req.body);
  const amount = body.amount;
  const name = oneLine(asString(body.name));
  const email = oneLine(asString(body.email));
  const phone = asString(body.phone).replace(/\s/g, '');

  if (typeof amount !== 'number' || !Number.isInteger(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
    return res
      .status(400)
      .json({ message: `Please choose an amount between ₹${MIN_AMOUNT} and ₹${MAX_AMOUNT.toLocaleString('en-IN')}.` });
  }
  if (name.length < 2 || name.length > 120) {
    return res.status(400).json({ message: 'Please enter your name.' });
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ message: 'Please enter a 10-digit mobile number.' });
  }

  try {
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      },
      body: JSON.stringify({
        amount: amount * 100, // Razorpay works in paise
        currency: 'INR',
        receipt: `fc_${Date.now().toString(36)}`,
        notes: { purpose: 'donation', donor_name: name, donor_email: email, donor_phone: phone },
      }),
    });

    const order = (await response.json()) as { id?: string; amount?: number; currency?: string };
    if (!response.ok || !order.id) {
      console.error('Donations: Razorpay rejected the order', response.status, order);
      return res.status(502).json({ message: 'We could not start the payment. Please try again in a moment.' });
    }

    return res.status(200).json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId });
  } catch (error) {
    console.error('Donations: creating the order failed', error);
    return res.status(502).json({ message: 'We could not reach the payment partner. Please try again in a moment.' });
  }
}
