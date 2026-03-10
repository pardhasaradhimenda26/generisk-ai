# Implementation Plan - Dark Techy Redesign

Redesign GeneRisk AI with a dark techy aesthetic similar to a hacker dashboard. Keep it clean, readable, and professional.

## Proposed Changes

### DNA Helix Fix
#### [MODIFY] [main.js](file:///e:/GeneRisk%20AI%20Analyser/main.js)
- Update helix parameters: `opacity: 0.12`, `particle brightness: -60%`.
- Update strand colors: `0x003344`, `0x004455`.
#### [MODIFY] [style.css](file:///e:/GeneRisk%20AI%20Analyser/style.css)
- Set canvas opacity to 0.06 for results and analyze sections.

### Color Scheme & Typography
#### [MODIFY] [style.css](file:///e:/GeneRisk%20AI%20Analyser/style.css)
- Update CSS variables for colors (bg-primary, bg-secondary, bg-card, accent-primary, etc.).
- Update typography styles for headings (Space Grotesk) and body (Inter).
#### [MODIFY] [index.html](file:///e:/GeneRisk%20AI%20Analyser/index.html)
- Import 'Space Grotesk' and 'Inter' from Google Fonts.

### UI Components
#### [MODIFY] [style.css](file:///e:/GeneRisk%20AI%20Analyser/style.css)
- Redesign Navbar (blur, border-bottom, logo colors).
- Redesign Hero Section (grid pattern, glowing orb, title shadow, stats bar).
- Redesign Cards (border-radius, shadow, hover effects).
- Redesign Risk Indicators (badges, risk rings).
- Redesign "How It Works" (terminal/code aesthetic).
- Redesign DNA Input (terminal-style buttons and textarea).
- Redesign Results Report Header (scan line effect, pills).
- Redesign Algorithm Comparison Table (terminal aesthetic).
- Redesign Footer (3 columns, powered by section).

### Content Updates
#### [MODIFY] [index.html](file:///e:/GeneRisk%20AI%20Analyser/index.html)
- Update text content for "How It Works" steps (terminal icons/labels).
- Add sample sequence buttons in DNA Input section.
- Update Footer columns.

## Verification Plan

### Manual Verification
- View `index.html` in the browser to verify the new design.
- Test DNA input with sample buttons.
- Verify result dashboard styling and risk indicators.
- Check mobile responsiveness.
