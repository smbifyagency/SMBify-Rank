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
    // Service page benefit cards (6 items)
    servicePageBenefits?: Array<{ heading: string; body: string }>;
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
    servicePageBenefits: [
      { heading: 'IICRC-Certified Restoration', body: 'Every technician holds current IICRC certifications — ensuring your property is restored to industry-recognized standards, not guesswork.' },
      { heading: 'Stops Damage from Spreading', body: 'Fast professional response limits how far water migrates into walls, floors, and structural cavities — reducing total repair scope and cost.' },
      { heading: 'Prevents Mold Growth', body: 'Thorough structural drying to IICRC moisture targets eliminates the conditions mold needs to establish — protecting your family\'s health.' },
      { heading: 'Full Insurance Documentation', body: 'We provide complete moisture logs, equipment records, and photos your adjuster needs — streamlining your claim from day one.' },
      { heading: 'Industrial Equipment', body: 'Truck-mounted extractors and professional-grade drying systems work dramatically faster than consumer equipment, shortening your disruption.' },
      { heading: 'Single Point of Contact', body: 'We manage the entire project in-house — from emergency extraction through final repairs — so you never have to coordinate multiple contractors.' },
    ],
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
    servicePageBenefits: [
      { heading: 'State-Licensed Plumbers', body: 'Every plumber is state-licensed and background-checked — legally qualified to handle the work and accountable for the results.' },
      { heading: 'Fixed-Price Estimates', body: 'You get a written flat-rate estimate before work begins. No hourly surprises, no price changes after the fact.' },
      { heading: 'Same-Day Service Available', body: 'Most plumbing jobs can be scheduled same-day. Emergency calls are prioritized and dispatched immediately, 24/7.' },
      { heading: 'Prevents Costly Water Damage', body: 'Leaks and pipe failures cause thousands in property damage fast. Professional repair stops the problem at the source before it escalates.' },
      { heading: 'All Major Brands & Systems', body: 'We service all pipe materials, fixture brands, and water heater types — no need to call a specialist for each component.' },
      { heading: '100% Satisfaction Guarantee', body: 'Our work is backed by a satisfaction guarantee. If the problem returns or something isn\'t right, we come back and fix it.' },
    ],
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
    servicePageBenefits: [
      { heading: 'Licensed Roofing Contractors', body: 'All roofing work is performed by state-licensed contractors carrying full liability and workers\' compensation insurance — protecting you throughout the job.' },
      { heading: 'Free Roof Inspection', body: 'Every job starts with a thorough free inspection and detailed written report. No obligation, no pressure — just honest findings.' },
      { heading: 'Manufacturer Warranties', body: 'We install materials from leading manufacturers and provide both product warranties and our own workmanship guarantee on every project.' },
      { heading: 'Insurance Claim Experts', body: 'We document all damage in the format insurance adjusters require and can communicate directly with your carrier to maximize your claim.' },
      { heading: 'Protects Your Entire Home', body: 'A properly repaired or replaced roof protects everything beneath it — insulation, structure, walls, and belongings — from water intrusion and weather damage.' },
      { heading: 'Clean Job Sites', body: 'We protect your landscaping, clean up all roofing debris, and use magnetic rollers to collect stray nails before we leave your property.' },
    ],
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

// ─── HVAC ─────────────────────────────────────────────────────────────────────

