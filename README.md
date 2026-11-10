# FAIRCLAIM FOUNDATION Website

Official informational website for **FAIRCLAIM FOUNDATION**, engineered and designed by **Legendary One Technologies**.

The website is a fast, responsive, accessible, static web application built to communicate the foundation's purpose, guiding principles, mission, vision, proposed initiatives, and civic engagement dialogues.

---

## 1. Technology Stack

- **React 19**
- **Vite 8**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **React Router v7** (`react-router-dom`)
- **TypeScript** with strict type safety
- **Lucide React** (icons)
- **qrcode** (UPI and WhatsApp QR codes, loaded on demand)
- **Razorpay Checkout** (loaded on demand when a donor chooses to pay online)
- **Newsreader** and **Plus Jakarta Sans**, self-hosted via Fontsource (no third-party font requests)

---

## 2. Getting started

```bash
npm install
npm run dev       # local development
npm run build     # type-check and production build into dist/
npm run lint      # oxlint
npm run preview   # serve the production build
```

## 3. Where things live

| What | Where |
| --- | --- |
| Design tokens (palette, fonts, type scale, motion) | `src/index.css` (`@theme` and component classes) |
| Organization facts, mission/vision, principles, FAQ | `src/data/organization.ts` |
| The four proposed focus areas | `src/data/initiatives.ts` |
| Navigation and per-page titles/descriptions | `src/data/navigation.ts`, `src/data/pageMeta.ts` |
| Contact form integration | `src/services/contact.ts` |
| Brand assets | `public/brand/`, `public/favicon.png` |
| Motion (reveals, parallax, scroll/focus after navigation) | `src/components/PageEffects.tsx` |

Content rules: every focus area is **proposed**; do not describe it as operating. Contact details, social profiles, registration status and similar facts are only rendered once filled in `organization.ts`.

## 4. Contact form

Set `VITE_CONTACT_FORM_ENDPOINT` (see `.env.example`) to an HTTPS endpoint (Formspree, Basin, Web3Forms, or a custom webhook) **at build time**. The form posts JSON `{ fullName, email, areaOfInterest, organization, message, submittedAt }` and shows success only after a 2xx response. With no endpoint set, the form shows a visitor-friendly "not available yet" notice and the submit button is disabled.

## 5. Logo

`public/brand/fairclaim-emblem.png` (2x master) and `fairclaim-emblem-sm.png` were prepared from the supplied emblem image: cropped to the seal, white point levelled so the paper tone matches pure white, and the background outside the seal made transparent. Interior whites are preserved. **Replace these files with the original high-resolution logo when available**, keeping the filenames. Always show the emblem on a white surface.

## 6. SEO

Production host: **https://www.fairclaimfoundation.org** (the bare domain redirects to `www` in the Vercel domain settings). To change it, edit `SITE_URL` in `src/lib/seo.ts`: sitemap, robots.txt, llms.txt, canonicals and JSON-LD all derive from it.

- `npm run build` type-checks, builds the client, builds a server entry (`src/entry-server.tsx`) and runs `scripts/prerender.mjs`, which writes real HTML for every route (`dist/about/index.html`, ...), a `404.html`, and `sitemap.xml`. The browser then hydrates that HTML.
- **To add a page:** add the route in `src/App.tsx` and an entry in `src/data/pageMeta.ts` (title, description, schema type, sitemap hints). The sitemap, canonical, Open Graph tags and breadcrumbs follow automatically.
- `src/lib/seo.ts` builds each page's head: title, description, canonical, robots, Open Graph, Twitter card, hreflang and JSON-LD (Organization, WebSite, page type, BreadcrumbList; FAQPage on the home page; ItemList on Initiatives). Email, phone, address and social profiles are added to the Organization schema only once filled in `organization.ts`.
- `sitemap.xml`, `robots.txt` and `llms.txt` are generated into `dist/` at build time (`lastmod` comes from git history). Static: `public/og-image.png` (1200x630) and `site.webmanifest`.
- Titles should stay under about 60 characters and descriptions under about 160.

## 7. Donations

`/donate` and the widget in the home hero offer two flows that share one amount and name form (`src/components/donate/`, settings in `src/data/donation.ts`):

- **Pay online (gateway):** the browser asks `api/create-order.ts` for a Razorpay order, opens Razorpay Checkout, then `api/verify-payment.ts` checks the HMAC signature and the payment status with Razorpay before any success is shown. Needs `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (server-only). Keep payment capture on "Automatic" in the Razorpay dashboard. Use `rzp_test_` keys until you go live.
- **Scan & pay (UPI QR):** a QR for `VITE_UPI_ID` and the chosen amount is generated in the browser. Each donation gets a reference like `FC-K3X9Q2` in the UPI note. After paying, the donor is walked through sending the payment screenshot to `VITE_WHATSAPP_NUMBER` (pre-written message, steps, a QR for desktop visitors, and direct file sharing on phones that support it). A person on your side matches the screenshot to your bank statement; nothing is auto-confirmed.

Set the variables from `.env.example`. `VITE_*` values are baked in at build time, so redeploy after changing them. The API routes only run on Vercel (or `npx vercel dev`), not under plain `npm run dev`. Amount limits (INR 100 to 100,000) live in `src/data/donation.ts` and `api/create-order.ts`; keep them in step. The donation FAQ states that no tax exemption (such as 80G) has been published: update `donationFaqs` once that changes.

## 8. Deployment

`vercel.json` enables clean URLs (no trailing slash), security headers (HSTS, CSP, etc.) and long-lived caching for hashed assets. There is deliberately **no** catch-all rewrite to `index.html`: unknown URLs get the real `404.html` with a 404 status instead of a soft 404. `public/_redirects` carries the bare-domain to `www` redirect for Netlify-style hosts.
