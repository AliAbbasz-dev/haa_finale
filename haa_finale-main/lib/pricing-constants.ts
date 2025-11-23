// HAA Pricing & Plans Configuration
// Source: HAA Pricing & Plans – Developer Hand-Off (v1.0)

export type CustomerSegment = 'residential' | 'landlord' | 'commercial' | 'marketplace';
export type BillingCycle = 'monthly' | 'annual';

// Residential Plans
export interface ResidentialPlan {
  id: string;
  name: string;
  tier: 'essentials' | 'premium' | 'signature';
  monthlyPrice: number;
  annualPrice: number;
  seats: number;
  vehicles: number;
  features: string[];
  sizingRules: {
    maxSqFt?: number;
    minSqFt?: number;
    bedrooms?: string;
    bathrooms?: string;
  };
}

export const RESIDENTIAL_PLANS: ResidentialPlan[] = [
  {
    id: 'residential-essentials',
    name: 'Essentials',
    tier: 'essentials',
    monthlyPrice: 0,
    annualPrice: 0,
    seats: 1,
    vehicles: 1,
    features: [
      '14-day try experience',
      '1 property (read-only after trial)',
      '5 documents',
      'Basic reminders',
      'Recall alerts',
      'Community Q&A',
    ],
    sizingRules: {},
  },
  {
    id: 'residential-premium',
    name: 'Premium',
    tier: 'premium',
    monthlyPrice: 11.99,
    annualPrice: 99,
    seats: 3,
    vehicles: 3,
    features: [
      'Unlimited documents',
      'Smart reminders',
      'OCR receipts',
      'Warranty tracking',
      'Maintenance calendar',
      'Budget planner',
      'Room & system inventory templates',
      'Advanced analytics',
      'Export (CSV/PDF)',
      'Partner discounts',
      'Priority email support',
    ],
    sizingRules: {
      maxSqFt: 2999,
      bedrooms: '3-4 bed',
      bathrooms: '2.5-3 bath',
    },
  },
  {
    id: 'residential-signature',
    name: 'Signature',
    tier: 'signature',
    monthlyPrice: 17.99,
    annualPrice: 149,
    seats: 5,
    vehicles: 4,
    features: [
      'All Premium features',
      'Premium backup/versioning',
      'Multi-zone maintenance schedules',
      'Preferred vendor concierge',
      'Priority chat support',
    ],
    sizingRules: {
      minSqFt: 3000,
      bedrooms: '4+ bed',
      bathrooms: '3+ bath',
    },
  },
];

// Landlord/PM Plans
export interface LandlordPlan {
  id: string;
  name: string;
  tier: 'lite' | 'pro' | 'portfolio' | 'enterprise';
  monthlyPricePerUnit?: number;
  fixedMonthlyPrice?: number;
  fixedAnnualPrice?: number;
  minMonthlyPrice?: number;
  unitRange: {
    min: number;
    max?: number;
  };
  features: string[];
}

