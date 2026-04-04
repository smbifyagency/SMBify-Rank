export interface PromptBusinessContext {
  name: string;
  type: string;
  primaryCity: string;
  locations: string[];
  services: string[];
  nicheKeywords?: string[];
  contentFingerprint?: string;
  yearsInBusiness?: string | number;
  usp?: string;
  phone: string;
  ownerName?: string;
  address?: string;
  website?: string;
}

export interface ServiceLocationLink {
  city: string;
  slug: string;
}

export interface ServiceLink {
  service: string;
  slug: string;
}

const formatList = (items: string[]): string => {
  const cleaned = items.map((item) => item.trim()).filter(Boolean);
  return cleaned.length > 0 ? cleaned.join(", ") : "N/A";
};

export const MASTER_SYSTEM_PROMPT = `
You are an elite SEO content strategist and copywriter specializing in local business websites.
You write content that ranks on Google and converts visitors into paying customers.

Your content philosophy:
- Every page targets one primary keyword with high buyer intent
- Naturally weave semantic keywords, named entities, and local signals
- Sound like a trusted local expert: warm, confident, practical
- Follow E-E-A-T: Experience, Expertise, Authoritativeness, Trustworthiness
- Make H2 and H3 sections independently useful for search intent
- Avoid filler phrases and generic fluff — every sentence must add value
- Content must be unique to the provided business context and niche
- Use second person voice (you/your), active voice, short clear sentences
- Include internal link placeholders where requested
- Do NOT invent fake statistics, star ratings, customer counts, or review numbers
- Do NOT use superlative claims like "#1 in the city" unless the business explicitly states it
- Each paragraph should be 4-6 sentences of substantive, specific content
- FAQ answers must be 100-150 words each, detailed and genuinely helpful
- Include real-world scenarios and examples relevant to the business niche
- Mention specific neighborhoods, landmarks, or local references where possible

WORD COUNT TARGETS (CRITICAL — produce AT LEAST these minimums):
- Homepage: minimum 3000 words total across all JSON fields combined
- Service pages: minimum 3000 words total across all JSON fields combined
- Location pages: minimum 2500 words total across all JSON fields combined
- Intro/overview paragraphs: 150-220 words each (not less than 150)
- Process step bodies: 80-120 words each
- Benefit/point bodies: 80-120 words each
- FAQ answers: 100-150 words each
- Why-us points: 80-120 words each
- Service card descriptions: 60-100 words each

CONTENT DEPTH RULES:
- Always provide at least 6 FAQ items per page (preferably 8-10)
- Always provide at least 6 why-us/benefit points
- Always provide at least 4 intro paragraphs
- Service overview sections need at least 3 paragraphs of 150+ words each
- Include actionable, practical advice unique to the specific service/location
- Reference common scenarios customers face in the specific city/area
- Weave in at least 8 semantic keyword variations naturally throughout the content

Respond only in valid JSON matching the requested schema. No markdown fences.
`;

