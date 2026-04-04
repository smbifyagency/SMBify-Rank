export interface Template {
  id: string;
  name: string;
  gradient: string;
  lightBg: string;
  darkText: string;
  mediumText: string;
  icon: string;
  nicheCategory?: string; // Added for niche-specific templates
  targetIndustries?: string[]; // Added to map to business categories
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

export const templates: Template[] = [
  // SEO & Digital Marketing Templates
  {
    id: "seo-agency-blue",
    name: "SEO Agency Pro",
    gradient: "bg-gradient-to-br from-blue-600 to-indigo-700",
    lightBg: "bg-blue-50",
    darkText: "text-blue-900",
    mediumText: "text-blue-700",
    icon: "fas fa-search",
    nicheCategory: "SEO Agency",
    targetIndustries: ["Digital Marketing", "SEO Services", "Web Development", "Social Media Marketing"],
    colors: {
      primary: "#2563eb",
      secondary: "#1d4ed8",
      accent: "#60a5fa",
      background: "#ffffff",
      text: "#1f2937"
    }
  },
  
  // Legal & Professional Services
  {
    id: "legal-professional-navy",
    name: "Legal Pro",
    gradient: "bg-gradient-to-br from-blue-800 to-indigo-900",
    lightBg: "bg-slate-50",
    darkText: "text-slate-900",
    mediumText: "text-slate-700",
    icon: "fas fa-balance-scale",
    nicheCategory: "Law Firm",
    targetIndustries: ["Legal Services", "Attorney", "Law Office", "Legal Consultation"],
    colors: {
      primary: "#1e40af",
      secondary: "#312e81",
      accent: "#60a5fa",
      background: "#ffffff",
      text: "#1f2937"
    }
  },

  // Real Estate
  {
    id: "real-estate-gold",
    name: "Real Estate",
    gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
    lightBg: "bg-amber-50",
    darkText: "text-amber-900",
    mediumText: "text-amber-700",
    icon: "fas fa-home",
    nicheCategory: "Real Estate",
    targetIndustries: ["Real Estate", "Property Management", "Home Sales"],
    colors: {
      primary: "#f59e0b",
      secondary: "#ea580c",
      accent: "#fbbf24",
      background: "#ffffff",
      text: "#1f2937"
    }
  },

  // Restaurant & Food
  {
    id: "restaurant-red",
    name: "Restaurant",
    gradient: "bg-gradient-to-br from-red-500 to-pink-600",
    lightBg: "bg-red-50",
    darkText: "text-red-900",
    mediumText: "text-red-700",
    icon: "fas fa-utensils",
    nicheCategory: "Restaurant",
    targetIndustries: ["Restaurant", "Food Service", "Catering", "Bar"],
    colors: {
      primary: "#ef4444",
      secondary: "#ec4899",
      accent: "#f87171",
      background: "#ffffff",
      text: "#1f2937"
    }
  },

  // Fitness & Wellness
  {
    id: "fitness-green",
    name: "Fitness",
    gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
    lightBg: "bg-green-50",
    darkText: "text-green-900",
    mediumText: "text-green-700",
    icon: "fas fa-dumbbell",
    nicheCategory: "Fitness",
    targetIndustries: ["Fitness", "Gym", "Personal Training", "Wellness"],
    colors: {
      primary: "#22c55e",
      secondary: "#059669",
      accent: "#4ade80",
      background: "#ffffff",
      text: "#1f2937"
    }
  },

  // Beauty & Spa
  {
    id: "beauty-purple",
    name: "Beauty & Spa",
    gradient: "bg-gradient-to-br from-purple-500 to-violet-600",
    lightBg: "bg-purple-50",
    darkText: "text-purple-900",
    mediumText: "text-purple-700",
    icon: "fas fa-spa",
    nicheCategory: "Beauty",
    targetIndustries: ["Beauty", "Spa", "Salon", "Cosmetics"],
    colors: {
      primary: "#a855f7",
      secondary: "#7c3aed",
      accent: "#c084fc",
      background: "#ffffff",
      text: "#1f2937"
    }
  },

  // Medical & Healthcare
  {
    id: "medical-care-teal",
    name: "Medical Care",
    gradient: "bg-gradient-to-br from-teal-500 to-cyan-600",
    lightBg: "bg-teal-50",
    darkText: "text-teal-900",
    mediumText: "text-teal-700",
    icon: "fas fa-stethoscope",
    nicheCategory: "Medical Practice",
    targetIndustries: ["Healthcare", "Medical Services", "Dental", "Clinic", "Hospital"],
    colors: {
      primary: "#0d9488",
      secondary: "#0e7490",
      accent: "#2dd4bf",
      background: "#ffffff",
      text: "#1f2937"
    }
  },

  // Construction & Home Services
  {
    id: "construction-orange",
    name: "Construction Pro",
    gradient: "bg-gradient-to-br from-orange-600 to-amber-600",
    lightBg: "bg-orange-50",
    darkText: "text-orange-900",
    mediumText: "text-orange-700",
    icon: "fas fa-hard-hat",
    nicheCategory: "Construction Company",
    targetIndustries: ["General Contractors", "Home Builders", "Roofing", "Electrical", "Plumbing", "HVAC", "Handyman", "Renovation"],
    colors: {
      primary: "#ea580c",
      secondary: "#d97706",
      accent: "#fb923c",
      background: "#ffffff",
      text: "#1f2937"
    }
  },

  // Automotive
  {
    id: "automotive-gray",
    name: "Auto Pro",
    gradient: "bg-gradient-to-br from-red-600 to-gray-800",
    lightBg: "bg-gray-50",
    darkText: "text-gray-900",
    mediumText: "text-gray-700",
    icon: "fas fa-car",
    nicheCategory: "Automotive",
    targetIndustries: ["Auto Repair", "Car Dealership", "Auto Parts", "Car Wash"],
    colors: {
      primary: "#dc2626",
      secondary: "#1f2937",
      accent: "#f87171",
      background: "#ffffff",
      text: "#1f2937"
    }
  },

  // Technology
  {
    id: "tech-cyan",
    name: "Tech Hub",
    gradient: "bg-gradient-to-br from-cyan-500 to-blue-600",
    lightBg: "bg-cyan-50",
    darkText: "text-cyan-900",
    mediumText: "text-cyan-700",
    icon: "fas fa-laptop-code",
    nicheCategory: "Technology",
    targetIndustries: ["IT Services", "Software Development", "Tech Support", "Computer Repair"],
    colors: {
      primary: "#0891b2",
      secondary: "#2563eb",
      accent: "#22d3ee",
      background: "#ffffff",
      text: "#1f2937"
    }
  },

  // Education
  {
    id: "education-indigo",
    name: "Education",
    gradient: "bg-gradient-to-br from-indigo-500 to-purple-600",
    lightBg: "bg-indigo-50",
    darkText: "text-indigo-900",
    mediumText: "text-indigo-700",
    icon: "fas fa-graduation-cap",
    nicheCategory: "Education",
    targetIndustries: ["Tutoring", "Online Courses", "Training", "School"],
    colors: {
      primary: "#6366f1",
      secondary: "#7c3aed",
      accent: "#818cf8",
      background: "#ffffff",
      text: "#1f2937"
    }
  },

  // Creative & Design
  {
    id: "creative-pink",
    name: "Creative Studio",
    gradient: "bg-gradient-to-br from-pink-500 to-rose-600",
    lightBg: "bg-pink-50",
    darkText: "text-pink-900",
    mediumText: "text-pink-700",
    icon: "fas fa-palette",
    nicheCategory: "Creative",
    targetIndustries: ["Graphic Design", "Photography", "Marketing Agency", "Art Studio"],
    colors: {
      primary: "#ec4899",
      secondary: "#e11d48",
      accent: "#f9a8d4",
      background: "#ffffff",
      text: "#1f2937"
    }
  },

  // Financial Services
  {
    id: "finance-green",
    name: "Finance Authority",
    gradient: "bg-gradient-to-br from-emerald-600 to-green-700",
    lightBg: "bg-emerald-50",
    darkText: "text-emerald-900",
    mediumText: "text-emerald-700",
    icon: "fas fa-chart-line",
    nicheCategory: "Financial Services",
    targetIndustries: ["Insurance", "Accounting", "Financial Planning", "Investment", "Banking"],
    colors: {
      primary: "#059669",
      secondary: "#15803d",
      accent: "#34d399",
      background: "#ffffff",
      text: "#1f2937"
    }
  },

  // Fitness & Wellness
  {
    id: "fitness-purple",
    name: "Fitness Elite",
    gradient: "bg-gradient-to-br from-purple-600 to-violet-600",
    lightBg: "bg-purple-50",
    darkText: "text-purple-900",
    mediumText: "text-purple-700",
    icon: "fas fa-dumbbell",
    nicheCategory: "Fitness Center",
    targetIndustries: ["Gym", "Fitness", "Personal Training", "Yoga", "Wellness", "Spa"],
    colors: {
      primary: "#7c3aed",
      secondary: "#6d28d9",
      accent: "#a78bfa",
      background: "#ffffff",
      text: "#1f2937"
    }
  },

  // Real Estate Premium
  {
    id: "real-estate-premium",
    name: "Real Estate Premium",
    gradient: "bg-gradient-to-br from-yellow-600 to-amber-700",
    lightBg: "bg-yellow-50",
    darkText: "text-yellow-900",
    mediumText: "text-yellow-700",
    icon: "fas fa-home",
    nicheCategory: "Real Estate Agency",
    targetIndustries: ["Real Estate", "Property Management", "Home Sales", "Commercial Real Estate"],
    colors: {
      primary: "#d97706",
      secondary: "#b45309",
      accent: "#fbbf24",
      background: "#ffffff",
      text: "#1f2937"
    }
  },

  // Beauty & Salon Services
  {
    id: "beauty-pink",
    name: "Beauty Salon",
    gradient: "bg-gradient-to-br from-pink-500 to-rose-500",
    lightBg: "bg-pink-50",
    darkText: "text-pink-900",
    mediumText: "text-pink-700",
    icon: "fas fa-cut",
    nicheCategory: "Beauty Salon",
    targetIndustries: ["Hair Salon", "Beauty Services", "Spa", "Nail Salon", "Barbershop"],
    colors: {
      primary: "#ec4899",
      secondary: "#be185d",
      accent: "#f9a8d4",
      background: "#ffffff",
      text: "#1f2937"
    }
  },

  // Auto & Vehicle Services
  {
    id: "automotive-steel",
    name: "Auto Service Pro",
    gradient: "bg-gradient-to-br from-orange-600 to-slate-800",
    lightBg: "bg-gray-50",
    darkText: "text-gray-900",
    mediumText: "text-gray-700",
    icon: "fas fa-car",
    nicheCategory: "Auto Repair",
    targetIndustries: ["Auto Repair", "Car Service", "Automotive", "Towing", "Car Wash"],
    colors: {
      primary: "#ea580c",
      secondary: "#1e293b",
      accent: "#fb923c",
      background: "#ffffff",
      text: "#1f2937"
    }
  },

  // Landscaping & Outdoor Services
  {
    id: "landscaping-green",
    name: "Landscape Pro",
    gradient: "bg-gradient-to-br from-green-600 to-emerald-600",
    lightBg: "bg-green-50",
    darkText: "text-green-900",
    mediumText: "text-green-700",
    icon: "fas fa-leaf",
    nicheCategory: "Landscaping Company",
    targetIndustries: ["Landscaping", "Lawn Care", "Tree Service", "Garden Design", "Irrigation"],
    colors: {
      primary: "#16a34a",
      secondary: "#15803d",
      accent: "#4ade80",
      background: "#ffffff",
      text: "#1f2937"
    }
  },

  // Technology & IT Services
  {
    id: "tech-cyber-blue",
    name: "Tech Solutions",
    gradient: "bg-gradient-to-br from-cyan-500 to-blue-600",
    lightBg: "bg-cyan-50",
    darkText: "text-cyan-900",
    mediumText: "text-cyan-700",
    icon: "fas fa-laptop-code",
    nicheCategory: "IT Services",
    targetIndustries: ["Computer Repair", "IT Support", "Software Development", "Cybersecurity"],
    colors: {
      primary: "#0891b2",
      secondary: "#0e7490",
      accent: "#22d3ee",
      background: "#ffffff",
      text: "#1f2937"
    }
  },

  // Cleaning Services
  {
    id: "cleaning-fresh-blue",
    name: "Fresh Clean",
    gradient: "bg-gradient-to-br from-sky-500 to-blue-500",
    lightBg: "bg-sky-50",
    darkText: "text-sky-900",
    mediumText: "text-sky-700",
    icon: "fas fa-broom",
    nicheCategory: "Cleaning Service",
    targetIndustries: ["Cleaning Services", "House Cleaning", "Carpet Cleaning", "Window Cleaning", "Maid Service"],
    colors: {
      primary: "#0ea5e9",
      secondary: "#0284c7",
      accent: "#7dd3fc",
      background: "#ffffff",
      text: "#1f2937"
    }
  },

  // Pet Services
  {
    id: "pet-care-warm",
    name: "Pet Care Plus",
    gradient: "bg-gradient-to-br from-amber-500 to-orange-500",
    lightBg: "bg-amber-50",
    darkText: "text-amber-900",
    mediumText: "text-amber-700",
    icon: "fas fa-paw",
    nicheCategory: "Pet Services",
    targetIndustries: ["Veterinary", "Pet Grooming", "Pet Sitting", "Pet Training", "Animal Care"],
    colors: {
      primary: "#f59e0b",
      secondary: "#d97706",
      accent: "#fcd34d",
      background: "#ffffff",
      text: "#1f2937"
    }
  },

  // Education & Training
  {
    id: "education-royal",
    name: "Education Hub",
    gradient: "bg-gradient-to-br from-indigo-600 to-purple-600",
    lightBg: "bg-indigo-50",
    darkText: "text-indigo-900",
    mediumText: "text-indigo-700",
    icon: "fas fa-graduation-cap",
    nicheCategory: "Educational Services",
    targetIndustries: ["Tutoring", "Training", "Education", "Driving School", "Music Lessons"],
    colors: {
      primary: "#4f46e5",
      secondary: "#7c3aed",
      accent: "#818cf8",
      background: "#ffffff",
      text: "#1f2937"
    }
  }
];

// Function to get recommended template based on business category
export function getRecommendedTemplate(businessCategory: string): Template | null {
  const categoryLower = businessCategory.toLowerCase();
  
  // Find template that matches the business category
  for (const template of templates) {
    if (!template.targetIndustries) continue;
    
    for (const industry of template.targetIndustries) {
      if (categoryLower.includes(industry.toLowerCase()) || 
          industry.toLowerCase().includes(categoryLower)) {
        return template;
      }
    }
  }
  
  // Enhanced category mapping for more specific matches
  const categoryMappings: { [key: string]: string } = {
    // Construction & Home Services
    'plumbing': 'construction-orange',
    'electrical': 'construction-orange', 
    'hvac': 'construction-orange',
    'roofing': 'construction-orange',
    'heating': 'construction-orange',
    'contractor': 'construction-orange',
    'handyman': 'construction-orange',
    'renovation': 'construction-orange',
    'remodeling': 'construction-orange',
    'painting': 'construction-orange',
    'flooring': 'construction-orange',
    'kitchen': 'construction-orange',
    'bathroom': 'construction-orange',
    'basement': 'construction-orange',
    'foundation': 'construction-orange',
    'concrete': 'construction-orange',
    'drywall': 'construction-orange',
    'insulation': 'construction-orange',
    'windows': 'construction-orange',
    'doors': 'construction-orange',
    'gutters': 'construction-orange',
    'siding': 'construction-orange',
    'deck': 'construction-orange',
    'fence': 'construction-orange',
    'cabinet': 'construction-orange',
    'tile': 'construction-orange',
    'carpentry': 'construction-orange',
    'demolition': 'construction-orange',
    
    // Landscaping & Outdoor
    'landscaping': 'landscaping-green',
    'lawn': 'landscaping-green',
    'tree': 'landscaping-green',
    'garden': 'landscaping-green',
    'irrigation': 'landscaping-green',
    'outdoor': 'landscaping-green',
    'yard': 'landscaping-green',
    'patio': 'landscaping-green',
    'hardscape': 'landscaping-green',
    'sprinkler': 'landscaping-green',
    
    // Cleaning Services
    'cleaning': 'cleaning-fresh-blue',
    'maid': 'cleaning-fresh-blue',
    'janitorial': 'cleaning-fresh-blue',
    'carpet cleaning': 'cleaning-fresh-blue',
    'window cleaning': 'cleaning-fresh-blue',
    'pressure washing': 'cleaning-fresh-blue',
    
    // Auto Services
    'auto': 'automotive-steel',
    'car': 'automotive-steel',
    'automotive': 'automotive-steel',
    'towing': 'automotive-steel',
    'mechanic': 'automotive-steel',
    'garage': 'automotive-steel',
    
    // Medical & Healthcare
    'medical': 'medical-care-teal',
    'dental': 'medical-care-teal',
    'healthcare': 'medical-care-teal',
    'clinic': 'medical-care-teal',
    'doctor': 'medical-care-teal',
    'physician': 'medical-care-teal',
    'therapy': 'medical-care-teal',
    'chiropractic': 'medical-care-teal',
    
    // Beauty & Salon
    'salon': 'beauty-pink',
    'hair': 'beauty-pink',
    'beauty': 'beauty-pink',
    'spa': 'beauty-pink',
    'nail': 'beauty-pink',
    'barbershop': 'beauty-pink',
    'massage': 'beauty-pink',
    
    // Pet Services
    'pet': 'pet-care-warm',
    'veterinary': 'pet-care-warm',
    'vet': 'pet-care-warm',
    'animal': 'pet-care-warm',
    'grooming': 'pet-care-warm',
    
    // Legal Services
    'legal': 'legal-professional-navy',
    'law': 'legal-professional-navy',
    'attorney': 'legal-professional-navy',
    'lawyer': 'legal-professional-navy',
    
    // Financial Services
    'insurance': 'finance-green',
    'financial': 'finance-green',
    'accounting': 'finance-green',
    'tax': 'finance-green',
    'investment': 'finance-green',
    
    // Technology
    'computer': 'tech-cyber-blue',
    'it': 'tech-cyber-blue',
    'software': 'tech-cyber-blue',
    'tech': 'tech-cyber-blue',
    'web': 'seo-agency-blue',
    'seo': 'seo-agency-blue',
    'marketing': 'seo-agency-blue',
    'digital': 'seo-agency-blue',
    
    // Real Estate
    'real estate': 'real-estate-gold',
    'realtor': 'real-estate-gold',
    'property': 'real-estate-gold',
    
    // Fitness & Wellness
    'fitness': 'fitness-purple',
    'gym': 'fitness-purple',
    'yoga': 'fitness-purple',
    'personal training': 'fitness-purple',
    'wellness': 'fitness-purple',
    
    // Restaurant & Food
    'restaurant': 'restaurant-red',
    'food': 'restaurant-red',
    'catering': 'restaurant-red',
    'cafe': 'restaurant-red',
    'bakery': 'restaurant-red',
    'bar': 'restaurant-red',
    
    // Education
    'education': 'education-royal',
    'school': 'education-royal',
    'tutoring': 'education-royal',
    'training': 'education-royal',
    'lesson': 'education-royal'
  };
  
  // Check category mappings
  for (const [keyword, templateId] of Object.entries(categoryMappings)) {
    if (categoryLower.includes(keyword)) {
      return templates.find(t => t.id === templateId) || null;
    }
  }
  
  // Default fallback to construction template for most home services
  return templates.find(t => t.id === 'construction-orange') || templates[0];
}

// Get all templates for a specific category
export function getTemplatesForCategory(businessCategory: string): Template[] {
  const recommended = getRecommendedTemplate(businessCategory);
  if (!recommended) return templates;
  
  // Return recommended template first, then others
  return [recommended, ...templates.filter(t => t.id !== recommended.id)];
}
