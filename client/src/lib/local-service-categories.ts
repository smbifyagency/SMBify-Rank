/**
 * Local Service Category Configs
 * Each category drives: wizard defaults, generator copy, calculator tabs, SEO schema.
 * Add a new vertical by adding one more CategoryConfig entry to CATEGORIES.
 */

export interface CalculatorTab {
  id: string;
  label: string;
  fields: CalculatorField[];
  resultLabel: string;
  baseMin: number;
  baseMax: number;
}

export interface CalculatorField {
  id: string;
  label: string;
  type: 'select' | 'number' | 'checkbox';
  options?: { label: string; value: number }[];  // for select — multiplier or adder
  adder?: number;   // for checkbox — flat add
}

export interface CategoryConfig {
  id: string;
  name: string;
  icon: string;              // emoji for wizard card
  tagline: string;           // short description for wizard card
  isEmergency: boolean;
  defaultPrimaryKeyword: string;
  defaultPalette: { primary: string; secondary: string };
  defaultServices: string[];

  copy: {
    heroTagline: string;
    heroSubheading: string;
    ctaHeadline: string;
    ctaSubtext: string;
    ctaButton: string;
    trustBadges: string[];       // 3 badges shown in hero/header
    whyUsPoints: string[];       // 4 points in "Why Choose Us" section
    emergencyBadge?: string;     // e.g. "24/7 Emergency Service"
  };

  seo: {
    schemaType: string;
    metaDescriptionTemplate: string;  // uses {{city}}, {{keyword}}, {{businessName}}
  };

  calculator: {
    enabled: boolean;
    title: string;
    tabs: CalculatorTab[];
  };
}

// ─── Water Damage ─────────────────────────────────────────────────────────────

const waterDamageConfig: CategoryConfig = {
  id: 'water-damage',
  name: 'Water Damage Restoration',
  icon: '💧',
  tagline: 'Emergency restoration & drying',
  isEmergency: true,
  defaultPrimaryKeyword: 'Water Damage Restoration',
  defaultPalette: { primary: '#1e3a5f', secondary: '#0ea5e9' },
  defaultServices: [
    'Water Damage Restoration',
    'Residential Water Damage Restoration',
    'Commercial Water Damage Restoration',
    'Emergency Water Extraction',
    'Flood Cleanup & Flood Damage Repair',
    'Structural Drying & Dehumidification',
    'Crawl Space Water Damage',
    'Basement Flooding Cleanup',
    'Sewage Cleanup & Biohazard Removal',
    'Mold Remediation & Prevention',
    'Fire & Smoke Damage Restoration',
    'Storm Damage Restoration',
  ],
  copy: {
    heroTagline: 'Fast Response. Certified Experts.',
    heroSubheading: '24/7 emergency water damage restoration — we arrive fast, dry thoroughly, and restore completely.',
    ctaHeadline: 'Water Damage Emergency?',
    ctaSubtext: 'Every minute counts. Standing water causes mold within 24–48 hours. Call now for immediate response.',
    ctaButton: 'Call Now — Free Inspection',
    emergencyBadge: '24/7 Emergency Response',
    trustBadges: ['IICRC Certified', 'Licensed & Insured', '24/7 Response'],
    whyUsPoints: [
      'IICRC-certified technicians on every job',
      '60-minute emergency response time',
      'Full insurance claim assistance',
      'Advanced drying equipment & moisture tracking',
    ],
  },
  seo: {
    schemaType: 'HomeAndConstructionBusiness',
    metaDescriptionTemplate:
      'Professional {{keyword}} in {{city}}. Licensed & insured. 24/7 emergency response. Call {{businessName}} for fast, certified restoration.',
  },
  calculator: {
    enabled: true,
    title: 'Water Damage Cost Estimator',
    tabs: [
      {
        id: 'restoration',
        label: 'Restoration Cost',
        resultLabel: 'Estimated Restoration Cost',
        baseMin: 1200,
        baseMax: 2500,
        fields: [
          {
            id: 'area',
            label: 'Affected Area',
            type: 'select',
            options: [
              { label: 'Single room (< 200 sq ft)', value: 1 },
              { label: 'Multiple rooms (200–600 sq ft)', value: 2.2 },
              { label: 'Large area (600–1500 sq ft)', value: 4 },
              { label: 'Whole floor / basement', value: 6.5 },
            ],
          },
          {
            id: 'category',
            label: 'Water Category',
            type: 'select',
            options: [
              { label: 'Clean water (burst pipe, appliance)', value: 1 },
              { label: 'Grey water (washing machine, dishwasher)', value: 1.5 },
              { label: 'Black water (sewage, flood)', value: 2.2 },
            ],
          },
          {
            id: 'mold',
            label: 'Mold present?',
            type: 'checkbox',
            adder: 800,
          },
        ],
      },
      {
        id: 'drying',
        label: 'Drying Time',
        resultLabel: 'Estimated Drying Time (days)',
        baseMin: 3,
        baseMax: 5,
        fields: [
          {
            id: 'material',
            label: 'Primary material affected',
            type: 'select',
            options: [
              { label: 'Hardwood floors', value: 1.8 },
              { label: 'Carpet & padding', value: 1.2 },
              { label: 'Drywall & insulation', value: 1.5 },
              { label: 'Concrete slab', value: 2 },
            ],
          },
          {
            id: 'depth',
            label: 'Water depth at peak',
            type: 'select',
            options: [
              { label: 'Surface moisture only', value: 0.7 },
              { label: 'Up to 1 inch', value: 1 },
              { label: '1–6 inches', value: 1.4 },
              { label: 'Over 6 inches', value: 2 },
            ],
          },
        ],
      },
    ],
  },
};