export function buildHomePagePrompt(
  biz: PromptBusinessContext,
  allServiceSlugs: string[],
  allLocationSlugs: string[]
): string {
  return `
Write complete SEO-optimized homepage content for this local business.

BUSINESS DETAILS
- Business Name: ${biz.name}
- Industry / Type: ${biz.type}
- Primary City: ${biz.primaryCity}
- All Areas Served: ${formatList(biz.locations)}
- Core Services: ${formatList(biz.services)}
- Niche Keywords: ${formatList(biz.nicheKeywords || biz.services)}
- Content Fingerprint: ${biz.contentFingerprint || "N/A"}
- Years in Business: ${biz.yearsInBusiness || "over 10 years"}
- Key Differentiators: ${biz.usp || "licensed, insured, same-day service, free estimates"}
- Phone: ${biz.phone}
- Owner Name: ${biz.ownerName || ""}

INTERNAL LINK TARGETS AVAILABLE
- Service Pages: ${formatList(allServiceSlugs)}
- Location Pages: ${formatList(allLocationSlugs)}

OUTPUT FORMAT (strict JSON)
{
  "metaTitle": "Primary keyword + city + brand | under 60 chars",
  "metaDescription": "Include top keyword, city, strong CTA | 150-160 chars",
  "hero": {
    "h1": "Outcome-focused headline with primary keyword and city name",
    "subheadline": "Expand the promise and include a differentiator",
    "primaryCTA": "Button text",
    "trustLine": "Short trust signal under CTA"
  },
  "intro": {
    "h2": "Search-worthy H2 that includes the primary service category",
    "paragraphs": [
      "Para 1: customer pain point and empathy (150-220 words)",
      "Para 2: expert solution with keyword and city (150-220 words)",
      "Para 3: experience/certification/community trust (150-220 words)",
      "Para 4: specific process overview and what sets this business apart (150-220 words)",
      "Para 5: soft CTA with one internal link (100-150 words)"
    ]
  },
  "servicesSection": {
    "h2": "Our [City] [Industry] Services",
    "intro": "One sentence overview",
    "cards": [
      {
        "service": "Service name",
        "h3": "Keyword variation",
        "description": "2-3 sentences, benefit first",
        "internalLink": { "anchor": "Anchor text", "slug": "/services/service-slug" }
      }
    ]
  },
  "whyUsSection": {
    "h2": "Why [City] Residents Choose [Business Name]",
    "points": [
      {
        "icon": "emoji or icon name",
        "heading": "Trust point heading",
        "body": "3-4 specific evidence-backed sentences (80-120 words)"
      }
    ]
  },
  "locationsSection": {
    "h2": "Proudly Serving [Primary City] and Surrounding Areas",
    "body": "2 paragraphs with neighborhood signals and local trust",
    "locationLinks": [
      { "city": "City name", "anchor": "City name", "slug": "/locations/city-slug" }
    ]
  },
  "faqSection": {
    "h2": "Frequently Asked Questions - [Primary Service] in [City]",
    "faqs": [
      { "question": "High-intent buyer question", "answer": "4-6 sentence answer with semantic keyword (100-150 words)" },
      { "question": "Cost/timing question", "answer": "4-6 sentence detailed answer (100-150 words)" },
      { "question": "Process/qualification question", "answer": "4-6 sentence answer (100-150 words)" },
      { "question": "Local-specific question", "answer": "4-6 sentence answer (100-150 words)" },
      { "question": "Quality/warranty question", "answer": "4-6 sentence answer (100-150 words)" },
      { "question": "Comparison/alternative question", "answer": "4-6 sentence answer (100-150 words)" },
      { "question": "Emergency/urgency question", "answer": "4-6 sentence answer (100-150 words)" },
      { "question": "Preparation/next steps question", "answer": "4-6 sentence answer (100-150 words)" }
    ]
  },
  "finalCTA": {
    "h2": "Ready to Get Started? Contact [Business Name] Today",
    "body": "2 sentences with urgency and trust",
    "ctaButton": "Button text",
    "phone": "${biz.phone}"
  },
  "seoFootnote": {
    "h2": "[Primary Service] in [City] - [Business Name]",
    "body": "3-4 sentence entity-rich paragraph",
    "targetKeywords": ["6 to 8 keywords used"]
  }
}

QUALITY RULES
- Primary keyword must appear in metaTitle, metaDescription, H1, first 100 intro words, and seoFootnote
- City name must appear in hero, why-us heading, locations section, FAQ heading, and final CTA heading
- Include at least 8 internal links across the page
- Each FAQ answer should include at least one semantic variation and be 100-150 words
- Use at least 8 niche keywords naturally across headings and body copy
- Do not reuse generic boilerplate lines; make claims specific to this business profile
- Total page content must be at least 3000 words
- Include at least 6 why-us points with 80-120 word bodies
- Include at least 8 FAQ items
- Service cards should each have 60-100 word descriptions
`;
}

