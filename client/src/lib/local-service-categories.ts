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
    // Homepage section overrides
    schemaDescription?: string;
    schemaOfferCatalogName?: string;
    footerEmergencyText?: string;
    whatsappMessage?: string;
    introParas?: string[];
    processH2?: string;
    processSteps?: Array<{ step: number; heading: string; body: string }>;
    faqH2?: string;
    faqs?: Array<{ question: string; answer: string }>;
    seoBody?: string;
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
    schemaDescription: `Professional plumbing services in {{city}}, {{state}}. Licensed & bonded plumbers available 24/7 for drain cleaning, pipe repair, water heaters, and more.`,
    schemaOfferCatalogName: 'Plumbing Services',
    footerEmergencyText: 'Available around the clock for plumbing emergencies.',
    whatsappMessage: 'Hi, I need a plumber!',
    introParas: [
      `When a plumbing problem hits your {{city}} home or business, fast action prevents costly damage. Whether it's a burst pipe, stubborn clog, or failing water heater, {{businessName}} dispatches licensed plumbers who arrive equipped and ready to fix the problem right the first time.`,
      `Our certified plumbers use the latest diagnostic tools to pinpoint issues quickly — saving you time and money. From routine maintenance to full repipes, we handle every job with upfront pricing and no hidden fees.`,
      `{{businessName}} has earned a trusted reputation throughout {{city}} for honest service, expert workmanship, and lasting results. We back every job with a 100% satisfaction guarantee.`,
    ],
    processH2: 'Our Plumbing Service Process',
    processSteps: [
      { step: 1, heading: 'Call & Schedule', body: 'Call anytime — our dispatchers are available 24/7 to take your call and get a plumber on the way.' },
      { step: 2, heading: 'Diagnosis & Estimate', body: 'Our licensed plumber inspects the issue, explains the problem clearly, and provides an upfront written estimate before any work begins.' },
      { step: 3, heading: 'Expert Repair', body: 'We fix the problem using quality parts and proven techniques — done right the first time to prevent repeat issues.' },
      { step: 4, heading: 'Cleanup & Inspection', body: 'We clean up our work area completely and run a final check to make sure everything is working perfectly before we leave.' },
      { step: 5, heading: 'Satisfaction Guarantee', body: 'All our work is backed by a 100% satisfaction guarantee. If you have any concerns after the job, we make it right.' },
    ],
    faqH2: 'Frequently Asked Questions About Plumbing Services',
    faqs: [
      { question: 'Do you offer 24/7 emergency plumbing?', answer: 'Yes. Our licensed plumbers are on call 24 hours a day, 7 days a week — including weekends and holidays. Burst pipes and serious leaks cannot wait, and neither do we.' },
      { question: 'How much does a plumber cost?', answer: 'Costs vary depending on the type of job. Simple repairs like unclogging a drain may start around $100–$200, while larger jobs like water heater replacement or repiping cost more. We always provide a written upfront estimate before starting any work — no surprise charges.' },
      { question: 'Are your plumbers licensed and insured?', answer: 'Yes. Every plumber on our team is state-licensed, background-checked, and fully insured. We follow all local building codes on every job.' },
      { question: 'How quickly can you arrive for a plumbing emergency?', answer: 'We aim to arrive as fast as possible — often within 60 minutes for emergencies in our service area. Call us and our dispatcher will give you an accurate ETA based on your location.' },
      { question: 'Do you offer upfront pricing?', answer: 'Yes. We provide written flat-rate estimates before any work begins. You approve the price first — we never start work without your agreement.' },
      { question: 'What plumbing services do you offer?', answer: 'We handle drain cleaning, pipe repair and replacement, water heater installation and repair, leak detection, toilet and faucet repair, sewer line work, repiping, hydro jetting, and more. If it involves plumbing, we can help.' },
      { question: 'Can a slow drip cause serious damage?', answer: 'Yes. Even a small leak can cause significant water damage, mold growth, and structural issues over time. It can also waste thousands of gallons of water and raise your utility bills. We recommend addressing leaks promptly.' },
      { question: 'How do I know if I need to repipe my home?', answer: 'Signs you may need repiping include frequent leaks, rusty or discolored water, low water pressure throughout the home, or pipes that are over 50 years old. Our plumbers can inspect your system and advise you on the best solution.' },
    ],
    seoBody: `{{businessName}} is {{city}}'s trusted plumbing company. We provide comprehensive plumbing services including drain cleaning, pipe repair, water heater installation, leak detection, and emergency plumbing. Our licensed, bonded plumbers serve homeowners and businesses throughout {{city}} and the surrounding region. When a plumbing problem strikes, we respond fast with upfront pricing and expert workmanship.`,
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

