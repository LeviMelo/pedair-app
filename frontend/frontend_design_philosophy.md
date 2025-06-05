# CREST Frontend Design Philosophy

## Overview
CREST (Clinical REsearch Study Tool) emphasizes vibrant, colorful aesthetics with smooth animations and high contrast for medical professionals.

## Brand Colors & Palette

**Primary Gradient**: Blue → Indigo → Purple
- Blue 600: #2563eb (Trust, Reliability)
- Indigo 600: #4f46e5 (Innovation, Technology)  
- Purple 600: #9333ea (Medical Excellence)

**Secondary Gradient**: Emerald → Teal → Cyan
- Emerald 500: #10b981 (Growth, Success)
- Teal 500: #14b8a6 (Balance, Healing)
- Cyan 500: #06b6d4 (Clarity, Precision)

**Accent Colors**: Orange → Red → Pink
- Orange 500: #f97316 (Energy, Warmth)
- Red 500: #ef4444 (Urgency, Importance)
- Pink 500: #ec4899 (Care, Compassion)

## Light Mode Color Scheme

### Backgrounds
- Page: Gradient from slate-50 via blue-50/30 to purple-50/30
- Cards: White with subtle gradient overlays
- Content: #ffffff with 60% opacity over gradients

### Text
- Primary: #1e293b (Slate 800) - High contrast
- Secondary: #475569 (Slate 600) - Supporting content
- Tertiary: #64748b (Slate 500) - Meta information

## Dark Mode Color Scheme

### Backgrounds
- Page: Deep gradients from slate-900 via slate-900 to slate-900
- Cards: #1e293b with glassmorphism effects
- Content: #1e293b with 80% opacity

### Text
- Primary: #f1f5f9 (Slate 100) - Crisp white
- Secondary: #cbd5e1 (Slate 300) - Supporting content
- Tertiary: #94a3b8 (Slate 400) - Meta information

## UI/UX Consistency Rules

### Icon-Text Color Harmony
- **Rule**: Icons accompanying text/headers MUST have the same color as the text
- **Rationale**: Mismatched colors confuse UI hierarchy and obliterate visual cohesion
- **Implementation**: Use matching color classes for both icon and text elements
- **Example**: If text is `text-purple-600`, icon should be `text-purple-600`

### Active State Indication
- **Sidebar Navigation**: Current active page must be clearly indicated
- **Visual Treatment**: Active items receive enhanced styling (color, glow/shadow, size)
- **Light Mode**: Active items use colored background with subtle shadow
- **Dark Mode**: Active items use colored background with glow effects
- **Scale**: Active items are slightly larger (1.02-1.05x transform)

### Header Design Principles
- **Alignment**: Header content must align vertically with sidebar elements
- **Mobile-First Actions**: Header buttons should be minimal, discrete, horizontally scrollable
- **Context Awareness**: Header should reflect the current active sidebar section
- **Responsive Behavior**: Buttons stack horizontally on mobile, expand on desktop

### Project Context Design
- **Active Project Display**: Must be interactive for project switching
- **Visual Hierarchy**: Clear indication of current project with ability to change
- **Context Preservation**: Project switching should maintain current page context when possible

## Component System

### Buttons
- Primary: Gradient backgrounds with shadow effects
- Secondary: Subtle gradients with hover effects
- Outline: Border-based with color-fill animations
- Ghost: Transparent with background animations

### Cards
- Base: Simple containers with subtle borders
- Enhanced: Gradient backgrounds with elevated shadows  
- Colorful: Overlay gradients with brand colors
- Interactive: Transform and shadow animations on hover

### Animations
- Hover: Scale transforms (1.02-1.05x), color transitions
- Focus: Gradient ring animations with color pulsing
- Loading: Smooth spinner rotations with gradient backgrounds
- Transitions: Fade animations with slight Y-transform over 200ms

## Accessibility
- Text contrast: Minimum 4.5:1 ratio (WCAG AA)
- Focus indicators: High contrast rings with 2px minimum width
- Reduced motion: Respect prefers-reduced-motion settings
- Screen reader support: Proper ARIA labels and semantic markup

## Responsive Design
- Mobile First: Start with 320px base design
- Tablet: 768px+ with expanded layouts
- Desktop: 1024px+ with multi-column layouts
- Components scale from icon-only (mobile) to full text (desktop)

This philosophy ensures CREST maintains modern, engaging visuals while serving medical research professionals effectively. 