export function buildServicePagePrompt(
  biz: PromptBusinessContext,
  service: string,
  serviceSlug: string,
  locationPages: ServiceLocationLink[],
  otherServiceSlugs: string[]
): string {
  const locationLinks = locationPages
    .map((loc) => `${loc.city} -> ${loc.slug}`)
    .join(", ");

  return `
Write a complete SEO-optimized service page for a local business.

CONTEXT
- Business: ${biz.name}
- Industry: ${biz.type}
- This service: ${service}
- Primary city: ${biz.primaryCity}
- All cities served: ${formatList(biz.locations)}
- Niche Keywords: ${formatList(biz.nicheKeywords || biz.services)}
- Content Fingerprint: ${biz.contentFingerprint || "N/A"}
- Differentiators: ${biz.usp || "licensed, insured, free estimates, same-day availability"}
- Phone: ${biz.phone}
- Current service slug: ${serviceSlug}

Location pages for this service:
${locationLinks || "N/A"}

Other service pages for cross-linking:
${formatList(otherServiceSlugs)}

OUTPUT FORMAT (strict JSON)
{
  "metaTitle": "${service} in ${biz.primaryCity} | ${biz.name} | under 60 chars",
  "metaDescription": "Transactional intent meta with keyword + city + CTA",
  "breadcrumb": "Home > Services > ${service}",
  "hero": {
    "h1": "${service} in ${biz.primaryCity} with clear outcome",
    "subheadline": "Specific benefit or guarantee",
    "trustBadges": ["Badge 1", "Badge 2", "Badge 3"]
  },
  "overviewSection": {
    "h2": "What Is ${service} and Why It Matters",
    "body": ["Paragraph 1 (150-220 words)", "Paragraph 2 (150-220 words)", "Paragraph 3 (150-220 words)", "Paragraph 4 (150-220 words)"]
  },
  "processSection": {
    "h2": "Our ${service} Process in ${biz.primaryCity}",
    "intro": "One sentence intro",
    "steps": [
      { "step": 1, "heading": "Step heading", "body": "3-4 sentence explanation (80-120 words)" },
      { "step": 2, "heading": "Step heading", "body": "3-4 sentence explanation (80-120 words)" },
      { "step": 3, "heading": "Step heading", "body": "3-4 sentence explanation (80-120 words)" },
      { "step": 4, "heading": "Step heading", "body": "3-4 sentence explanation (80-120 words)" },
      { "step": 5, "heading": "Step heading", "body": "3-4 sentence explanation (80-120 words)" },
      { "step": 6, "heading": "Step heading", "body": "3-4 sentence explanation (80-120 words)" },
      { "step": 7, "heading": "Step heading", "body": "3-4 sentence explanation (80-120 words)" }
    ]
  },
  "benefitsSection": {
    "h2": "Benefits of Professional ${service}",
    "points": [
      { "heading": "Benefit heading", "body": "3-4 sentences specific outcome (80-120 words each)" },
      { "heading": "Benefit heading", "body": "3-4 sentences specific outcome (80-120 words each)" },
      { "heading": "Benefit heading", "body": "3-4 sentences specific outcome (80-120 words each)" },
      { "heading": "Benefit heading", "body": "3-4 sentences specific outcome (80-120 words each)" },
      { "heading": "Benefit heading", "body": "3-4 sentences specific outcome (80-120 words each)" },
      { "heading": "Benefit heading", "body": "3-4 sentences specific outcome (80-120 words each)" },
      { "heading": "Benefit heading", "body": "3-4 sentences specific outcome (80-120 words each)" },
      { "heading": "Benefit heading", "body": "3-4 sentences specific outcome (80-120 words each)" }
    ]
  },
  "warningSignsSection": {
    "h2": "Signs You Need ${service} Right Away",
    "intro": "2-3 sentence intro explaining urgency",
    "signs": [
      { "sign": "Symptom heading", "body": "2-3 sentences: why this means action is needed now (40-60 words)" },
      { "sign": "Symptom heading", "body": "2-3 sentences: why this means action is needed now (40-60 words)" },
      { "sign": "Symptom heading", "body": "2-3 sentences: why this means action is needed now (40-60 words)" },
      { "sign": "Symptom heading", "body": "2-3 sentences: why this means action is needed now (40-60 words)" },
      { "sign": "Symptom heading", "body": "2-3 sentences: why this means action is needed now (40-60 words)" },
      { "sign": "Symptom heading", "body": "2-3 sentences: why this means action is needed now (40-60 words)" }
    ]
  },
  "locationClusterSection": {
    "h2": "${service} Near You - Areas We Serve",
    "intro": "1-2 sentence intro",
    "locationCards": [
      { "city": "City", "anchor": "${service} in [City]", "slug": "/services/${serviceSlug}", "teaser": "City-specific teaser" }
    ]
  },
  "faqSection": {
    "h2": "${service} - Frequently Asked Questions",
    "faqs": [
      { "question": "Cost/pricing question specific to this service", "answer": "100-150 word detailed answer with specific context" },
      { "question": "How long does it take question", "answer": "100-150 word detailed answer" },
      { "question": "DIY vs professional question", "answer": "100-150 word detailed answer explaining risks of DIY" },
      { "question": "Insurance coverage question", "answer": "100-150 word detailed answer" },
      { "question": "Licensing/certification question", "answer": "100-150 word detailed answer" },
      { "question": "City-specific local question", "answer": "100-150 word detailed answer mentioning the city" },
      { "question": "Prevention or follow-up question", "answer": "100-150 word detailed answer" },
      { "question": "Process/what to expect question", "answer": "100-150 word detailed answer" },
      { "question": "Quality guarantee question", "answer": "100-150 word detailed answer" },
      { "question": "Comparison with alternatives question", "answer": "100-150 word detailed answer" }
    ]
  },
  "crossLinkSection": {
    "h2": "Related Services",
    "links": [
      { "service": "Related service", "anchor": "Anchor text", "slug": "/services/related-slug", "reason": "Why related" }
    ]
  },
  "finalCTA": {
    "h2": "Get Professional ${service} in ${biz.primaryCity} Today",
    "body": "2 sentence CTA",
    "ctaButton": "Call or book",
    "phone": "${biz.phone}"
  },
  "targetKeywordsSummary": ["8-10 keywords used"]
}

REQUIREMENTS
- Use ${service} + city in metaTitle, H1, first paragraph, 2+ H2s, and final CTA
- Link to location pages and related services naturally
- Keep tone practical, buyer-intent focused, and specific
- Use niche-specific terminology from the keyword list naturally
- Avoid repeating sentence structures used on other pages
- Total content must be at least 3000 words across all sections
- Each overview paragraph must be 150-220 words
- Each process step body must be 80-120 words
- Each benefit body must be 80-120 words
- Each FAQ answer must be 100-150 words
- Include at least 10 FAQ items
- Include at least 8 benefit points
`;
}

