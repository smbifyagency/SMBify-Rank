import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { allSaasPages, saasSections, type SaasPage } from "../client/src/lib/saas-pages";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, "../client/public/saas-sitemap.html");

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderPageLink = (page: SaasPage): string => {
  const routeTemplate =
    page.routePath !== page.href
      ? `<div class="route route-template">Template: ${escapeHtml(page.routePath)}</div>`
      : "";

  return [
    `<a href="${escapeHtml(page.href)}">`,
    `<strong>${escapeHtml(page.name)}</strong>`,
    `<div class="route">${escapeHtml(page.href)}</div>`,
    routeTemplate,
    `<div class="route route-description">${escapeHtml(page.description)}</div>`,
    `</a>`,
  ]
    .filter(Boolean)
    .join("");
};

const sectionMarkup = saasSections
  .map(
    (section) => `
      <section class="card">
        <h2>${escapeHtml(section.label)} (${section.pages.length})</h2>
        <div class="links">
          ${section.pages.map(renderPageLink).join("\n          ")}
        </div>
      </section>
    `.trim(),
  )
  .join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SiteGenie SaaS HTML Sitemap</title>
  <style>
    :root {
      --bg: #020617;
      --card: #0f172a;
      --border: #1e293b;
      --text: #e2e8f0;
      --muted: #94a3b8;
      --link: #67e8f9;
      --template: #38bdf8;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      background: var(--bg);
      color: var(--text);
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
    }
    h1, h2 {
      margin: 0;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 8px;
    }
    h2 {
      font-size: 16px;
      margin-bottom: 12px;
      color: #a5f3fc;
    }
    p {
      margin: 0;
      color: var(--muted);
    }
    .meta {
      margin-top: 8px;
      font-size: 12px;
    }
    .generated-at {
      margin-top: 6px;
      font-size: 11px;
      color: #64748b;
    }
    .section-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 12px;
    }
    .links {
      display: grid;
      gap: 8px;
    }
    a {
      color: var(--link);
      text-decoration: none;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px;
      display: block;
      transition: 0.2s ease;
    }
    a:hover {
      border-color: #22d3ee;
      background: #082f49;
    }
    .route {
      margin-top: 4px;
      font-size: 11px;
      color: var(--muted);
      word-break: break-all;
    }
    .route-template {
      color: var(--template);
    }
    .route-description {
      color: #cbd5e1;
    }
    .top-links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
    .top-links a {
      width: auto;
      display: inline-block;
      padding: 8px 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <section class="card">
      <h1>SiteGenie SaaS HTML Sitemap</h1>
      <p>This page is generated from <code>client/src/lib/saas-pages.ts</code>.</p>
      <p class="meta">Total pages: ${allSaasPages.length}. Click each link to confirm route availability.</p>
      <p class="generated-at">Generated at: ${new Date().toISOString()}</p>
      <div class="top-links">
        <a href="/">Home</a>
        <a href="/builder">Builder</a>
        <a href="/sitemap">In-App Sitemap</a>
      </div>
    </section>

    <div class="section-grid">
      ${sectionMarkup}
    </div>
  </div>
</body>
</html>
`;

mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, html, "utf8");

console.log(`Generated ${outputPath} with ${allSaasPages.length} pages.`);
