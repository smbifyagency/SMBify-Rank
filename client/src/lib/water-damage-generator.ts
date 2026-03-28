/**
 * Water Damage Restoration - Dedicated HTML Template Generator
 * Single-niche, SEO-optimized, lead-generation focused
 *
 * Pages generated:
 * - index.html            Homepage (AI, 2000+ words)
 * - about.html            About Us (AI)
 * - contact.html          Contact (template)
 * - faq.html              FAQ (AI, 30+ questions)
 * - calculator.html       Cost/Drying/Mold/Insurance/Dehumidifier/Restoration calculators
 * - blog.html             Blog archive (template)
 * - gallery.html          Before/After + project gallery (template)
 * - privacy.html          Privacy Policy (template)
 * - terms.html            Terms of Service (template)
 * - services/[slug].html  Per service (AI, 2000-2500 words)
 * - locations/[slug].html Per location (AI, 2000-2500 words)
 * - robots.txt, sitemap.xml
 */

export type WDFontFamily = 'inter' | 'poppins' | 'montserrat' | 'merriweather';

/** Darken a hex color by multiplying each channel by `factor` (0–1). */
function darkenHex(hex: string, factor: number): string {
  try {
    const c = hex.replace('#', '');
    const r = Math.round(parseInt(c.slice(0, 2), 16) * factor);
    const g = Math.round(parseInt(c.slice(2, 4), 16) * factor);
    const b = Math.round(parseInt(c.slice(4, 6), 16) * factor);
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  } catch { return '#0f2244'; }
}

/** Convert hex to "r, g, b" string for use inside rgba(). */
function hexToRgb(hex: string): string {
  try {
    const c = hex.replace('#', '');
    return `${parseInt(c.slice(0,2),16)}, ${parseInt(c.slice(2,4),16)}, ${parseInt(c.slice(4,6),16)}`;
  } catch { return '15, 34, 68'; }
}

export interface WDTheme {
  primaryColor: string;    // header, buttons, headings
  secondaryColor: string;  // links, accents, hover
  accentColor: string;     // emergency CTA (default red)
  fontFamily: WDFontFamily;
  heroImageUrl?: string;   // optional custom hero background
}

export interface WDBusinessData {
  businessName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  country?: string;
  countryCode?: string;
  primaryKeyword: string;
  secondaryKeyword?: string;
  services: string[];
  serviceAreas: string[];
  urlSlug: string;
  // SEO & Analytics
  googleVerificationCode?: string;
  googleAnalyticsId?: string;
  customHeadCode?: string;
  // Theme
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: WDFontFamily;
  // Media
  logoUrl?: string;
  logoAlt?: string;
  faviconUrl?: string;
  // Business details
  contactFormEmbed?: string;
  yearsInBusiness?: string;
  licenseNumber?: string;
  insuranceInfo?: string;
  // About page data
  aboutContent?: string;
  teamDescription?: string;
  // Custom images: placeholder key → data URL or hosted URL
  customImages?: Record<string, string>;
  // Social media
  facebookUrl?: string;
  instagramUrl?: string;
  googleUrl?: string;
  yelpUrl?: string;
  twitterUrl?: string;
  // Floating CTA: 'call' (default) | 'whatsapp' | 'none'
  floatingCTA?: 'call' | 'whatsapp' | 'none';
  whatsappNumber?: string;
  // Gallery images (uploaded by user, hosted on Netlify after publish)
  galleryImages?: WDGalleryImage[];
  // Blog posts
  blogPosts?: WDBlogPost[];
  // AI-generated content
  homepageContent?: WDHomepageContent;
  serviceContent?: Record<string, WDServiceContent>;
  locationContent?: Record<string, WDLocationContent>;
  faqContent?: WDFAQPageContent;
  // Multi-category support — injected by generateLocalServiceWebsite()
  _categoryId?: string;
  _heroTagline?: string;
  _heroSubheading?: string;
  _ctaHeadline?: string;
  _ctaSubtext?: string;
  _ctaButton?: string;
  _emergencyBadge?: string;
  _trustBadges?: string[];
  _whyUsPoints?: Array<{ icon: string; heading: string; body: string }>;
  _schemaType?: string;
  _schemaDescription?: string;
  _schemaOfferCatalogName?: string;
  _footerEmergencyText?: string;
  _whatsappMessage?: string;
  _introH2?: string;
  _introParas?: string[];
  _servicesH2?: string;
  _servicesIntro?: string;
  _processH2?: string;
  _processSteps?: Array<{ step: number; heading: string; body: string }>;
  _locationsBody?: string;
  _faqH2?: string;
  _faqs?: Array<{ question: string; answer: string }>;
  _seoBody?: string;
  _servicePageBenefitsH2?: string;
  _servicePageBenefits?: Array<{ heading: string; body: string }>;
}

export interface WDGalleryImage {
  src: string;         // URL (placeholder or uploaded)
  alt: string;
  type: 'before' | 'after' | 'normal';
  pairId?: string;     // for before/after pairs
  caption?: string;
}

export interface WDBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  date: string;
  category?: string;
}

export interface WDFAQPageContent {
  metaTitle?: string;
  metaDescription?: string;
  h1?: string;
  intro?: string;
  categories?: Array<{
    heading: string;
    faqs: Array<{ question: string; answer: string }>;
  }>;
}

export interface WDHomepageContent {
  metaTitle: string;
  metaDescription: string;
  hero: {
    h1: string;
    subheadline: string;
    primaryCTA: string;
    trustLine: string;
  };
  intro: {
    h2: string;
    paragraphs: string[];
  };
  servicesSection: {
    h2: string;
    intro: string;
    cards: Array<{
      service: string;
      h3: string;
      description: string;
      internalLink: { anchor: string; slug: string };
    }>;
  };
  whyUsSection: {
    h2: string;
    points: Array<{
      icon: string;
      heading: string;
      body: string;
    }>;
  };
  processSection?: {
    h2: string;
    steps: Array<{ step: number; heading: string; body: string }>;
  };
  locationsSection: {
    h2: string;
    body: string;
    locationLinks: Array<{ city: string; anchor: string; slug: string }>;
  };
  faqSection: {
    h2: string;
    faqs: Array<{ question: string; answer: string }>;
  };
  finalCTA: {
    h2: string;
    body: string;
    ctaButton: string;
    phone: string;
  };
  seoFootnote?: {
    h2: string;
    body: string;
    targetKeywords: string[];
  };
}

export interface WDServiceContent {
  metaTitle: string;
  metaDescription: string;
  breadcrumb: string;
  hero: {
    h1: string;
    subheadline: string;
    trustBadges: string[];
  };
  overviewSection: {
    h2: string;
    body: string[];
  };
  processSection: {
    h2: string;
    intro: string;
    steps: Array<{ step: number; heading: string; body: string }>;
  };
  benefitsSection: {
    h2: string;
    points: Array<{ heading: string; body: string }>;
  };
  warningSignsSection: {
    h2: string;
    intro: string;
    signs: Array<{ sign: string; body: string }>;
  };
  locationClusterSection: {
    h2: string;
    intro: string;
    locationCards: Array<{ city: string; anchor: string; slug: string; teaser: string }>;
  };
  faqSection: {
    h2: string;
    faqs: Array<{ question: string; answer: string }>;
  };
  crossLinkSection: {
    h2: string;
    links: Array<{ service: string; anchor: string; slug: string; reason: string }>;
  };
  finalCTA: {
    h2: string;
    body: string;
    ctaButton: string;
    phone: string;
  };
  targetKeywordsSummary: string[];
}

export interface WDLocationContent {
  metaTitle: string;
  metaDescription: string;
  breadcrumb: string;
  hero: {
    h1: string;
    subheadline: string;
    trustBadges: string[];
  };
  localIntroSection: {
    h2: string;
    paragraphs: string[];
  };
  servicesInCitySection: {
    h2: string;
    intro: string;
    serviceCards: Array<{
      service: string;
      h3: string;
      description: string;
      internalLink: { anchor: string; slug: string };
    }>;
  };
  whyLocalSection: {
    h2: string;
    points: Array<{ heading: string; body: string }>;
  };
  localAreaSection: {
    h2: string;
    body: string;
  };
  faqSection: {
    h2: string;
    faqs: Array<{ question: string; answer: string }>;
  };
  finalCTA: {
    h2: string;
    body: string;
    ctaButton: string;
    phone: string;
  };
  targetKeywordsSummary: string[];
}

// ─── Theme / Font System ───────────────────────────────────────────────────

const FONT_URLS: Record<WDFontFamily, string> = {
  inter: '',
  poppins: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap',
  montserrat: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap',
  merriweather: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Inter:wght@400;500;600;700&display=swap',
};

const FONT_STACKS: Record<WDFontFamily, string> = {
  inter: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, sans-serif',
  poppins: '"Poppins", -apple-system, BlinkMacSystemFont, sans-serif',
  montserrat: '"Montserrat", -apple-system, BlinkMacSystemFont, sans-serif',
  merriweather: '"Merriweather", Georgia, "Times New Roman", serif',
};

function resolveTheme(data: WDBusinessData): WDTheme {
  return {
    primaryColor: data.primaryColor || '#1e3a5f',
    secondaryColor: data.secondaryColor || '#0ea5e9',
    accentColor: data.accentColor || '#dc2626',
    fontFamily: data.fontFamily || 'inter',
    heroImageUrl: data.customImages?.['hero-bg'] || (data as any)._categoryImages?.['hero'],
  };
}

// ─── Placeholder Images ────────────────────────────────────────────────────

// Placeholder image URLs for water damage niche - user replaces after generation
const WD_PLACEHOLDER_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
  team: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
  equipment: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  mold: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',
  flooding: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80',
  drying: 'https://images.unsplash.com/photo-1601760562234-9814eea6663a?w=800&q=80',
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function buildServiceSlug(service: string, city: string): string {
  return `services/${slugify(service)}-${slugify(city)}.html`;
}

// ─── Icon name → emoji (AI returns names like "shield", "clock") ────────────
function iconToEmoji(icon: string): string {
  if (!icon) return '✅';
  // Already an emoji or contains non-ASCII
  if (/[^\x00-\x7F]/.test(icon)) return icon;
  const map: Record<string, string> = {
    'shield': '🛡️', 'shield-check': '🛡️',
    'clock': '⏰', 'time': '⏰', 'timer': '⏰',
    'check-circle': '✅', 'check': '✅', 'checkmark': '✅',
    'star': '⭐', 'award': '🏆', 'trophy': '🏆',
    'phone': '📞', 'call': '📞',
    'home': '🏠', 'house': '🏠',
    'heart': '❤️', 'love': '❤️',
    'users': '👥', 'team': '👥', 'people': '👥',
    'tool': '🔧', 'wrench': '🔧', 'settings': '🔧',
    'zap': '⚡', 'lightning': '⚡', 'fast': '⚡',
    'alert': '🚨', 'warning': '⚠️', 'emergency': '🚨',
    'map-pin': '📍', 'map': '📍', 'location': '📍',
    'dollar': '💲', 'money': '💲', 'price': '💲',
    'file': '📋', 'clipboard': '📋', 'document': '📋',
    'water': '💧', 'droplet': '💧', 'drop': '💧',
    'mold': '🦠', 'bacteria': '🦠',
    'calendar': '📅', 'date': '📅',
    'camera': '📷', 'photo': '📷',
    'search': '🔍', 'magnify': '🔍',
    'lock': '🔒', 'secure': '🔒',
    'truck': '🚛', 'van': '🚛', 'vehicle': '🚛',
    'certified': '🎓', 'certificate': '🎓', 'license': '🎓',
    'insurance': '📄', 'paper': '📄',
    'thumbs-up': '👍', 'like': '👍',
    'smile': '😊', 'happy': '😊',
  };
  const key = icon.toLowerCase().trim().replace(/[\s_]+/g, '-');
  return map[key] || map[key.split('-')[0]] || '✅';
}

function buildLocationSlug(city: string): string {
  return `locations/${slugify(city)}.html`;
}

// ─── SHARED: Navigation ────────────────────────────────────────────────────

function generateNav(data: WDBusinessData, currentPath: string = ''): string {
  const prefix = currentPath.includes('/') ? '../' : '';
  const serviceLinks = data.services
    .slice(0, 8)
    .map(s => `<li><a href="${prefix}services/${slugify(s)}-${slugify(data.city)}.html">${s}</a></li>`)
    .join('');
  const locationLinks = data.serviceAreas
    .slice(0, 8)
    .map(l => `<li><a href="${prefix}locations/${slugify(l)}.html">${l}</a></li>`)
    .join('');

  const logoHtml = data.logoUrl
    ? `<a href="${prefix}index.html" aria-label="${data.businessName} - Home">
          <img src="${data.logoUrl}" alt="${data.logoAlt || data.businessName + ' logo'}" class="header-logo" width="160" height="48" loading="eager">
        </a>`
    : `<a href="${prefix}index.html" class="brand-name" aria-label="${data.businessName} - Home">${data.businessName}</a>`;

  return `
  <header class="site-header" role="banner">
    <div class="header-inner">
      <div class="header-brand">
        ${logoHtml}
      </div>

      <nav class="main-nav" role="navigation" aria-label="Main navigation">
        <ul class="nav-list">
          <li><a href="${prefix}index.html">Home</a></li>
          <li class="has-dropdown">
            <a href="#" aria-haspopup="true" aria-expanded="false">Services ▾</a>
            <ul class="dropdown" role="menu">
              ${serviceLinks}
            </ul>
          </li>
          <li class="has-dropdown">
            <a href="#" aria-haspopup="true" aria-expanded="false">Areas ▾</a>
            <ul class="dropdown" role="menu">
              ${locationLinks}
            </ul>
          </li>
          <li><a href="${prefix}about.html">About</a></li>
          <li><a href="${prefix}gallery.html">Gallery</a></li>
          <li><a href="${prefix}faq.html">FAQ</a></li>
          <li><a href="${prefix}calculator.html">Calculators</a></li>
          <li><a href="${prefix}blog.html">Blog</a></li>
          <li><a href="${prefix}contact.html">Contact</a></li>
        </ul>
      </nav>

      <div class="header-cta">
        <a href="tel:${data.countryCode || '+1'}${data.phone.replace(/\D/g, '')}" class="btn-emergency" aria-label="Call us now">
          📞 ${data.phone}
        </a>
      </div>

      <button class="mobile-menu-toggle" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>`;
}

// ─── SHARED: Footer ────────────────────────────────────────────────────────

function generateFooter(data: WDBusinessData, currentPath: string = ''): string {
  const prefix = currentPath.includes('/') ? '../' : '';
  const serviceLinks = data.services
    .slice(0, 5)
    .map(s => `<li><a href="${prefix}services/${slugify(s)}-${slugify(data.city)}.html">${s}</a></li>`)
    .join('');
  const locationLinks = data.serviceAreas
    .slice(0, 5)
    .map(l => `<li><a href="${prefix}locations/${slugify(l)}.html">${l}</a></li>`)
    .join('');
  const year = new Date().getFullYear();

  const brandBlock = data.logoUrl
    ? `<img src="${data.logoUrl}" alt="${data.logoAlt || data.businessName + ' logo'}" class="footer-logo" width="140" height="42" loading="lazy">
        <p style="margin-top:0.75rem;">${data.address}</p>`
    : `<p class="footer-biz-name">${data.businessName}</p>
        <p>${data.address}</p>`;

  return `
  <footer class="site-footer" role="contentinfo">
    <div class="footer-inner">
      <div class="footer-brand">
        ${brandBlock}
        <p>${data.city}, ${data.state}</p>
        <p><a href="tel:${data.countryCode || '+1'}${data.phone.replace(/\D/g, '')}">${data.phone}</a></p>
        ${data.email ? `<p><a href="mailto:${data.email}">${data.email}</a></p>` : ''}
        ${generateSocialLinks(data)}
        <div style="margin-top:1rem;">
          <a href="${prefix}about.html" style="color:#94a3b8;font-size:.85rem;margin-right:.75rem;">About</a>
          <a href="${prefix}faq.html" style="color:#94a3b8;font-size:.85rem;margin-right:.75rem;">FAQ</a>
          <a href="${prefix}gallery.html" style="color:#94a3b8;font-size:.85rem;margin-right:.75rem;">Gallery</a>
          <a href="${prefix}calculator.html" style="color:#94a3b8;font-size:.85rem;margin-right:.75rem;">Calculators</a>
          <a href="${prefix}contact.html" style="color:#94a3b8;font-size:.85rem;margin-right:.75rem;">Contact</a>
          <a href="${prefix}privacy.html" style="color:#94a3b8;font-size:.85rem;margin-right:.75rem;">Privacy Policy</a>
          <a href="${prefix}terms.html" style="color:#94a3b8;font-size:.85rem;">Terms of Service</a>
        </div>
      </div>

      <div class="footer-links">
        <h3>Our Services</h3>
        <ul>${serviceLinks}</ul>
      </div>

      <div class="footer-links">
        <h3>Service Areas</h3>
        <ul>${locationLinks}</ul>
      </div>

      <div class="footer-contact">
        <h3>24/7 Emergency Line</h3>
        <a href="tel:${data.countryCode || '+1'}${data.phone.replace(/\D/g, '')}" class="footer-phone">${data.phone}</a>
        <p>${data._footerEmergencyText || 'Available around the clock for emergencies.'}</p>
        ${data.licenseNumber ? `<p style="font-size:.8rem;color:#64748b;margin-top:.5rem;">License: ${data.licenseNumber}</p>` : ''}
        ${data.insuranceInfo ? `<p style="font-size:.8rem;color:#64748b;">${data.insuranceInfo}</p>` : ''}
      </div>
    </div>

    <div class="footer-bottom">
      <p>© ${year} ${data.businessName}. All rights reserved.</p>
      <p>Serving ${data.city}, ${data.state} and surrounding areas.</p>
    </div>
  </footer>`;
}

// ─── SHARED: Schema Markup ─────────────────────────────────────────────────

function generateLocalBusinessSchema(data: WDBusinessData, domain: string): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://${domain}/#organization`,
    "name": data.businessName,
    "description": data._schemaDescription || `Professional water damage restoration services in ${data.city}, ${data.state}. 24/7 emergency response for water extraction, structural drying, mold remediation, and more.`,
    "telephone": data.phone,
    "email": data.email || undefined,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": data.address,
      "addressLocality": data.city,
      "addressRegion": data.state,
      "addressCountry": data.country || "US"
    },
    "url": `https://${domain}`,
    "areaServed": data.serviceAreas.map(area => ({
      "@type": "City",
      "name": area
    })),
    "openingHours": "Mo-Su 00:00-24:00",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": data._schemaOfferCatalogName || "Water Damage Restoration Services",
      "itemListElement": data.services.map(service => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service
        }
      }))
    }
  };
  return JSON.stringify(schema, null, 2);
}

function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
  return JSON.stringify(schema, null, 2);
}

function generateWebSiteSchema(data: WDBusinessData, domain: string): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": data.businessName,
    "url": `https://${domain}.netlify.app/`,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `https://${domain}.netlify.app/?s={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
  return JSON.stringify(schema, null, 2);
}

function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url
    }))
  };
  return JSON.stringify(schema, null, 2);
}

// ─── SHARED: CSS ───────────────────────────────────────────────────────────

function generateCSS(theme: WDTheme): string {
  const { primaryColor, secondaryColor, accentColor, fontFamily } = theme;
  const fontStack = FONT_STACKS[fontFamily];
  return `