export function buildLocationPagePrompt(
  biz: PromptBusinessContext,
  city: string,
  servicePages: ServiceLink[],
  serviceLocationPages: ServiceLink[]
): string {
  const comboLinks = serviceLocationPages
    .map((item) => `${item.service} in ${city} -> ${item.slug}`)
    .join(", ");

  return `
Write a complete SEO-optimized location hub page for a local business.

CONTEXT
- Business: ${biz.name}
- Industry: ${biz.type}
- Target city: ${city}
- All services offered: ${formatList(biz.services)}
- Niche Keywords: ${formatList(biz.nicheKeywords || biz.services)}
- Content Fingerprint: ${biz.contentFingerprint || "N/A"}
- HQ / primary city: ${biz.primaryCity}
- Phone: ${biz.phone}
- Differentiators: ${biz.usp || "licensed, insured, free estimates, fast response"}

Service-location pages:
${comboLinks || "N/A"}

Service pillar pages:
${servicePages.map((item) => `${item.service} -> ${item.slug}`).join(", ") || "N/A"}

OUTPUT FORMAT (strict JSON)
{
  "metaTitle": "${biz.type} in ${city} | ${biz.name} | under 60 chars",
  "metaDescription": "Keyword + city + CTA | 150-160 chars",
  "breadcrumb": "Home > Locations > ${city}",
  "hero": {
    "h1": "Trusted ${biz.type} Services in ${city}",
    "subheadline": "City-specific promise",
    "trustBadges": ["Badge 1", "Badge 2", "Badge 3"]
  },
  "localIntroSection": {
    "h2": "${biz.name} - Your Local ${biz.type} in ${city}",
    "paragraphs": [
      "Paragraph 1: city-specific intro, the local water damage challenge (120-160 words)",
      "Paragraph 2: how the business serves this city, local knowledge, response capability (120-160 words)",
      "Paragraph 3: insurance process, documentation, trust factors (120-160 words)",
      "Paragraph 4: commitment to the city community, local expertise (100-140 words)"
    ]
  },
  "servicesInCitySection": {
    "h2": "Our ${biz.type} Services in ${city}",
    "intro": "1-2 sentence intro",
    "serviceCards": [
      {
        "service": "Service name",
        "h3": "[Service] in ${city}",
        "description": "2-3 sentence local context",
        "internalLink": { "anchor": "[Service] in ${city}", "slug": "/services/service-slug-city-slug" }
      }
    ]
  },
  "whyLocalSection": {
    "h2": "Why ${city} Residents Trust ${biz.name}",
    "points": [
      { "heading": "Local authority point", "body": "2 sentence proof" }
    ]
  },
  "localAreaSection": {
    "h2": "Neighborhoods and Areas We Cover in ${city}",
    "body": "2 paragraphs with neighborhoods, ZIPs, landmarks",
    "note": "Use real area entities where possible"
  },
  "faqSection": {
    "h2": "${biz.type} Services in ${city} - Common Questions",
    "faqs": [
      { "question": "How fast can you respond to emergencies in ${city}?", "answer": "100-150 word detailed answer with specific response time info" },
      { "question": "What types of water damage do you handle in ${city}?", "answer": "100-150 word answer covering all damage categories" },
      { "question": "Does ${biz.name} work with insurance companies in ${city}?", "answer": "100-150 word answer about insurance claim process" },
      { "question": "How long does restoration take in ${city}?", "answer": "100-150 word answer with realistic timelines" },
      { "question": "Can I stay in my ${city} home during restoration?", "answer": "100-150 word honest answer about disruption" },
      { "question": "Do you provide free estimates in ${city}?", "answer": "100-150 word answer about the assessment process" },
      { "question": "What certifications do your ${city} technicians have?", "answer": "100-150 word answer about qualifications" },
      { "question": "What areas of ${city} do you cover?", "answer": "100-150 word answer about specific neighborhoods and coverage" }
    ]
  },
  "finalCTA": {
    "h2": "Need ${biz.type} Services in ${city}? Call Us Today",
    "body": "2 sentence CTA with trust and urgency",
    "ctaButton": "CTA text",
    "phone": "${biz.phone}"
  },
  "targetKeywordsSummary": ["8-10 keywords used"]
}

CRITICAL RULES
- City must appear in metaTitle, H1, hero subheadline, every H2, intro opening, FAQ H2, and final CTA H2
- Content must feel local and unique for ${city}
- Link to related service pages naturally
- Integrate niche keywords naturally without keyword stuffing
- Keep language and examples distinct from other pages for uniqueness
- Total content must be at least 2500 words across all sections
- Each localIntro paragraph must be 120-160 words as specified
- Each FAQ answer must be 100-150 words
- Include at least 8 FAQ items
- Reference specific neighborhoods, landmarks, and local details for ${city}
`;
}