const hvacConfig: CategoryConfig = {
  id: 'hvac',
  name: 'HVAC Services',
  icon: '❄️',
  tagline: 'Heating, cooling & air quality',
  isEmergency: true,
  defaultPrimaryKeyword: 'HVAC Services',
  defaultPalette: { primary: '#0c4a6e', secondary: '#0284c7' },
  defaultServices: [
    'AC Repair & Installation',
    'Furnace Repair & Replacement',
    'Heat Pump Services',
    'Emergency HVAC Repair',
    'Air Duct Cleaning',
    'Indoor Air Quality Testing',
    'Thermostat Installation & Programming',
    'HVAC Maintenance & Tune-Up',
    'Mini-Split Installation',
    'Commercial HVAC Services',
    'Boiler Repair & Replacement',
    'Ventilation & Exhaust Services',
  ],
  copy: {
    heroTagline: 'Certified HVAC Technicians. Fast Service.',
    heroSubheading: 'From AC breakdowns to furnace failures — licensed HVAC pros ready to restore your comfort, any season.',
    ctaHeadline: 'HVAC System Not Working?',
    ctaSubtext: 'No heat in winter or no AC in summer can be dangerous. Call now for fast, same-day HVAC service.',
    ctaButton: 'Call Now — Same-Day Service',
    emergencyBadge: '24/7 Emergency HVAC Service',
    servicePageBenefits: [
      { heading: 'NATE-Certified Technicians', body: 'Our technicians hold NATE certifications — the most respected credential in the HVAC industry — ensuring your system is serviced to the highest standard.' },
      { heading: 'All Brands Serviced', body: 'We service and install all major HVAC brands. Our trucks carry common parts for faster same-day repairs without waiting on orders.' },
      { heading: 'Lower Energy Bills', body: 'A properly serviced HVAC system runs more efficiently — reducing energy consumption and lowering your monthly utility costs noticeably.' },
      { heading: 'Extends System Lifespan', body: 'Professional maintenance and correct repairs extend your equipment\'s lifespan significantly, delaying the cost of full system replacement.' },
      { heading: 'Upfront Flat-Rate Pricing', body: 'We quote the full price before starting. No hourly billing surprises — you approve the cost first, every time.' },
      { heading: 'Comfort Guaranteed', body: 'If your system isn\'t working correctly after our service, we return and make it right. Your comfort is our commitment.' },
    ],
    trustBadges: ['NATE Certified', 'Licensed & Insured', 'Same-Day Service'],
    whyUsPoints: [
      'NATE-certified technicians on every job',
      'Upfront flat-rate pricing — no hidden fees',
      'Same-day and emergency service available',
      'All major brands serviced and repaired',
    ],
    schemaDescription: `Professional HVAC services in {{city}}, {{state}}. Licensed & insured technicians for AC repair, furnace replacement, heat pumps, and more. Same-day service available.`,
    schemaOfferCatalogName: 'HVAC Services',
    footerEmergencyText: 'Available around the clock for heating and cooling emergencies.',
    whatsappMessage: 'Hi, I need HVAC help!',
    introParas: [
      `When your heating or cooling system fails, comfort and safety are on the line. {{businessName}} provides fast, reliable HVAC services throughout {{city}} — from emergency AC repairs in the heat of summer to furnace replacements in the dead of winter.`,
      `Our NATE-certified technicians diagnose problems quickly and explain your options clearly before any work begins. We service all major HVAC brands and stock common parts on our trucks for faster repairs.`,
      `{{businessName}} is {{city}}'s trusted HVAC company — known for honest assessments, fair pricing, and work that lasts. We back every job with a satisfaction guarantee.`,
    ],
    processH2: 'Our HVAC Service Process',
    processSteps: [
      { step: 1, heading: 'Call & Schedule', body: 'Call anytime — we offer same-day appointments and 24/7 emergency service for heating and cooling failures.' },
      { step: 2, heading: 'Diagnosis', body: 'Our certified technician performs a thorough system inspection, identifies the root cause, and explains it in plain language.' },
      { step: 3, heading: 'Upfront Estimate', body: 'You receive a written flat-rate estimate before any work begins. We never start without your approval.' },
      { step: 4, heading: 'Expert Repair or Installation', body: 'We complete the work using quality parts and proper techniques, following manufacturer specs and local codes.' },
      { step: 5, heading: 'System Test & Walkthrough', body: 'We test the full system before leaving and walk you through any maintenance tips to keep it running efficiently.' },
    ],
    faqH2: 'Frequently Asked Questions About HVAC Services',
    faqs: [
      { question: 'How often should I have my HVAC system serviced?', answer: 'We recommend a tune-up twice per year — once in spring before cooling season and once in fall before heating season. Regular maintenance extends system life, improves efficiency, and catches small problems before they become expensive failures.' },
      { question: 'Why is my AC blowing warm air?', answer: 'Common causes include a refrigerant leak, dirty air filter, frozen evaporator coil, or a failed compressor. Our technicians can diagnose the issue quickly. Many AC problems are minor and can be repaired the same day.' },
      { question: 'Should I repair or replace my HVAC system?', answer: 'A general rule of thumb: if the repair cost exceeds 50% of the system replacement cost, or the system is over 10–15 years old, replacement is usually the better long-term investment. We provide honest, no-pressure recommendations based on your specific situation.' },
      { question: 'How long does an HVAC installation take?', answer: 'A standard residential HVAC replacement typically takes 4–8 hours. More complex installations involving ductwork modifications may take a full day. We work efficiently and clean up completely before leaving.' },
      { question: 'Do you offer financing for HVAC replacement?', answer: 'Yes. We offer financing options for qualified customers to help make system replacement more affordable. Call us for current financing plans and rates.' },
      { question: 'What HVAC brands do you service?', answer: 'We service and install all major brands including Carrier, Trane, Lennox, Rheem, York, Goodman, American Standard, and more. Our trucks are stocked with common parts for faster same-day repairs.' },
      { question: 'Why is my energy bill so high?', answer: 'An aging or poorly maintained HVAC system is one of the most common causes of high energy bills. Dirty filters, refrigerant leaks, and inefficient equipment can significantly increase energy usage. A tune-up or system upgrade can often reduce bills noticeably.' },
      { question: 'Are you licensed and insured?', answer: 'Yes. {{businessName}} is fully licensed and insured. All our technicians hold proper certifications and we carry full liability and workers\' compensation coverage.' },
    ],
    seoBody: `{{businessName}} is {{city}}'s trusted HVAC company. We provide comprehensive heating and cooling services including AC repair and installation, furnace replacement, heat pump services, air duct cleaning, and emergency HVAC repair. Our NATE-certified technicians serve homeowners and businesses throughout {{city}} and the surrounding region with same-day service and upfront pricing.`,
  },
  seo: {
    schemaType: 'HVACBusiness',
    metaDescriptionTemplate:
      'Licensed HVAC company in {{city}}. {{keyword}}, AC repair, furnace replacement & more. Same-day service. Call {{businessName}} now.',
  },
  calculator: {
    enabled: true,
    title: 'HVAC Cost Estimator',
    tabs: [
      {
        id: 'ac-repair',
        label: 'AC Repair',
        resultLabel: 'Estimated AC Repair Cost',
        baseMin: 150,
        baseMax: 500,
        fields: [
          {
            id: 'issue',
            label: 'Issue type',
            type: 'select',
            options: [
              { label: 'Refrigerant recharge', value: 1.5 },
              { label: 'Capacitor / contactor replacement', value: 1 },
              { label: 'Fan motor replacement', value: 1.8 },
              { label: 'Compressor replacement', value: 5 },
              { label: 'Thermostat / control board', value: 1.3 },
            ],
          },
          {
            id: 'emergency',
            label: 'Emergency / after-hours?',
            type: 'checkbox',
            adder: 150,
          },
        ],
      },
      {
        id: 'system-replace',
        label: 'System Replacement',
        resultLabel: 'Estimated Replacement Cost',
        baseMin: 3500,
        baseMax: 7000,
        fields: [
          {
            id: 'type',
            label: 'System type',
            type: 'select',
            options: [
              { label: 'Central AC only', value: 0.7 },
              { label: 'Gas furnace only', value: 0.6 },
              { label: 'AC + furnace (full system)', value: 1 },
              { label: 'Heat pump system', value: 1.2 },
              { label: 'Mini-split (single zone)', value: 0.5 },
            ],
          },
          {
            id: 'size',
            label: 'Home size',
            type: 'select',
            options: [
              { label: 'Small (under 1,200 sq ft)', value: 0.8 },
              { label: 'Medium (1,200–2,500 sq ft)', value: 1 },
              { label: 'Large (2,500–4,000 sq ft)', value: 1.4 },
              { label: 'Extra large (4,000+ sq ft)', value: 1.9 },
            ],
          },
        ],
      },
    ],
  },
};

