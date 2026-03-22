import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { BusinessData } from '@shared/schema';

interface BusinessDataContextType {
  businessData: Partial<BusinessData>;
  setBusinessData: (data: Partial<BusinessData>) => void;
  updateBusinessData: (data: Partial<BusinessData>) => void;
  clearBusinessData: () => void;
}

const BusinessDataContext = createContext<BusinessDataContextType | undefined>(undefined);

export function useBusinessData() {
  const context = useContext(BusinessDataContext);
  if (context === undefined) {
    throw new Error('useBusinessData must be used within a BusinessDataProvider');
  }
  return context;
}

interface BusinessDataProviderProps {
  children: ReactNode;
}

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const sampleBlogPosts = [
  {
    id: "post-1",
    title: "Essential HVAC Maintenance Tips for Homeowners",
    slug: "essential-hvac-maintenance-tips-homeowners",
    excerpt: "Keep your heating and cooling system running efficiently with these expert maintenance tips that can save you money and extend equipment life.",
    content: `# Essential HVAC Maintenance Tips for Homeowners

Regular HVAC maintenance is crucial for keeping your home comfortable year-round while minimizing energy costs and preventing costly repairs.

## Why HVAC Maintenance Matters

Proper maintenance of your heating, ventilation, and air conditioning system offers several benefits:

- **Lower Energy Bills**: Well-maintained systems run more efficiently
- **Extended Equipment Life**: Regular care can double your system's lifespan
- **Better Air Quality**: Clean filters and ducts improve indoor air
- **Fewer Repairs**: Preventive maintenance catches issues early

## Monthly Maintenance Tasks

### Change Air Filters
Replace air filters every 1-3 months, depending on usage and filter type. Dirty filters reduce airflow and force your system to work harder.

### Check Thermostat Settings
Ensure your thermostat is working correctly and consider upgrading to a programmable model for better energy efficiency.

## Seasonal Maintenance

### Spring Preparation
- Clean outdoor condenser coils
- Check refrigerant levels
- Test cooling system operation
- Inspect ductwork for leaks

### Fall Preparation  
- Test heating system operation
- Check and clean heat exchanger
- Inspect flue and venting systems
- Lubricate moving parts

## When to Call Professionals

While homeowners can handle basic maintenance, certain tasks require professional expertise:

- Refrigerant handling and repairs
- Electrical component issues
- Complex diagnostic problems
- Annual professional tune-ups

## Conclusion

Regular HVAC maintenance is an investment in your home's comfort and efficiency. By following these tips and scheduling professional service annually, you can ensure your system operates reliably for years to come.`,
    featuredImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=400&fit=crop",
    featuredImageAlt: "HVAC technician performing maintenance on air conditioning unit",
    metaTitle: "HVAC Maintenance Tips | Keep Your System Running Efficiently",
    metaDescription: "Expert HVAC maintenance tips for homeowners. Learn how to maintain your heating and cooling system for better efficiency and longer life.",
    category: "Maintenance",
    tags: ["HVAC", "maintenance", "home care", "energy efficiency"],
    status: "published" as const,
    authorName: "Expert HVAC Team",
    isAiGenerated: false,
  },
  {
    id: "post-2", 
    title: "Signs You Need Emergency Plumbing Services",
    slug: "signs-you-need-emergency-plumbing-services",
    excerpt: "Learn to recognize the warning signs that indicate you need immediate professional plumbing assistance to prevent costly water damage.",
    content: `# Signs You Need Emergency Plumbing Services

Plumbing emergencies can strike at any time, often causing significant damage if not addressed quickly. Knowing when to call for emergency plumbing services can save you thousands in repairs.

## Immediate Emergency Signs

### Burst Pipes
A burst pipe is a clear emergency that requires immediate attention:
- Shut off main water supply immediately
- Call emergency plumbing services
- Move furniture and valuables away from water
- Document damage for insurance

### Sewage Backup
Raw sewage in your home poses serious health risks:
- Avoid contact with contaminated water
- Keep family and pets away from affected areas
- Call professionals immediately
- Don't attempt DIY fixes

### No Hot Water in Winter
Complete loss of hot water during cold weather can be dangerous:
- Check if pilot light is out
- Look for signs of water heater leaks
- Call for emergency service if no obvious fix

## Serious Issues Requiring Quick Action

### Major Leaks
Large leaks can cause extensive water damage:
- Under sinks or behind appliances
- Ceiling or wall stains indicating hidden leaks
- Flooding in basements or crawl spaces

### Frozen Pipes
Frozen pipes can burst without warning:
- No water flow during freezing weather
- Strange sounds from pipes
- Visible frost on exposed pipes

### Gas Line Issues
Gas leaks are extremely dangerous:
- Smell of gas (rotten egg odor)
- Hissing sounds near gas lines
- Dead vegetation near gas lines

## When to Wait vs. Act Immediately

### Can Wait Until Business Hours:
- Slow drains
- Dripping faucets
- Running toilets
- Minor leaks contained with buckets

### Needs Emergency Response:
- Any gas-related issues
- Major water leaks
- Sewage problems
- Complete system failures

## Prevention Tips

- Know your main water shutoff location
- Keep emergency plumber contact information handy
- Regular maintenance prevents many emergencies
- Install water leak detectors

## Conclusion

Recognizing plumbing emergencies early and acting quickly can prevent extensive damage and costly repairs. When in doubt, it's better to call professionals immediately than risk major damage to your home.`,
    featuredImage: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=400&fit=crop",
    featuredImageAlt: "Emergency plumbing repair with tools and pipes",
    metaTitle: "Emergency Plumbing Signs | When to Call for Immediate Help",
    metaDescription: "Recognize the signs that require emergency plumbing services. Learn when to act immediately to prevent costly water damage to your home.",
    category: "Emergency Services",
    tags: ["plumbing", "emergency", "water damage", "home safety"],
    status: "published" as const,
    authorName: "Professional Plumbers",
    isAiGenerated: false,
  },
  {
    id: "post-3",
    title: "Electrical Safety Tips Every Homeowner Should Know",
    slug: "electrical-safety-tips-every-homeowner-should-know",
    excerpt: "Protect your family and home with these essential electrical safety tips that can prevent fires, injuries, and costly damage.",
    content: `# Electrical Safety Tips Every Homeowner Should Know

Electrical safety in the home is crucial for protecting your family and property. Understanding basic electrical safety principles can prevent fires, injuries, and expensive repairs.

## Basic Electrical Safety Rules

### Never Mix Water and Electricity
- Keep electrical devices away from water
- Use GFCI outlets in bathrooms and kitchens
- Dry hands before touching electrical switches
- Install proper ventilation in damp areas

### Respect Electrical Capacity
- Don't overload outlets or extension cords
- Use power strips with built-in circuit breakers
- Understand your home's electrical capacity
- Distribute electrical loads across multiple circuits

## Warning Signs to Watch For

### Flickering Lights
May indicate:
- Loose connections
- Overloaded circuits
- Faulty wiring
- Need for electrical panel upgrade

### Warm Outlets or Switch Plates
This could signal:
- Overloaded circuits
- Loose wiring connections
- Defective outlets
- Fire hazard requiring immediate attention

### Burning Smells
Never ignore electrical odors:
- Shut off power to affected area
- Call an electrician immediately
- Don't use the circuit until inspected
- Check for visible damage or sparks

## Safe Practices Around the Home

### Extension Cord Safety
- Use appropriate gauge for the load
- Never run cords under rugs or furniture
- Inspect regularly for damage
- Don't daisy-chain extension cords

### Outlet Safety
- Install outlet covers in homes with children
- Replace damaged outlets immediately
- Use GFCI outlets near water sources
- Don't force plugs into outlets

### Electrical Panel Maintenance
- Keep area around panel clear
- Label all circuits clearly
- Test GFCI and AFCI breakers monthly
- Never ignore tripped breakers

## When to Call Professionals

### DIY vs. Professional Work
**DIY Appropriate:**
- Changing light bulbs
- Testing GFCI outlets
- Basic outlet covers

**Professional Required:**
- Any wiring work
- Panel upgrades
- New outlet installation
- Troubleshooting electrical problems

### Emergency Situations
Call emergency electrician for:
- Sparks or electrical fires
- Power outages affecting only your home
- Electrical shock incidents
- Burning electrical smells

## Electrical Fire Prevention

### Common Causes
- Overloaded circuits
- Damaged extension cords
- Faulty electrical devices
- Poor electrical connections

### Prevention Strategies
- Regular electrical inspections
- Proper use of electrical devices
- Quality electrical components
- Professional installation and repairs

## Conclusion

Electrical safety requires vigilance and respect for the power of electricity. When in doubt, always consult with qualified electrical professionals to ensure your home remains safe and up to code.`,
    featuredImage: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=400&fit=crop",
    featuredImageAlt: "Electrician working safely on electrical panel",
    metaTitle: "Home Electrical Safety Tips | Protect Your Family and Property",
    metaDescription: "Essential electrical safety tips for homeowners. Learn how to prevent electrical fires, injuries, and damage with proper electrical practices.",
    category: "Safety",
    tags: ["electrical", "safety", "home maintenance", "fire prevention"],
    status: "published" as const,
    authorName: "Licensed Electricians",
    isAiGenerated: false,
  }
];