export function buildServiceLocationPrompt(
  biz: PromptBusinessContext,
  service: string,
  city: string,
  serviceSlug: string,
  locationSlug: string,
  nearbyCities: string[]
): string {
  return `
Write a complete SEO service-location conversion page.

Business: ${biz.name}
Service: ${service}
City: ${city}
Nearby Cities: ${formatList(nearbyCities)}
Phone: ${biz.phone}
Differentiators: ${biz.usp || "licensed, insured, same-day, free estimates"}
Niche Keywords: ${formatList(biz.nicheKeywords || biz.services)}
Content Fingerprint: ${biz.contentFingerprint || "N/A"}
Years: ${biz.yearsInBusiness || "10+"}
Parent service page: ${serviceSlug}
Parent location page: ${locationSlug}

Return strict JSON with sections: metaTitle, metaDescription, breadcrumb, hero, openingSection,
localContextSection, serviceDetailSection, pricingSection, faqSection, nearbyCitiesSection,
parentLinksSection, finalCTA, targetKeywordsSummary.

Keep tone urgent and conversion-focused for high-buy-intent users.
`;
}

export function buildInternalLinkingPrompt(
  allPages: Array<{ title: string; slug: string; pageType: string; targetService?: string; targetCity?: string }>
): string {
  const pageList = allPages
    .map(
      (page) =>
        `slug: ${page.slug} | type: ${page.pageType} | service: ${page.targetService || "-"} | city: ${page.targetCity || "-"}`
    )
    .join("\n");

  return `
You are an SEO internal linking architect.

Pages:
${pageList}

Build a linking map with these rules:
- Homepage links to all service and location hub pages
- Service pages link to location variants, related services, and homepage
- Location pages link to service-location pages and homepage
- No orphan pages
- Max 15 outgoing links per page

Return strict JSON:
{
  "linkingMap": {
    "/slug": {
      "linksTo": [{ "slug": "/target", "anchorText": "descriptive anchor" }],
      "linkedFromBy": ["/source-1", "/source-2"]
    }
  },
  "orphanCheck": ["pages with low inbound links"],
  "pillarPages": ["/slug"],
  "hubPages": ["/slug"]
}
`;
}

