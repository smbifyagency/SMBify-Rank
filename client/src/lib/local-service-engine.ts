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

  // Build why-us points from config (with city interpolation)
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

  return generateWaterDamageWebsite(enriched, domain) as Record<string, string>;
}