// ─── Electrical ───────────────────────────────────────────────────────────────

const electricalConfig: CategoryConfig = {
  id: 'electrical',
  name: 'Electrical Services',
  icon: '⚡',
  tagline: 'Residential & commercial electrical',
  isEmergency: true,
  defaultPrimaryKeyword: 'Electrical Services',
  defaultPalette: { primary: '#713f12', secondary: '#d97706' },
  defaultServices: [
    'Electrical Panel Upgrade',
    'Wiring & Rewiring',
    'Outlet & Switch Installation',
    'Circuit Breaker Repair & Replacement',
    'Emergency Electrical Repair',
    'EV Charger Installation',
    'Ceiling Fan & Light Fixture Installation',
    'Generator Installation & Repair',
    'Smoke & Carbon Monoxide Detector Installation',
    'Surge Protection Installation',
    'Outdoor & Landscape Lighting',
    'Commercial Electrical Services',
  ],
  copy: {
    heroTagline: 'Licensed Electricians. Code Compliant.',
    heroSubheading: 'From panel upgrades to emergency repairs — certified electricians keeping your home safe and powered.',
    ctaHeadline: 'Electrical Problem?',
    ctaSubtext: 'Electrical issues are a leading cause of house fires. Don\'t wait — call a licensed electrician now for a safe, fast fix.',
    ctaButton: 'Call Now — Licensed Electrician',
    emergencyBadge: '24/7 Emergency Electrical Service',
    servicePageBenefits: [
      { heading: 'State-Licensed Electricians', body: 'All work is performed by state-licensed electricians — legally qualified, fully insured, and accountable for safe, code-compliant results.' },
      { heading: 'Eliminates Fire & Safety Risk', body: 'Faulty wiring is a leading cause of residential fires. Professional electrical work eliminates hazards and keeps your home and family safe.' },
      { heading: 'Code Compliant — Permits Pulled', body: 'We pull permits when required and ensure all work passes inspection — protecting your home\'s value and your insurance coverage.' },
      { heading: 'Accurate Diagnosis', body: 'Electrical problems are often symptoms of deeper issues. We trace problems to the source and fix them correctly rather than just treating the surface symptom.' },
      { heading: 'Upfront Written Estimates', body: 'You receive a flat-rate written estimate before any work begins. No hourly billing, no guesswork on the final invoice.' },
      { heading: 'Future-Proofed Work', body: 'We install to current NEC standards, giving your electrical system capacity for modern demands like EV chargers, home offices, and smart home devices.' },
    ],
    trustBadges: ['Licensed Electrician', 'Code Compliant', 'Upfront Pricing'],
    whyUsPoints: [
      'State-licensed, fully insured electricians',
      'All work meets local electrical codes',
      'Upfront pricing — no surprises on your bill',
      'Safety-first approach on every job',
    ],
    schemaDescription: `Licensed electrical services in {{city}}, {{state}}. Residential and commercial electricians for panel upgrades, wiring, EV chargers, and emergency electrical repair.`,
    schemaOfferCatalogName: 'Electrical Services',
    footerEmergencyText: 'Available around the clock for electrical emergencies.',
    whatsappMessage: 'Hi, I need an electrician!',
    introParas: [
      `Electrical problems are not something to put off — faulty wiring and overloaded panels are a leading cause of residential fires. {{businessName}} provides licensed electrical services throughout {{city}}, from simple outlet repairs to full panel upgrades and home rewiring.`,
      `Every job is completed by a state-licensed electrician who follows current electrical codes and safety standards. We pull permits when required, ensuring your work is inspected and your home's value is protected.`,
      `{{businessName}} is known throughout {{city}} for honest pricing, clean workmanship, and going the extra mile to explain what we find and what we recommend — without pressure.`,
    ],
    processH2: 'Our Electrical Service Process',
    processSteps: [
      { step: 1, heading: 'Call & Schedule', body: 'Call anytime — same-day appointments available for most jobs, and 24/7 emergency service for urgent electrical issues.' },
      { step: 2, heading: 'Safety Inspection', body: 'Our licensed electrician assesses the issue, checks for related safety concerns, and documents findings.' },
      { step: 3, heading: 'Upfront Estimate', body: 'We explain the problem clearly and provide a written flat-rate estimate before any work begins. No surprises.' },
      { step: 4, heading: 'Code-Compliant Work', body: 'All electrical work is completed to current NEC and local code standards. Permits are pulled when required.' },
      { step: 5, heading: 'Final Test & Sign-Off', body: 'We test all circuits, verify safety, and walk you through the completed work before leaving your property.' },
    ],
    faqH2: 'Frequently Asked Questions About Electrical Services',
    faqs: [
      { question: 'When do I need to upgrade my electrical panel?', answer: 'Signs you need a panel upgrade include frequently tripping breakers, flickering lights, a panel rated under 200 amps in an older home, or adding major appliances like an EV charger or hot tub. Panels over 25–30 years old should be inspected. We can assess your panel and advise honestly.' },
      { question: 'Is it safe to do my own electrical work?', answer: 'DIY electrical work is risky and often illegal without a permit. Improper wiring is a leading cause of house fires and can void your homeowner\'s insurance. Licensed electricians ensure the work is safe, code-compliant, and properly documented.' },
      { question: 'Why do my circuit breakers keep tripping?', answer: 'Frequent tripping usually means a circuit is overloaded, there\'s a short circuit, or a breaker is failing. It can also indicate a more serious wiring issue. We can diagnose and resolve the cause — not just reset the breaker.' },
      { question: 'How much does an electrical panel upgrade cost?', answer: 'A standard panel upgrade to 200 amps typically costs $1,500–$3,500 depending on your home\'s wiring, permit requirements, and local labor rates. We provide a detailed written estimate after a free inspection.' },
      { question: 'Do you install EV chargers?', answer: 'Yes. We install Level 2 home EV chargers (240V) for all major vehicle brands. Installation typically takes 2–4 hours and includes a dedicated circuit and the appropriate outlet or hardwired connection.' },
      { question: 'Do you pull permits for electrical work?', answer: 'Yes, when required. Permitted electrical work is inspected by the city and provides legal documentation that the work was done correctly — important for insurance and when selling your home.' },
      { question: 'What should I do in an electrical emergency?', answer: 'If you see sparking, smell burning, or have a complete power outage, turn off the main breaker if safe to do so, evacuate if there is any sign of fire, and call us immediately. Do not attempt to fix sparking or burning wiring yourself.' },
      { question: 'Are you licensed and insured?', answer: 'Yes. {{businessName}} holds a valid state electrical contractor license and carries full general liability and workers\' compensation insurance. All work is performed by licensed electricians.' },
    ],
    seoBody: `{{businessName}} is {{city}}'s trusted electrical contractor. We provide comprehensive electrical services including panel upgrades, wiring and rewiring, outlet installation, EV charger installation, generator hookups, and 24/7 emergency electrical repair. Our licensed electricians serve homeowners and businesses throughout {{city}} and the surrounding region with code-compliant work and upfront pricing.`,
  },
  seo: {
    schemaType: 'Electrician',
    metaDescriptionTemplate:
      'Licensed electrician in {{city}}. {{keyword}}, panel upgrades, EV chargers & emergency electrical repair. Call {{businessName}} now.',
  },
  calculator: {
    enabled: true,
    title: 'Electrical Cost Estimator',
    tabs: [
      {
        id: 'repair',
        label: 'Electrical Repair',
        resultLabel: 'Estimated Repair Cost',
        baseMin: 100,
        baseMax: 400,
        fields: [
          {
            id: 'type',
            label: 'Type of repair',
            type: 'select',
            options: [
              { label: 'Outlet or switch replacement', value: 1 },
              { label: 'Circuit breaker replacement', value: 1.5 },
              { label: 'Light fixture installation', value: 1.2 },
              { label: 'Ceiling fan installation', value: 1.4 },
              { label: 'Wiring repair (short / burn)', value: 2.5 },
            ],
          },
          {
            id: 'emergency',
            label: 'Emergency / after-hours?',
            type: 'checkbox',
            adder: 150,
          },
        ],
      },
      {
        id: 'panel',
        label: 'Panel Upgrade',
        resultLabel: 'Estimated Panel Upgrade Cost',
        baseMin: 1500,
        baseMax: 3500,
        fields: [
          {
            id: 'size',
            label: 'Upgrade to',
            type: 'select',
            options: [
              { label: '100 amp panel', value: 0.7 },
              { label: '200 amp panel (standard)', value: 1 },
              { label: '400 amp panel (large home)', value: 1.6 },
            ],
          },
          {
            id: 'rewire',
            label: 'Rewiring needed?',
            type: 'checkbox',
            adder: 1500,
          },
        ],
      },
    ],
  },
};