/**
 * Generates unique, AI-written copy for local service sites
 * (water damage, plumbing, roofing, HVAC, etc.).
 * Output is injected into the _introParas, _faqs, and _seoBody fields
 * of the water-damage-generator template engine.
 */
export function buildLocalServiceContentPrompt(
  biz: PromptBusinessContext,
  categoryName: string,
  primaryKeyword: string
): string {
  return `
Write unique SEO-optimized copy for a local ${categoryName} business website.

BUSINESS DETAILS
- Business Name: ${biz.name}
- Service Category: ${categoryName}
- Primary Keyword: ${primaryKeyword}
- Primary City: ${biz.primaryCity}
- All Areas Served: ${formatList(biz.locations)}
- Services Offered: ${formatList(biz.services)}
- Phone: ${biz.phone}
- Years in Business: ${biz.yearsInBusiness || "over 10 years"}
- Key Differentiators: ${biz.usp || "licensed, insured, fast response, free estimates"}

WRITING RULES
- Write as if you are the business owner talking to a potential customer in ${biz.primaryCity}
- Mention ${biz.primaryCity} naturally in at least 3 intro paragraphs
- Every FAQ answer must be 100-150 words and genuinely helpful
- Do NOT invent fake statistics, star ratings, or review counts
- Do NOT use superlatives like "#1 in the city"
- Sound like a trusted local expert: warm, confident, specific
- Vary sentence length; avoid repetitive structure
- Include real-world scenarios customers face
- Reference local landmarks, neighborhoods, or weather patterns when relevant

OUTPUT FORMAT (strict JSON, no markdown fences):
{
  "introParas": [
    "Paragraph 1: 150-220 words. Explain the problem homeowners face, why ${biz.primaryCity} residents trust ${biz.name}, and what makes you different. Include specific examples.",
    "Paragraph 2: 150-220 words. Describe your service process, credentials, and commitment to quality in ${biz.primaryCity}. Mention certifications and experience.",
    "Paragraph 3: 150-220 words. Detail your expertise with specific service types, tools, and methods used. Explain what customers can expect.",
    "Paragraph 4: 120-150 words. Call to action paragraph mentioning the service areas and why acting fast matters. Include urgency without being pushy."
  ],
  "faqs": [
    { "question": "Specific question about ${primaryKeyword} in ${biz.primaryCity}", "answer": "100-150 word detailed answer" },
    { "question": "Question about pricing or cost", "answer": "100-150 word detailed answer" },
    { "question": "Question about qualifications or licensing", "answer": "100-150 word detailed answer" },
    { "question": "Question about response time or availability", "answer": "100-150 word detailed answer" },
    { "question": "Question about the process or what to expect", "answer": "100-150 word detailed answer" },
    { "question": "Question about a common problem or concern", "answer": "100-150 word detailed answer" },
    { "question": "Question about safety or guarantees", "answer": "100-150 word detailed answer" },
    { "question": "Question about service area coverage", "answer": "100-150 word detailed answer" },
    { "question": "Question about maintenance or prevention", "answer": "100-150 word detailed answer" },
    { "question": "Question about choosing the right provider", "answer": "100-150 word detailed answer" }
  ],
  "seoBody": "200-300 word paragraph naturally weaving in ${primaryKeyword}, ${biz.primaryCity}, business name, and key services. Reads like expert local content, not keyword stuffing. Include specific benefits and community connection.",
  "processSteps": [
    { "step": 1, "heading": "Step name", "body": "80-120 word description of what happens at this step" },
    { "step": 2, "heading": "Step name", "body": "80-120 word description" },
    { "step": 3, "heading": "Step name", "body": "80-120 word description" },
    { "step": 4, "heading": "Step name", "body": "80-120 word description" },
    { "step": 5, "heading": "Step name", "body": "80-120 word description" },
    { "step": 6, "heading": "Step name", "body": "80-120 word description" },
    { "step": 7, "heading": "Step name", "body": "80-120 word description" }
  ],
  "whyChooseUs": [
    { "heading": "Trust point heading", "body": "80-120 word unique reason why customers should choose this business" },
    { "heading": "Trust point heading", "body": "80-120 word unique reason" },
    { "heading": "Trust point heading", "body": "80-120 word unique reason" },
    { "heading": "Trust point heading", "body": "80-120 word unique reason" },
    { "heading": "Trust point heading", "body": "80-120 word unique reason" },
    { "heading": "Trust point heading", "body": "80-120 word unique reason" }
  ],
  "aboutContent": "250-350 word about us section. Write as the business owner describing the company history, mission, values, and commitment to ${biz.primaryCity} residents. Mention years of experience, certifications, team size, and what drives the business. Sound authentic and personal.",
  "testimonials": [
    { "name": "First Last", "location": "${biz.primaryCity}", "rating": 5, "text": "60-100 word realistic customer review mentioning specific service received and why they recommend ${biz.name}" },
    { "name": "First Last", "location": "Nearby city", "rating": 5, "text": "60-100 word realistic customer review" },
    { "name": "First Last", "location": "${biz.primaryCity}", "rating": 5, "text": "60-100 word realistic customer review" },
    { "name": "First Last", "location": "Nearby city", "rating": 4, "text": "60-100 word realistic customer review" },
    { "name": "First Last", "location": "${biz.primaryCity}", "rating": 5, "text": "60-100 word realistic customer review" }
  ],
  "serviceDescriptions": {
    "_instructions": "For each service listed below, write a 100-150 word description that explains what the service includes, when homeowners need it, and why ${biz.name} excels at it. Use the exact service names as keys.",
    ${formatList(biz.services).split(', ').slice(0, 8).map(s => `"${s.trim()}": "100-150 word service description"`).join(',\n    ')}
  }
}

Generate all content above as valid JSON. Each introParas item must be a single string paragraph. Total content must be at least 4000 words.
`;
}

export function buildSchemaPrompt(
  biz: PromptBusinessContext,
  pageType: string,
  pageData: unknown
): string {
  return `
Generate JSON-LD schema for this page.

Business: ${biz.name}
Business Type: ${biz.type}
Address: ${biz.address || ""}
Phone: ${biz.phone}
Website: ${biz.website || ""}
Page Type: ${pageType}
Page Data: ${JSON.stringify(pageData)}

Return strict JSON:
{
  "schemas": [
    {
      "type": "LocalBusiness | Service | FAQPage | BreadcrumbList | WebPage",
      "jsonLd": { "@context": "https://schema.org", "@type": "..." }
    }
  ]
}

Rules:
- Every page includes WebPage and BreadcrumbList
- Homepage includes LocalBusiness
- Service pages include Service and FAQPage if FAQs exist
- Location pages include LocalBusiness with areaServed
- Service-location pages include Service + LocalBusiness + FAQPage
`;
}
