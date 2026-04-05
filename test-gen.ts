/**
 * Test script: Generate a real website and output audit data
 * Run with: npx tsx test-gen.ts
 */
import { generateWaterDamageWebsite } from './client/src/lib/water-damage-generator.ts';
import type { WDBusinessData } from './client/src/lib/water-damage-generator.ts';
import * as fs from 'fs';
import * as path from 'path';

const testBusiness: WDBusinessData = {
  businessName: "ProFlow Plumbing & Drain",
  phone: "(512) 555-0182",
  email: "info@proflow-plumbing.com",
  address: "4821 Oak Hollow Drive",
  city: "Austin",
  state: "TX",
  country: "US",
  countryCode: "+1",
  primaryKeyword: "Plumbing Services",
  secondaryKeyword: "Drain Cleaning",
  services: [
    "Emergency Plumbing",
    "Drain Cleaning",
    "Water Heater Installation",
    "Pipe Repair",
    "Sewer Line Services",
    "Leak Detection"
  ],
  serviceAreas: [
    "Austin",
    "Round Rock",
    "Cedar Park",
    "Pflugerville",
    "Georgetown",
    "Lakeway"
  ],
  urlSlug: "proflow-plumbing-austin",
  primaryColor: "#1a365d",
  secondaryColor: "#0ea5e9",
  accentColor: "#dc2626",
  fontFamily: "inter",
  yearsInBusiness: "12",
  licenseNumber: "MPL-38291-TX",
  floatingCTA: "call",
  facebookUrl: "https://facebook.com/proflowplumbing",
  googleUrl: "https://g.co/proflowplumbing",
};

console.log("Generating website for:", testBusiness.businessName);

const files = generateWaterDamageWebsite(testBusiness, "proflow-plumbing-austin");

// Write all files to disk
const outDir = path.join(process.cwd(), 'test-website-output');
if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

let totalFiles = 0;
let totalSize = 0;
for (const [filename, content] of Object.entries(files)) {
  const filePath = path.join(outDir, filename);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content as string, 'utf-8');
  const size = Buffer.byteLength(content as string, 'utf-8');
  totalSize += size;
  totalFiles++;
}

console.log(`Generated ${totalFiles} files (${(totalSize / 1024).toFixed(1)} KB total)`);

// Audit key pages
const auditPages = ['index.html', 'about.html', 'contact.html', 'faq.html', 'calculator.html', 'privacy.html', 'terms.html', 'gallery.html'];
const servicePages = Object.keys(files).filter(f => f.startsWith('services/'));
const locationPages = Object.keys(files).filter(f => f.startsWith('locations/'));
if (servicePages[0]) auditPages.push(servicePages[0]);
if (locationPages[0]) auditPages.push(locationPages[0]);

const audit: any = { pages: {}, summary: {} };
const bannedWords = ["comprehensive", "cutting-edge", "state-of-the-art", "leverage", "delve", "seamless", "robust", "elevate", "empower", "harness", "pivotal", "paramount", "invaluable", "unparalleled", "bespoke", "tailor-made", "navigat", "landscape"];

let allBannedFound: string[] = [];
let allSlashes: string[] = [];
let pagesWithoutExtLinks = 0;