// ─── Roofing ──────────────────────────────────────────────────────────────────

const roofingConfig: CategoryConfig = {
  id: 'roofing',
  name: 'Roofing Services',
  icon: '🏠',
  tagline: 'Roof repair, replacement & inspection',
  isEmergency: true,
  defaultPrimaryKeyword: 'Roofing Services',
  defaultPalette: { primary: '#7f1d1d', secondary: '#dc2626' },
  defaultServices: [
    'Roof Repair',
    'Roof Replacement',
    'Roof Inspection',
    'Storm Damage Repair',
    'Emergency Roof Tarping',
    'Shingle Replacement',
    'Flat Roof Repair & Replacement',
    'Metal Roofing Installation',
    'Gutter Installation & Repair',
    'Skylight Installation & Repair',
    'Roof Leak Detection & Repair',
    'Insurance Claim Assistance',
  ],
  copy: {
    heroTagline: 'Licensed Roofers. Storm Ready.',
    heroSubheading: 'From emergency repairs to full replacements — certified roofers protecting your home, any time of year.',
    ctaHeadline: 'Roof Damaged or Leaking?',
    ctaSubtext: 'A damaged roof can lead to water intrusion, mold, and structural damage within days. Call now for a free inspection.',
    ctaButton: 'Call Now — Free Roof Inspection',
    emergencyBadge: '24/7 Emergency Roof Repair',
    trustBadges: ['Licensed & Insured', 'Free Inspections', 'Insurance Claims Help'],
    whyUsPoints: [
      'State-licensed, fully insured roofing contractors',
      'Free roof inspections with no-obligation estimates',
      'Insurance claim assistance from start to finish',
      '100% satisfaction guarantee on all roofing work',
    ],
    schemaDescription: `Professional roofing services in {{city}}, {{state}}. Licensed & insured roofers for roof repair, replacement, storm damage, and inspections. Free estimates.`,
    schemaOfferCatalogName: 'Roofing Services',
    footerEmergencyText: 'Available around the clock for emergency roof repairs.',
    whatsappMessage: 'Hi, I need a roofer!',
    introParas: [
      `Your roof is your home's first line of defense against the elements. When it's damaged — whether from a storm, age, or wear — fast professional repair is essential to prevent water intrusion, mold, and costly structural damage. {{businessName}} provides expert roofing services throughout {{city}} with licensed, insured crews who get the job done right.`,
      `We use premium materials and proven installation techniques on every project. From a simple shingle repair to a complete roof replacement, our team delivers lasting results backed by manufacturer warranties and our own workmanship guarantee.`,
      `{{businessName}} has earned a trusted reputation throughout {{city}} for transparent pricing, clean job sites, and standing behind our work. We also work directly with insurance companies to help you maximize your storm damage claim.`,
    ],
    processH2: 'Our Roofing Service Process',
    processSteps: [
      { step: 1, heading: 'Free Inspection', body: 'We perform a thorough roof inspection at no charge, documenting all damage with photos and a detailed written report.' },
      { step: 2, heading: 'Honest Estimate', body: 'We provide a clear, itemized written estimate with no hidden fees. We explain exactly what needs to be done and why.' },
      { step: 3, heading: 'Insurance Coordination', body: 'If your damage is storm-related, we work directly with your insurance adjuster and handle the documentation to support your claim.' },
      { step: 4, heading: 'Expert Installation', body: 'Our licensed crews complete the work using quality materials, following manufacturer specs and local building codes.' },
      { step: 5, heading: 'Final Walkthrough', body: 'We inspect the completed work with you, clean up all debris, and walk you through the warranty before we leave.' },
    ],
    faqH2: 'Frequently Asked Questions About Roofing Services',
    faqs: [
      { question: 'How do I know if my roof needs to be replaced or just repaired?', answer: 'A repair is usually sufficient for isolated damage — a few missing shingles, a small leak, or minor storm damage. Replacement is recommended when the roof is over 20–25 years old, has widespread shingle failure, significant storm damage, or recurring leaks. Our free inspection will give you an honest assessment with no pressure.' },
      { question: 'Do you offer free roof inspections?', answer: 'Yes. We provide free roof inspections with a detailed written report and photo documentation. There is no obligation to hire us after the inspection.' },
      { question: 'Does homeowner\'s insurance cover roof damage?', answer: 'Most standard homeowner\'s insurance policies cover sudden and accidental roof damage caused by storms, hail, wind, and falling objects. Damage from normal wear and age is typically not covered. We work directly with your insurance company and can help document the damage for your claim.' },
      { question: 'How long does a roof replacement take?', answer: 'Most residential roof replacements are completed in 1–2 days. Larger or more complex roofs may take 2–3 days. We work efficiently to minimize disruption and always clean up thoroughly at the end of each day.' },
      { question: 'What roofing materials do you work with?', answer: 'We install and repair all major roofing types including asphalt shingles, architectural shingles, metal roofing, flat/TPO roofing, and more. We\'ll recommend the best material for your home, budget, and local climate.' },
      { question: 'How long will my new roof last?', answer: 'Lifespan depends on the material. Standard 3-tab asphalt shingles last 15–20 years, architectural shingles 25–30 years, and metal roofing 40–70 years. Proper installation and periodic maintenance significantly extend any roof\'s lifespan.' },
      { question: 'Do you offer emergency roof repair?', answer: 'Yes. We offer 24/7 emergency roof repair and tarping services for situations where immediate action is needed to prevent further interior damage — such as after a severe storm or sudden structural failure.' },
      { question: 'Are you licensed and insured?', answer: 'Yes. We are fully licensed and insured in the state of {{state}}. We carry general liability and workers\' compensation coverage, protecting you and your property throughout the job.' },
    ],
    seoBody: `{{businessName}} is {{city}}'s trusted roofing contractor. We provide comprehensive roofing services including roof repair, full roof replacement, storm damage repair, emergency tarping, gutter installation, and insurance claim assistance. Our licensed, insured roofing crews serve homeowners and businesses throughout {{city}} and the surrounding region. Whether you need a quick repair or a complete new roof, we deliver quality workmanship and lasting results.`,
  },
  seo: {
    schemaType: 'RoofingContractor',
    metaDescriptionTemplate:
      'Licensed roofing contractor in {{city}}. {{keyword}}, storm damage repair, inspections & more. Free estimates. Call {{businessName}} today.',
  },
  calculator: {
    enabled: true,
    title: 'Roofing Cost Estimator',
    tabs: [
      {
        id: 'repair',
        label: 'Roof Repair',
        resultLabel: 'Estimated Repair Cost',
        baseMin: 300,
        baseMax: 800,
        fields: [
          {
            id: 'type',
            label: 'Type of damage',
            type: 'select',
            options: [
              { label: 'Missing / damaged shingles (small area)', value: 1 },
              { label: 'Flashing repair (chimney, vents)', value: 1.4 },
              { label: 'Roof leak repair', value: 1.6 },
              { label: 'Storm damage (large area)', value: 3.5 },
            ],
          },
          {
            id: 'pitch',
            label: 'Roof pitch / steepness',
            type: 'select',
            options: [
              { label: 'Low pitch (walkable)', value: 1 },
              { label: 'Moderate pitch', value: 1.2 },
              { label: 'Steep pitch', value: 1.5 },
            ],
          },
          {
            id: 'emergency',
            label: 'Emergency / same-day service?',
            type: 'checkbox',
            adder: 200,
          },
        ],
      },
      {
        id: 'replacement',
        label: 'Roof Replacement',
        resultLabel: 'Estimated Replacement Cost',
        baseMin: 5000,
        baseMax: 10000,
        fields: [
          {
            id: 'size',
            label: 'Home size',
            type: 'select',
            options: [
              { label: 'Small (under 1,200 sq ft)', value: 0.7 },
              { label: 'Medium (1,200–2,000 sq ft)', value: 1 },
              { label: 'Large (2,000–3,000 sq ft)', value: 1.5 },
              { label: 'Extra large (3,000+ sq ft)', value: 2.2 },
            ],
          },
          {
            id: 'material',
            label: 'Roofing material',
            type: 'select',
            options: [
              { label: 'Architectural asphalt shingles', value: 1 },
              { label: 'Impact-resistant shingles', value: 1.3 },
              { label: 'Metal roofing (standing seam)', value: 2.2 },
              { label: 'Flat / TPO membrane', value: 1.4 },
            ],
          },
          {
            id: 'layers',
            label: 'Layers to tear off',
            type: 'select',
            options: [
              { label: 'One layer (standard)', value: 1 },
              { label: 'Two layers', value: 1.15 },
              { label: 'Three or more layers', value: 1.3 },
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
  roofingConfig,
  // future: hvacConfig, electricalConfig, locksmithConfig, ...
];

export function getCategoryConfig(id: string): CategoryConfig {
  return CATEGORIES.find(c => c.id === id) ?? waterDamageConfig;
}