const sampleBlogCategories = [
  {
    id: "cat-1",
    name: "Maintenance", 
    slug: "maintenance",
    description: "Regular maintenance tips and best practices"
  },
  {
    id: "cat-2",
    name: "Emergency Services",
    slug: "emergency-services", 
    description: "Emergency service information and urgent repairs"
  },
  {
    id: "cat-3",
    name: "Safety",
    slug: "safety",
    description: "Safety tips and best practices for homeowners"
  }
];

const STORAGE_KEY = 'business_form_data';

// Helper function to safely parse JSON from localStorage
const getStoredData = (): Partial<BusinessData> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure blogPosts and blogCategories exist
      return {
        blogPosts: [],
        blogCategories: [],
        ...parsed
      };
    }
  } catch (error) {
    console.warn('Failed to parse stored form data:', error);
  }
  return {
    blogPosts: [],
    blogCategories: []
  };
};

// Helper function to safely save data to localStorage
const saveDataToStorage = (data: Partial<BusinessData>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save form data to localStorage:', error);
  }
};

export function BusinessDataProvider({ children }: BusinessDataProviderProps) {
  const [businessData, setBusinessDataState] = useState<Partial<BusinessData>>(getStoredData);

  // Save to localStorage whenever businessData changes
  useEffect(() => {
    saveDataToStorage(businessData);
  }, [businessData]);

  const setBusinessData = (data: Partial<BusinessData>) => {
    setBusinessDataState(data);
  };

  const updateBusinessData = (data: Partial<BusinessData>) => {
    console.log('BusinessDataContext updateBusinessData called with:', data);
    console.log('Previous state:', businessData);
    setBusinessDataState(prev => {
      const newState = { ...prev, ...data };
      console.log('New state:', newState);
      return newState;
    });
  };

  const clearBusinessData = () => {
    const emptyData = {
      blogPosts: [],
      blogCategories: []
    };
    setBusinessDataState(emptyData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear stored form data:', error);
    }
  };

  const value = {
    businessData,
    setBusinessData,
    updateBusinessData,
    clearBusinessData,
  };

  return (
    <BusinessDataContext.Provider value={value}>
      {children}
    </BusinessDataContext.Provider>
  );
}