for (const page of auditPages) {
  const html = files[page] as string;
  if (!html) continue;
  
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const metaDescMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/);
  const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/);
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/s);
  const h2Matches = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gs)].map(m => m[1].replace(/<[^>]*>/g, '').trim());
  const h3Matches = [...html.matchAll(/<h3[^>]*>(.*?)<\/h3>/gs)];
  const schemaMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const externalLinks = [...html.matchAll(/<a[^>]*href="https?:\/\/(?!www\.google\.com\/maps)[^"]*"[^>]*>/g)];
  const dofollowLinks = [...html.matchAll(/<a[^>]*rel="dofollow"[^>]*>/g)];
  const internalLinks = [...html.matchAll(/<a[^>]*href="[^"]*\.html[^"]*"[^>]*>/g)];
  const imgTags = [...html.matchAll(/<img[^>]*>/g)];
  const imgWithAlt = imgTags.filter(m => /alt="[^"]+"/i.test(m[0]) && !/alt=""/i.test(m[0]));
  const hasViewport = /meta.*viewport/.test(html);
  const hasCharset = /charset/i.test(html);
  const textContent = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = textContent.split(' ').length;
  const hasMap = /google\.com\/maps/.test(html);
  const hasFAQSchema = /FAQPage/.test(html);
  const hasLocalBizSchema = /LocalBusiness/.test(html);
  const hasOGTags = /property="og:/.test(html);
  const hasBreadcrumb = /breadcrumb/i.test(html);
  const hasLazyLoad = /loading="lazy"/.test(html);
  const hasPreconnect = /rel="preconnect"/.test(html);
  const pageSize = Buffer.byteLength(html, 'utf-8');
  
  const foundBanned = bannedWords.filter(w => textContent.toLowerCase().includes(w));
  allBannedFound.push(...foundBanned.map(w => `${page}: ${w}`));
  
  const slashConstructions = [...textContent.matchAll(/[a-z]+\/[a-z]+/gi)]
    .map(m => m[0])
    .filter(s => !['http', 'https', 'and/or'].some(x => s.includes(x)));
  allSlashes.push(...slashConstructions.map(s => `${page}: ${s}`));
  
  if (dofollowLinks.length === 0) pagesWithoutExtLinks++;
  
  // Check for glassmorphism
  const hasGlassmorphism = /backdrop-filter/.test(html);
  
  // Check for generic logo (no business name as logo)
  const hasGenericLogo = /generic-logo/.test(html);
  const hasBrandNameAsLogo = /class="brand-name"/.test(html);
  
  // Check for duplicate map (in footer)
  const footerMapCount = (html.match(/Footer Map/g) || []).length;
  const totalMaps = (html.match(/google\.com\/maps/g) || []).length;
  
  // Check for prefooter CTA
  const hasPrefooterCTA = /prefooter-cta/.test(html);
  
  audit.pages[page] = {
    size: `${(pageSize / 1024).toFixed(1)} KB`,
    wordCount,
    title: titleMatch?.[1] || 'MISSING',
    titleLength: (titleMatch?.[1] || '').length,
    metaDescription: metaDescMatch?.[1] || 'MISSING',
    metaDescLength: (metaDescMatch?.[1] || '').length,
    canonical: canonicalMatch?.[1] ? 'YES' : 'MISSING',
    h1: h1Match?.[1]?.replace(/<[^>]*>/g, '').trim() || 'MISSING',
    h2Count: h2Matches.length,
    h3Count: h3Matches.length,
    schemaTypes: schemaMatches.map(m => { try { return JSON.parse(m[1])['@type']; } catch { return 'INVALID_JSON'; } }),
    externalLinkCount: externalLinks.length,
    dofollowLinkCount: dofollowLinks.length,
    internalLinkCount: internalLinks.length,
    imageCount: imgTags.length,
    imagesWithAlt: imgWithAlt.length,
    imagesMissingAlt: imgTags.length - imgWithAlt.length,
    hasViewport,
    hasCharset,
    hasOGTags,
    hasMap,
    totalMapIframes: totalMaps,
    hasFAQSchema,
    hasLocalBizSchema,
    hasBreadcrumb,
    hasLazyLoad,
    hasPreconnect,
    hasGlassmorphism,
    hasGenericLogo,
    hasBrandNameAsLogo,
    hasPrefooterCTA,
    bannedAIWords: foundBanned,
    slashConstructions: slashConstructions.slice(0, 5),
  };
}

// Summary
audit.summary = {
  totalFiles,
  totalSizeKB: (totalSize / 1024).toFixed(1),
  servicePageCount: servicePages.length,
  locationPageCount: locationPages.length,
  allFiles: Object.keys(files),
  bannedWordsFound: [...new Set(allBannedFound)],
  slashConstructionsFound: [...new Set(allSlashes)].slice(0, 20),
  pagesWithoutExternalDofollowLinks: pagesWithoutExtLinks,
};

const outputPath = path.join(process.cwd(), 'test-website-output.json');
fs.writeFileSync(outputPath, JSON.stringify(audit, null, 2));
console.log("Audit written to test-website-output.json");
