# Website Layout Configuration Guide

## Quick Start for Team Members

**Want to change how websites look? Just edit ONE file!**

📁 **File to edit:** `client/src/lib/website-layout-config.ts`

## Common Changes

### 🔥 Most Requested Changes:

#### Change number of feature boxes per row
```typescript
// Current: 3 boxes per row
featuresPerRow: 3,

// Change to 2 boxes per row:
featuresPerRow: 2,

// Change to 4 boxes per row:
featuresPerRow: 4,
```

#### Change contact cards layout
```typescript
// Current: 3 cards per row  
contactCardsPerRow: 3,

// Change to 2 cards per row:
contactCardsPerRow: 2,
```

#### Adjust about section spacing
```typescript
// Make text section narrower/wider
aboutTextWidthAdjustment: '-20px',  // narrower
aboutTextWidthAdjustment: '0px',    // normal
aboutTextWidthAdjustment: '+10px',  // wider

// Make card section wider/narrower (opposite of text)
aboutCardWidthAdjustment: '+20px',  // wider
aboutCardWidthAdjustment: '0px',    // normal
aboutCardWidthAdjustment: '-10px',  // narrower
```

#### Change gaps between elements
```typescript
// Space between feature boxes
featuresGap: '2rem',     // current
featuresGap: '1.5rem',   // closer together
featuresGap: '3rem',     // farther apart

// Space between contact cards
contactCardsGap: '2rem', // current
contactCardsGap: '1rem', // closer together

// Space in about section
aboutSectionGap: '4rem', // current
aboutSectionGap: '3rem', // closer together
```

## ⚠️ After Making Changes:

1. **Save the file**
2. **Restart the application** (it will auto-restart)
3. **Generate a new website** to see changes
4. **Deploy to test** on Netlify

## 💡 Pro Tips:

- **Smaller numbers** = elements closer together
- **Larger numbers** = elements farther apart  
- **rem units**: 1rem ≈ 16px
- **Only change the numbers**, don't touch the code structure
- **Test on desktop** - these changes only affect desktop view

## 🚨 Don't Touch:
- Helper functions at the bottom
- Import statements at the top
- Anything outside the `WEBSITE_LAYOUT_CONFIG` object

## Need Help?
If something breaks or you need a layout change not covered here, ask for help - but most common changes are covered above!

---
*This system makes layout changes apply to ALL future websites automatically.*