/* ── Reset & Base ─────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; font-size: 16px; }

body {
  font-family: ${fontStack};
  color: #1e293b;
  line-height: 1.7;
  background: #fff;
}

a { color: ${secondaryColor}; text-decoration: none; }
a:hover { text-decoration: underline; }

img { max-width: 100%; height: auto; display: block; }

h1, h2, h3, h4 {
  font-weight: 700;
  line-height: 1.3;
  color: ${primaryColor};
}

h1 { font-size: clamp(1.75rem, 4vw, 2.8rem); }
h2 { font-size: clamp(1.4rem, 3vw, 2rem); }
h3 { font-size: clamp(1.1rem, 2vw, 1.4rem); }

p { margin-bottom: 1rem; }
p:last-child { margin-bottom: 0; }

ul { list-style: none; }

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

section { padding: 4rem 0; }
section:nth-child(even):not(.cta-section):not(.page-hero):not(.hero-section):not(.hero) { background: #f8fafc; }

/* ── Header ───────────────────────────────────── */
.site-header {
  background: ${primaryColor};
  border-bottom: 1px solid ${darkenHex(primaryColor, 0.8)};
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 12px rgba(0,0,0,.18);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  gap: 1rem;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: #fff;
  text-decoration: none;
  flex-shrink: 0;
}

.header-logo {
  height: 48px;
  width: auto;
  display: block;
  object-fit: contain;
}

.footer-logo {
  height: 42px;
  width: auto;
  display: block;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.9;
}

.main-nav { display: flex; }

.nav-list {
  display: flex;
  gap: 0.25rem;
  align-items: center;
  flex-wrap: wrap;
}

.nav-list a {
  color: rgba(255,255,255,0.88);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background .15s, color .15s;
  white-space: nowrap;
}

.nav-list a:hover {
  background: rgba(255,255,255,0.15);
  color: #fff;
  text-decoration: none;
}

.has-dropdown { position: relative; }

.dropdown {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,.1);
  min-width: 220px;
  padding: 0.5rem;
  z-index: 200;
}

.has-dropdown:hover .dropdown { display: block; }

.dropdown li a {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
}

.btn-emergency {
  background: ${accentColor};
  color: #fff !important;
  padding: 0.6rem 1.1rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: background .15s;
  text-decoration: none !important;
}

.btn-emergency:hover { background: ${accentColor}dd; }

.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
}

.mobile-menu-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
}

/* ── Hero ──────────────────────────────────────── */
.hero {
  position: relative;
  background: linear-gradient(135deg, ${primaryColor} 0%, ${darkenHex(primaryColor, 0.45)} 100%);
  color: #fff;
  padding: 5rem 0 4rem;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url('${theme.heroImageUrl || WD_PLACEHOLDER_IMAGES.hero}') center/cover no-repeat;
  opacity: 0.35;
}
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(${hexToRgb(darkenHex(primaryColor,0.35))},0.72) 0%, rgba(${hexToRgb(darkenHex(primaryColor,0.3))},0.52) 100%);
}

.hero-inner {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 3rem;
  align-items: center;
}

.hero-badge {
  display: inline-block;
  background: ${accentColor};
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.35rem 0.9rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.hero h1 {
  color: #fff;
  margin-bottom: 1rem;
}

.hero-sub {
  font-size: 1.1rem;
  color: #cbd5e1;
  margin-bottom: 2rem;
  max-width: 560px;
}

.hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #dc2626;
  color: #fff;
  padding: 0.9rem 1.75rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  transition: background .15s, transform .1s;
  text-decoration: none;
}

.btn-primary:hover { background: #b91c1c; transform: translateY(-1px); text-decoration: none; }

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  color: #fff;
  border: 2px solid rgba(255,255,255,.5);
  padding: 0.9rem 1.75rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  transition: border-color .15s, background .15s;
  text-decoration: none;
}

.btn-secondary:hover { border-color: #fff; background: rgba(255,255,255,.1); text-decoration: none; }

.hero-trust {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-top: 1rem;
}

/* Hero CTA Card */
.hero-cta-card {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0,0,0,.3);
  color: #1e293b;
}

.hero-cta-card h3 {
  font-size: 1.1rem;
  margin-bottom: 1.25rem;
  text-align: center;
  color: ${primaryColor};
}

.hero-cta-phone {
  display: block;
  background: #dc2626;
  color: #fff;
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  text-decoration: none;
  transition: background .15s;
}

.hero-cta-phone:hover { background: #b91c1c; text-decoration: none; }

.hero-cta-divider {
  text-align: center;
  color: #94a3b8;
  font-size: 0.8rem;
  margin: 0.75rem 0;
}

.hero-cta-form-btn {
  display: block;
  background: ${primaryColor};
  color: #fff;
  text-align: center;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: background .15s;
}

.hero-cta-form-btn:hover { background: ${darkenHex(primaryColor, 0.7)}; text-decoration: none; }

/* ── Services Grid ─────────────────────────────── */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.service-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1.75rem;
  transition: box-shadow .2s, transform .2s;
}

.service-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,.08);
  transform: translateY(-2px);
}

.service-card h3 {
  margin-bottom: 0.75rem;
  color: ${primaryColor};
}