// ─── Locksmith ────────────────────────────────────────────────────────────────

const locksmithConfig: CategoryConfig = {
  id: 'locksmith',
  name: 'Locksmith Services',
  icon: '🔑',
  tagline: 'Lockouts, rekeying & security',
  isEmergency: true,
  defaultPrimaryKeyword: 'Locksmith Services',
  defaultPalette: { primary: '#1c1917', secondary: '#78716c' },
  defaultServices: [
    'Emergency Lockout Service',
    'Car Lockout Service',
    'House Lockout Service',
    'Lock Rekeying',
    'Lock Replacement & Installation',
    'Deadbolt Installation',
    'Smart Lock Installation',
    'Safe Opening & Installation',
    'Master Key System',
    'Commercial Locksmith Services',
    'Key Duplication',
    'Broken Key Extraction',
  ],
  copy: {
    heroTagline: 'Licensed Locksmiths. Fast Arrival.',
    heroSubheading: 'Locked out? Lost your keys? Our certified locksmiths arrive fast — 24/7, with upfront pricing.',
    ctaHeadline: 'Locked Out?',
    ctaSubtext: 'Don\'t break a window. Our licensed locksmiths arrive fast — usually within 30 minutes — with no damage to your lock or door.',
    ctaButton: 'Call Now — Fast Arrival',
    emergencyBadge: '24/7 Emergency Locksmith',
    servicePageBenefits: [
      { heading: 'Licensed, Bonded & Background-Checked', body: 'Every locksmith carries proper licensing and bonding and has passed a background check — giving you verified, trustworthy professionals at your door.' },
      { heading: 'Non-Destructive Entry', body: 'Our locksmiths use professional tools designed to open locks without damaging your hardware or door — saving you the cost of replacement.' },
      { heading: 'Price Quoted Before We Start', body: 'We give you an upfront price over the phone before arriving. If you\'re not comfortable with the quote, there\'s no obligation to proceed.' },
      { heading: 'Fast Arrival', body: 'We aim for 30-minute response times across our service area. Getting you back inside quickly — and safely — is our priority.' },
      { heading: 'Improves Your Security', body: 'A lockout is a good opportunity to assess your locks. We can rekey, upgrade, or replace hardware on the spot to improve your home\'s security.' },
      { heading: 'Available Every Day, Every Hour', body: 'Lockouts happen at inconvenient times. We\'re available 24/7, including weekends and holidays, with no after-hours premium surprises.' },
    ],
    trustBadges: ['Licensed & Bonded', '30-Min Response', 'Upfront Pricing'],
    whyUsPoints: [
      'Licensed, bonded, and background-checked locksmiths',
      'Fast arrival — typically within 30 minutes',
      'Upfront pricing quoted before we start',
      'Non-destructive entry — we protect your locks and doors',
    ],
    schemaDescription: `Licensed locksmith services in {{city}}, {{state}}. 24/7 lockouts, rekeying, lock installation, and smart lock setup. Fast arrival, upfront pricing.`,
    schemaOfferCatalogName: 'Locksmith Services',
    footerEmergencyText: 'Available around the clock for lockouts and security emergencies.',
    whatsappMessage: 'Hi, I need a locksmith!',
    introParas: [
      `Getting locked out of your home, car, or business is stressful — but help is never far away. {{businessName}} provides fast, professional locksmith services throughout {{city}}, arriving quickly with the tools and expertise to get you back inside without damaging your lock or door.`,
      `Beyond lockouts, we handle rekeying, lock upgrades, deadbolt installation, smart lock setup, and commercial security solutions. Every job is quoted upfront so there are never any surprises on your bill.`,
      `{{businessName}} is {{city}}'s trusted locksmith — licensed, bonded, and background-checked for your peace of mind.`,
    ],
    processH2: 'Our Locksmith Service Process',
    processSteps: [
      { step: 1, heading: 'Call Us', body: 'Call anytime — our dispatch team answers 24/7 and will have a licensed locksmith on the way to your location fast.' },
      { step: 2, heading: 'ETA & Upfront Quote', body: 'We give you an accurate arrival time and a clear price quote over the phone before the locksmith arrives — no surprises.' },
      { step: 3, heading: 'Fast, Non-Destructive Entry', body: 'Our locksmith uses professional tools to open your lock without damaging your door or hardware whenever possible.' },
      { step: 4, heading: 'Security Assessment', body: 'We inspect your locks and recommend upgrades if your current hardware is worn, outdated, or easily bypassed.' },
      { step: 5, heading: 'Job Complete', body: 'We verify everything is working correctly, answer any questions, and leave your property secure.' },
    ],
    faqH2: 'Frequently Asked Questions About Locksmith Services',
    faqs: [
      { question: 'How fast can you arrive for a lockout?', answer: 'We typically arrive within 30 minutes in most of our {{city}} service area. Response time depends on your specific location and current call volume. We give you an accurate ETA when you call.' },
      { question: 'Will you damage my lock or door to get me in?', answer: 'In the vast majority of cases, no. Our locksmiths use professional non-destructive entry techniques designed to open locks without causing damage. If destructive entry is truly necessary, we will always discuss it and get your approval first.' },
      { question: 'How much does a lockout service cost?', answer: 'Lockout pricing depends on the type of lock and time of day. Residential lockouts typically range from $75–$150. We quote the price before starting — if you\'re not happy with the quote, you\'re not obligated to proceed.' },
      { question: 'Can you make a key without the original?', answer: 'Yes. We can cut a new key from the lock itself using specialized tools. We can also rekey the lock to a new key if your original is lost and you\'re concerned about security.' },
      { question: 'What is rekeying and when should I do it?', answer: 'Rekeying changes the internal pins of your lock so old keys no longer work. It\'s cheaper than replacing the lock and recommended after moving into a new home, losing keys, ending a relationship, or dismissing an employee who had access.' },
      { question: 'Do you install smart locks?', answer: 'Yes. We install and program all major smart lock brands including Schlage, Kwikset, Yale, and August. Smart locks can be integrated with your existing door hardware and home automation system.' },
      { question: 'Are you available on weekends and holidays?', answer: 'Yes. Our locksmith service is available 24 hours a day, 7 days a week — including weekends and holidays. Lockouts don\'t follow business hours, and neither do we.' },
      { question: 'Are your locksmiths licensed and background-checked?', answer: 'Yes. All {{businessName}} locksmiths are licensed, bonded, and have passed background checks. We carry proper identification and will show it upon arrival.' },
    ],
    seoBody: `{{businessName}} is {{city}}'s trusted locksmith service. We provide 24/7 emergency lockout service for homes, cars, and businesses — plus rekeying, lock replacement, deadbolt and smart lock installation, key duplication, and commercial security solutions. Our licensed, bonded locksmiths serve {{city}} and the surrounding region with fast arrival and upfront pricing.`,
  },
  seo: {
    schemaType: 'Locksmith',
    metaDescriptionTemplate:
      'Licensed locksmith in {{city}}. 24/7 lockouts, rekeying, smart locks & more. Fast arrival. Call {{businessName}} now.',
  },
  calculator: {
    enabled: true,
    title: 'Locksmith Cost Estimator',
    tabs: [
      {
        id: 'lockout',
        label: 'Lockout Service',
        resultLabel: 'Estimated Lockout Cost',
        baseMin: 75,
        baseMax: 150,
        fields: [
          {
            id: 'type',
            label: 'Type of lockout',
            type: 'select',
            options: [
              { label: 'Home / residential', value: 1 },
              { label: 'Car / auto', value: 1.1 },
              { label: 'Business / commercial', value: 1.3 },
              { label: 'Safe lockout', value: 2.5 },
            ],
          },
          {
            id: 'time',
            label: 'Time of day',
            type: 'select',
            options: [
              { label: 'Business hours (8am–6pm)', value: 1 },
              { label: 'Evening (6pm–midnight)', value: 1.3 },
              { label: 'Late night / holiday', value: 1.6 },
            ],
          },
        ],
      },
      {
        id: 'rekey',
        label: 'Rekey / Lock Change',
        resultLabel: 'Estimated Cost',
        baseMin: 60,
        baseMax: 120,
        fields: [
          {
            id: 'service',
            label: 'Service needed',
            type: 'select',
            options: [
              { label: 'Rekey single lock', value: 1 },
              { label: 'Rekey whole home (4–6 locks)', value: 3.5 },
              { label: 'Deadbolt installation', value: 1.5 },
              { label: 'Smart lock installation', value: 2.2 },
            ],
          },
        ],
      },
    ],
  },
};

