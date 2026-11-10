/**
 * Build-time prerenderer. Runs after `vite build` (client) and
 * `vite build --ssr` (server entry). For every route it writes a fully
 * rendered HTML file with its own <head> (title, description, canonical,
 * Open Graph, JSON-LD), then generates sitemap.xml and the 404 page.
 *
 *   dist/index.html                       /
 *   dist/about/index.html                 /about
 *   dist/404.html                         unknown URLs (served with HTTP 404)
 *   dist/sitemap.xml
 */
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');

const server = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);
const { render, headHtml, pages, SITE_URL, absoluteUrl } = server;

const template = await readFile(join(dist, 'index.html'), 'utf8');
if (!template.includes('<!--seo-head-->') || !template.includes('<!--app-html-->')) {
  throw new Error('dist/index.html is missing the <!--seo-head--> / <!--app-html--> markers.');
}

const page = (path) =>
  template.replace('<!--seo-head-->', headHtml(path)).replace('<!--app-html-->', render(path));

const outFile = (path) => (path === '/' ? join(dist, 'index.html') : join(dist, path.slice(1), 'index.html'));

// ---- 1. Prerender every route -------------------------------------------------
const paths = Object.keys(pages);
for (const path of paths) {
  const file = outFile(path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, page(path));
  console.log(`prerendered ${path.padEnd(24)} -> ${file.replace(root, '.')}`);
}

// ---- 2. 404 page (served with a real 404 status by the host) -------------------
await writeFile(join(dist, '404.html'), page('/404'));
console.log('prerendered 404                    -> ./dist/404.html');

// ---- 3. sitemap.xml --------------------------------------------------------------
const today = new Date().toISOString().slice(0, 10);
const lastmod = (sources) => {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...sources], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : today;
  } catch {
    return today;
  }
};

const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const urls = paths
  .map((path) => {
    const p = pages[path];
    const image =
      path === '/'
        ? `\n    <image:image>\n      <image:loc>${xml(absoluteUrl('/og-image.png'))}</image:loc>\n      <image:title>Fairclaim Foundation</image:title>\n    </image:image>`
        : '';
    return `  <url>
    <loc>${xml(absoluteUrl(path))}</loc>
    <lastmod>${lastmod(p.sources)}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority.toFixed(1)}</priority>${image}
  </url>`;
  })
  .join('\n');

await writeFile(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`,
);
console.log(`sitemap.xml                        -> ${paths.length} URLs (${SITE_URL})`);

// ---- 4. robots.txt and llms.txt (generated so they always match SITE_URL) -------
await writeFile(
  join(dist, 'robots.txt'),
  `# ${SITE_URL}/robots.txt
User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`,
);
console.log('robots.txt                         -> ./dist/robots.txt');

const llmsPages = [
  ['/', 'Home', "Overview of the foundation's purpose, proposed focus areas, principles and approach."],
  ['/about', 'About', 'Purpose, guiding principles and intended direction.'],
  ['/mission-vision', 'Mission & Vision', 'The mission and vision in plain language.'],
  [
    '/initiatives',
    'Initiatives',
    'The four proposed focus areas: community equity & access; public education & civic understanding; community dialogue & mediation; fairness research & policy insight.',
  ],
  ['/donate', 'Donate', 'Give securely online (UPI, cards, net banking) or by UPI QR with a WhatsApp screenshot confirmation.'],
  ['/contact', 'Contact', 'Questions, ideas and collaboration enquiries.'],
];
await writeFile(
  join(dist, 'llms.txt'),
  `# Fairclaim Foundation

> Fairclaim Foundation aims to make fairness easier to understand and pursue through public education, constructive dialogue, and a shared commitment to equitable opportunity. Tagline: "A fairer future. Built together."

Important note: the foundation's registration status, leadership and programs are still being confirmed. This website describes its purpose and four *proposed* focus areas only; none of them should be described as an operating program.

## Pages

${llmsPages.map(([path, name, desc]) => `- [${name}](${absoluteUrl(path)}): ${desc}`).join('\n')}

## Optional

- [Privacy Policy (draft)](${absoluteUrl('/privacy-policy')})
- [Terms & Conditions (draft)](${absoluteUrl('/terms-and-conditions')})
- [Sitemap](${SITE_URL}/sitemap.xml)
`,
);
console.log('llms.txt                           -> ./dist/llms.txt');

// ---- 5. Clean up -----------------------------------------------------------------
await rm(ssrDir, { recursive: true, force: true });