.service-card p { color: #475569; font-size: 0.95rem; margin-bottom: 1rem; }

.service-card-link {
  color: ${secondaryColor};
  font-weight: 600;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

/* ── Why Us ────────────────────────────────────── */
.why-us-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.why-us-item { display: flex; gap: 1rem; align-items: flex-start; }

.why-us-icon {
  font-size: 1.75rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.why-us-item h3 { margin-bottom: 0.35rem; font-size: 1rem; }
.why-us-item p { color: #475569; font-size: 0.9rem; margin: 0; }

/* ── Process Steps ─────────────────────────────── */
.process-steps {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  counter-reset: step-counter;
}

.process-step {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1.5rem;
  position: relative;
  counter-increment: step-counter;
}

.process-step::before {
  content: counter(step-counter);
  position: absolute;
  top: -14px;
  left: 1.5rem;
  background: ${secondaryColor};
  color: #fff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.85rem;
}

.process-step h3 { margin-top: 0.5rem; margin-bottom: 0.5rem; font-size: 1rem; }
.process-step p { color: #475569; font-size: 0.9rem; margin: 0; }

/* ── Locations ─────────────────────────────────── */
.locations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.location-link {
  display: block;
  background: #fff;
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  color: ${primaryColor};
  transition: background .15s, border-color .15s;
}

.location-link:hover {
  background: ${primaryColor};
  color: #fff;
  border-color: ${primaryColor};
  text-decoration: none;
}

/* ── FAQ ───────────────────────────────────────── */
.faq-list { max-width: 800px; margin: 2rem auto 0; }

.faq-item {
  border-bottom: 1px solid #e2e8f0;
  padding: 1.25rem 0;
}

.faq-item:last-child { border-bottom: none; }

.faq-question {
  width: 100%;
  background: none;
  border: none;
  text-align: left;
  font-size: 1rem;
  font-weight: 600;
  color: ${primaryColor};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0;
}

.faq-question::after {
  content: '+';
  font-size: 1.5rem;
  font-weight: 400;
  flex-shrink: 0;
  transition: transform .2s;
}

.faq-item.open .faq-question::after { transform: rotate(45deg); }

.faq-answer {
  display: none;
  padding-top: 0.75rem;
  color: #475569;
  line-height: 1.7;
}

.faq-item.open .faq-answer { display: block; }

/* ── CTA Section ───────────────────────────────── */
.cta-section {
  background: linear-gradient(135deg, ${primaryColor} 0%, ${darkenHex(primaryColor, 0.45)} 100%);
  color: #fff;
  text-align: center;
  padding: 5rem 0;
}

.cta-section h2 { color: #fff; margin-bottom: 1rem; }
.cta-section p { color: #cbd5e1; max-width: 600px; margin: 0 auto 2rem; }

.cta-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

/* ── Breadcrumb ────────────────────────────────── */
.breadcrumb {
  padding: 0.75rem 0;
  font-size: 0.875rem;
  color: #64748b;
}

.breadcrumb a { color: ${secondaryColor}; }
.breadcrumb span { margin: 0 0.5rem; }

/* ── Content Page Hero ─────────────────────────── */
.page-hero {
  background: linear-gradient(135deg, ${primaryColor} 0%, ${darkenHex(primaryColor, 0.5)} 100%);
  color: #fff;
  padding: 3.5rem 0 3rem;
}

.page-hero h1 { color: #fff; margin-bottom: 0.75rem; }
.page-hero p { color: #cbd5e1; font-size: 1.05rem; max-width: 680px; }

.trust-badges {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1.25rem;
}

.trust-badge {
  background: rgba(255,255,255,.15);
  color: #fff;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid rgba(255,255,255,.25);
}

/* ── Overview / Content Sections ──────────────── */
.content-section { padding: 4rem 0; }
.content-section h2 { margin-bottom: 1.5rem; }
.content-section p { color: #475569; }

/* ── Benefits Grid ─────────────────────────────── */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.benefit-item {
  background: #fff;
  border-left: 4px solid ${secondaryColor};
  padding: 1.25rem 1.5rem;
  border-radius: 0 8px 8px 0;
}

.benefit-item h3 { font-size: 1rem; margin-bottom: 0.4rem; }
.benefit-item p { color: #475569; font-size: 0.9rem; margin: 0; }

/* ── Warning Signs ─────────────────────────────── */
.warnings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.warning-item {
  background: #fff9f9;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1.25rem;
}

.warning-item h3 {
  font-size: 1rem;
  color: #dc2626;
  margin-bottom: 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.warning-item h3::before { content: '⚠'; }
.warning-item p { color: #475569; font-size: 0.9rem; margin: 0; }

/* ── Related Services ──────────────────────────── */
.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.related-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.25rem;
}

.related-card h3 { font-size: 1rem; margin-bottom: 0.4rem; }
.related-card p { color: #475569; font-size: 0.875rem; margin-bottom: 0.75rem; }

/* ── Contact Form Area ─────────────────────────── */
.contact-section { padding: 4rem 0; }
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.contact-info h3 { margin-bottom: 1rem; }
.contact-info p { color: #475569; }

.contact-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.contact-icon { font-size: 1.25rem; flex-shrink: 0; }

/* ── Image with Alt Placeholder ────────────────── */
.placeholder-img {
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
}

.img-caption {
  font-size: 0.8rem;
  color: #94a3b8;
  text-align: center;
  margin-top: 0.4rem;
  font-style: italic;
}

/* ── Footer ────────────────────────────────────── */
.site-footer {
  background: ${primaryColor};
  color: #cbd5e1;
  padding: 4rem 0 2rem;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 2.5rem;
}

.footer-biz-name {
  font-size: 1.2rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 0.75rem;
}

.footer-links h3 {
  color: #fff;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
}

.footer-links li { margin-bottom: 0.4rem; }
.footer-links a { color: #94a3b8; font-size: 0.9rem; }
.footer-links a:hover { color: #fff; text-decoration: none; }

.footer-contact h3 {
  color: #fff;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
}

.footer-phone {
  display: block;
  color: #fbbf24;
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.footer-bottom {
  max-width: 1200px;
  margin: 2.5rem auto 0;
  padding: 1.5rem 1.5rem 0;
  border-top: 1px solid rgba(255,255,255,.1);
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #64748b;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* ── Utility ───────────────────────────────────── */
.section-intro {
  max-width: 700px;
  color: #475569;
  margin-bottom: 0.5rem;
}

.section-header { margin-bottom: 0.25rem; }

.text-center { text-align: center; }

/* ── Responsive ────────────────────────────────── */
@media (max-width: 1024px) {
  .hero-inner { grid-template-columns: 1fr; }
  .hero-cta-card { max-width: 500px; }
  .footer-inner { grid-template-columns: 1fr 1fr; }
  .contact-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .main-nav { display: none; }
  .main-nav.open { display: block; position: absolute; top: 72px; left: 0; right: 0; background: #fff; border-bottom: 1px solid #e2e8f0; padding: 1rem; }
  .main-nav.open .nav-list { flex-direction: column; }
  .mobile-menu-toggle { display: flex; }
  .hero { padding: 3rem 0 2.5rem; }
  section { padding: 3rem 0; }
  .footer-inner { grid-template-columns: 1fr; gap: 2rem; }
  .footer-bottom { flex-direction: column; }
}

@media (max-width: 480px) {
  h1 { font-size: 1.6rem; }
  h2 { font-size: 1.3rem; }
  .hero-actions { flex-direction: column; }
  .cta-actions { flex-direction: column; align-items: center; }
}

/* ── Social Links ──────────────────────────────── */
.social-links { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.75rem; }
.social-link {
  display: inline-flex; align-items: center; gap: 0.35rem;
  padding: 0.35rem 0.75rem; border-radius: 20px;
  background: rgba(255,255,255,0.08); color: #94a3b8;
  font-size: 0.8rem; text-decoration: none; transition: background .2s, color .2s;
}
.social-link:hover { background: rgba(255,255,255,0.15); color: #fff; text-decoration: none; }

/* ── Floating CTA Button ───────────────────────── */
.floating-cta {
  position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999;
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.85rem 1.4rem; border-radius: 50px;
  font-weight: 700; font-size: 1rem; color: #fff;
  text-decoration: none; white-space: nowrap;
  box-shadow: 0 4px 20px rgba(0,0,0,0.35);
  animation: ctaPulse 2.5s ease-in-out infinite;
}
.floating-cta--call { background: ${accentColor}; }
.floating-cta--whatsapp { background: #25D366; }
@keyframes ctaPulse {
  0%,100% { transform: scale(1); box-shadow: 0 4px 20px rgba(0,0,0,0.35); }
  50%      { transform: scale(1.04); box-shadow: 0 6px 28px rgba(0,0,0,0.45); }
}
@media (max-width: 480px) { .floating-cta { bottom: 1rem; right: 1rem; font-size: 0.9rem; padding: 0.75rem 1.1rem; } }`;
}

// ─── Social Links HTML ──────────────────────────────────────────────────────
function generateSocialLinks(data: WDBusinessData): string {
  const links: Array<{ url: string; label: string; icon: string }> = [];
  if (data.facebookUrl)  links.push({ url: data.facebookUrl,  label: 'Facebook',  icon: '<i class="fab fa-facebook-f"></i>' });
  if (data.instagramUrl) links.push({ url: data.instagramUrl, label: 'Instagram', icon: '<i class="fab fa-instagram"></i>' });
  if (data.googleUrl)    links.push({ url: data.googleUrl,    label: 'Google',    icon: '<i class="fab fa-google"></i>' });
  if (data.yelpUrl)      links.push({ url: data.yelpUrl,      label: 'Yelp',      icon: '<i class="fab fa-yelp"></i>' });
  if (data.twitterUrl)   links.push({ url: data.twitterUrl,   label: 'X',         icon: '<i class="fab fa-x-twitter"></i>' });
  if (links.length === 0) return '';
  return `<div class="social-links">${links.map(l =>
    `<a href="${l.url}" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="${l.label}">${l.icon} ${l.label}</a>`
  ).join('')}</div>`;
}

// ─── Floating CTA HTML ──────────────────────────────────────────────────────
function generateFloatingCTA(data: WDBusinessData): string {
  const cta = data.floatingCTA ?? 'call';
  if (cta === 'none') return '';
  if (cta === 'whatsapp') {
    const num = (data.whatsappNumber || data.phone).replace(/\D/g, '');
    const msg = encodeURIComponent(data._whatsappMessage || `Hi, I need help!`);
    return `<a href="https://wa.me/${num}?text=${msg}" class="floating-cta floating-cta--whatsapp" aria-label="WhatsApp us">💬 WhatsApp Us</a>`;
  }
  // default: call
  const tel = data.phone.replace(/\D/g, '');
  return `<a href="tel:${data.countryCode || '+1'}${tel}" class="floating-cta floating-cta--call" aria-label="Call us now">📞 Call Now</a>`;
}

// ─── SHARED: JS ────────────────────────────────────────────────────────────

function generateJS(): string {
  return `
// Mobile menu toggle
const toggleBtn = document.querySelector('.mobile-menu-toggle');
const nav = document.querySelector('.main-nav');
if (toggleBtn && nav) {
  toggleBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
    const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!expanded));
  });
}

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    if (!item) return;
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    // Toggle clicked
    if (!isOpen) item.classList.add('open');
  });
});

// Sticky header shadow on scroll
const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10 ? '0 2px 12px rgba(0,0,0,.1)' : '0 1px 6px rgba(0,0,0,.06)';
  }, { passive: true });
}
`;
}

// ─── SHARED: HTML Shell ────────────────────────────────────────────────────

function htmlShell(params: {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  theme: WDTheme;
  schemaBlocks: string[];
  bodyContent: string;
  extraJs?: string;
  ogImage?: string;
  googleVerification?: string;
  googleAnalyticsId?: string;
  faviconUrl?: string;
  customHeadCode?: string;
}): string {
  const schemas = params.schemaBlocks
    .map(s => `<script type="application/ld+json">\n${s}\n</script>`)
    .join('\n  ');

  const fontUrl = FONT_URLS[params.theme.fontFamily];
  const fontLink = fontUrl
    ? `\n  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontUrl}" rel="stylesheet">`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${params.metaTitle}</title>
  <meta name="description" content="${params.metaDescription}">
  <link rel="canonical" href="${params.canonicalUrl}">
  ${params.faviconUrl ? `<link rel="icon" type="image/png" href="${params.faviconUrl}">
  <link rel="shortcut icon" href="${params.faviconUrl}">` : ''}${fontLink}

  <!-- SEO -->
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  ${params.googleVerification ? `<meta name="google-site-verification" content="${params.googleVerification}">` : ''}
  <meta property="og:title" content="${params.metaTitle}">
  <meta property="og:description" content="${params.metaDescription}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${params.canonicalUrl}">
  ${params.ogImage ? `<meta property="og:image" content="${params.ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${params.metaTitle}">
  <meta name="twitter:description" content="${params.metaDescription}">
  ${params.ogImage ? `<meta name="twitter:image" content="${params.ogImage}">` : ''}

  <!-- Schema.org -->
  ${schemas}

  ${params.googleAnalyticsId ? `<!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${params.googleAnalyticsId}"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${params.googleAnalyticsId}');</script>` : ''}

  ${params.customHeadCode ? `<!-- Custom Head Code -->\n  ${params.customHeadCode.trim()}` : ''}

  <style>
    ${generateCSS(params.theme)}
  </style>
</head>
<body>
  ${params.bodyContent}

  <script>
    ${generateJS()}
    ${params.extraJs || ''}
  </script>
</body>
</html>`;
}

// ─── HOMEPAGE ──────────────────────────────────────────────────────────────

export function generateHomepage(data: WDBusinessData, domain: string): string {
  const content = data.homepageContent;
  const prefix = '';

  // Fallback content if AI content not yet generated
  const h1 = content?.hero?.h1 || `${data.primaryKeyword} in ${data.city}, ${data.state}`;
  const heroSub = content?.hero?.subheadline || data._heroSubheading || `Trusted ${data.primaryKeyword.toLowerCase()} specialists serving ${data.city} and surrounding areas. We respond fast to protect your property.`;
  const introH2 = content?.intro?.h2 || data._introH2 || `${data.primaryKeyword} Services in ${data.city}`;
  const introParas = content?.intro?.paragraphs || data._introParas || [
    `When water damage strikes your ${data.city} home or business, every minute matters. Moisture moves fast — soaking into walls, floors, and building materials before you even realize the full extent of the damage. ${data.businessName} provides rapid-response water damage restoration to limit destruction and get your property back to normal.`,
    `Our certified technicians arrive equipped with industrial-grade water extraction equipment, structural drying systems, and moisture detection tools. We handle everything from the initial assessment to the final walkthrough, keeping you informed at every step.`,
    `${data.businessName} has built a reputation throughout ${data.city} for honest assessments, thorough work, and professional service. We work directly with most insurance companies and can help you document the damage for your claim from day one.`,
  ];

  const servH2 = content?.servicesSection?.h2 || data._servicesH2 || `Our ${data.primaryKeyword} Services in ${data.city}`;
  const servIntro = content?.servicesSection?.intro || data._servicesIntro || `We offer a full range of professional ${data.primaryKeyword.toLowerCase()} services to homeowners and businesses throughout ${data.city}.`;
  const serviceCards = content?.servicesSection?.cards?.length
    ? content.servicesSection.cards
    : data.services.map(s => ({
        service: s,
        h3: s,
        description: `Professional ${s.toLowerCase()} services for ${data.city} properties. Contact us for a free assessment.`,
        internalLink: { anchor: `Learn about ${s}`, slug: `services/${slugify(s)}-${slugify(data.city)}.html` },
      }));

  const whyH2 = content?.whyUsSection?.h2 || `Why ${data.city} Chooses ${data.businessName}`;
  const defaultWhyPoints = data._whyUsPoints || [
    { icon: '🚨', heading: '24/7 Emergency Response', body: `${data.primaryKeyword} emergencies don't follow business hours. Our ${data.city} team is available around the clock, every day of the year.` },
    { icon: '🎓', heading: 'Certified Technicians', body: 'Our specialists hold industry certifications and follow best-practice protocols for every job.' },
    { icon: '🏠', heading: 'Insurance Claim Help', body: 'We work directly with your insurance adjuster and provide thorough documentation to support your claim.' },
    { icon: '⚡', heading: 'Fast Response', body: `We dispatch quickly — because when you need ${data.primaryKeyword.toLowerCase()}, every minute counts.` },
    { icon: '🔍', heading: 'Thorough Assessment', body: 'We inspect fully and document everything so you understand exactly what needs to be done and why.' },
    { icon: '📋', heading: 'Transparent Pricing', body: 'No surprise charges. We provide written estimates and explain every step before work begins.' },
  ];
  const whyPoints = content?.whyUsSection?.points || defaultWhyPoints;

  const processH2 = content?.processSection?.h2 || data._processH2 || `Our ${data.primaryKeyword} Process in ${data.city}`;
  const processSteps = content?.processSection?.steps || data._processSteps || [
    { step: 1, heading: 'Emergency Contact', body: `Call us anytime. Our ${data.city} dispatcher will assess your situation and dispatch a team immediately.` },
    { step: 2, heading: 'Inspection & Assessment', body: 'Technicians identify the water source, categorize the damage, and document affected areas with photos and moisture readings.' },
    { step: 3, heading: 'Water Extraction', body: 'Truck-mounted and portable extractors remove standing water from floors, carpets, and building cavities.' },
    { step: 4, heading: 'Structural Drying', body: 'Industrial air movers and dehumidifiers dry structural materials to IICRC target moisture levels.' },
    { step: 5, heading: 'Mold Prevention', body: 'Antimicrobial treatments are applied to inhibit mold growth in affected areas.' },
    { step: 6, heading: 'Monitoring', body: 'We return daily to check moisture levels and adjust equipment until the structure is dry.' },
    { step: 7, heading: 'Restoration', body: 'Once dry, we restore or repair damaged materials — drywall, flooring, cabinets — returning your property to pre-loss condition.' },
  ];

  const locH2 = content?.locationsSection?.h2 || `Serving ${data.city} and Surrounding Communities`;
  const locBody = content?.locationsSection?.body || data._locationsBody || `${data.businessName} provides professional ${data.primaryKeyword.toLowerCase()} services across ${data.city} and the surrounding region. Our crews are strategically positioned to reach most areas quickly. Whether you are in the heart of ${data.city} or a neighboring suburb, we are your local ${data.primaryKeyword.toLowerCase()} team.`;

  const locationLinks = content?.locationsSection?.locationLinks?.length
    ? content.locationsSection.locationLinks
    : data.serviceAreas.map(l => ({ city: l, anchor: l, slug: `locations/${slugify(l)}.html` }));

  const faqH2 = content?.faqSection?.h2 || data._faqH2 || `Frequently Asked Questions About ${data.primaryKeyword} in ${data.city}`;
  const faqs = content?.faqSection?.faqs || data._faqs || [
    { question: `How quickly can you respond in ${data.city}?`, answer: `Our ${data.city} team is available 24 hours a day, 7 days a week. We typically arrive quickly after your call, depending on your location.` },
    { question: `What areas in ${data.city} do you serve?`, answer: `We serve all areas within ${data.city} as well as surrounding communities including ${data.serviceAreas.slice(0, 5).join(', ')}. Call us to confirm coverage in your specific neighborhood.` },
    { question: `Are you licensed and insured?`, answer: `Yes. ${data.businessName} is fully licensed and insured. We follow all local regulations and industry standards on every job.` },
    { question: `Do you offer free estimates?`, answer: `Yes. We provide free on-site assessments and written estimates before any work begins. There are no surprise charges.` },
    { question: `What payment methods do you accept?`, answer: `We accept all major credit cards, cash, and checks. Financing options may be available — call us for details.` },
  ];

  const ctaH2 = content?.finalCTA?.h2 || data._ctaHeadline || `Need ${data.primaryKeyword} in ${data.city}? Call Now`;
  const ctaBody = content?.finalCTA?.body || data._ctaSubtext || `Don't wait. Contact ${data.businessName} now for immediate assistance. We are available 24/7 for emergency response throughout ${data.city}.`;
  const ctaBtn = content?.finalCTA?.ctaButton || data._ctaButton || 'Call for Emergency Help';

  const seoH2 = content?.seoFootnote?.h2 || `${data.primaryKeyword} - ${data.city}, ${data.state}`;
  const seoBody = content?.seoFootnote?.body || data._seoBody || `${data.businessName} is ${data.city}'s trusted ${data.primaryKeyword.toLowerCase()} company. We provide comprehensive ${data.primaryKeyword.toLowerCase()} services to homeowners and businesses throughout ${data.city} and the surrounding region. Our licensed, insured team delivers fast, professional results on every job.`;

  const servicesCardsHTML = serviceCards.map(card => `
      <article class="service-card" data-placeholder-section="service-${slugify(card.service)}">
        <h3>${card.h3}</h3>
        <p>${card.description}</p>
        <a href="${prefix}${card.internalLink.slug}" class="service-card-link">${card.internalLink.anchor} →</a>
      </article>`).join('');

  const whyPointsHTML = whyPoints.map(pt => `
      <div class="why-us-item">
        <span class="why-us-icon" aria-hidden="true">${iconToEmoji(pt.icon)}</span>
        <div>
          <h3>${pt.heading}</h3>
          <p>${pt.body}</p>
        </div>
      </div>`).join('');

  const processStepsHTML = processSteps.map(step => `
      <div class="process-step">
        <h3>${step.heading}</h3>
        <p>${step.body}</p>
      </div>`).join('');

  const locationLinksHTML = locationLinks.map(loc => `
      <a href="${prefix}${loc.slug}" class="location-link">${loc.anchor}</a>`).join('');

  const faqsHTML = faqs.map(faq => `
      <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
        <button class="faq-question" itemprop="name">${faq.question}</button>
        <div class="faq-answer" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <span itemprop="text">${faq.answer}</span>
        </div>
      </div>`).join('');

  const introParagraphsHTML = introParas.map(p => `<p>${p}</p>`).join('');

  const contactSection = data.contactFormEmbed
    ? `<section class="contact-section" id="contact">
        <div class="container">
          <h2>Contact ${data.businessName}</h2>
          <div class="contact-grid">
            <div class="contact-info">
              <h3>Get in Touch</h3>
              <p>For emergencies, call us immediately. For non-urgent inquiries, fill out the form and we'll respond promptly.</p>
              <div class="contact-item">
                <span class="contact-icon">📞</span>
                <div>
                  <strong>Phone (24/7)</strong><br>
                  <a href="tel:${data.countryCode || '+1'}${data.phone.replace(/\D/g, '')}">${data.phone}</a>
                </div>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📍</span>
                <div>
                  <strong>Address</strong><br>
                  ${data.address}, ${data.city}, ${data.state}
                </div>
              </div>
              ${data.email ? `<div class="contact-item"><span class="contact-icon">✉</span><div><strong>Email</strong><br><a href="mailto:${data.email}">${data.email}</a></div></div>` : ''}
            </div>
            <div class="contact-form-embed">
              ${data.contactFormEmbed}
            </div>
          </div>
        </div>
      </section>`
    : '';

  const body = `
  ${generateNav(data)}

  <!-- ── Hero ─────────────────────────────────────────── -->
  <section class="hero" role="banner">
    <div class="hero-inner">
      <div class="hero-content">
        ${data._emergencyBadge || data._categoryId ? `<span class="hero-badge">${data._emergencyBadge || '24/7 Emergency Response'}</span>` : '<span class="hero-badge">24/7 Emergency Response</span>'}
        <h1>${h1}</h1>
        <p class="hero-sub">${heroSub}</p>
        <div class="hero-actions">
          <a href="tel:${data.countryCode || '+1'}${data.phone.replace(/\D/g, '')}" class="btn-primary">📞 Call ${data.phone}</a>
          <a href="#contact" class="btn-secondary">Get Free Estimate</a>
        </div>
        <p class="hero-trust">${(data._trustBadges || ['Licensed', 'Insured', 'Certified']).join(' • ')}</p>
      </div>
      <div class="hero-cta-card" aria-label="Emergency contact">
        <h3>🚨 ${data._ctaHeadline || `${data.primaryKeyword} Emergency?`}</h3>
        <a href="tel:${data.countryCode || '+1'}${data.phone.replace(/\D/g, '')}" class="hero-cta-phone">${data.phone}</a>
        <p class="hero-cta-divider">or</p>
        <a href="#contact" class="hero-cta-form-btn">Request a Callback</a>
      </div>
    </div>
  </section>

  <!-- ── Intro ─────────────────────────────────────────── -->
  <section id="about" aria-labelledby="intro-heading">
    <div class="container">
      <h2 id="intro-heading">${introH2}</h2>
      ${introParagraphsHTML}
    </div>
  </section>

  <!-- ── Services ──────────────────────────────────────── -->
  <section id="services" aria-labelledby="services-heading">
    <div class="container">
      <h2 id="services-heading">${servH2}</h2>
      <p class="section-intro">${servIntro}</p>
      <div class="services-grid">
        ${servicesCardsHTML}
      </div>
    </div>
  </section>

  <!-- ── Why Us ─────────────────────────────────────────── -->
  <section aria-labelledby="why-heading">
    <div class="container">
      <h2 id="why-heading">${whyH2}</h2>
      <div class="why-us-grid">
        ${whyPointsHTML}
      </div>
    </div>
  </section>

  <!-- ── Process ───────────────────────────────────────── -->
  <section aria-labelledby="process-heading">
    <div class="container">
      <h2 id="process-heading">${processH2}</h2>
      <p class="section-intro">Here's exactly what happens when you call ${data.businessName} for ${data.primaryKeyword.toLowerCase()} in ${data.city}.</p>
      <div class="process-steps">
        ${processStepsHTML}
      </div>
    </div>
  </section>

  <!-- ── Placeholder Image ─────────────────────────────── -->
  <section style="padding: 0;" aria-hidden="true">
    <div class="container" style="padding-top: 2rem; padding-bottom: 2rem;">
      <img
        src="${data.customImages?.['main-image'] || (data as any)._categoryImages?.['main-image'] || WD_PLACEHOLDER_IMAGES.team}"
        alt="PLACEHOLDER: Replace with a photo of your team or equipment — add descriptive alt text for SEO"
        class="placeholder-img"
        data-placeholder="main-image"
        style="max-height: 420px; object-fit: cover;"
        loading="lazy"
        width="1200"
        height="420"
      >
      <p class="img-caption">📷 Replace this placeholder image with a real photo of your team or work</p>
    </div>
  </section>

  <!-- ── Service Areas ─────────────────────────────────── -->
  <section aria-labelledby="locations-heading">
    <div class="container">
      <h2 id="locations-heading">${locH2}</h2>
      <p>${locBody}</p>
      <div class="locations-grid">
        ${locationLinksHTML}
      </div>
    </div>
  </section>

  <!-- ── FAQ ───────────────────────────────────────────── -->
  <section id="faq" aria-labelledby="faq-heading">
    <div class="container">
      <h2 id="faq-heading" class="text-center">${faqH2}</h2>
      <div class="faq-list" role="list">
        ${faqsHTML}
      </div>
    </div>
  </section>

  <!-- ── SEO Footnote ───────────────────────────────────── -->
  <section aria-label="About our services">
    <div class="container">
      <h2>${seoH2}</h2>
      <p style="color:#475569;">${seoBody}</p>
    </div>
  </section>

  <!-- ── CTA ───────────────────────────────────────────── -->
  <section class="cta-section" aria-labelledby="cta-heading">
    <div class="container">
      <h2 id="cta-heading">${ctaH2}</h2>
      <p>${ctaBody}</p>
      <div class="cta-actions">
        <a href="tel:${data.countryCode || '+1'}${data.phone.replace(/\D/g, '')}" class="btn-primary">📞 ${ctaBtn}</a>
        <a href="#contact" class="btn-secondary">Send Us a Message</a>
      </div>
    </div>
  </section>

  ${contactSection}

  ${generateFooter(data)}`;

  const canonicalUrl = `https://${domain}.netlify.app/`;

  return htmlShell({
    metaTitle: content?.metaTitle || `${data.primaryKeyword} in ${data.city} | ${data.businessName}`,
    metaDescription: content?.metaDescription || `${data.businessName} provides professional ${data.primaryKeyword.toLowerCase()} services in ${data.city}, ${data.state}. Available 24/7 for emergencies. Call ${data.phone}.`,
    canonicalUrl,
    theme: resolveTheme(data),
    schemaBlocks: [
      generateLocalBusinessSchema(data, `${domain}.netlify.app`),
      generateWebSiteSchema(data, domain),
      generateFAQSchema(faqs),
    ],
    bodyContent: body,
    ogImage: data.logoUrl || undefined,
    googleVerification: data.googleVerificationCode || undefined,
    googleAnalyticsId: data.googleAnalyticsId || undefined,
    faviconUrl: data.faviconUrl || undefined,
    customHeadCode: data.customHeadCode || undefined,
  });
}

// ─── SERVICE PAGE ──────────────────────────────────────────────────────────

export function generateServicePage(
  data: WDBusinessData,
  service: string,
  domain: string
): string {
  const slug = slugify(service);
  const citySlug = slugify(data.city);
  const content = data.serviceContent?.[service];
  const prefix = '../';

  const h1 = content?.hero?.h1 || `${service} in ${data.city}, ${data.state}`;
  const heroSub = content?.hero?.subheadline || `Professional ${service.toLowerCase()} services for homeowners and businesses in ${data.city}. Fast response, certified technicians.`;
  const trustBadges = content?.hero?.trustBadges || data._trustBadges || ['Licensed & Insured', '24/7 Available', 'Free Estimates', 'Upfront Pricing'];

  const overviewH2 = content?.overviewSection?.h2 || `Professional ${service} in ${data.city} — What to Expect`;
  const overviewParas = content?.overviewSection?.body || [
    `${service} in ${data.city} requires licensed professionals with the right tools, training, and local experience. Whether it's an emergency or a planned project, ${data.businessName} responds fast and handles the job completely — protecting your property and your investment.`,
    `Our ${data.city} technicians diagnose the full scope of the problem before any work begins, giving you a clear picture and an honest written estimate. We address root causes, not just visible symptoms, so the problem doesn't come back.`,
    `${data.businessName} has built its reputation throughout ${data.city} on transparent pricing, quality workmanship, and results that last. When you need ${service.toLowerCase()} done right, one call is all it takes.`,
  ];

  const processH2 = content?.processSection?.h2 || `Our ${service} Process in ${data.city}`;
  const processIntro = content?.processSection?.intro || `Every ${service.toLowerCase()} project follows a systematic process to ensure thorough results.`;
  const processSteps = content?.processSection?.steps || data._processSteps || [
    { step: 1, heading: 'Contact & Dispatch', body: `When you call ${data.phone}, our dispatcher immediately routes the nearest available ${data.city} crew to your location.` },
    { step: 2, heading: 'Assessment', body: 'Our technicians inspect the situation thoroughly, document all findings, and explain exactly what needs to be done before any work begins.' },
    { step: 3, heading: 'Upfront Estimate', body: 'You receive a clear written estimate with no hidden fees. We never start work without your approval.' },
    { step: 4, heading: 'Professional Service', body: `We complete the ${service.toLowerCase()} work using quality materials and proven techniques, following all applicable codes and standards.` },
    { step: 5, heading: 'Final Walkthrough', body: 'We inspect the completed work with you, answer any questions, and ensure you are fully satisfied before we leave.' },
  ];

  const benefitsH2 = content?.benefitsSection?.h2 || data._servicePageBenefitsH2 || `Why Hire ${data.businessName} for ${service} in ${data.city}`;
  const benefitPoints = content?.benefitsSection?.points || data._servicePageBenefits || [
    { heading: `Licensed ${data.primaryKeyword} Professionals`, body: `Every technician is properly licensed and insured for ${service.toLowerCase()} work in ${data.state} — protecting you and your property on every job.` },
    { heading: 'Correct First Time', body: `We diagnose the root cause and fix it properly, so you're not calling us back for the same problem. Quality workmanship means long-lasting results.` },
    { heading: 'Upfront Written Estimates', body: `No surprise bills. You receive a clear, itemized written estimate before any work begins — and we never start without your approval.` },
    { heading: 'Protects Property Value', body: `Professionally completed and documented ${service.toLowerCase()} protects your ${data.city} property value and provides records that matter for insurance and resale.` },
    { heading: 'Faster Than DIY', body: `Our team arrives with the right tools and experience to complete ${service.toLowerCase()} faster and more thoroughly than DIY — with no risk of making the problem worse.` },
    { heading: '100% Satisfaction Guarantee', body: `We stand behind every job. If something isn't right after we leave, call us and we'll make it right — no excuses.` },
  ];

  const warningsH2 = content?.warningSignsSection?.h2 || `Signs You Need ${service} in ${data.city} Right Away`;
  const warningsIntro = content?.warningSignsSection?.intro || `Do not wait if you notice any of the following signs in your ${data.city} property. Early action saves time, money, and prevents bigger problems.`;
  const warningSigns = content?.warningSignsSection?.signs || [
    { sign: 'Visible damage or deterioration', body: 'Any obvious damage should be addressed promptly to prevent it from worsening and becoming more expensive to fix.' },
    { sign: 'Unusual odors or sounds', body: 'Strange odors or sounds often indicate a problem that is not immediately visible but needs professional attention.' },
    { sign: 'Rising utility bills', body: 'An unexplained increase in energy or water bills can be a sign of an underlying problem that needs to be diagnosed.' },
    { sign: 'Recurring issues', body: 'If the same problem keeps coming back, a professional assessment will identify the root cause and provide a lasting fix.' },
    { sign: 'Property age', body: 'Older properties often have systems and materials that need professional inspection and updating to remain safe and efficient.' },
    { sign: 'Post-storm or emergency event', body: 'After a major storm, flood, or fire event, a professional inspection helps identify damage that may not be immediately visible.' },
  ];

  const locationClusterH2 = content?.locationClusterSection?.h2 || `${service} Near You — Areas We Serve`;
  const locationClusterIntro = content?.locationClusterSection?.intro || `${data.businessName} provides ${service.toLowerCase()} throughout ${data.city} and the surrounding region.`;
  const locationCards = content?.locationClusterSection?.locationCards?.length
    ? content.locationClusterSection.locationCards
    : data.serviceAreas.map(loc => ({
        city: loc,
        anchor: `${service} in ${loc}`,
        slug: `../locations/${slugify(loc)}.html`,
        teaser: `Serving ${loc} homeowners and businesses with professional ${service.toLowerCase()}.`,
      }));

  const faqH2 = content?.faqSection?.h2 || `${service} in ${data.city} — Frequently Asked Questions`;
  const faqs = content?.faqSection?.faqs || [
    { question: `How much does ${service.toLowerCase()} cost in ${data.city}?`, answer: `The cost of ${service.toLowerCase()} depends on the scope of the work needed. We provide free on-site assessments and written estimates before any work begins — no surprises. Call us for an accurate quote for your specific situation.` },
    { question: `How long does ${service.toLowerCase()} take?`, answer: `Timelines vary depending on the size and complexity of the job. We will give you a realistic timeline during our initial assessment and keep you updated throughout the project.` },
    { question: `Can I do ${service.toLowerCase()} myself?`, answer: `Some minor issues can be addressed by homeowners, but most ${service.toLowerCase()} work requires professional tools, training, and experience to be done safely and correctly. Improper work can lead to bigger problems and higher costs — professional service is almost always the better investment.` },
    { question: `Will my insurance cover ${service.toLowerCase()} in ${data.city}?`, answer: `Coverage depends on your specific policy and the cause of the damage. We recommend contacting your insurance provider. We provide complete documentation to support your claim and can communicate with your adjuster if needed.` },
    { question: `Are you licensed and insured for ${service.toLowerCase()} in ${data.state}?`, answer: `Yes. ${data.businessName} is fully licensed and insured. All work is performed by qualified professionals following applicable codes and industry standards.` },
  ];

  const crossH2 = content?.crossLinkSection?.h2 || `Related ${data.primaryKeyword} Services`;
  const crossLinks = content?.crossLinkSection?.links?.length
    ? content.crossLinkSection.links
    : data.services
        .filter(s => s !== service)
        .slice(0, 4)
        .map(s => ({
          service: s,
          anchor: s,
          slug: `../services/${slugify(s)}-${citySlug}.html`,
          reason: `Often needed alongside ${service.toLowerCase()}`,
        }));

  const ctaH2 = content?.finalCTA?.h2 || `Get Professional ${service} in ${data.city} Today`;
  const ctaBody = content?.finalCTA?.body || `${data.businessName} is ready to respond to your ${service.toLowerCase()} needs in ${data.city}. Call now for immediate assistance or submit a request for non-emergency services.`;

  // Build HTML sections
  const overviewHTML = overviewParas.map(p => `<p>${p}</p>`).join('');

  const processStepsHTML = processSteps.map(step => `
    <div class="process-step">
      <h3>${step.heading}</h3>
      <p>${step.body}</p>
    </div>`).join('');

  const benefitsHTML = benefitPoints.map(pt => `
    <div class="benefit-item">
      <h3>${pt.heading}</h3>
      <p>${pt.body}</p>
    </div>`).join('');

  const warningsHTML = warningSigns.map(w => `
    <div class="warning-item">
      <h3>${w.sign}</h3>
      <p>${w.body}</p>
    </div>`).join('');

  const locationCardsHTML = locationCards.map(loc => `
    <a href="${loc.slug}" class="location-link">${loc.city}</a>`).join('');

  const faqsHTML = faqs.map(faq => `
    <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <button class="faq-question" itemprop="name">${faq.question}</button>
      <div class="faq-answer" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
        <span itemprop="text">${faq.answer}</span>
      </div>
    </div>`).join('');

  const crossLinksHTML = crossLinks.map(link => `
    <div class="related-card">
      <h3><a href="${link.slug}">${link.anchor}</a></h3>
      <p>${link.reason}</p>
    </div>`).join('');

  const trustBadgesHTML = trustBadges.map(b => `<span class="trust-badge">${b}</span>`).join('');

  const canonicalUrl = `https://${domain}.netlify.app/services/${slug}-${citySlug}.html`;

  const body = `
  ${generateNav(data, `services/`)}

  <div class="breadcrumb container">
    <a href="../index.html">Home</a>
    <span>›</span>
    <a href="../index.html#services">Services</a>
    <span>›</span>
    <span aria-current="page">${service}</span>
  </div>

  <!-- ── Page Hero ──────────────────────────────── -->
  <section class="page-hero" role="banner">
    <div class="container">
      <h1>${h1}</h1>
      <p>${heroSub}</p>
      <div class="trust-badges">${trustBadgesHTML}</div>
      <div style="margin-top:1.5rem; display:flex; gap:1rem; flex-wrap:wrap;">
        <a href="tel:${data.countryCode || '+1'}${data.phone.replace(/\D/g, '')}" class="btn-primary">📞 Call ${data.phone}</a>
        <a href="../index.html#contact" class="btn-secondary">Get Free Estimate</a>
      </div>
    </div>
  </section>

  <!-- ── Overview ───────────────────────────────── -->
  <section class="content-section" aria-labelledby="overview-heading">
    <div class="container">
      <h2 id="overview-heading">${overviewH2}</h2>
      ${overviewHTML}
    </div>
  </section>

  <!-- ── Placeholder Image ─────────────────────── -->
  <div class="container" style="padding-bottom:2rem;">
    <img
      src="${data.customImages?.['service-image-' + slug] || data.customImages?.['service-image'] || (data as any)._categoryImages?.['service-image'] || WD_PLACEHOLDER_IMAGES.equipment}"
      alt="PLACEHOLDER: Replace with a photo showing your ${service.toLowerCase()} work or equipment — use descriptive alt text"
      class="placeholder-img"
      data-placeholder="service-image-${slug}"
      style="max-height:380px; object-fit:cover;"
      loading="lazy"
      width="1200"
      height="380"
    >
    <p class="img-caption">📷 Replace this with a real photo of your ${service.toLowerCase()} work</p>
  </div>

  <!-- ── Process ────────────────────────────────── -->
  <section class="content-section" aria-labelledby="process-heading" style="background:#f8fafc;">
    <div class="container">
      <h2 id="process-heading">${processH2}</h2>
      <p class="section-intro">${processIntro}</p>
      <div class="process-steps">
        ${processStepsHTML}
      </div>
    </div>
  </section>

  <!-- ── Benefits ───────────────────────────────── -->
  <section class="content-section" aria-labelledby="benefits-heading">
    <div class="container">
      <h2 id="benefits-heading">${benefitsH2}</h2>
      <div class="benefits-grid">
        ${benefitsHTML}
      </div>
    </div>
  </section>

  <!-- ── Warning Signs ─────────────────────────── -->
  <section class="content-section" aria-labelledby="warnings-heading" style="background:#f8fafc;">
    <div class="container">
      <h2 id="warnings-heading">${warningsH2}</h2>
      <p class="section-intro">${warningsIntro}</p>
      <div class="warnings-grid">
        ${warningsHTML}
      </div>
    </div>
  </section>

  <!-- ── Service Areas ─────────────────────────── -->
  <section class="content-section" aria-labelledby="cluster-heading">
    <div class="container">
      <h2 id="cluster-heading">${locationClusterH2}</h2>
      <p>${locationClusterIntro}</p>
      <div class="locations-grid">
        ${locationCardsHTML}
      </div>
    </div>
  </section>

  <!-- ── FAQ ────────────────────────────────────── -->
  <section class="content-section" id="faq" aria-labelledby="faq-heading" style="background:#f8fafc;">
    <div class="container">
      <h2 id="faq-heading" class="text-center">${faqH2}</h2>
      <div class="faq-list">
        ${faqsHTML}
      </div>
    </div>
  </section>

  <!-- ── Related Services ──────────────────────── -->
  <section class="content-section" aria-labelledby="related-heading">
    <div class="container">
      <h2 id="related-heading">${crossH2}</h2>
      <div class="related-grid">
        ${crossLinksHTML}
      </div>
    </div>
  </section>

  <!-- ── CTA ────────────────────────────────────── -->
  <section class="cta-section" aria-labelledby="cta-heading">
    <div class="container">
      <h2 id="cta-heading">${ctaH2}</h2>
      <p>${ctaBody}</p>
      <div class="cta-actions">
        <a href="tel:${data.countryCode || '+1'}${data.phone.replace(/\D/g, '')}" class="btn-primary">📞 Call Now</a>
        <a href="../index.html#contact" class="btn-secondary">Send a Message</a>
      </div>
    </div>
  </section>

  ${generateFooter(data, 'services/')}`;

  return htmlShell({
    metaTitle: content?.metaTitle || `${service} in ${data.city} | ${data.businessName}`,
    metaDescription: content?.metaDescription || `${data.businessName} provides professional ${service.toLowerCase()} in ${data.city}, ${data.state}. ${(data._trustBadges || ['Licensed & Insured'])[0]}. Free estimates — call ${data.phone} today.`,
    canonicalUrl,
    theme: resolveTheme(data),
    googleAnalyticsId: data.googleAnalyticsId || undefined,
    faviconUrl: data.faviconUrl || undefined,
    customHeadCode: data.customHeadCode || undefined,
    schemaBlocks: [
      generateFAQSchema(faqs),
      generateBreadcrumbSchema([
        { name: 'Home', url: `https://${domain}.netlify.app/` },
        { name: 'Services', url: `https://${domain}.netlify.app/#services` },
        { name: service, url: canonicalUrl },
      ]),
    ],
    bodyContent: body,
  });
}

// ─── LOCATION PAGE ─────────────────────────────────────────────────────────

export function generateLocationPage(
  data: WDBusinessData,
  city: string,
  domain: string
): string {
  const citySlug = slugify(city);
  const content = data.locationContent?.[city];
  const prefix = '../';

  const h1 = content?.hero?.h1 || `${data.primaryKeyword} in ${city}, ${data.state}`;
  const heroSub = content?.hero?.subheadline || `${data.businessName} provides fast, professional ${data.primaryKeyword.toLowerCase()} services in ${city}. Call now for a free estimate.`;
  const trustBadges = content?.hero?.trustBadges || data._trustBadges || ['Licensed & Insured', 'Free Estimates', 'Upfront Pricing', '24/7 Available'];

  const introH2 = content?.localIntroSection?.h2 || `${data.businessName} — ${data.primaryKeyword} Experts in ${city}`;
  const introParas = content?.localIntroSection?.paragraphs || [
    `When you need ${data.primaryKeyword.toLowerCase()} in ${city}, fast professional response makes the difference. ${data.businessName} serves homeowners and businesses throughout ${city} with expert service, licensed technicians, and upfront pricing.`,
    `Our team knows ${city} — the local properties, common issues, and what it takes to get the job done right. This local expertise means faster service and better results for your specific situation.`,
    `${data.businessName} works with all major insurance providers when applicable and can guide you through the process from start to finish. We document everything to support your claim and keep you informed every step of the way.`,
  ];

  const servCityH2 = content?.servicesInCitySection?.h2 || `Our ${data.primaryKeyword} Services in ${city}`;
  const servCityIntro = content?.servicesInCitySection?.intro || `${data.businessName} provides a full range of professional ${data.primaryKeyword.toLowerCase()} services to homeowners and businesses throughout ${city} and surrounding areas.`;
  const serviceCards = content?.servicesInCitySection?.serviceCards?.length
    ? content.servicesInCitySection.serviceCards
    : data.services.map(s => ({
        service: s,
        h3: `${s} in ${city}`,
        description: `Professional ${s.toLowerCase()} for ${city} homeowners and businesses. Fast response, certified technicians.`,
        internalLink: { anchor: `${s} in ${city}`, slug: `../services/${slugify(s)}-${slugify(data.city)}.html` },
      }));

  const whyLocalH2 = content?.whyLocalSection?.h2 || `Why ${city} Residents Trust ${data.businessName}`;
  const whyLocalPoints = content?.whyLocalSection?.points || [
    { heading: `Local ${city} Knowledge`, body: `We understand the specific needs of ${city} properties and deliver service that's tailored to local conditions and requirements.` },
    { heading: 'Rapid Response Time', body: `Our crews are positioned to reach ${city} properties quickly — because fast service often means better outcomes.` },
    { heading: 'Community Reputation', body: `${data.businessName} has earned the trust of ${city} homeowners through honest assessments, upfront pricing, and professional results.` },
    { heading: 'Complete Service', body: `We handle every phase of the job in-house — no subcontracting — so you deal with one team from start to finish.` },
  ];

  const areasH2 = content?.localAreaSection?.h2 || `Areas and Neighborhoods We Serve in ${city}`;
  const areasBody = content?.localAreaSection?.body || `${data.businessName} serves all neighborhoods and districts within ${city}. Our response coverage includes the greater ${city} area, surrounding communities, and neighboring ZIP codes. If you are unsure whether we cover your location, call us at ${data.phone} — we will give you an honest answer.`;

  const faqH2 = content?.faqSection?.h2 || `${data.primaryKeyword} in ${city} — Common Questions`;
  const faqs = content?.faqSection?.faqs || [
    { question: `How fast can you respond in ${city}?`, answer: `Our ${city} team is available around the clock. Response times depend on your location and current demand — we will give you an honest ETA when you call.` },
    { question: `Do you serve all of ${city}?`, answer: `Yes. We serve all areas within ${city} as well as surrounding communities. If you are unsure whether we cover your specific location, just call us and we will confirm immediately.` },
    { question: `Does ${data.businessName} work with insurance companies?`, answer: `Yes. We work with all major insurance carriers. We provide complete documentation to support your claim and can communicate directly with your adjuster if you prefer.` },
    { question: `How long will the job take in my ${city} property?`, answer: `Timelines depend on the scope of the work. We provide a realistic estimate during our initial assessment and keep you updated throughout the process.` },
    { question: `Do you provide free estimates in ${city}?`, answer: `Yes. We offer free on-site assessments with no obligation. A technician will inspect the situation and provide a written estimate before any work begins.` },
    { question: `Are you licensed and insured in ${data.state}?`, answer: `Yes. ${data.businessName} is fully licensed and insured in ${data.state}. All work is performed by qualified professionals following applicable codes and industry standards.` },
  ];

  const ctaH2 = content?.finalCTA?.h2 || `Need ${data.primaryKeyword} in ${city}? Contact Us Now`;
  const ctaBody = content?.finalCTA?.body || `${data.businessName} is ready to help ${city} homeowners and businesses with professional ${data.primaryKeyword.toLowerCase()}. Call now or submit a request and we will follow up promptly.`;

  // Build HTML sections
  const introParagraphsHTML = introParas.map(p => `<p>${p}</p>`).join('');

  const serviceCardsHTML = serviceCards.map(card => `
    <article class="service-card">
      <h3>${card.h3}</h3>
      <p>${card.description}</p>
      <a href="${card.internalLink.slug}" class="service-card-link">${card.internalLink.anchor} →</a>
    </article>`).join('');

  const whyLocalHTML = whyLocalPoints.map(pt => `
    <div class="benefit-item">
      <h3>${pt.heading}</h3>
      <p>${pt.body}</p>
    </div>`).join('');

  const faqsHTML = faqs.map(faq => `
    <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <button class="faq-question" itemprop="name">${faq.question}</button>
      <div class="faq-answer" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
        <span itemprop="text">${faq.answer}</span>
      </div>
    </div>`).join('');

  const trustBadgesHTML = trustBadges.map(b => `<span class="trust-badge">${b}</span>`).join('');

  const nearbyLocationsHTML = data.serviceAreas
    .filter(l => l.toLowerCase() !== city.toLowerCase())
    .slice(0, 8)
    .map(l => `<a href="${prefix}locations/${slugify(l)}.html" class="location-link">${l}</a>`)
    .join('');

  const canonicalUrl = `https://${domain}.netlify.app/locations/${citySlug}.html`;

  const body = `
  ${generateNav(data, `locations/`)}

  <div class="breadcrumb container">
    <a href="../index.html">Home</a>
    <span>›</span>
    <span>Service Areas</span>
    <span>›</span>
    <span aria-current="page">${city}</span>
  </div>

  <!-- ── Page Hero ──────────────────────────────── -->
  <section class="page-hero" role="banner">
    <div class="container">
      <h1>${h1}</h1>
      <p>${heroSub}</p>
      <div class="trust-badges">${trustBadgesHTML}</div>
      <div style="margin-top:1.5rem; display:flex; gap:1rem; flex-wrap:wrap;">
        <a href="tel:${data.countryCode || '+1'}${data.phone.replace(/\D/g, '')}" class="btn-primary">📞 Call ${data.phone}</a>
        <a href="../index.html#contact" class="btn-secondary">Get Free Estimate</a>
      </div>
    </div>
  </section>

  <!-- ── Local Intro ────────────────────────────── -->
  <section class="content-section" aria-labelledby="intro-heading">
    <div class="container">
      <h2 id="intro-heading">${introH2}</h2>
      ${introParagraphsHTML}
    </div>
  </section>

  <!-- ── Placeholder Image ─────────────────────── -->
  <div class="container" style="padding-bottom:2rem;">
    <img
      src="${data.customImages?.['location-image-' + citySlug] || data.customImages?.['location-image'] || (data as any)._categoryImages?.['location-image'] || WD_PLACEHOLDER_IMAGES.drying}"
      alt="PLACEHOLDER: Replace with a photo of your ${city} team or a recent project — add specific alt text"
      class="placeholder-img"
      data-placeholder="location-image-${citySlug}"
      style="max-height:360px; object-fit:cover;"
      loading="lazy"
      width="1200"
      height="360"
    >
    <p class="img-caption">📷 Replace this with a real photo from your ${city} work</p>
  </div>

  <!-- ── Services in City ───────────────────────── -->
  <section class="content-section" style="background:#f8fafc;" aria-labelledby="serv-city-heading">
    <div class="container">
      <h2 id="serv-city-heading">${servCityH2}</h2>
      <p class="section-intro">${servCityIntro}</p>
      <div class="services-grid">
        ${serviceCardsHTML}
      </div>
    </div>
  </section>

  <!-- ── Why Local ──────────────────────────────── -->
  <section class="content-section" aria-labelledby="why-local-heading">
    <div class="container">
      <h2 id="why-local-heading">${whyLocalH2}</h2>
      <div class="benefits-grid">
        ${whyLocalHTML}
      </div>
    </div>
  </section>

  <!-- ── Areas Covered ─────────────────────────── -->
  <section class="content-section" style="background:#f8fafc;" aria-labelledby="areas-heading">
    <div class="container">
      <h2 id="areas-heading">${areasH2}</h2>
      <p style="color:#475569;">${areasBody}</p>
      ${nearbyLocationsHTML ? `<div class="locations-grid" style="margin-top:1.5rem;">${nearbyLocationsHTML}</div>` : ''}
    </div>
  </section>

  <!-- ── FAQ ────────────────────────────────────── -->
  <section class="content-section" id="faq" aria-labelledby="faq-heading">
    <div class="container">
      <h2 id="faq-heading" class="text-center">${faqH2}</h2>
      <div class="faq-list">
        ${faqsHTML}
      </div>
    </div>
  </section>

  <!-- ── CTA ────────────────────────────────────── -->
  <section class="cta-section" aria-labelledby="cta-heading">
    <div class="container">
      <h2 id="cta-heading">${ctaH2}</h2>
      <p>${ctaBody}</p>
      <div class="cta-actions">
        <a href="tel:${data.countryCode || '+1'}${data.phone.replace(/\D/g, '')}" class="btn-primary">📞 Call Now</a>
        <a href="../index.html#contact" class="btn-secondary">Send a Message</a>
      </div>
    </div>
  </section>

  ${generateFooter(data, 'locations/')}`;

  return htmlShell({
    metaTitle: content?.metaTitle || `${data.primaryKeyword} in ${city} | ${data.businessName}`,
    metaDescription: content?.metaDescription || `Professional ${data.primaryKeyword.toLowerCase()} in ${city}, ${data.state}. ${data.businessName} — licensed & insured, free estimates. Call ${data.phone}.`,
    canonicalUrl,
    theme: resolveTheme(data),
    googleAnalyticsId: data.googleAnalyticsId || undefined,
    faviconUrl: data.faviconUrl || undefined,
    customHeadCode: data.customHeadCode || undefined,
    schemaBlocks: [
      generateFAQSchema(faqs),
      generateBreadcrumbSchema([
        { name: 'Home', url: `https://${domain}.netlify.app/` },
        { name: 'Service Areas', url: `https://${domain}.netlify.app/#locations` },
        { name: city, url: canonicalUrl },
      ]),
    ],
    bodyContent: body,
  });
}

// ─── ABOUT PAGE ────────────────────────────────────────────────────────────

export function generateAboutPage(data: WDBusinessData, domain: string): string {
  const theme = resolveTheme(data);
  const canonicalUrl = `https://${domain}.netlify.app/about.html`;
  const yearsText = data.yearsInBusiness ? `With ${data.yearsInBusiness} years of experience` : 'With years of experience';

  const aboutText = data.aboutContent ||
    `${data.businessName} was founded to give homeowners and businesses in ${data.city} a ${data.primaryKeyword.toLowerCase()} company they could genuinely trust. Too many property owners have been let down by contractors who cut corners, gave vague estimates, or disappeared after collecting payment.

We built this company differently. Every technician we hire is properly licensed and trained before they set foot on a customer's property. Every project is documented thoroughly so you always know exactly what was done and why.

${data.businessName} serves all of ${data.city} and surrounding communities. We handle everything from first call to final walkthrough — delivering professional results and honest service every time.`;

  const teamText = data.teamDescription ||
    `Our team is made up of licensed professionals, not day laborers or subcontractors. Every person on our crew has been trained to the highest standards in their field. When you call ${data.businessName}, you get people who know what they are doing and take your property seriously.`;

  const body = `
  ${generateNav(data)}

  <div class="breadcrumb container">
    <a href="index.html">Home</a>
    <span>›</span>
    <span aria-current="page">About Us</span>
  </div>

  <section class="page-hero" role="banner">
    <div class="container">
      <h1>About ${data.businessName}</h1>
      <p>${data.primaryKeyword} — built on certified expertise, honest assessments, and thorough results.</p>
    </div>
  </section>

  <section class="content-section">
    <div class="container" style="display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:start;">
      <div>
        <h2>Our Story</h2>
        ${aboutText.split('\n\n').map(p => `<p style="color:#475569;">${p.trim()}</p>`).join('')}
      </div>
      <div>
        <img
          src="${data.customImages?.['about-team-photo'] || data.customImages?.['about-image'] || (data as any)._categoryImages?.['about-team-photo'] || WD_PLACEHOLDER_IMAGES.team}"
          alt="PLACEHOLDER: Replace with a real photo of your team or office"
          class="placeholder-img"
          data-placeholder="about-team-photo"
          style="border-radius:10px;"
          loading="lazy"
          width="600"
          height="420"
        >
        <p class="img-caption">📷 Replace with a real photo of your team</p>
      </div>
    </div>
  </section>

  <section class="content-section" style="background:#f8fafc;">
    <div class="container">
      <h2>Our Team</h2>
      <p style="color:#475569;max-width:760px;">${teamText}</p>
      <div class="why-us-grid" style="margin-top:2rem;">
        <div class="why-us-item">
          <span class="why-us-icon">🎓</span>
          <div>
            <h3>Licensed &amp; Trained Technicians</h3>
            <p>All field technicians hold proper licenses and certifications for ${data.primaryKeyword.toLowerCase()} work in ${data.state}.</p>
          </div>
        </div>
        <div class="why-us-item">
          <span class="why-us-icon">📋</span>
          <div>
            <h3>Licensed &amp; Insured</h3>
            <p>Fully licensed to operate in ${data.state} and carrying comprehensive liability insurance on every project.${data.licenseNumber ? ` License: ${data.licenseNumber}.` : ''}</p>
          </div>
        </div>
        <div class="why-us-item">
          <span class="why-us-icon">🏆</span>
          <div>
            <h3>${yearsText}</h3>
            <p>Hundreds of ${data.city} jobs completed. Our experience means fewer surprises and better outcomes for every customer.</p>
          </div>
        </div>
        <div class="why-us-item">
          <span class="why-us-icon">🤝</span>
          <div>
            <h3>Insurance Claim Experts</h3>
            <p>We work directly with adjusters from all major carriers, providing complete documentation that supports your claim from day one.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <h2>Our Certifications &amp; Standards</h2>
      <p style="color:#475569;max-width:760px;">${data.primaryKeyword} requires specialized knowledge, proper licensing, and adherence to industry standards. Our certifications and training ensure that every job is approached with the technical rigor and professionalism it requires.</p>
      <div class="benefits-grid" style="margin-top:1.5rem;">
        <div class="benefit-item">
          <h3>State Licensed &amp; Insured</h3>
          <p>Fully licensed to operate in ${data.state} with comprehensive liability and workers' compensation insurance on every project.${data.licenseNumber ? ` License #${data.licenseNumber}.` : ''}</p>
        </div>
        <div class="benefit-item">
          <h3>Industry Certified</h3>
          <p>Our technicians hold relevant industry certifications and complete ongoing training to stay current with best practices and code requirements.</p>
        </div>
        <div class="benefit-item">
          <h3>Code Compliant</h3>
          <p>All work follows applicable local, state, and national codes and standards. Permits are pulled when required, providing proper documentation for your records.</p>
        </div>
        <div class="benefit-item">
          <h3>Background Checked</h3>
          <p>Every technician is background-checked before joining our team. You can trust the professionals we send to your home or business.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="content-section" style="background:#f8fafc;">
    <div class="container">
      <h2>Service Area: ${data.city} and Surrounding Communities</h2>
      <p style="color:#475569;">We provide ${data.primaryKeyword.toLowerCase()} services throughout ${data.city}, ${data.state} and the surrounding region. Our crews are positioned for fast response across our full service area.</p>
      <div class="locations-grid" style="margin-top:1.5rem;">
        ${data.serviceAreas.map(l => `<a href="locations/${slugify(l)}.html" class="location-link">${l}</a>`).join('')}
      </div>
    </div>
  </section>

  <section class="cta-section" aria-labelledby="cta-heading">
    <div class="container">
      <h2 id="cta-heading">Ready to Work With a Team You Can Trust?</h2>
      <p>Call ${data.businessName} for immediate help or to schedule a free assessment.</p>
      <div class="cta-actions">
        <a href="tel:${data.countryCode || '+1'}${data.phone.replace(/\D/g, '')}" class="btn-primary">📞 Call ${data.phone}</a>
        <a href="contact.html" class="btn-secondary">Contact Us</a>
      </div>
    </div>
  </section>

  ${generateFooter(data)}`;

  return htmlShell({
    metaTitle: `About ${data.businessName} | ${data.primaryKeyword} in ${data.city}`,
    metaDescription: `Learn about ${data.businessName} — licensed ${data.primaryKeyword.toLowerCase()} in ${data.city}, ${data.state}. ${yearsText} serving homeowners and businesses.`,
    canonicalUrl,
    theme,
    googleAnalyticsId: data.googleAnalyticsId || undefined,
    faviconUrl: data.faviconUrl || undefined,
    customHeadCode: data.customHeadCode || undefined,
    schemaBlocks: [generateLocalBusinessSchema(data, `${domain}.netlify.app`)],
    bodyContent: body,
  });
}

// ─── CONTACT PAGE ──────────────────────────────────────────────────────────

export function generateContactPage(data: WDBusinessData, domain: string): string {
  const theme = resolveTheme(data);
  const canonicalUrl = `https://${domain}.netlify.app/contact.html`;

  const formSection = data.contactFormEmbed
    ? data.contactFormEmbed
    : `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:2rem;text-align:center;">
        <p style="color:#475569;margin-bottom:1rem;">Contact form will appear here after setup.</p>
        <p style="color:#64748b;font-size:.9rem;">To add a form, paste your embed code (Typeform, JotForm, Gravity Forms, etc.) in the dashboard editor.</p>
      </div>`;

  const body = `
  ${generateNav(data)}

  <div class="breadcrumb container">
    <a href="index.html">Home</a>
    <span>›</span>
    <span aria-current="page">Contact</span>
  </div>

  <section class="page-hero" role="banner">
    <div class="container">
      <h1>Contact ${data.businessName}</h1>
      <p>For emergencies, call us immediately — we are available 24/7. For non-urgent inquiries, use the form below.</p>
    </div>
  </section>

  <!-- Emergency Banner -->
  <div style="background:#dc2626;color:#fff;padding:1.25rem 0;text-align:center;">
    <div class="container">
      <strong>🚨 ${data._emergencyBadge || data.primaryKeyword + ' Emergency'}?</strong> Don't wait — call us now:
      <a href="tel:${data.countryCode || '+1'}${data.phone.replace(/\D/g, '')}" style="color:#fff;font-size:1.2rem;font-weight:800;margin-left:.75rem;">${data.phone}</a>
    </div>
  </div>

  <section class="contact-section">
    <div class="container">
      <div class="contact-grid">
        <div class="contact-info">
          <h2>Get in Touch</h2>
          <p style="color:#475569;">We respond promptly to all inquiries. For emergencies, please call — do not wait for an email response.</p>

          <div class="contact-item" style="margin-top:1.5rem;">
            <span class="contact-icon">📞</span>
            <div>
              <strong>Phone (24/7 Emergency)</strong><br>
              <a href="tel:${data.countryCode || '+1'}${data.phone.replace(/\D/g, '')}" style="font-size:1.2rem;font-weight:700;">${data.phone}</a>
            </div>
          </div>

          ${data.email ? `<div class="contact-item">
            <span class="contact-icon">✉</span>
            <div>
              <strong>Email</strong><br>
              <a href="mailto:${data.email}">${data.email}</a>
            </div>
          </div>` : ''}

          <div class="contact-item">
            <span class="contact-icon">📍</span>
            <div>
              <strong>Address</strong><br>
              ${data.address}<br>
              ${data.city}, ${data.state}
            </div>
          </div>

          <div class="contact-item">
            <span class="contact-icon">🕐</span>
            <div>
              <strong>Hours</strong><br>
              Emergency Response: 24/7, 365 days<br>
              Office Hours: Mon–Fri 8am–6pm
            </div>
          </div>

          ${data.licenseNumber ? `<div class="contact-item">
            <span class="contact-icon">📋</span>
            <div>
              <strong>License</strong><br>
              ${data.licenseNumber}
            </div>
          </div>` : ''}

          <div style="margin-top:2rem;padding:1.25rem;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;">
            <strong style="color:#166534;">Service Areas</strong>
            <p style="color:#475569;font-size:.9rem;margin-top:.4rem;">We serve ${data.city} and: ${data.serviceAreas.slice(0, 8).join(', ')}${data.serviceAreas.length > 8 ? ' and more.' : '.'}</p>
          </div>
        </div>

        <div>
          <h2>Send Us a Message</h2>
          ${formSection}

          <!-- Map placeholder -->
          <div style="margin-top:1.5rem;background:#e2e8f0;border-radius:10px;height:240px;display:flex;align-items:center;justify-content:center;color:#64748b;" data-placeholder="map-embed">
            <div style="text-align:center;">
              <div style="font-size:2rem;margin-bottom:.5rem;">🗺</div>
              <p style="margin:0;font-size:.9rem;">Map placeholder — embed Google Maps here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="content-section" style="background:#f8fafc;">
    <div class="container">
      <h2 style="text-align:center;">What to Expect When You Call</h2>
      <div class="process-steps" style="margin-top:2rem;">
        <div class="process-step">
          <h3>1. Immediate Answer</h3>
          <p>A live team member answers your call 24/7 — no voicemail for emergencies.</p>
        </div>
        <div class="process-step">
          <h3>2. Fast Dispatch</h3>
          <p>We route the nearest available crew to your ${data.city} property and give you an honest ETA.</p>
        </div>
        <div class="process-step">
          <h3>3. Free Assessment</h3>
          <p>On arrival, technicians inspect and document the damage before any work begins. No surprise charges.</p>
        </div>
        <div class="process-step">
          <h3>4. Written Estimate</h3>
          <p>You receive a written scope of work and cost estimate before we start restoration.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="cta-section" aria-labelledby="cta-heading">
    <div class="container">
      <h2 id="cta-heading">Water Damage Cannot Wait</h2>
      <p>Every hour increases the risk of mold and structural damage. Call now for immediate response.</p>
      <div class="cta-actions">
        <a href="tel:${data.countryCode || '+1'}${data.phone.replace(/\D/g, '')}" class="btn-primary">📞 Call ${data.phone}</a>
      </div>
    </div>
  </section>

  ${generateFooter(data)}`;

  return htmlShell({
    metaTitle: `Contact ${data.businessName} | Water Damage Restoration ${data.city}`,
    metaDescription: `Contact ${data.businessName} for water damage restoration in ${data.city}, ${data.state}. Available 24/7 for emergencies. Call ${data.phone} or use our contact form.`,
    canonicalUrl,
    theme,
    googleAnalyticsId: data.googleAnalyticsId || undefined,
    faviconUrl: data.faviconUrl || undefined,
    customHeadCode: data.customHeadCode || undefined,
    schemaBlocks: [generateLocalBusinessSchema(data, `${domain}.netlify.app`)],
    bodyContent: body,
  });
}

// ─── FAQ PAGE ──────────────────────────────────────────────────────────────

export function generateFAQPage(data: WDBusinessData, domain: string): string {
  const theme = resolveTheme(data);
  const canonicalUrl = `https://${domain}.netlify.app/faq.html`;
  const content = data.faqContent;

  const defaultCategories = [
    {
      heading: 'Emergency Response',
      faqs: [
        { question: `How fast can you respond to water damage in ${data.city}?`, answer: `Our ${data.city} team is available 24 hours a day, 7 days a week. We typically arrive within 60 minutes of your call for most locations in our service area. When you call, we will give you an honest estimated arrival time based on current crew availability.` },
        { question: 'What should I do while waiting for your crew to arrive?', answer: 'If it is safe to do so: shut off the water source if possible, turn off electricity in affected areas, move valuables and furniture off wet floors, and take photos of the damage for your insurance claim. Do not use a regular vacuum on standing water and avoid entering rooms where ceilings are sagging.' },
        { question: 'Do you respond to water damage 24 hours a day?', answer: `Yes. Water damage does not follow business hours and neither do we. Our emergency dispatch is staffed around the clock, every day of the year including holidays. Call ${data.phone} at any time for immediate assistance in ${data.city} and surrounding areas.` },
        { question: 'What counts as a water damage emergency?', answer: 'Any active water intrusion, burst pipe, appliance flood, sewage backup, or storm-related flooding qualifies as an emergency requiring immediate response. Even a slow leak that has been ongoing warrants prompt professional assessment, as moisture accumulates in hidden areas and mold can begin within 24 to 48 hours.' },
      ]
    },
    {
      heading: 'The Restoration Process',
      faqs: [
        { question: 'What is the difference between water mitigation and restoration?', answer: 'Water mitigation covers all emergency actions taken to stop damage from getting worse — water extraction, structural drying, antimicrobial application, and content protection. Water restoration is the rebuild phase that follows: replacing drywall, flooring, cabinets, and other materials damaged beyond salvage. We handle both phases.' },
        { question: 'How long does structural drying take?', answer: 'Most residential drying projects reach IICRC target moisture levels within 3 to 5 days. Larger losses, concrete subfloors, or heavily saturated wall systems may require additional time. We monitor moisture readings daily and will not remove equipment until levels are verified at or below acceptable thresholds.' },
        { question: 'Do you use IICRC standards?', answer: `Yes. Every water damage restoration project we perform follows IICRC S500 standards, which define best practices for water extraction, structural drying, and moisture documentation. Our technicians are IICRC-certified, which means they have been trained and tested on the science behind effective water damage restoration — not just the physical tasks.` },
        { question: 'Will you move my furniture and belongings?', answer: 'Yes. Content manipulation is part of our standard service. We move furniture, area rugs, and personal items to protect them during the drying process. For significant losses, we can perform a structured pack-out of contents to a secure facility for drying and cleaning, then return them after restoration is complete.' },
        { question: 'How do I know all the moisture has been removed?', answer: 'We use calibrated moisture meters and thermal imaging cameras to locate and measure moisture in structural materials — including inside walls, under flooring, and above ceilings. You will receive a drying documentation report showing daily moisture readings from initial setup through final clearance, confirming the structure is dry per IICRC standards.' },
      ]
    },
    {
      heading: 'Insurance and Claims',
      faqs: [
        { question: 'Will my homeowner\'s insurance cover water damage?', answer: 'Most standard homeowner\'s insurance policies cover sudden and accidental water damage — burst pipes, appliance failures, HVAC leaks, and roof leaks from storms. Gradual leaks, flooding from external sources, and maintenance-related damage are typically excluded. We recommend calling your insurance company to open a claim immediately after a water event, and we can work alongside your adjuster.' },
        { question: 'Do you work directly with insurance companies?', answer: `Yes. We work with all major insurance carriers and communicate directly with adjusters on your behalf if you choose. We provide complete documentation — moisture logs, equipment records, photo reports, and scopes of work — formatted to meet adjuster requirements. Our goal is to make the claims process as smooth as possible for you.` },
        { question: 'Do I need to get multiple estimates before starting work?', answer: 'Your insurance policy may or may not require multiple estimates — check with your adjuster. In emergency situations, most insurers understand that work must begin immediately to prevent further damage. We document everything thoroughly so the adjuster has full visibility into what was done and why, even if work began before the adjuster arrived on site.' },
        { question: 'What if my insurance claim is denied?', answer: 'A denial is not always final. You have the right to appeal and to hire a public adjuster to represent your interests. We can provide our documentation to support your appeal. We also offer private-pay restoration services and can work with you on payment options if insurance coverage is limited or unavailable.' },
      ]
    },
    {
      heading: 'Mold and Health',
      faqs: [
        { question: 'Can mold grow after water damage?', answer: 'Yes. Mold spores are present in virtually every indoor environment. Given moisture, a food source (any organic material including drywall paper, wood framing, and carpet backing), and the right temperature, mold can begin to establish within 24 to 48 hours after a water event. This is why rapid response and thorough structural drying are critical — not cosmetic.' },
        { question: 'How do you prevent mold after water damage?', answer: 'Preventing mold requires removing the moisture that mold needs to grow. We apply EPA-registered antimicrobial treatments to affected surfaces and use industrial drying equipment to bring structural materials to target moisture levels as quickly as possible. We also physically remove materials that cannot be dried to acceptable levels, such as heavily saturated drywall or flooring.' },
        { question: 'Do I need a separate mold test after water damage?', answer: 'In most cases, if water damage is addressed promptly and thoroughly by a certified restorer, a post-remediation mold test is not necessary for standard insurance claims. However, if you have health concerns, visible mold growth, or a persistent musty odor after restoration, an air quality test by a certified industrial hygienist may be appropriate. We can refer you to qualified testing professionals.' },
        { question: 'Is Category 3 water dangerous?', answer: 'Yes. Category 3 (black water) includes sewage backups, flooding from rivers or streams, and standing water that has been contaminated by pathogens. Contact with Category 3 water poses serious health risks. All materials that cannot be effectively disinfected must be removed and disposed of. Our technicians use full personal protective equipment when handling Category 3 losses.' },
      ]
    },
    {
      heading: 'Costs and Pricing',
      faqs: [
        { question: 'How much does water damage restoration cost?', answer: `Water damage restoration costs vary widely depending on the severity of the loss, the square footage affected, the category of water involved, and the extent of structural damage. Minor incidents involving a small area of clean water may cost a few hundred dollars. Larger losses involving multiple rooms, Category 2 or 3 water, or significant structural damage can run into the thousands. We provide free on-site assessments with written estimates before work begins.` },
        { question: 'Do you charge for the initial assessment?', answer: `No. We provide free on-site assessments for water damage in ${data.city} and surrounding areas. A certified technician will inspect the affected areas, document the damage with moisture readings and photos, and provide a written estimate. There is no obligation to proceed with us after the assessment.` },
        { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, checks, and bank transfers. For insurance claims, we can often bill the insurance company directly after your claim is approved. We are transparent about costs throughout the project and will notify you of any changes to the scope before proceeding with additional work.' },
      ]
    },
    {
      heading: 'After Restoration',
      faqs: [
        { question: 'Do you handle the full rebuild after drying?', answer: 'Yes. ${data.businessName} provides complete restoration services — from emergency extraction through final repairs. Once drying is complete, we can replace drywall, flooring, insulation, cabinets, trim, and paint to restore your property to pre-loss condition. You work with one company through the entire process.' },
        { question: 'Will my home look the same after restoration?', answer: 'Our goal is always to return your property to pre-loss condition or better. For matching materials, we use the same or equivalent products to your existing finishes wherever possible. In some cases, discontinued products may require a partial update to an adjacent area for a consistent appearance — we discuss this with you before proceeding.' },
        { question: 'How do I prevent water damage in the future?', answer: 'Regular home maintenance is your best defense. Key steps: inspect your roof and gutters annually, check washing machine and dishwasher hoses for cracks or bulging, maintain your water heater (most fail after 10 to 15 years), know where your main water shutoff is located, install water leak detectors near appliances and under sinks, and keep your sump pump tested and functioning if you have one.' },
      ]
    },
  ];

  const categories = content?.categories || defaultCategories;
  const h1 = content?.h1 || `Water Damage Restoration — Frequently Asked Questions`;
  const intro = content?.intro || `Everything you need to know about water damage restoration, the claims process, mold prevention, and what to expect when you call ${data.businessName} in ${data.city}.`;

  // Build all FAQs flat list for schema
  const allFaqs = categories.flatMap(cat => cat.faqs);

  const categoriesHTML = categories.map(cat => `
    <div style="margin-bottom:2.5rem;">
      <h2 style="margin-bottom:1rem;">${cat.heading}</h2>
      <div class="faq-list" role="list">
        ${cat.faqs.map(faq => `
        <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
          <button class="faq-question" itemprop="name">${faq.question}</button>
          <div class="faq-answer" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
            <span itemprop="text">${faq.answer}</span>
          </div>
        </div>`).join('')}
      </div>
    </div>`).join('');

  const body = `
  ${generateNav(data)}

  <div class="breadcrumb container">
    <a href="index.html">Home</a>
    <span>›</span>
    <span aria-current="page">FAQ</span>
  </div>

  <section class="page-hero" role="banner">
    <div class="container">
      <h1>${h1}</h1>
      <p>${intro}</p>
    </div>
  </section>

  <section class="content-section">
    <div class="container" style="max-width:860px;">
      ${categoriesHTML}
    </div>
  </section>

  <section class="cta-section" aria-labelledby="cta-heading">
    <div class="container">
      <h2 id="cta-heading">Still Have Questions? Call Us Directly</h2>
      <p>Our team is available 24/7 to answer any questions and dispatch help when you need it.</p>
      <div class="cta-actions">
        <a href="tel:${data.countryCode || '+1'}${data.phone.replace(/\D/g, '')}" class="btn-primary">📞 Call ${data.phone}</a>
        <a href="contact.html" class="btn-secondary">Send a Message</a>
      </div>
    </div>
  </section>

  ${generateFooter(data)}`;

  return htmlShell({
    metaTitle: content?.metaTitle || `Water Damage FAQ | ${data.businessName} — ${data.city}`,
    metaDescription: content?.metaDescription || `Common questions about water damage restoration answered by ${data.businessName} in ${data.city}, ${data.state}. Emergency response, insurance, mold prevention and more.`,
    canonicalUrl,
    theme,
    googleAnalyticsId: data.googleAnalyticsId || undefined,
    faviconUrl: data.faviconUrl || undefined,
    customHeadCode: data.customHeadCode || undefined,
    schemaBlocks: [generateFAQSchema(allFaqs)],
    bodyContent: body,
  });
}

// ─── CALCULATOR PAGE ────────────────────────────────────────────────────────

export function generateCalculatorPage(data: WDBusinessData, domain: string): string {
  const theme = resolveTheme(data);
  const canonicalUrl = `https://${domain}.netlify.app/calculator.html`;

  const calcJS = `
// ── Tab switching ──────────────────────────────────────────────
document.querySelectorAll('.calc-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-calc');
    document.querySelectorAll('.calc-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(id).classList.add('active');
  });
});

// ── 1. Cost Estimator ──────────────────────────────────────────
function calcCost() {
  const sqft = parseFloat(document.getElementById('cost-sqft').value) || 0;
  const category = parseInt(document.getElementById('cost-category').value) || 1;
  const hasStructural = document.getElementById('cost-structural').checked;
  const hasMold = document.getElementById('cost-mold').checked;
  let base = sqft * (category === 1 ? 3.5 : category === 2 ? 5.5 : 8);
  if (hasStructural) base *= 1.4;
  if (hasMold) base *= 1.35;
  const low = Math.round(base * 0.8 / 50) * 50;
  const high = Math.round(base * 1.3 / 50) * 50;
  document.getElementById('cost-result').innerHTML =
    '<strong>Estimated Range: $' + low.toLocaleString() + ' – $' + high.toLocaleString() + '</strong>' +
    '<p style="margin-top:.5rem;font-size:.85rem;color:#64748b;">This is a rough estimate only. Actual costs depend on local rates, extent of hidden damage, and materials needed. A free on-site assessment provides a written estimate.</p>';
}

// ── 2. Drying Time ─────────────────────────────────────────────
function calcDrying() {
  const sqft = parseFloat(document.getElementById('dry-sqft').value) || 0;
  const material = document.getElementById('dry-material').value;
  const humidity = parseFloat(document.getElementById('dry-humidity').value) || 50;
  let base = material === 'drywall' ? 3.5 : material === 'concrete' ? 5 : material === 'wood' ? 4.5 : 3;
  if (humidity > 70) base += 1.5;
  else if (humidity > 55) base += 0.5;
  if (sqft > 500) base += 1;
  if (sqft > 1000) base += 1;
  const low = Math.max(2, Math.floor(base));
  const high = Math.ceil(base + 2);
  document.getElementById('dry-result').innerHTML =
    '<strong>Estimated Drying Time: ' + low + '–' + high + ' days</strong>' +
    '<p style="margin-top:.5rem;font-size:.85rem;color:#64748b;">Actual drying time depends on equipment used, airflow, and initial moisture levels. We measure daily with calibrated meters and remove equipment only when IICRC targets are met.</p>';
}

// ── 3. Mold Risk ───────────────────────────────────────────────
function calcMold() {
  const hours = parseFloat(document.getElementById('mold-hours').value) || 0;
  const humidity = parseFloat(document.getElementById('mold-humidity').value) || 50;
  const temp = parseFloat(document.getElementById('mold-temp').value) || 70;
  let score = 0;
  if (hours > 48) score += 3;
  else if (hours > 24) score += 2;
  else if (hours > 12) score += 1;
  if (humidity > 80) score += 3;
  else if (humidity > 65) score += 2;
  else if (humidity > 55) score += 1;
  if (temp >= 70 && temp <= 90) score += 2;
  else if (temp >= 60) score += 1;
  let level, color, advice;
  if (score <= 2) { level = 'Low'; color = '#16a34a'; advice = 'Mold growth is unlikely if drying begins promptly. Standard drying protocols should prevent mold.'; }
  else if (score <= 4) { level = 'Moderate'; color = '#d97706'; advice = 'Conditions are favorable for mold growth. Professional drying with antimicrobial treatment is recommended without delay.'; }
  else if (score <= 6) { level = 'High'; color = '#dc2626'; advice = 'Significant mold risk. Immediate professional response is strongly advised. Antimicrobial treatment and thorough drying are essential.'; }
  else { level = 'Critical'; color = '#7c3aed'; advice = 'Mold may already be present or actively growing. Immediate remediation response required. Do not disturb affected materials without proper containment.'; }
  document.getElementById('mold-result').innerHTML =
    '<strong style="color:' + color + '">Mold Risk: ' + level + '</strong>' +
    '<p style="margin-top:.5rem;font-size:.85rem;color:#475569;">' + advice + '</p>';
}

// ── 4. Insurance Estimate ──────────────────────────────────────
function calcInsurance() {
  const total = parseFloat(document.getElementById('ins-total').value) || 0;
  const deductible = parseFloat(document.getElementById('ins-deductible').value) || 0;
  const covered = document.getElementById('ins-covered').value;
  if (covered === 'no') {
    document.getElementById('ins-result').innerHTML = '<strong>Flood damage typically requires separate flood insurance and is not covered by standard homeowner policies.</strong><p style="font-size:.85rem;color:#64748b;margin-top:.5rem;">Contact your agent to review your flood insurance coverage.</p>';
    return;
  }
  const payout = Math.max(0, total - deductible);
  document.getElementById('ins-result').innerHTML =
    '<strong>Estimated Insurance Payout: $' + payout.toLocaleString() + '</strong>' +
    '<p style="margin-top:.5rem;font-size:.85rem;color:#64748b;">After your $' + deductible.toLocaleString() + ' deductible. Actual payout depends on your policy terms, adjuster assessment, and any depreciation applied to materials.</p>';
}

// ── 5. Dehumidifier Sizing ─────────────────────────────────────
function calcDehumid() {
  const sqft = parseFloat(document.getElementById('dh-sqft').value) || 0;
  const level = document.getElementById('dh-level').value;
  const basement = document.getElementById('dh-basement').checked;
  let ppd = sqft * (level === 'slightly' ? 0.1 : level === 'moderately' ? 0.14 : 0.2);
  if (basement) ppd *= 1.2;
  const low = Math.ceil(ppd / 10) * 10;
  const high = low + 20;
  document.getElementById('dh-result').innerHTML =
    '<strong>Recommended Capacity: ' + low + '–' + high + ' pints/day</strong>' +
    '<p style="margin-top:.5rem;font-size:.85rem;color:#64748b;">Consumer dehumidifiers max out around 70 pints/day. For water damage restoration, industrial LGR dehumidifiers (70–200 pints/day) are used alongside air movers for proper structural drying.</p>';
}

// ── 6. Restore vs Replace ──────────────────────────────────────
function calcRestore() {
  const material = document.getElementById('rv-material').value;
  const damage = parseInt(document.getElementById('rv-damage').value) || 0;
  const age = parseInt(document.getElementById('rv-age').value) || 0;
  let restoreScore = 0;
  if (damage < 30) restoreScore += 3;
  else if (damage < 60) restoreScore += 1;
  if (age < 5) restoreScore += 2;
  else if (age < 15) restoreScore += 1;
  if (material === 'hardwood') restoreScore += 2;
  else if (material === 'tile') restoreScore += 1;
  let rec, reason;
  if (restoreScore >= 5) {
    rec = 'Restore'; reason = 'Low damage percentage, younger material age, and the material type support restoration as the cost-effective choice.';
  } else if (restoreScore >= 3) {
    rec = 'Restore (Borderline)'; reason = 'Restoration may be viable depending on hidden moisture levels and the condition of the subfloor. A professional assessment is recommended before deciding.';
  } else {
    rec = 'Replace'; reason = 'High damage percentage, older material, or material type that does not respond well to drying makes replacement the more practical long-term solution.';
  }
  document.getElementById('rv-result').innerHTML =
    '<strong>Recommendation: ' + rec + '</strong>' +
    '<p style="margin-top:.5rem;font-size:.85rem;color:#475569;">' + reason + '</p>' +
    '<p style="font-size:.8rem;color:#64748b;margin-top:.25rem;">Note: This is a general guideline. Final decisions should be based on in-person moisture testing and professional assessment.</p>';
}
`;

  const body = `
  ${generateNav(data)}

  <div class="breadcrumb container">
    <a href="index.html">Home</a>
    <span>›</span>
    <span aria-current="page">Calculators</span>
  </div>

  <section class="page-hero" role="banner">
    <div class="container">
      <h1>Water Damage Calculators</h1>
      <p>Estimate costs, drying time, mold risk, insurance payouts, and more with these free tools. For accurate figures, contact us for a free on-site assessment.</p>
    </div>
  </section>

  <section class="content-section">
    <div class="container">

      <!-- Tab Navigation -->
      <div class="calc-tabs" role="tablist">
        <button class="calc-tab active" data-calc="calc-cost" role="tab">💰 Cost Estimator</button>
        <button class="calc-tab" data-calc="calc-dry" role="tab">⏱ Drying Time</button>
        <button class="calc-tab" data-calc="calc-mold" role="tab">🦠 Mold Risk</button>
        <button class="calc-tab" data-calc="calc-ins" role="tab">📄 Insurance</button>
        <button class="calc-tab" data-calc="calc-dh" role="tab">💧 Dehumidifier</button>
        <button class="calc-tab" data-calc="calc-rv" role="tab">🔨 Restore vs Replace</button>
      </div>

      <!-- 1. Cost Estimator -->
      <div class="calc-panel active" id="calc-cost" role="tabpanel">
        <h2>Water Damage Cost Estimator</h2>
        <p class="section-intro">Get a rough idea of restoration costs based on the size and severity of the damage.</p>
        <div class="calc-form">
          <div class="calc-field">
            <label for="cost-sqft">Affected Area (sq ft)</label>
            <input type="number" id="cost-sqft" placeholder="e.g. 200" min="1">
          </div>
          <div class="calc-field">
            <label for="cost-category">Water Category</label>
            <select id="cost-category">
              <option value="1">Category 1 — Clean water (burst pipe, appliance)</option>
              <option value="2">Category 2 — Gray water (washing machine, dishwasher)</option>
              <option value="3">Category 3 — Black water (sewage, flooding)</option>
            </select>
          </div>
          <div class="calc-field calc-check">
            <label><input type="checkbox" id="cost-structural"> Structural damage present (wet drywall, flooring, framing)</label>
          </div>
          <div class="calc-field calc-check">
            <label><input type="checkbox" id="cost-mold"> Mold growth visible or suspected</label>
          </div>
          <button class="calc-btn" onclick="calcCost()">Calculate Estimate</button>
          <div class="calc-result" id="cost-result"></div>
        </div>
      </div>

      <!-- 2. Drying Time -->
      <div class="calc-panel" id="calc-dry" role="tabpanel">
        <h2>Structural Drying Time Calculator</h2>
        <p class="section-intro">Estimate how many days it will take to dry your structure to IICRC target moisture levels.</p>
        <div class="calc-form">
          <div class="calc-field">
            <label for="dry-sqft">Affected Area (sq ft)</label>
            <input type="number" id="dry-sqft" placeholder="e.g. 300" min="1">
          </div>
          <div class="calc-field">
            <label for="dry-material">Primary Material Affected</label>
            <select id="dry-material">
              <option value="drywall">Drywall / Gypsum board</option>
              <option value="wood">Wood framing / Hardwood floors</option>
              <option value="concrete">Concrete slab / Block</option>
              <option value="carpet">Carpet / Pad</option>
            </select>
          </div>
          <div class="calc-field">
            <label for="dry-humidity">Current Indoor Humidity (%)</label>
            <input type="number" id="dry-humidity" placeholder="e.g. 65" min="20" max="100">
          </div>
          <button class="calc-btn" onclick="calcDrying()">Calculate Drying Time</button>
          <div class="calc-result" id="dry-result"></div>
        </div>
      </div>

      <!-- 3. Mold Risk -->
      <div class="calc-panel" id="calc-mold" role="tabpanel">
        <h2>Mold Risk Calculator</h2>
        <p class="section-intro">Assess the risk of mold growth based on how long water has been present and current conditions.</p>
        <div class="calc-form">
          <div class="calc-field">
            <label for="mold-hours">Hours Since Water Damage Occurred</label>
            <input type="number" id="mold-hours" placeholder="e.g. 18" min="0">
          </div>
          <div class="calc-field">
            <label for="mold-humidity">Current Humidity in Affected Area (%)</label>
            <input type="number" id="mold-humidity" placeholder="e.g. 75" min="0" max="100">
          </div>
          <div class="calc-field">
            <label for="mold-temp">Temperature in Affected Area (°F)</label>
            <input type="number" id="mold-temp" placeholder="e.g. 72" min="32" max="110">
          </div>
          <button class="calc-btn" onclick="calcMold()">Assess Mold Risk</button>
          <div class="calc-result" id="mold-result"></div>
        </div>
      </div>

      <!-- 4. Insurance Estimate -->
      <div class="calc-panel" id="calc-ins" role="tabpanel">
        <h2>Insurance Claim Estimator</h2>
        <p class="section-intro">Estimate your expected insurance payout after your deductible.</p>
        <div class="calc-form">
          <div class="calc-field">
            <label for="ins-covered">Type of Water Damage</label>
            <select id="ins-covered">
              <option value="yes">Sudden/accidental — burst pipe, appliance, storm leak</option>
              <option value="no">Flood water from outside (river, storm surge)</option>
              <option value="maybe">Gradual leak or seepage</option>
            </select>
          </div>
          <div class="calc-field">
            <label for="ins-total">Total Estimated Damage ($)</label>
            <input type="number" id="ins-total" placeholder="e.g. 8000" min="0">
          </div>
          <div class="calc-field">
            <label for="ins-deductible">Your Policy Deductible ($)</label>
            <input type="number" id="ins-deductible" placeholder="e.g. 1000" min="0">
          </div>
          <button class="calc-btn" onclick="calcInsurance()">Estimate Payout</button>
          <div class="calc-result" id="ins-result"></div>
        </div>
      </div>

      <!-- 5. Dehumidifier Sizing -->
      <div class="calc-panel" id="calc-dh" role="tabpanel">
        <h2>Dehumidifier Sizing Calculator</h2>
        <p class="section-intro">Find out what dehumidifier capacity (pints per day) you need for your affected space.</p>
        <div class="calc-form">
          <div class="calc-field">
            <label for="dh-sqft">Area to Dehumidify (sq ft)</label>
            <input type="number" id="dh-sqft" placeholder="e.g. 400" min="1">
          </div>
          <div class="calc-field">
            <label for="dh-level">Current Moisture Level</label>
            <select id="dh-level">
              <option value="slightly">Slightly damp — visible moisture, no standing water</option>
              <option value="moderately">Moderately wet — soaked materials, some standing water</option>
              <option value="very">Extremely wet — significant flooding, saturated structure</option>
            </select>
          </div>
          <div class="calc-field calc-check">
            <label><input type="checkbox" id="dh-basement"> Basement or below-grade space</label>
          </div>
          <button class="calc-btn" onclick="calcDehumid()">Calculate Capacity</button>
          <div class="calc-result" id="dh-result"></div>
        </div>
      </div>

      <!-- 6. Restore vs Replace -->
      <div class="calc-panel" id="calc-rv" role="tabpanel">
        <h2>Restoration vs. Replacement Calculator</h2>
        <p class="section-intro">Should you restore or replace damaged flooring, drywall, or other materials?</p>
        <div class="calc-form">
          <div class="calc-field">
            <label for="rv-material">Material Type</label>
            <select id="rv-material">
              <option value="hardwood">Hardwood flooring</option>
              <option value="carpet">Carpet</option>
              <option value="laminate">Laminate flooring</option>
              <option value="drywall">Drywall</option>
              <option value="tile">Tile flooring</option>
              <option value="subfloor">Subfloor / OSB</option>
            </select>
          </div>
          <div class="calc-field">
            <label for="rv-damage">Estimated Damage (%)</label>
            <input type="number" id="rv-damage" placeholder="e.g. 40" min="0" max="100">
          </div>
          <div class="calc-field">
            <label for="rv-age">Material Age (years)</label>
            <input type="number" id="rv-age" placeholder="e.g. 8" min="0">
          </div>
          <button class="calc-btn" onclick="calcRestore()">Get Recommendation</button>
          <div class="calc-result" id="rv-result"></div>
        </div>
      </div>

    </div>
  </section>

  <section style="background:#f8fafc;padding:3rem 0;">
    <div class="container" style="text-align:center;">
      <h2>Get an Accurate Assessment — Free</h2>
      <p style="color:#475569;max-width:600px;margin:0 auto 1.5rem;">These calculators provide estimates, not exact figures. For an accurate assessment and written estimate, call ${data.businessName}. There is no charge for on-site evaluations in ${data.city}.</p>
      <a href="tel:${data.countryCode || '+1'}${data.phone.replace(/\D/g, '')}" class="btn-primary">📞 Call ${data.phone}</a>
    </div>
  </section>

  ${generateFooter(data)}`;

  const calcCSS = `
.calc-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
/* Calculator tabs */
.calc-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.75rem;
}
.calc-tab {
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.55rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .15s;
  white-space: nowrap;
}
.calc-tab.active { background: ${theme.primaryColor}; color: #fff; border-color: ${theme.primaryColor}; }
.calc-tab:hover:not(.active) { background: ${theme.primaryColor}20; border-color: ${theme.primaryColor}; color: ${theme.primaryColor}; }
.calc-panel { display: none; animation: fadeIn .2s ease; }
.calc-panel.active { display: block; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
/* Calculator card */
.calc-panel h2 { font-size: 1.4rem; font-weight: 700; color: #1e293b; margin-bottom: 0.4rem; }
.calc-panel .section-intro { color: #64748b; margin-bottom: 1.5rem; }
.calc-form {
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.75rem;
  max-width: 600px;
  box-shadow: 0 1px 4px rgba(0,0,0,.05);
}
.calc-field { margin-bottom: 1.25rem; }
.calc-field label { display: block; font-weight: 600; margin-bottom: 0.4rem; font-size: 0.9rem; color: #334155; }
.calc-field input, .calc-field select {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  background: #f8fafc;
  transition: border-color .15s;
  box-sizing: border-box;
}
.calc-field input:focus, .calc-field select:focus { outline: none; border-color: ${theme.primaryColor}; background: #fff; }
.calc-check label { display: flex; align-items: center; gap: 0.6rem; font-weight: 500; cursor: pointer; color: #475569; }
.calc-check input[type=checkbox] { width: 1.1rem; height: 1.1rem; accent-color: ${theme.primaryColor}; }
.calc-btn {
  background: ${theme.primaryColor};
  color: #fff;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background .15s, transform .1s;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.calc-btn:hover { background: ${theme.secondaryColor}; transform: translateY(-1px); }
.calc-result {
  margin-top: 1.5rem;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border: 1.5px solid #bae6fd;
  border-radius: 10px;
  min-height: 3rem;
  font-size: 1rem;
  color: #0c4a6e;
}
@media (max-width: 640px) {
  .calc-tabs { gap: 0.35rem; }
  .calc-tab { font-size: 0.78rem; padding: 0.45rem 0.7rem; }
  .calc-form { padding: 1.25rem; }
}
`;

  const fullTheme = resolveTheme(data);
  const fontUrl = FONT_URLS[fullTheme.fontFamily];
  const fontLink = fontUrl
    ? `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontUrl}" rel="stylesheet">`
    : '';

  // Use manual shell for calculator page to inject extra CSS and JS
  const schemas = [generateLocalBusinessSchema(data, `${domain}.netlify.app`)]
    .map(s => `<script type="application/ld+json">\n${s}\n</script>`)
    .join('\n  ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Water Damage Calculators | ${data.businessName} — ${data.city}</title>
  <meta name="description" content="Free water damage calculators for ${data.city} homeowners — cost estimator, drying time, mold risk, insurance payout, dehumidifier sizing, and restoration vs replacement.">
  <link rel="canonical" href="${canonicalUrl}">
  ${data.faviconUrl ? `<link rel="icon" type="image/png" href="${data.faviconUrl}">
  <link rel="shortcut icon" href="${data.faviconUrl}">` : ''}
  ${fontLink}
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  ${data.googleVerificationCode ? `<meta name="google-site-verification" content="${data.googleVerificationCode}">` : ''}
  <meta property="og:title" content="Water Damage Calculators | ${data.businessName}">
  <meta property="og:type" content="website">
  <!-- Schema.org -->
  ${schemas}
  ${data.googleAnalyticsId ? `<!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${data.googleAnalyticsId}"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${data.googleAnalyticsId}');</script>` : ''}
  ${data.customHeadCode ? `<!-- Custom Head Code -->\n  ${data.customHeadCode.trim()}` : ''}

  <style>
    ${generateCSS(fullTheme)}
    ${calcCSS}
  </style>
</head>
<body>
  ${body}
  <script>
    ${generateJS()}
    ${calcJS}
  </script>
</body>
</html>`;
}

// ─── GALLERY PAGE ──────────────────────────────────────────────────────────

export function generateGalleryPage(data: WDBusinessData, domain: string): string {
  const canonicalUrl = `https://${domain}.netlify.app/gallery.html`;

  const images = data.galleryImages || [];
  const beforeAfterPairs: Array<{ before: WDGalleryImage; after: WDGalleryImage }> = [];
  const normalImages: WDGalleryImage[] = [];

  // Pair before/after images by pairId
  const beforeMap = new Map<string, WDGalleryImage>();
  const afterMap = new Map<string, WDGalleryImage>();
  images.forEach(img => {
    if (img.type === 'before' && img.pairId) beforeMap.set(img.pairId, img);
    else if (img.type === 'after' && img.pairId) afterMap.set(img.pairId, img);
    else if (img.type === 'normal' && img.src) normalImages.push(img);
  });
  beforeMap.forEach((before, id) => {
    const after = afterMap.get(id);
    // Only include pair if BOTH images have actual uploaded sources (not empty)
    if (after && before.src && after.src) beforeAfterPairs.push({ before, after });
  });

  // Default placeholder before/after pairs if none provided
  const defaultPairs = [
    { before: { src: WD_PLACEHOLDER_IMAGES.flooding, alt: 'PLACEHOLDER: Before — water damaged room', type: 'before' as const, pairId: 'p1', caption: 'Before: Water damage from burst pipe' }, after: { src: WD_PLACEHOLDER_IMAGES.drying, alt: 'PLACEHOLDER: After — restored room', type: 'after' as const, pairId: 'p1', caption: 'After: Fully restored' } },
    { before: { src: WD_PLACEHOLDER_IMAGES.mold, alt: 'PLACEHOLDER: Before — mold damage', type: 'before' as const, pairId: 'p2', caption: 'Before: Mold remediation project' }, after: { src: WD_PLACEHOLDER_IMAGES.team, alt: 'PLACEHOLDER: After — mold removed', type: 'after' as const, pairId: 'p2', caption: 'After: Mold removed, area treated' } },
    { before: { src: WD_PLACEHOLDER_IMAGES.equipment, alt: 'PLACEHOLDER: Before — flooded basement', type: 'before' as const, pairId: 'p3', caption: 'Before: Flooded basement' }, after: { src: WD_PLACEHOLDER_IMAGES.hero, alt: 'PLACEHOLDER: After — dry basement', type: 'after' as const, pairId: 'p3', caption: 'After: Dried and restored' } },
  ];

  const displayPairs = beforeAfterPairs.length > 0 ? beforeAfterPairs : defaultPairs;

  const defaultNormal: WDGalleryImage[] = [
    { src: WD_PLACEHOLDER_IMAGES.equipment, alt: 'PLACEHOLDER: Industrial drying equipment in use', type: 'normal' },
    { src: WD_PLACEHOLDER_IMAGES.team, alt: 'PLACEHOLDER: Restoration team at work', type: 'normal' },
    { src: WD_PLACEHOLDER_IMAGES.drying, alt: 'PLACEHOLDER: Structural drying in progress', type: 'normal' },
    { src: WD_PLACEHOLDER_IMAGES.flooding, alt: 'PLACEHOLDER: Water extraction process', type: 'normal' },
    { src: WD_PLACEHOLDER_IMAGES.mold, alt: 'PLACEHOLDER: Mold inspection and treatment', type: 'normal' },
    { src: WD_PLACEHOLDER_IMAGES.hero, alt: 'PLACEHOLDER: Completed restoration project', type: 'normal' },
  ];

  const displayNormal = normalImages.length > 0 ? normalImages : defaultNormal;

  const beforeAfterHTML = displayPairs.map((pair, i) => `
    <div class="ba-item">
      <div class="ba-slider" data-pair="${i}">
        <div class="ba-after">
          <img src="${pair.after.src}" alt="${pair.after.alt}" loading="lazy" data-placeholder="gallery-after-${i}">
        </div>
        <div class="ba-before">
          <img src="${pair.before.src}" alt="${pair.before.alt}" loading="lazy" data-placeholder="gallery-before-${i}">
        </div>
        <div class="ba-handle" aria-label="Drag to compare before and after">
          <div class="ba-handle-line"></div>
          <div class="ba-handle-circle">◀▶</div>
          <div class="ba-handle-line"></div>
        </div>
      </div>
      <div class="ba-labels">
        <span class="ba-label-before">Before</span>
        <span class="ba-label-after">After</span>
      </div>
      ${pair.before.caption ? `<p class="img-caption">${pair.before.caption}</p>` : ''}
    </div>`).join('');

  const normalGridHTML = displayNormal.map((img, i) => `
    <div class="gallery-item">
      <img
        src="${img.src}"
        alt="${img.alt}"
        loading="lazy"
        data-placeholder="gallery-normal-${i}"
        onclick="openLightbox(this)"
        style="cursor:pointer;"
      >
      ${img.caption ? `<p class="img-caption">${img.caption}</p>` : ''}
    </div>`).join('');

  const galleryJS = `
// Before/After Slider
document.querySelectorAll('.ba-slider').forEach(slider => {
  const before = slider.querySelector('.ba-before');
  const handle = slider.querySelector('.ba-handle');
  let isDragging = false;

  function setPos(x) {
    const rect = slider.getBoundingClientRect();
    let pct = Math.min(Math.max((x - rect.left) / rect.width * 100, 0), 100);
    before.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    handle.style.left = pct + '%';
  }

  // Initialise at 50%
  before.style.clipPath = 'inset(0 50% 0 0)';
  handle.style.left = '50%';

  handle.addEventListener('mousedown', e => { isDragging = true; e.preventDefault(); });
  handle.addEventListener('touchstart', e => { isDragging = true; }, { passive: true });
  document.addEventListener('mousemove', e => { if (isDragging) setPos(e.clientX); });
  document.addEventListener('touchmove', e => { if (isDragging) setPos(e.touches[0].clientX); }, { passive: true });
  document.addEventListener('mouseup', () => { isDragging = false; });
  document.addEventListener('touchend', () => { isDragging = false; });
  slider.addEventListener('mousedown', e => { if (e.target !== handle && !handle.contains(e.target)) { isDragging = true; setPos(e.clientX); } });
  slider.addEventListener('click', e => setPos(e.clientX));
});

// Lightbox
function openLightbox(img) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lb-img').src = img.src;
  document.getElementById('lb-img').alt = img.alt;
  lb.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
document.addEventListener('DOMContentLoaded', () => {
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.addEventListener('click', () => { lb.style.display = 'none'; document.body.style.overflow = ''; });
  }
});
`;

  const galleryCSS = `
.ba-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 2rem; margin-top: 2rem; }
.ba-item {}
.ba-slider { position: relative; overflow: hidden; border-radius: 10px; cursor: ew-resize; user-select: none; aspect-ratio: 4/3; }
.ba-after, .ba-before { position: absolute; inset: 0; }
.ba-after img, .ba-before img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ba-before { clip-path: inset(0 50% 0 0); }
.ba-handle { position: absolute; top: 0; bottom: 0; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: all; cursor: ew-resize; }
.ba-handle-line { flex: 1; width: 2px; background: #fff; }
.ba-handle-circle { background: #fff; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: .65rem; color: #334155; font-weight: 700; box-shadow: 0 2px 8px rgba(0,0,0,.3); flex-shrink: 0; }
.ba-labels { display: flex; justify-content: space-between; margin-top: .5rem; }
.ba-label-before, .ba-label-after { font-size: .8rem; font-weight: 700; color: #64748b; }
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 2rem; }
.gallery-item img { width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 8px; transition: transform .2s; }
.gallery-item img:hover { transform: scale(1.02); }
#lightbox { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.9); z-index: 9999; align-items: center; justify-content: center; }
#lightbox img { max-width: 90vw; max-height: 90vh; border-radius: 8px; }
`;

  const fullTheme = resolveTheme(data);
  const fontUrl = FONT_URLS[fullTheme.fontFamily];
  const fontLink = fontUrl
    ? `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontUrl}" rel="stylesheet">`
    : '';

  const body = `
  ${generateNav(data)}

  <div class="breadcrumb container">
    <a href="index.html">Home</a>
    <span>›</span>
    <span aria-current="page">Gallery</span>
  </div>

  <section class="page-hero" role="banner">
    <div class="container">
      <h1>Water Damage Restoration Gallery</h1>
      <p>Real before-and-after photos from water damage restoration projects in ${data.city} and surrounding areas. Replace placeholder images with your own work photos in the editor.</p>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <h2>Before &amp; After Comparisons</h2>
      <p class="section-intro">Drag the slider to compare before and after restoration. 📷 <em>Replace placeholder images with real project photos in the editor.</em></p>
      <div class="ba-grid">
        ${beforeAfterHTML}
      </div>
    </div>
  </section>

  <section class="content-section" style="background:#f8fafc;">
    <div class="container">
      <h2>Project Photos</h2>
      <p class="section-intro">Photos from recent water damage restoration projects in ${data.city}. 📷 <em>Replace placeholder images with real photos in the editor.</em></p>
      <div class="gallery-grid">
        ${normalGridHTML}
      </div>
    </div>
  </section>

  <section class="cta-section" aria-labelledby="cta-heading">
    <div class="container">
      <h2 id="cta-heading">Need Water Damage Restoration in ${data.city}?</h2>
      <p>Our certified team is ready to respond 24/7. Call now or request a free assessment.</p>
      <div class="cta-actions">
        <a href="tel:${data.countryCode || '+1'}${data.phone.replace(/\D/g, '')}" class="btn-primary">📞 Call ${data.phone}</a>
        <a href="contact.html" class="btn-secondary">Get Free Estimate</a>
      </div>
    </div>
  </section>

  <!-- Lightbox -->
  <div id="lightbox" role="dialog" aria-label="Image viewer">
    <img id="lb-img" src="" alt="">
  </div>

  ${generateFooter(data)}`;

  const schemas = [generateLocalBusinessSchema(data, `${domain}.netlify.app`)]
    .map(s => `<script type="application/ld+json">\n${s}\n</script>`)
    .join('\n  ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Water Damage Restoration Gallery | ${data.businessName} — ${data.city}</title>
  <meta name="description" content="Before and after water damage restoration photos from ${data.businessName} in ${data.city}, ${data.state}. See our work restoring homes and businesses from water damage, flooding, and mold.">
  <link rel="canonical" href="${canonicalUrl}">
  ${fontLink}
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <meta property="og:title" content="Restoration Gallery | ${data.businessName}">
  <meta property="og:type" content="website">
  ${schemas}
  <style>
    ${generateCSS(fullTheme)}
    ${galleryCSS}
  </style>
</head>
<body>
  ${body}
  <script>
    ${generateJS()}
    ${galleryJS}
  </script>
</body>
</html>`;
}

// ─── BLOG ARCHIVE PAGE ─────────────────────────────────────────────────────

export function generateBlogArchivePage(data: WDBusinessData, domain: string): string {
  const theme = resolveTheme(data);
  const canonicalUrl = `https://${domain}.netlify.app/blog.html`;

  const posts = data.blogPosts || [];

  const defaultPosts: WDBlogPost[] = [
    { slug: 'what-to-do-after-water-damage', title: 'What to Do Immediately After Water Damage in Your Home', excerpt: 'The first 24 hours after water damage are critical. Learn the steps to take to protect your property and support your insurance claim before help arrives.', date: new Date().toISOString().split('T')[0], category: 'Emergency Tips', featuredImage: WD_PLACEHOLDER_IMAGES.flooding, featuredImageAlt: 'PLACEHOLDER: Water damage in a home' },
    { slug: 'signs-of-hidden-water-damage', title: '7 Signs of Hidden Water Damage You Should Never Ignore', excerpt: 'Water damage is not always visible. Discover the warning signs that moisture is lurking behind your walls, under your floors, or above your ceilings.', date: new Date().toISOString().split('T')[0], category: 'Home Maintenance', featuredImage: WD_PLACEHOLDER_IMAGES.equipment, featuredImageAlt: 'PLACEHOLDER: Moisture detection equipment' },
    { slug: 'water-damage-insurance-claims', title: 'How to File a Water Damage Insurance Claim Successfully', excerpt: 'A step-by-step guide to navigating the insurance claims process for water damage — what to document, what to say, and how to avoid common mistakes.', date: new Date().toISOString().split('T')[0], category: 'Insurance', featuredImage: WD_PLACEHOLDER_IMAGES.team, featuredImageAlt: 'PLACEHOLDER: Insurance claim discussion' },
    { slug: 'mold-after-water-damage', title: 'How to Prevent Mold After Water Damage', excerpt: 'Mold can begin growing within 24 hours of water intrusion. Learn what conditions mold needs and the steps professionals take to prevent it from taking hold.', date: new Date().toISOString().split('T')[0], category: 'Mold Prevention', featuredImage: WD_PLACEHOLDER_IMAGES.mold, featuredImageAlt: 'PLACEHOLDER: Mold inspection' },
    { slug: 'water-damage-categories-explained', title: 'Water Damage Categories 1, 2, and 3: What They Mean for Your Restoration', excerpt: 'Not all water damage is the same. Understanding the category of water involved determines the cleanup protocol, safety requirements, and restoration approach.', date: new Date().toISOString().split('T')[0], category: 'Education', featuredImage: WD_PLACEHOLDER_IMAGES.drying, featuredImageAlt: 'PLACEHOLDER: Water damage assessment' },
    { slug: 'diy-vs-professional-water-damage', title: 'DIY vs. Professional Water Damage Restoration: What You Need to Know', excerpt: 'Consumer fans and dehumidifiers cannot achieve the drying rates required by IICRC standards. Learn why professional equipment and certification matter.', date: new Date().toISOString().split('T')[0], category: 'Education', featuredImage: WD_PLACEHOLDER_IMAGES.hero, featuredImageAlt: 'PLACEHOLDER: Professional restoration equipment' },
  ];

  const displayPosts = posts.length > 0 ? posts : defaultPosts;

  const postsHTML = displayPosts.map(post => `
    <article class="blog-card">
      ${post.featuredImage ? `<a href="blog/${post.slug}.html">
        <img src="${post.featuredImage}" alt="${post.featuredImageAlt || post.title}" loading="lazy" class="blog-card-img" data-placeholder="blog-img-${post.slug}">
      </a>` : ''}
      <div class="blog-card-body">
        ${post.category ? `<span class="blog-category">${post.category}</span>` : ''}
        <h2 class="blog-card-title"><a href="blog/${post.slug}.html">${post.title}</a></h2>
        <p class="blog-card-excerpt">${post.excerpt}</p>
        <div class="blog-card-meta">
          <time datetime="${post.date}">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          <a href="blog/${post.slug}.html" class="service-card-link">Read More →</a>
        </div>
      </div>
    </article>`).join('');

  const blogCSS = `
.blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; margin-top: 2rem; }
.blog-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; transition: box-shadow .2s; }
.blog-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,.08); }
.blog-card-img { width: 100%; height: 200px; object-fit: cover; display: block; }
.blog-card-body { padding: 1.5rem; }
.blog-category { display: inline-block; background: ${theme.secondaryColor}22; color: ${theme.secondaryColor}; font-size: .75rem; font-weight: 700; padding: .25rem .6rem; border-radius: 4px; margin-bottom: .75rem; text-transform: uppercase; letter-spacing: .04em; }
.blog-card-title { font-size: 1.1rem; margin-bottom: .6rem; }
.blog-card-title a { color: ${theme.primaryColor}; }
.blog-card-excerpt { color: #475569; font-size: .9rem; margin-bottom: 1rem; }
.blog-card-meta { display: flex; justify-content: space-between; align-items: center; font-size: .85rem; color: #64748b; }
`;

  const fullTheme = resolveTheme(data);
  const fontUrl = FONT_URLS[fullTheme.fontFamily];
  const fontLink = fontUrl
    ? `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontUrl}" rel="stylesheet">`
    : '';

  const body = `
  ${generateNav(data)}

  <div class="breadcrumb container">
    <a href="index.html">Home</a>
    <span>›</span>
    <span aria-current="page">Blog</span>
  </div>

  <section class="page-hero" role="banner">
    <div class="container">
      <h1>Water Damage Restoration Blog</h1>
      <p>Expert tips, guides, and information about water damage restoration, mold prevention, insurance claims, and protecting your ${data.city} property.</p>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <div class="blog-grid">
        ${postsHTML}
      </div>
    </div>
  </section>

  <section class="cta-section" aria-labelledby="cta-heading">
    <div class="container">
      <h2 id="cta-heading">Water Damage Emergency in ${data.city}?</h2>
      <p>Don't rely on articles when you need real help. Call us for immediate response, 24/7.</p>
      <div class="cta-actions">
        <a href="tel:${data.countryCode || '+1'}${data.phone.replace(/\D/g, '')}" class="btn-primary">📞 Call ${data.phone}</a>
        <a href="contact.html" class="btn-secondary">Get Free Estimate</a>
      </div>
    </div>
  </section>

  ${generateFooter(data)}`;

  const schemas = [generateLocalBusinessSchema(data, `${domain}.netlify.app`)]
    .map(s => `<script type="application/ld+json">\n${s}\n</script>`)
    .join('\n  ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Water Damage Restoration Blog | ${data.businessName} — ${data.city}</title>
  <meta name="description" content="Water damage restoration tips, guides, and expert advice from ${data.businessName} in ${data.city}, ${data.state}. Learn about mold prevention, insurance claims, and restoration.">
  <link rel="canonical" href="${canonicalUrl}">
  ${fontLink}
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <meta property="og:type" content="website">
  ${schemas}
  <style>
    ${generateCSS(fullTheme)}
    ${blogCSS}
  </style>
</head>
<body>
  ${body}
  <script>${generateJS()}</script>
</body>
</html>`;
}

// ─── PRIVACY POLICY PAGE ───────────────────────────────────────────────────

export function generatePrivacyPage(data: WDBusinessData, domain: string): string {
  const theme = resolveTheme(data);
  const canonicalUrl = `https://${domain}.netlify.app/privacy.html`;
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const year = new Date().getFullYear();

  const body = `
  ${generateNav(data)}

  <section class="page-hero" role="banner">
    <div class="container">
      <h1>Privacy Policy</h1>
      <p>Last updated: ${today}</p>
    </div>
  </section>

  <section class="content-section">
    <div class="container" style="max-width:800px;">

      <p style="color:#475569;">This Privacy Policy describes how ${data.businessName} ("we," "us," or "our") collects, uses, and protects your personal information when you visit our website or contact us for services.</p>

      <h2 style="margin-top:2rem;">Information We Collect</h2>
      <p style="color:#475569;">We may collect the following types of information:</p>
      <ul style="color:#475569;padding-left:1.5rem;margin-bottom:1rem;list-style:disc;">
        <li style="margin-bottom:.5rem;"><strong>Contact information</strong> — name, phone number, email address, and property address when you contact us for services or submit a form.</li>
        <li style="margin-bottom:.5rem;"><strong>Property information</strong> — details about your property and the nature of damage you describe.</li>
        <li style="margin-bottom:.5rem;"><strong>Usage data</strong> — pages visited, time spent on the site, referral source, and browser type (collected anonymously via analytics).</li>
        <li style="margin-bottom:.5rem;"><strong>Communications</strong> — records of calls, emails, and messages exchanged with our team.</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p style="color:#475569;">We use your information to:</p>
      <ul style="color:#475569;padding-left:1.5rem;margin-bottom:1rem;list-style:disc;">
        <li style="margin-bottom:.5rem;">Respond to service inquiries and dispatch emergency response crews</li>
        <li style="margin-bottom:.5rem;">Provide water damage restoration and related services</li>
        <li style="margin-bottom:.5rem;">Communicate about your project and follow up after completion</li>
        <li style="margin-bottom:.5rem;">Improve our website and customer experience</li>
        <li style="margin-bottom:.5rem;">Comply with legal and insurance documentation requirements</li>
      </ul>

      <h2>Information Sharing</h2>
      <p style="color:#475569;">We do not sell your personal information to third parties. We may share information with:</p>
      <ul style="color:#475569;padding-left:1.5rem;margin-bottom:1rem;list-style:disc;">
        <li style="margin-bottom:.5rem;"><strong>Insurance companies</strong> — when processing claims on your behalf with your authorization</li>
        <li style="margin-bottom:.5rem;"><strong>Service partners</strong> — subcontractors and suppliers involved in your restoration project, limited to what is necessary</li>
        <li style="margin-bottom:.5rem;"><strong>Legal requirements</strong> — when required by law, court order, or government authority</li>
      </ul>

      <h2>Data Security</h2>
      <p style="color:#475569;">We implement reasonable technical and administrative measures to protect your personal information. However, no method of electronic transmission or storage is 100% secure. We encourage you to contact us directly by phone for sensitive or urgent communications.</p>

      <h2>Cookies and Analytics</h2>
      <p style="color:#475569;">Our website may use cookies and third-party analytics tools (such as Google Analytics) to understand how visitors use the site. These tools collect anonymized data and do not identify individual users. You can disable cookies in your browser settings, though some site features may not function correctly.</p>

      <h2>Your Rights</h2>
      <p style="color:#475569;">You may request access to, correction of, or deletion of your personal information at any time by contacting us at the information below. We will respond to verified requests within a reasonable time.</p>

      <h2>Children's Privacy</h2>
      <p style="color:#475569;">Our website and services are not directed at children under 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.</p>

      <h2>Changes to This Policy</h2>
      <p style="color:#475569;">We may update this Privacy Policy periodically. The date at the top of this page reflects the most recent revision. Continued use of our website constitutes acceptance of any changes.</p>

      <h2>Contact Us</h2>
      <p style="color:#475569;">For questions about this Privacy Policy or your personal information, contact:</p>
      <p style="color:#475569;">
        <strong>${data.businessName}</strong><br>
        ${data.address}, ${data.city}, ${data.state}<br>
        ${data.phone}<br>
        ${data.email ? `${data.email}` : ''}
      </p>

      <p style="color:#94a3b8;font-size:.85rem;margin-top:2rem;">© ${year} ${data.businessName}. All rights reserved.</p>
    </div>
  </section>

  ${generateFooter(data)}`;

  return htmlShell({
    metaTitle: `Privacy Policy | ${data.businessName}`,
    metaDescription: `Privacy Policy for ${data.businessName} — water damage restoration services in ${data.city}, ${data.state}.`,
    canonicalUrl,
    theme,
    googleAnalyticsId: data.googleAnalyticsId || undefined,
    faviconUrl: data.faviconUrl || undefined,
    customHeadCode: data.customHeadCode || undefined,
    schemaBlocks: [],
    bodyContent: body,
  });
}

// ─── TERMS OF SERVICE PAGE ─────────────────────────────────────────────────

export function generateTermsPage(data: WDBusinessData, domain: string): string {
  const theme = resolveTheme(data);
  const canonicalUrl = `https://${domain}.netlify.app/terms.html`;
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const year = new Date().getFullYear();

  const body = `
  ${generateNav(data)}

  <section class="page-hero" role="banner">
    <div class="container">
      <h1>Terms of Service</h1>
      <p>Last updated: ${today}</p>
    </div>
  </section>

  <section class="content-section">
    <div class="container" style="max-width:800px;">

      <p style="color:#475569;">These Terms of Service govern your use of the ${data.businessName} website and your engagement with our water damage restoration services. By using this website or engaging our services, you agree to these terms.</p>

      <h2 style="margin-top:2rem;">Services</h2>
      <p style="color:#475569;">${data.businessName} provides water damage restoration, structural drying, mold remediation, and related property restoration services in ${data.city}, ${data.state} and surrounding areas. All services are performed by licensed and insured technicians following IICRC industry standards.</p>

      <h2>Estimates and Scope of Work</h2>
      <p style="color:#475569;">Written estimates are provided prior to work commencement. Estimates are based on visible and measurable conditions at the time of assessment. Hidden or concealed damage discovered during the restoration process may require a revised scope of work and updated pricing. We will notify you before proceeding with any work beyond the original estimate.</p>

      <h2>Emergency Services</h2>
      <p style="color:#475569;">In emergency situations involving active water intrusion, we may begin mitigation work (water extraction, equipment placement) to prevent further damage. A written authorization and estimate will be provided as soon as practicable after emergency services commence.</p>

      <h2>Insurance Claims</h2>
      <p style="color:#475569;">When work is to be billed through insurance, you are responsible for authorizing the claim and cooperating with your insurance company. ${data.businessName} provides full documentation to support your claim but cannot guarantee claim approval or the amount your insurance company will pay. You are ultimately responsible for payment of services rendered.</p>

      <h2>Payment</h2>
      <p style="color:#475569;">Payment is due upon completion of each phase of work unless otherwise agreed in writing. For insurance claims, we may accept assignment of benefits with your authorization. Interest may accrue on overdue balances. We reserve the right to place a lien on the property for unpaid services in accordance with applicable state law.</p>

      <h2>Liability</h2>
      <p style="color:#475569;">${data.businessName} carries comprehensive general liability insurance. Our liability for services rendered is limited to the value of the services provided. We are not responsible for pre-existing conditions, hidden defects, or damage that was not accessible or visible at the time of our assessment. We are not liable for indirect, incidental, or consequential damages.</p>

      <h2>Warranty</h2>
      <p style="color:#475569;">We warrant that services will be performed in a professional and workmanlike manner in accordance with IICRC standards. Written warranties on specific restoration work will be provided separately when applicable. This warranty does not cover damage from subsequent water events, acts of nature, or conditions outside our control.</p>

      <h2>Website Use</h2>
      <p style="color:#475569;">The content on this website is provided for informational purposes only. Calculators and estimates on this site are general guidelines and do not constitute professional assessments. We make no representations about the accuracy or completeness of website content. Use of this website is at your own risk.</p>

      <h2>Governing Law</h2>
      <p style="color:#475569;">These Terms are governed by the laws of the State of ${data.state}. Any disputes arising from these Terms or our services shall be resolved in the courts of ${data.state}.</p>

      <h2>Changes to These Terms</h2>
      <p style="color:#475569;">We may update these Terms at any time. The date shown at the top of this page reflects the most recent update. Continued engagement with our services constitutes acceptance of any changes.</p>

      <h2>Contact</h2>
      <p style="color:#475569;">
        <strong>${data.businessName}</strong><br>
        ${data.address}, ${data.city}, ${data.state}<br>
        ${data.phone}<br>
        ${data.email ? data.email : ''}
      </p>

      <p style="color:#94a3b8;font-size:.85rem;margin-top:2rem;">© ${year} ${data.businessName}. All rights reserved.</p>
    </div>
  </section>

  ${generateFooter(data)}`;

  return htmlShell({
    metaTitle: `Terms of Service | ${data.businessName}`,
    metaDescription: `Terms of Service for ${data.businessName} — water damage restoration services in ${data.city}, ${data.state}.`,
    canonicalUrl,
    theme,
    googleAnalyticsId: data.googleAnalyticsId || undefined,
    faviconUrl: data.faviconUrl || undefined,
    customHeadCode: data.customHeadCode || undefined,
    schemaBlocks: [],
    bodyContent: body,
  });
}

// ─── SITEMAP ───────────────────────────────────────────────────────────────

export function generateSitemap(data: WDBusinessData, domain: string): string {
  const base = `https://${domain}.netlify.app`;
  const today = new Date().toISOString().split('T')[0];

  const staticPages = ['about', 'contact', 'faq', 'calculator', 'blog', 'gallery', 'privacy', 'terms']
    .map(page => `  <url>
    <loc>${base}/${page}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`)
    .join('\n');

  const serviceUrls = data.services
    .map(s => `  <url>
    <loc>${base}/services/${slugify(s)}-${slugify(data.city)}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`)
    .join('\n');

  const locationUrls = data.serviceAreas
    .map(l => `  <url>
    <loc>${base}/locations/${slugify(l)}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${staticPages}
${serviceUrls}
${locationUrls}
</urlset>`;
}

// ─── ROBOTS.TXT ────────────────────────────────────────────────────────────

export function generateRobots(domain: string): string {
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

Sitemap: https://${domain}.netlify.app/sitemap.xml`;
}

// ─── MAIN EXPORT: Generate All Files ──────────────────────────────────────

export interface WDGeneratedFiles {
  [filename: string]: string;
}

export function generateWaterDamageWebsite(
  data: WDBusinessData,
  domain: string
): WDGeneratedFiles {
  const files: WDGeneratedFiles = {};

  // Core pages
  files['index.html']      = generateHomepage(data, domain);
  files['about.html']      = generateAboutPage(data, domain);
  files['contact.html']    = generateContactPage(data, domain);
  files['faq.html']        = generateFAQPage(data, domain);
  files['calculator.html'] = generateCalculatorPage(data, domain);
  files['gallery.html']    = generateGalleryPage(data, domain);
  files['blog.html']       = generateBlogArchivePage(data, domain);
  files['privacy.html']    = generatePrivacyPage(data, domain);
  files['terms.html']      = generateTermsPage(data, domain);

  // Service pages
  for (const service of data.services) {
    const filename = `services/${slugify(service)}-${slugify(data.city)}.html`;
    files[filename] = generateServicePage(data, service, domain);
  }

  // Location pages
  for (const location of data.serviceAreas) {
    const filename = `locations/${slugify(location)}.html`;
    files[filename] = generateLocationPage(data, location, domain);
  }

  // Inject floating CTA button into all HTML pages
  const floatingCTAHtml = generateFloatingCTA(data);
  if (floatingCTAHtml) {
    for (const filename of Object.keys(files)) {
      if (filename.endsWith('.html') && typeof files[filename] === 'string') {
        files[filename] = (files[filename] as string).replace('</body>', `  ${floatingCTAHtml}\n</body>`);
      }
    }
  }

  // Inject custom images uploaded by user (replaces Unsplash placeholders)
  if (data.customImages && Object.keys(data.customImages).length > 0) {
    for (const [filename, html] of Object.entries(files)) {
      if (!filename.endsWith('.html') || typeof html !== 'string') continue;
      let updated = html;
      for (const [key, customSrc] of Object.entries(data.customImages)) {
        if (!customSrc) continue;
        // Replace src on <img> tags that have data-placeholder="key"
        updated = updated.replace(
          new RegExp(`(<img[^>]*data-placeholder="${key}"[^>]*)src="[^"]*"`, 'gs'),
          `$1src="${customSrc}"`
        );
        // Also handle src BEFORE data-placeholder
        updated = updated.replace(
          new RegExp(`(<img[^>]*)src="[^"]*"([^>]*data-placeholder="${key}")`, 'gs'),
          `$1src="${customSrc}"$2`
        );
      }
      files[filename] = updated;
    }
  }

  // SEO files
  files['sitemap.xml'] = generateSitemap(data, domain);
  files['robots.txt']  = generateRobots(domain);

  // Netlify headers for performance + indexing
  files['_headers'] = `/*
  Cache-Control: public, max-age=3600
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  X-Robots-Tag: index, follow

/*.html
  Cache-Control: public, max-age=3600
  X-Robots-Tag: index, follow

/sitemap.xml
  Content-Type: application/xml; charset=utf-8
  Cache-Control: public, max-age=86400

/robots.txt
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=86400`;

  return files;
}