export const LANDLORD_PLANS: LandlordPlan[] = [
  {
    id: 'landlord-lite',
    name: 'Landlord Lite',
    tier: 'lite',
    fixedMonthlyPrice: 12.99,
    fixedAnnualPrice: 119,
    unitRange: { min: 1, max: 10 },
    features: [
      'Everything in Residential Plus',
      'Units & leases (basic)',
      'Tenant contact hub',
      'Work orders w/ photos/video',
      'AI triage (DIY vs dispatch)',
      'Vendor shortlist',
      'In-app bookings/payments',
      'Turnover checklists',
      'Recurring tasks',
      'Schedule E & receipts export',
    ],
  },
  {
    id: 'landlord-pro',
    name: 'Landlord Pro',
    tier: 'pro',
    monthlyPricePerUnit: 1.50,
    minMonthlyPrice: 29,
    unitRange: { min: 11, max: 50 },
    features: [
      'All Lite features',
      'Tenant maintenance portal (web + QR/door)',
      'Bulk uploads',
      'Template libraries',
      'SLA rules & auto-dispatch',
      'Role-based access (owner/PM/tech)',
      'Analytics (CPU, vendor scorecards, CapEx planner)',
    ],
  },
  {
    id: 'landlord-portfolio',
    name: 'Portfolio PM',
    tier: 'portfolio',
    monthlyPricePerUnit: 1.20,
    minMonthlyPrice: 99,
    unitRange: { min: 51, max: 250 },
    features: [
      'All Pro features',
      'Multi-property dashboards',
      'Building/system hierarchies',
      'Preventive maintenance plans per asset',
      'Compliance packs (detectors, permits, COI)',
      'Custom fields',
      'Webhooks',
      'SSO (Google/Microsoft)',
      '1099 vendor export',
      'GL mapping',
    ],
  },
  {
    id: 'landlord-enterprise',
    name: 'Enterprise PM',
    tier: 'enterprise',
    monthlyPricePerUnit: 0.95,
    minMonthlyPrice: 2000,
    unitRange: { min: 251 },
    features: [
      'API + white-label portals (owner/tenant)',
      'SSO/SAML',
      'Sandbox',
      'Uptime SLA',
      'Integrations (Yardi/AppFolio/Buildium/QuickBooks via API)',
      'Dedicated CSM',
      'Quarterly reviews',
      'Data enrichment',
    ],
  },
];

// Commercial Plans
export interface CommercialPlan {
  id: string;
  name: string;
  tier: 'core' | 'growth' | 'enterprise';
  pricePerSite?: number;
  minMonthlyPrice?: number;
  customPricing?: boolean;
  siteRange: {
    min: number;
    max?: number;
  };
  features: string[];
}

export const COMMERCIAL_PLANS: CommercialPlan[] = [
  {
    id: 'commercial-core',
    name: 'Commercial Core',
    tier: 'core',
    pricePerSite: 39,
    minMonthlyPrice: 39,
    siteRange: { min: 1, max: 5 },
    features: [
      'Asset registry per site (systems & equipment)',
      'Preventive maintenance schedules',
      'Work orders with photos/video',
      'Vendor directory',
      'COI storage',
      'Basic analytics',
      'Export (CSV/PDF)',
    ],
  },
  {
    id: 'commercial-growth',
    name: 'Commercial Growth',
    tier: 'growth',
    pricePerSite: 29,
    minMonthlyPrice: 149,
    siteRange: { min: 6, max: 50 },
    features: [
      'All Core features',
      'Multi-site dashboards',
      'SLA policy engine',
      'Auto-dispatch to preferred vendors',
      'Role-based access (ops/tech/finance)',
      'Budget & CapEx planner',
      'QR codes for rooms/equipment',
      'Webhooks',
      'SSO (Google/Microsoft)',
    ],
  },
  {
    id: 'commercial-enterprise',
    name: 'Commercial Enterprise',
    tier: 'enterprise',
    customPricing: true,
    minMonthlyPrice: 2000,
    siteRange: { min: 51 },
    features: [
      'API & white-label portals',
      'SSO/SAML',
      'Sandbox',
      'Uptime SLA',
      'Procurement integrations',
      'Advanced compliance (permits, inspections)',
      'GL mapping',
      'Custom data contracts',
      'Dedicated CSM & quarterly reviews',
    ],
  },
];

// Marketplace/Service Provider Plans
export interface MarketplacePlan {
  id: string;
  name: string;
  tier: 'free' | 'growth' | 'pro';
  monthlyPrice: number;
  leadCredits: number | null;
  features: string[];
}