// ─── Fire & Smoke Damage ──────────────────────────────────────────────────────

const fireDamageConfig: CategoryConfig = {
  id: 'fire-damage',
  name: 'Fire Damage Restoration',
  icon: '🔥',
  tagline: 'Fire, smoke & soot cleanup',
  isEmergency: true,
  defaultPrimaryKeyword: 'Fire Damage Restoration',
  defaultPalette: { primary: '#7c2d12', secondary: '#ea580c' },
  defaultServices: [
    'Fire Damage Restoration',
    'Smoke & Soot Cleanup',
    'Odor Removal & Deodorization',
    'Board-Up & Tarping Services',
    'Structural Assessment & Repair',
    'Content Cleaning & Pack-Out',
    'Air Quality Testing & Restoration',
    'Water Damage from Firefighting',
    'Mold Prevention After Fire',
    'Insurance Claim Assistance',
    'Full Property Reconstruction',
    'Commercial Fire Restoration',
  ],
  copy: {
    heroTagline: 'Certified Restoration Experts. 24/7 Response.',
    heroSubheading: 'Fast, certified fire and smoke damage restoration — we secure, clean, and restore your property completely.',
    ctaHeadline: 'Fire or Smoke Damage?',
    ctaSubtext: 'Smoke and soot cause ongoing damage every hour after a fire. Call now for immediate response and a free damage assessment.',
    ctaButton: 'Call Now — Free Assessment',
    emergencyBadge: '24/7 Emergency Response',
    servicePageBenefits: [
      { heading: 'IICRC-Certified Restoration Team', body: 'Fire and smoke restoration requires specialized training. Our IICRC-certified technicians follow proven protocols to restore your property safely and completely.' },
      { heading: 'Immediate Board-Up & Securing', body: 'We secure your property immediately after arrival — boarding up openings and tarping roof damage to prevent further weather, theft, or vandalism damage.' },
      { heading: 'Complete Smoke & Odor Elimination', body: 'Smoke penetrates deep into materials. We use industrial air scrubbers, thermal fogging, and ozone treatment to neutralize odor at the molecular level — not mask it.' },
      { heading: 'Full Insurance Claim Support', body: 'We provide complete damage documentation in the format insurers require, communicate directly with your adjuster, and work to maximize your claim coverage.' },
      { heading: 'Contents Cleaning & Pack-Out', body: 'We professionally clean and restore salvageable belongings — furniture, documents, clothing, electronics — rather than simply replacing everything.' },
      { heading: 'Single Contractor, Full Restoration', body: 'We handle everything from emergency response through structural reconstruction in-house — one point of contact, one timeline, no coordination headaches.' },
    ],
    trustBadges: ['IICRC Certified', 'Licensed & Insured', 'Insurance Claims Help'],
    whyUsPoints: [
      'IICRC-certified fire and smoke restoration technicians',
      'Immediate board-up and tarping to secure your property',
      'Full insurance claim documentation and adjuster support',
      'Complete restoration — from cleanup to reconstruction',
    ],
    schemaDescription: `Professional fire damage restoration in {{city}}, {{state}}. IICRC-certified technicians for fire, smoke, soot cleanup, odor removal, and full property restoration. 24/7 emergency response.`,
    schemaOfferCatalogName: 'Fire Damage Restoration Services',
    footerEmergencyText: 'Available around the clock for fire and smoke damage emergencies.',
    whatsappMessage: 'Hi, I need fire damage restoration help!',
    introParas: [
      `Fire damage extends far beyond what the flames touch. Smoke and soot penetrate walls, ceilings, and belongings — continuing to cause damage and health risks long after the fire is out. {{businessName}} provides fast, IICRC-certified fire damage restoration throughout {{city}} to stop further damage and restore your property completely.`,
      `Our response team arrives quickly to secure the structure, remove debris, and begin the restoration process. We handle everything from smoke odor elimination to full structural reconstruction, so you only need to make one call.`,
      `{{businessName}} works directly with your insurance company from the first call to the final walkthrough — documenting all damage, coordinating with adjusters, and making sure you receive the full benefit of your policy.`,
    ],
    processH2: 'Our Fire Damage Restoration Process',
    processSteps: [
      { step: 1, heading: 'Emergency Response', body: 'We respond 24/7. Our team arrives quickly to assess the damage, secure the structure with board-up or tarping, and prevent further loss.' },
      { step: 2, heading: 'Damage Assessment', body: 'We document all fire, smoke, soot, and water damage with photos and detailed reports — everything your insurance adjuster needs.' },
      { step: 3, heading: 'Water & Debris Removal', body: 'We extract water left by firefighting efforts, remove charred debris, and begin the drying and cleanup process immediately.' },
      { step: 4, heading: 'Smoke & Odor Elimination', body: 'Industrial air scrubbers, thermal fogging, and specialized cleaning agents remove smoke odor from surfaces, air ducts, and belongings.' },
      { step: 5, heading: 'Full Restoration', body: 'We repair and rebuild damaged structural elements, restoring your property to pre-fire condition with full documentation throughout.' },
    ],
    faqH2: 'Frequently Asked Questions About Fire Damage Restoration',
    faqs: [
      { question: 'How soon should I call a restoration company after a fire?', answer: 'Immediately. Smoke and soot are acidic and continue damaging surfaces, metals, and fabrics every hour after a fire. The sooner restoration begins, the more of your property can be saved and the lower the total repair cost.' },
      { question: 'Is smoke damage covered by homeowner\'s insurance?', answer: 'Yes. Most standard homeowner\'s insurance policies cover fire and smoke damage, including cleanup, odor removal, content replacement, and structural repairs. We work directly with your insurance company and provide complete documentation to support your claim.' },
      { question: 'Can smoke smell be completely removed?', answer: 'Yes, in most cases. Professional smoke odor elimination uses thermal fogging, ozone treatment, air scrubbing, and specialized cleaning agents to neutralize odor at the molecular level — not just mask it. DIY methods are rarely effective for serious smoke damage.' },
      { question: 'Do I need to leave my home after a fire?', answer: 'Depending on the severity, you may need to vacate for safety, air quality, or structural reasons. We assess the situation immediately and advise you on the safest course of action. If relocation is necessary, your insurance policy typically covers additional living expenses.' },
      { question: 'Can my belongings be saved after fire damage?', answer: 'Many contents can be professionally cleaned and restored — including furniture, documents, electronics, clothing, and sentimental items. We perform a content assessment early in the process and pack out salvageable belongings for specialized cleaning.' },
      { question: 'What is board-up service?', answer: 'After a fire, windows, doors, and compromised walls must be secured immediately to prevent weather damage, theft, and unauthorized entry. We provide emergency board-up and tarping as part of our immediate response service.' },
      { question: 'How long does fire damage restoration take?', answer: 'Minor fire damage may be cleaned up in a few days. More extensive damage involving structural repairs can take several weeks to months. We provide a detailed timeline after our initial assessment and keep you informed throughout the process.' },
      { question: 'Do you handle the insurance claim process?', answer: 'Yes. We provide complete documentation of all damage, communicate directly with your adjuster, and help you understand and maximize your claim. We have extensive experience working with all major insurance carriers.' },
    ],
    seoBody: `{{businessName}} is {{city}}'s trusted fire damage restoration company. We provide comprehensive restoration services including fire and smoke cleanup, soot removal, odor elimination, board-up and tarping, water extraction, content cleaning, and full structural reconstruction. Our IICRC-certified team serves homeowners and businesses throughout {{city}} and the surrounding region with 24/7 emergency response and complete insurance claim support.`,
  },
  seo: {
    schemaType: 'HomeAndConstructionBusiness',
    metaDescriptionTemplate:
      'Professional fire damage restoration in {{city}}. {{keyword}}, smoke cleanup, odor removal & full reconstruction. 24/7 response. Call {{businessName}}.',
  },
  calculator: {
    enabled: true,
    title: 'Fire Damage Cost Estimator',
    tabs: [
      {
        id: 'cleanup',
        label: 'Cleanup & Restoration',
        resultLabel: 'Estimated Restoration Cost',
        baseMin: 3000,
        baseMax: 8000,
        fields: [
          {
            id: 'severity',
            label: 'Fire severity',
            type: 'select',
            options: [
              { label: 'Minor (one room, mostly smoke)', value: 1 },
              { label: 'Moderate (multiple rooms)', value: 2.5 },
              { label: 'Severe (structural damage)', value: 5 },
              { label: 'Total loss / rebuild needed', value: 12 },
            ],
          },
          {
            id: 'odor',
            label: 'Smoke odor treatment needed?',
            type: 'checkbox',
            adder: 800,
          },
          {
            id: 'content',
            label: 'Content pack-out & cleaning?',
            type: 'checkbox',
            adder: 1500,
          },
        ],
      },
    ],
  },
};