// ─── Plumbing ─────────────────────────────────────────────────────────────────

const plumbingConfig: CategoryConfig = {
  id: 'plumbing',
  name: 'Plumbing Services',
  icon: '🔧',
  tagline: 'Residential & commercial plumbing',
  isEmergency: true,
  defaultPrimaryKeyword: 'Plumbing Services',
  defaultPalette: { primary: '#1e3a5f', secondary: '#2563eb' },
  defaultServices: [
    'Emergency Plumbing Services',
    'Drain Cleaning & Unclogging',
    'Pipe Repair & Replacement',
    'Water Heater Installation & Repair',
    'Leak Detection & Repair',
    'Sewer Line Repair & Replacement',
    'Toilet Repair & Installation',
    'Faucet & Fixture Installation',
    'Gas Line Services',
    'Bathroom & Kitchen Plumbing',
    'Repiping Services',
    'Hydro Jetting',
  ],
  copy: {
    heroTagline: 'Licensed Plumbers. Fast Arrival.',
    heroSubheading: 'From burst pipes to clogged drains — certified plumbers ready to fix it fast, any time of day.',
    ctaHeadline: 'Plumbing Emergency?',
    ctaSubtext: 'Burst pipes and major leaks can cause thousands in damage within hours. Call now for immediate response.',
    ctaButton: 'Call Now — Fast Response',
    emergencyBadge: '24/7 Emergency Plumbing',
    trustBadges: ['Licensed & Bonded', 'Upfront Pricing', 'Same-Day Service'],
    whyUsPoints: [
      'State-licensed, background-checked plumbers',
      'Upfront flat-rate pricing — no hidden fees',
      'Same-day & emergency service available',
      '100% satisfaction guarantee on all work',
    ],
  },
  seo: {
    schemaType: 'Plumber',
    metaDescriptionTemplate:
      'Licensed plumber in {{city}}. {{keyword}}, drain cleaning, water heaters & more. Same-day service. Call {{businessName}} now.',
  },
  calculator: {
    enabled: true,
    title: 'Plumbing Cost Estimator',
    tabs: [
      {
        id: 'drain',
        label: 'Drain Cleaning',
        resultLabel: 'Estimated Drain Cleaning Cost',
        baseMin: 150,
        baseMax: 300,
        fields: [
          {
            id: 'type',
            label: 'Drain type',
            type: 'select',
            options: [
              { label: 'Kitchen sink', value: 1 },
              { label: 'Bathroom sink / tub', value: 0.9 },
              { label: 'Toilet', value: 1.1 },
              { label: 'Main sewer line', value: 3.5 },
              { label: 'Floor drain', value: 1.3 },
            ],
          },
          {
            id: 'method',
            label: 'Cleaning method needed',
            type: 'select',
            options: [
              { label: 'Standard snake / auger', value: 1 },
              { label: 'Hydro jetting', value: 2.8 },
              { label: 'Camera inspection + cleaning', value: 2.2 },
            ],
          },
          {
            id: 'emergency',
            label: 'Emergency / after-hours?',
            type: 'checkbox',
            adder: 100,
          },
        ],
      },
      {
        id: 'water-heater',
        label: 'Water Heater',
        resultLabel: 'Estimated Water Heater Cost',
        baseMin: 800,
        baseMax: 1400,
        fields: [
          {
            id: 'type',
            label: 'Heater type',
            type: 'select',
            options: [
              { label: 'Standard tank (40 gal)', value: 1 },
              { label: 'Standard tank (50–75 gal)', value: 1.3 },
              { label: 'Tankless / on-demand', value: 2.4 },
              { label: 'Heat pump water heater', value: 2.8 },
            ],
          },
          {
            id: 'work',
            label: 'Work needed',
            type: 'select',
            options: [
              { label: 'Repair only', value: 0.35 },
              { label: 'Replacement (like-for-like)', value: 1 },
              { label: 'Upgrade / new installation', value: 1.5 },
            ],
          },
        ],
      },
      {
        id: 'pipe-repair',
        label: 'Pipe Repair',
        resultLabel: 'Estimated Pipe Repair Cost',
        baseMin: 250,
        baseMax: 600,
        fields: [
          {
            id: 'type',
            label: 'Pipe issue',
            type: 'select',
            options: [
              { label: 'Minor leak / pinhole', value: 1 },
              { label: 'Burst pipe section', value: 2.5 },
              { label: 'Corroded pipe replacement', value: 3 },
              { label: 'Full repipe (whole home)', value: 18 },
            ],
          },
          {
            id: 'access',
            label: 'Pipe accessibility',
            type: 'select',
            options: [
              { label: 'Exposed / easy access', value: 1 },
              { label: 'Inside wall (drywall cut needed)', value: 1.8 },
              { label: 'Under slab / foundation', value: 3.5 },
            ],
          },
        ],
      },
    ],
  },
};

// ─── Registry ─────────────────────────────────────────────────────────────────

export const CATEGORIES: CategoryConfig[] = [
  waterDamageConfig,
  plumbingConfig,
  // future: hvacConfig, roofingConfig, electricalConfig, ...
];

export function getCategoryConfig(id: string): CategoryConfig {
  return CATEGORIES.find(c => c.id === id) ?? waterDamageConfig;
}