export const MARKETPLACE_PLANS: MarketplacePlan[] = [
  {
    id: 'marketplace-free',
    name: 'Free Listing',
    tier: 'free',
    monthlyPrice: 0,
    leadCredits: null,
    features: [
      'Public profile',
      'Reviews',
      'Pay-per-lead access',
    ],
  },
  {
    id: 'marketplace-growth',
    name: 'Growth',
    tier: 'growth',
    monthlyPrice: 99,
    leadCredits: 0,
    features: [
      'Featured placement',
      'Booking & payments',
      'Inbox',
      'Quotes',
      'CRM-lite',
      'Reviews management',
      'Basic analytics',
    ],
  },
  {
    id: 'marketplace-pro',
    name: 'Pro',
    tier: 'pro',
    monthlyPrice: 299,
    leadCredits: 30,
    features: [
      'All Growth features',
      'API/Zapier',
      'Multi-seat',
      'Route planning',
      'Advanced analytics',
      'Dedicated support',
    ],
  },
];

// Lead Pricing
export interface LeadPricing {
  complexity: 'low' | 'medium' | 'high';
  priceRange: {
    min: number;
    max: number;
  };
  examples: string[];
}

export const LEAD_PRICING: LeadPricing[] = [
  {
    complexity: 'low',
    priceRange: { min: 8, max: 15 },
    examples: ['Lockout', 'Minor repair'],
  },
  {
    complexity: 'medium',
    priceRange: { min: 20, max: 35 },
    examples: ['Appliance install', 'Brake service'],
  },
  {
    complexity: 'high',
    priceRange: { min: 40, max: 120 },
    examples: ['HVAC install', 'Roof repair', 'Engine work'],
  },
];

// Add-Ons
export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number | string;
  pricingModel: 'fixed' | 'per-unit' | 'per-use' | 'per-user' | 'per-market';
  applicableTo: CustomerSegment[];
}

export const ADD_ONS: AddOn[] = [
  // Residential Add-Ons
  {
    id: 'residential-reports-bundle',
    name: 'Reports Bundle',
    description: 'VIN history + permit lookup',
    price: 4.99,
    pricingModel: 'fixed',
    applicableTo: ['residential'],
  },
  {
    id: 'residential-photo-scanner',
    name: 'Home Inventory Photo Scanner',
    description: 'Scan and catalog items',
    price: '$9 per 100 items',
    pricingModel: 'per-use',
    applicableTo: ['residential'],
  },
  {
    id: 'residential-premium-backup',
    name: 'Premium Encrypted Backup/Versioning',
    description: 'Included with Signature or $1.99/mo add-on',
    price: 1.99,
    pricingModel: 'fixed',
    applicableTo: ['residential'],
  },
  // Landlord Add-Ons
  {
    id: 'landlord-emergency-triage',
    name: '24/7 Emergency Triage Line',
    description: 'Round-the-clock emergency support',
    price: '$0.25/unit/mo (min $25)',
    pricingModel: 'per-unit',
    applicableTo: ['landlord'],
  },
  {
    id: 'landlord-inspection-kit',
    name: 'Inspection Kit',
    description: 'Mobile forms + photo markup',
    price: '$9/user/mo',
    pricingModel: 'per-user',
    applicableTo: ['landlord'],
  },
  {
    id: 'landlord-docs-ocr',
    name: 'Lease/Docs OCR',
    description: 'Extract text from documents',
    price: '$5 per 100 pages',
    pricingModel: 'per-use',
    applicableTo: ['landlord'],
  },
  {
    id: 'landlord-advanced-backup',
    name: 'Advanced Backups & Retention',
    description: 'Extended backup retention',
    price: 2,
    pricingModel: 'fixed',
    applicableTo: ['landlord'],
  },
  {
    id: 'landlord-vendor-badge',
    name: 'Preferred Vendor Network Badge',
    description: 'Visibility in vendor marketplace',
    price: '$49/mo per market',
    pricingModel: 'per-market',
    applicableTo: ['landlord'],
  },
  // Commercial Add-Ons
  {
    id: 'commercial-emergency-triage',
    name: '24/7 Emergency Triage Line',
    description: 'Base + per-site pricing',
    price: '$99/mo base + $10/site/mo',
    pricingModel: 'per-unit',
    applicableTo: ['commercial'],
  },
  {
    id: 'commercial-inspections',
    name: 'Advanced Inspections',
    description: 'Mobile forms + image markup',
    price: '$12/user/mo',
    pricingModel: 'per-user',
    applicableTo: ['commercial'],
  },
  {
    id: 'commercial-docs-ocr',
    name: 'Document OCR',
    description: 'Leases, permits, warranties',
    price: '$5 per 100 pages',
    pricingModel: 'per-use',
    applicableTo: ['commercial'],
  },
  {
    id: 'commercial-vendor-compliance',
    name: 'Vendor Compliance Pack',
    description: 'COI reminders, W-9, background checks',
    price: '$49/mo per vendor',
    pricingModel: 'per-unit',
    applicableTo: ['commercial'],
  },
  {
    id: 'commercial-multi-brand-reporting',
    name: 'Multi-Brand Reporting Bundle',
    description: 'Advanced reporting across brands',
    price: 199,
    pricingModel: 'fixed',
    applicableTo: ['commercial'],
  },
];

