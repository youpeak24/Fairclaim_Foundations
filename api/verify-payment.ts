/**
 * Vercel serverless function: POST /api/verify-payment
 *
 * After Razorpay's checkout reports success, the browser sends the order ID,
 * payment ID and signature here. We recompute the HMAC with the secret key
 * (so a forged "success" is rejected), then ask Razorpay for the payment to
 * confirm its status and amount before telling the browser it worked.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

interface ApiRequest {
  method?: string;
  body?: unknown;
}
interface ApiResponse {
  status(code: number): ApiResponse;
  setHeader(name: string, value: string): void;
  json(body: unknown): void;
}

const env = (name: string) => process.env[name]?.trim() ?? '';
const asString = (value: unknown) => (typeof value === 'string' ? value : '');
const ID_PATTERN = /^[A-Za-z0-9_]{6,64}$/;

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

function signatureMatches(expected: string, received: string): boolean {
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(received, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
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
    return res.status(503).json({ message: 'Payment confirmation is not available right now.' });
  }

  const body = parseBody(req.body);
  const orderId = asString(body.orderId);
  const paymentId = asString(body.paymentId);
  const signature = asString(body.signature);

  if (!ID_PATTERN.test(orderId) || !ID_PATTERN.test(paymentId) || !/^[a-f0-9]{64}$/i.test(signature)) {
    return res.status(400).json({ message: 'The payment details were not valid.' });
  }

  const expected = createHmac('sha256', keySecret).update(`${orderId}|${paymentId}`).digest('hex');
  if (!signatureMatches(expected, signature.toLowerCase())) {
    console.error('Donations: signature mismatch for payment', paymentId);
    return res.status(400).json({
      message: `We could not confirm this payment. If money left your account, quote payment ID ${paymentId} when you contact us.`,
    });
  }

  try {
    const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}` },
    });
    const payment = (await response.json()) as { status?: string; amount?: number; order_id?: string };

    if (!response.ok || payment.order_id !== orderId || !['captured', 'authorized'].includes(payment.status ?? '')) {
      console.error('Donations: payment not confirmed', paymentId, response.status, payment.status);
      return res.status(402).json({
        message: `Your payment is not confirmed yet. If money left your account, quote payment ID ${paymentId} when you contact us.`,
      });
    }

    return res.status(200).json({ ok: true, amount: Math.round((payment.amount ?? 0) / 100) });
  } catch (error) {
    console.error('Donations: could not check the payment', error);
    return res.status(502).json({
      message: `Your payment went through the signature check, but we could not finish confirming it. Please keep payment ID ${paymentId} and contact us if you do not hear from us.`,
    });
  }
}
