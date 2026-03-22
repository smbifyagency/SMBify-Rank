/**
 * WEBSITE LAYOUT CONFIGURATION
 * 
 * This file contains all the main layout settings for generated websites.
 * Team members can easily modify these values without touching complex code.
 * 
 * IMPORTANT: After making changes, restart the application to see updates.
 */

export const WEBSITE_LAYOUT_CONFIG = {
  // ========================
  // CONTAINER/FEATURES SECTION
  // ========================
  
  // Number of feature boxes to display in a row on desktop
  // Options: 1, 2, 3, 4
  featuresPerRow: 3,
  
  // Gap between feature boxes (in rem units)
  // Examples: '1rem', '1.5rem', '2rem', '3rem'
  featuresGap: '2rem',
  
  // ========================
  // ABOUT SECTION LAYOUT
  // ========================
  
  // About section text width adjustment (negative = narrower, positive = wider)
  // Examples: '-20px', '-10px', '0px', '+10px', '+20px'
  aboutTextWidthAdjustment: '-60px',
  
  // About section card width adjustment (opposite of text width)
  // Examples: '+20px', '+10px', '0px', '-10px', '-20px'  
  aboutCardWidthAdjustment: '+60px',
  
  // Gap between about text and card sections
  // Examples: '2rem', '3rem', '4rem', '5rem'
  aboutSectionGap: '4rem',
  
  // ========================
  // CONTACT CARDS SECTION
  // ========================
  
  // Number of contact cards per row on desktop
  // Options: 1, 2, 3, 4
  contactCardsPerRow: 3,
  
  // Gap between contact cards
  // Examples: '1rem', '1.5rem', '2rem', '3rem'
  contactCardsGap: '2rem',
  
  // ========================
  // RESPONSIVE BREAKPOINTS
  // ========================
  
  // Screen width where desktop layout starts (in pixels)
  // Examples: 768, 992, 1024, 1200
  desktopBreakpoint: 768,
  
  // ========================
  // GRID LAYOUT SETTINGS
  // ========================
  
  // Content grid columns for main content areas
  // Examples: '1fr 1fr', '2fr 1fr', '3fr 2fr'
  contentGridColumns: '1fr 1fr',
  
  // General gap for grid layouts
  // Examples: '1rem', '2rem', '3rem', '4rem'
  generalGridGap: '4rem',
};

/**
 * HELPER FUNCTIONS
 * Don't modify these unless you understand CSS grid
 */

export function getFeaturesGridColumns(): string {
  return `repeat(${WEBSITE_LAYOUT_CONFIG.featuresPerRow}, 1fr)`;
}

export function getContactCardsGridColumns(): string {
  return `repeat(${WEBSITE_LAYOUT_CONFIG.contactCardsPerRow}, 1fr)`;
}

export function getAboutGridColumns(): string {
  // Use 40%/60% split for better readability
  // Text section gets 40% (narrower for better reading)
  // Card section gets 60% (wider for better content display)
  return `calc(40% - 20px) calc(60% + 20px)`;
}

export function getResponsiveBreakpoint(): string {
  return `${WEBSITE_LAYOUT_CONFIG.desktopBreakpoint}px`;
}