// Helper Functions
export function calculateResidentialPlan(sqft?: number, bedrooms?: number, bathrooms?: number): 'premium' | 'signature' {
  let premiumScore = 0;
  let signatureScore = 0;

  // Check square footage
  if (sqft) {
    if (sqft <= 2999) premiumScore++;
    if (sqft >= 3000) signatureScore++;
  }

  // Check bedrooms
  if (bedrooms) {
    if (bedrooms >= 3 && bedrooms <= 4) premiumScore++;
    if (bedrooms >= 4) signatureScore++;
  }

  // Check bathrooms
  if (bathrooms) {
    if (bathrooms >= 2.5 && bathrooms <= 3) premiumScore++;
    if (bathrooms >= 3) signatureScore++;
  }

  // If there's a conflict, use the higher tier (per spec)
  if (signatureScore > 0) return 'signature';
  return 'premium';
}

export function calculateLandlordPrice(units: number, billingCycle: BillingCycle = 'monthly'): { plan: LandlordPlan; price: number } | null {
  let selectedPlan: LandlordPlan | null = null;

  for (const plan of LANDLORD_PLANS) {
    if (units >= plan.unitRange.min && (!plan.unitRange.max || units <= plan.unitRange.max)) {
      selectedPlan = plan;
      break;
    }
  }

  if (!selectedPlan) return null;

  let price = 0;
  if (selectedPlan.tier === 'lite') {
    price = billingCycle === 'annual' ? selectedPlan.fixedAnnualPrice! : selectedPlan.fixedMonthlyPrice!;
  } else {
    const calculated = units * (selectedPlan.monthlyPricePerUnit || 0);
    price = Math.max(calculated, selectedPlan.minMonthlyPrice || 0);
  }

  return { plan: selectedPlan, price };
}

export function calculateCommercialPrice(sites: number): { plan: CommercialPlan; price: number } | null {
  let selectedPlan: CommercialPlan | null = null;

  for (const plan of COMMERCIAL_PLANS) {
    if (sites >= plan.siteRange.min && (!plan.siteRange.max || sites <= plan.siteRange.max)) {
      selectedPlan = plan;
      break;
    }
  }

  if (!selectedPlan) return null;

  if (selectedPlan.customPricing) {
    return { plan: selectedPlan, price: selectedPlan.minMonthlyPrice || 0 };
  }

  const calculated = sites * (selectedPlan.pricePerSite || 0);
  const price = Math.max(calculated, selectedPlan.minMonthlyPrice || 0);

  return { plan: selectedPlan, price };
}

// Annual discount calculation (20-30% per spec)
export function calculateAnnualDiscount(monthlyPrice: number): number {
  // Using 25% average discount
  return monthlyPrice * 12 * 0.75;
}