// ─── Mold Remediation ─────────────────────────────────────────────────────────

const moldRemediationConfig: CategoryConfig = {
  id: 'mold-remediation',
  name: 'Mold Remediation',
  icon: '🦠',
  tagline: 'Mold testing, removal & prevention',
  isEmergency: false,
  defaultPrimaryKeyword: 'Mold Remediation',
  defaultPalette: { primary: '#14532d', secondary: '#16a34a' },
  defaultServices: [
    'Mold Inspection & Testing',
    'Mold Remediation & Removal',
    'Black Mold Removal',
    'Crawl Space Mold Remediation',
    'Basement Mold Removal',
    'Attic Mold Remediation',
    'Air Quality Testing',
    'Mold Prevention & Encapsulation',
    'Post-Remediation Verification Testing',
    'HVAC Mold Cleaning',
    'Structural Drying & Moisture Control',
    'Insurance Claim Assistance',
  ],
  copy: {
    heroTagline: 'Certified Mold Experts. Safe Removal.',
    heroSubheading: 'Professional mold inspection, testing, and remediation — protecting your home\'s air quality and your family\'s health.',
    ctaHeadline: 'Mold Problem?',
    ctaSubtext: 'Mold spreads quickly and affects indoor air quality. Get a professional inspection today — before the problem grows.',
    ctaButton: 'Call Now — Free Consultation',
    emergencyBadge: 'IICRC Certified Mold Removal',
    servicePageBenefits: [
      { heading: 'IICRC-Certified Mold Specialists', body: 'Mold remediation requires specialized training and EPA-compliant protocols. Our IICRC-certified specialists handle every job to industry-recognized standards.' },
      { heading: 'Proper Containment', body: 'We establish negative air pressure containment zones before removing mold — preventing spores from spreading to unaffected areas of your property during the process.' },
      { heading: 'Root Cause Correction', body: 'Mold always has a moisture source. We identify and address the underlying cause — not just the visible growth — so the mold doesn\'t return after remediation.' },
      { heading: 'Third-Party Verification Testing', body: 'After remediation, independent air quality testing verifies spore levels are normal — giving you documented proof the job was done completely.' },
      { heading: 'Protects Your Family\'s Health', body: 'Mold exposure causes respiratory issues, allergy symptoms, and other health problems. Professional remediation restores safe indoor air quality for your household.' },
      { heading: 'Insurance Documentation', body: 'We provide complete remediation reports, air quality test results, and work documentation to support your insurance claim from start to finish.' },
    ],
    trustBadges: ['IICRC Certified', 'Licensed & Insured', 'Post-Remediation Testing'],
    whyUsPoints: [
      'IICRC-certified mold remediation specialists',
      'Third-party post-remediation verification testing',
      'Safe containment — prevents cross-contamination',
      'Address root cause to prevent recurrence',
    ],
    schemaDescription: `Professional mold remediation services in {{city}}, {{state}}. IICRC-certified specialists for mold inspection, testing, removal, and prevention. Safe, thorough, and fully documented.`,
    schemaOfferCatalogName: 'Mold Remediation Services',
    footerEmergencyText: 'Contact us anytime for mold inspections and remediation consultations.',
    whatsappMessage: 'Hi, I think I have a mold problem and need help!',
    introParas: [
      `Mold is more than an eyesore — it\'s a health hazard. Exposure to mold spores can cause respiratory problems, allergic reactions, and long-term health issues for your family. {{businessName}} provides professional mold inspection, testing, and remediation throughout {{city}}, addressing both the visible mold and the moisture problem causing it.`,
      `Our IICRC-certified remediation specialists use proper containment and removal protocols to eliminate mold safely — without spreading spores to unaffected areas. We then conduct post-remediation testing to verify the job was done completely.`,
      `{{businessName}} doesn\'t just remove mold — we find and fix the source of moisture that allowed it to grow, giving you lasting results instead of a temporary fix.`,
    ],
    processH2: 'Our Mold Remediation Process',
    processSteps: [
      { step: 1, heading: 'Inspection & Testing', body: 'We perform a thorough visual inspection and air quality testing to identify all affected areas and determine the type and severity of mold present.' },
      { step: 2, heading: 'Containment', body: 'We seal off affected areas using physical barriers and negative air pressure to prevent mold spores from spreading to unaffected parts of your home during removal.' },
      { step: 3, heading: 'Mold Removal', body: 'All mold-contaminated materials are safely removed, bagged, and disposed of per EPA guidelines. Affected surfaces are treated with EPA-registered antimicrobial agents.' },
      { step: 4, heading: 'Moisture Source Fix', body: 'We address the root cause — whether it\'s a leak, poor ventilation, or humidity issue — to prevent mold from returning.' },
      { step: 5, heading: 'Post-Remediation Testing', body: 'Third-party air quality testing verifies that mold levels have returned to normal — giving you documented proof the job was done completely.' },
    ],
    faqH2: 'Frequently Asked Questions About Mold Remediation',
    faqs: [
      { question: 'How do I know if I have mold?', answer: 'Common signs include visible dark spots or discoloration on walls, ceilings, or floors; a persistent musty or earthy odor; unexplained allergy-like symptoms in occupants; or a history of water damage or leaks. If you suspect mold, a professional inspection can confirm it.' },
      { question: 'Is mold dangerous?', answer: 'Yes, depending on the type and level of exposure. Common molds can cause allergy symptoms, respiratory irritation, and headaches. Black mold (Stachybotrys) and other toxic molds can cause more serious health effects. We recommend professional testing and removal for any significant mold growth.' },
      { question: 'Can I remove mold myself?', answer: 'Small surface mold patches (under 10 square feet) on non-porous surfaces can sometimes be cleaned by homeowners. But mold inside walls, in HVAC systems, in crawl spaces, or covering large areas requires professional remediation with proper containment to prevent spreading spores.' },
      { question: 'How long does mold remediation take?', answer: 'A small remediation job may take 1–2 days. Larger infestations involving multiple rooms or structural materials can take 3–7 days or more. We provide a timeline after our initial assessment.' },
      { question: 'Will mold come back after remediation?', answer: 'Not if the moisture source is properly addressed. Mold needs moisture to grow — our process includes identifying and fixing the root cause (leaks, condensation, humidity) as part of remediation. Simply removing visible mold without fixing the moisture problem will result in recurrence.' },
      { question: 'Does homeowner\'s insurance cover mold remediation?', answer: 'It depends on the cause. If mold resulted from a covered peril (like a sudden pipe burst), your insurance may cover remediation. Mold from long-term neglect or gradual leaks is typically not covered. We provide documentation to support your claim.' },
      { question: 'What is post-remediation testing?', answer: 'After remediation is complete, an independent third-party laboratory performs air quality and surface testing to verify that mold levels are back within normal ranges. This provides documented proof that the remediation was successful — important for your peace of mind and for insurance purposes.' },
      { question: 'How much does mold remediation cost?', answer: 'Costs depend on the size of the affected area, the type of mold, and whether structural materials need to be removed. Small jobs may cost $500–$1,500, while larger infestations can run $3,000–$10,000+. We provide a detailed written estimate after inspection.' },
    ],
    seoBody: `{{businessName}} is {{city}}'s trusted mold remediation company. We provide professional mold inspection and testing, safe mold removal and remediation, post-remediation verification testing, and moisture source correction. Our IICRC-certified specialists serve homeowners and businesses throughout {{city}} and the surrounding region with thorough, documented remediation that addresses both the mold and the root cause.`,
  },
  seo: {
    schemaType: 'HomeAndConstructionBusiness',
    metaDescriptionTemplate:
      'Professional mold remediation in {{city}}. {{keyword}}, mold inspection, black mold removal & air quality testing. Call {{businessName}} today.',
  },
  calculator: {
    enabled: true,
    title: 'Mold Remediation Cost Estimator',
    tabs: [
      {
        id: 'remediation',
        label: 'Remediation Cost',
        resultLabel: 'Estimated Remediation Cost',
        baseMin: 500,
        baseMax: 2000,
        fields: [
          {
            id: 'area',
            label: 'Affected area size',
            type: 'select',
            options: [
              { label: 'Small (under 10 sq ft)', value: 1 },
              { label: 'Medium (10–50 sq ft)', value: 2.5 },
              { label: 'Large (50–200 sq ft)', value: 5 },
              { label: 'Extensive (200+ sq ft or structural)', value: 10 },
            ],
          },
          {
            id: 'location',
            label: 'Location of mold',
            type: 'select',
            options: [
              { label: 'Surface / drywall (accessible)', value: 1 },
              { label: 'Crawl space or basement', value: 1.8 },
              { label: 'Inside walls (drywall removal needed)', value: 2 },
              { label: 'Attic', value: 1.5 },
              { label: 'HVAC system', value: 2.2 },
            ],
          },
          {
            id: 'testing',
            label: 'Post-remediation testing?',
            type: 'checkbox',
            adder: 300,
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
  hvacConfig,
  electricalConfig,
  locksmithConfig,
  fireDamageConfig,
  moldRemediationConfig,
  // future: pestControlConfig, treeServiceConfig, ...
];

export function getCategoryConfig(id: string): CategoryConfig {
  return CATEGORIES.find(c => c.id === id) ?? waterDamageConfig;
}
