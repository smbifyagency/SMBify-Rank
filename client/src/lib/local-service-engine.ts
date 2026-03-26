/**
 * Local Service Engine
 * Thin wrapper over the water-damage generator that injects category-specific
 * copy and defaults. Adding a new vertical = adding one CategoryConfig entry
 * in local-service-categories.ts — no generator changes needed.
 */

import { generateWaterDamageWebsite, WDBusinessData } from './water-damage-generator';
import { getCategoryConfig, CategoryConfig } from './local-service-categories';

export type { CategoryConfig };
export { getCategoryConfig };

/** Replace {{city}}, {{state}}, {{businessName}} placeholders in a string. */
function interpolate(str: string, data: Record<string, any>): string {
  return str
    .replace(/\{\{city\}\}/g, data.city || '')
    .replace(/\{\{state\}\}/g, data.state || '')
    .replace(/\{\{businessName\}\}/g, data.businessName || '');
}

function interpolateArr(arr: string[], data: Record<string, any>): string[] {
  return arr.map(s => interpolate(s, data));
}

/**
 * Generate a full local-service website for any supported category.
 *
 * @param categoryId  e.g. "water-damage" | "plumbing"
 * @param rawData     business data from the editor / wizard
 * @param domain      netlify subdomain slug (e.g. "rapid-dry-restoration")
 */
export function generateLocalServiceWebsite(
  categoryId: string,
  rawData: Record<string, any>,
  domain: string
): Record<string, string> {
  const config = getCategoryConfig(categoryId);

  // Build why-us points from config
  const whyUsPoints = config.copy.whyUsPoints.map((point, i) => {
    const icons = ['🚨', '🎓', '✅', '⚡', '🔍', '📋'];
    return {
      icon: icons[i] ?? '✅',
      heading: point,
      body: point,
    };
  });

  // Merge category defaults into business data
  const enriched: WDBusinessData = {
    // Defaults from category config
    primaryKeyword: config.defaultPrimaryKeyword,
    primaryColor: config.defaultPalette.primary,
    secondaryColor: config.defaultPalette.secondary,
    services: config.defaultServices,

    // Business data overrides everything
    ...rawData,

    // Inject category copy fields (prefixed with _ to avoid DB confusion)
    _categoryId: config.id,
    _heroTagline: config.copy.heroTagline,
    _heroSubheading: config.copy.heroSubheading,
    _ctaHeadline: config.copy.ctaHeadline,
    _ctaSubtext: config.copy.ctaSubtext,
    _ctaButton: config.copy.ctaButton,
    _emergencyBadge: config.copy.emergencyBadge,
    _trustBadges: config.copy.trustBadges,
    _whyUsPoints: whyUsPoints,
    _schemaType: config.seo.schemaType,
  } as any;

  // Inject extended copy fields if defined in the category config
  const c = config.copy;
  const d = enriched as any;

  if (c.schemaDescription)      d._schemaDescription      = interpolate(c.schemaDescription, enriched);
  if (c.schemaOfferCatalogName) d._schemaOfferCatalogName = c.schemaOfferCatalogName;
  if (c.footerEmergencyText)    d._footerEmergencyText    = c.footerEmergencyText;
  if (c.whatsappMessage)        d._whatsappMessage        = c.whatsappMessage;
  if (c.introParas)             d._introParas             = interpolateArr(c.introParas, enriched);
  if (c.processH2)              d._processH2              = c.processH2;
  if (c.processSteps)           d._processSteps           = c.processSteps;
  if (c.faqH2)                  d._faqH2                  = c.faqH2;
  if (c.faqs)                   d._faqs                   = c.faqs;
  if (c.seoBody)                d._seoBody                = interpolate(c.seoBody, enriched);
  if (c.servicePageBenefits)    d._servicePageBenefits    = c.servicePageBenefits;

  return generateWaterDamageWebsite(enriched, domain) as Record<string, string>;
}
