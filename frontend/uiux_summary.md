# CREST Frontend UI/UX Design System Documentation

## Overview

CREST (Clinical Research Study Tool) employs a modern, sophisticated design system built on a foundation of vibrant gradients, glassmorphism effects, and thoughtful color psychology tailored for medical professionals. This document outlines the comprehensive design principles, layout patterns, and implementation details that create a cohesive, accessible, and visually striking user interface.

## Design Philosophy & Principles

### Core Brand Identity
- **Mission**: Modern medical research interface emphasizing trust, innovation, and precision
- **Visual Theme**: Vibrant, colorful aesthetics with smooth animations and high contrast
- **Target Users**: Medical professionals, researchers, clinical coordinators, form designers

### Color Psychology & Accessibility
- **Trust Colors**: Blue (reliability, medical trust)
- **Innovation Colors**: Indigo/Purple (technology, medical excellence)  
- **Success Colors**: Emerald/Teal (healing, growth, balance)
- **Energy Colors**: Orange/Red/Pink (urgency, care, compassion)
- **Contrast Requirements**: Minimum 4.5:1 ratio (WCAG AA compliance)

## Color System

### Primary Gradient Palette
```css
/* Primary: Blue → Indigo → Purple */
Blue 600: #2563eb (Trust, Reliability)
Indigo 600: #4f46e5 (Innovation, Technology)  
Purple 600: #9333ea (Medical Excellence)

/* Secondary: Emerald → Teal → Cyan */
Emerald 500: #10b981 (Growth, Success)
Teal 500: #14b8a6 (Balance, Healing)
Cyan 500: #06b6d4 (Clarity, Precision)

/* Accent: Orange → Red → Pink */
Orange 500: #f97316 (Energy, Warmth)
Red 500: #ef4444 (Urgency, Importance)
Pink 500: #ec4899 (Care, Compassion)
```

### Light Mode Color Scheme
- **Page Background**: Gradient from slate-50 via blue-50/30 to purple-50/30
- **Card Backgrounds**: White with subtle gradient overlays (60% opacity)
- **Text Hierarchy**: 
  - Primary: #1e293b (Slate 800) - High contrast
  - Secondary: #475569 (Slate 600) - Supporting content
  - Tertiary: #64748b (Slate 500) - Meta information

### Dark Mode Color Scheme
- **Page Background**: Deep gradients from slate-900 via slate-900 to slate-900
- **Card Backgrounds**: #1e293b with glassmorphism effects (80% opacity)
- **Text Hierarchy**:
  - Primary: #f1f5f9 (Slate 100) - Crisp white
  - Secondary: #cbd5e1 (Slate 300) - Supporting content
  - Tertiary: #94a3b8 (Slate 400) - Meta information

## Layout Architecture

### Three-Layer System

#### 1. Main Container Layout
```css
.min-h-screen.bg-gradient-to-br.from-slate-50.via-blue-50/40.to-purple-50/40
```
- Full viewport height with subtle gradient backgrounds
- Responsive gradient shifts between light/dark modes
- Foundation for all page content

#### 2. Sidebar Navigation System
**Responsive Sidebar States:**
- **Hidden** (`w-0`): Completely collapsed, floating show button appears
- **Collapsed** (`w-16`): Icon-only navigation with hover expansion
- **Full** (`w-64`): Complete navigation with labels and project context

**Key Features:**
- **Glassmorphism Background**: `bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl`
- **Overlay Positioning**: Fixed position with proper z-index layering (z-40)
- **Hover Auto-Expansion**: Collapsed sidebar expands on mouse enter
- **Vertical Scrolling**: Scrollable content with hidden scrollbars
- **Project Context**: Interactive project selector with role-based navigation

#### 3. Fixed Topbar Header
**Design Characteristics:**
- **Overlay Architecture**: Fixed position (z-50) that overlays sidebar, not superimposed
- **Glassmorphism**: `bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl`
- **Responsive Logo**: Scales from icon-only (mobile) → icon+name (tablet) → icon+name+subtitle (desktop)
- **Context Navigation**: Horizontal scrollable quick actions relevant to current page
- **User Controls**: Theme toggle, sidebar controls, user menu with role indicators

### Responsive Breakpoints
```css
/* Mobile First Approach */
Mobile: 320px+ (Icon-only elements, stacked layouts)
Tablet: 768px+ (Expanded layouts, collapsed sidebar default)  
Desktop: 1024px+ (Multi-column layouts, full sidebar default)
```

## Component Design System

### Card System Hierarchy

#### 1. Base Cards (`.card-base`)
```css
@apply bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm;
```
- Simple containers with subtle borders
- Foundation for most content containers

#### 2. Enhanced Cards (`.card-enhanced`)
```css
@apply bg-white dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 shadow-lg backdrop-blur-sm;
```
- Glassmorphism effects with elevated shadows
- Gradient background overlays for depth
- Used for important content sections

#### 3. Colorful Cards (`.card-colorful`)
```css
/* Gradient overlay with brand colors */
background: linear-gradient(135deg, 
  rgba(59,130,246,0.05) 0%, 
  rgba(147,51,234,0.05) 35%, 
  rgba(236,72,153,0.05) 70%, 
  rgba(59,130,246,0.05) 100%);
```
- Subtle brand gradient overlays
- Enhanced visual hierarchy
- Perfect for featured content or dashboards

### Button Component System

#### Primary Actions
```css
.btn-primary {
  @apply bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 
         text-white font-medium py-2 px-4 rounded-lg shadow-sm hover:shadow-md 
         transition-all duration-200;
}
```

#### Secondary Actions  
```css
.btn-secondary {
  @apply bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 
         hover:bg-slate-200 dark:hover:bg-slate-600 font-medium py-2 px-4 rounded-lg 
         transition-all duration-200;
}
```

#### Ghost/Subtle Actions
```css
.btn-ghost {
  @apply text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 
         hover:bg-slate-100 dark:hover:bg-slate-700 font-medium py-2 px-4 rounded-lg 
         transition-all duration-200;
}
```

### Form Input System

#### Base Input Styling
```css
.input-base {
  @apply block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 
         rounded-lg text-sm placeholder-slate-400 dark:placeholder-slate-500 
         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent;
}
```

#### Form Labels
```css
.form-label {
  @apply block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1;
}
```

#### Field Containers
```css
.form-field {
  @apply mb-4; /* Standard spacing between form fields */
}
```

## Animation & Interaction Design

### Micro-Interactions

#### Hover Effects
```css
/* Standard hover lift */
.hover-lift {
  @apply transition-all duration-200 hover:scale-105 hover:shadow-lg;
}

/* Glow effects for special elements */
.hover-glow {
  @apply transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/25;
}
```

#### Page Transitions
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animation-fade-in {
  animation: fade-in 0.5s ease-out;
}
```

#### Pulse Glow Animation
```css
@keyframes pulse-glow {
  0%, 100% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.05); filter: brightness(1.1); }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
```

### Focus & Accessibility
```css
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
         focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800;
}
```

## Advanced Visual Effects

### Glassmorphism Implementation
**Core Philosophy**: Semi-transparent backgrounds with backdrop blur for depth and modern aesthetics

#### Sidebar Glassmorphism
```css
bg-gradient-to-b from-white via-slate-50/80 to-white 
dark:from-slate-800 dark:via-slate-900/90 dark:to-slate-800 
backdrop-blur-xl
```

#### Header Glassmorphism  
```css
bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl
```

#### Card Glassmorphism
```css
bg-white/60 dark:bg-slate-700/50 backdrop-blur-md
```

### Text Gradient System
```css
/* Primary brand gradient */
.text-gradient {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Cool variant */
.text-gradient-cool {
  background: linear-gradient(135deg, #3b82f6, #06b6d4, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Warm variant */
.text-gradient-warm {
  background: linear-gradient(135deg, #f59e0b, #ef4444, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

## Navigation & User Experience Patterns

### Icon-Text Color Harmony Rule
**Critical Design Principle**: Icons accompanying text/headers MUST have the same color as the text
```css
/* Implementation via utility classes */
.icon-text-match .icon {
  @apply text-current; /* Inherits parent text color */
}

/* Colorful variants for specific themes */
.icon-text-colorful.variant-purple .icon {
  @apply text-purple-500 dark:text-purple-400;
}
```

### Active State Indication
#### Sidebar Navigation
```css
/* Active navigation items */
.active {
  @apply scale-105 bg-gradient-to-r from-blue-500/20 via-indigo-500/15 to-purple-500/20 
         text-blue-700 dark:text-blue-300 shadow-lg border border-blue-200/50;
}
```

#### Context Navigation (Topbar)
```css
.context-nav-item.active {
  @apply text-blue-700 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-900/30
         border-b-2 border-blue-500 dark:border-blue-400 shadow-sm;
}
```

### Mobile-First Responsive Navigation
#### Sidebar Behavior
- **Mobile**: Hidden by default, overlay when opened
- **Tablet**: Collapsed by default, expandable
- **Desktop**: Full by default, user-controlled states

#### Header Context Navigation
- **Mobile**: Horizontal scroll, icon-only buttons
- **Tablet**: Horizontal scroll, icon + minimal text
- **Desktop**: Full button labels, expanded layout

## Scrollbar & Interaction Design

### Custom Scrollbar Styling
```css
::-webkit-scrollbar {
  width: 8px; height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9; /* Light mode */
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-track {
  background: #1e293b; /* Dark mode */
}

.dark ::-webkit-scrollbar-thumb {
  background: #475569;
}
```

### Hidden Scrollbar Utility
```css
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

## Status & Feedback Systems

### Status Indicators
```css
.status-dot { @apply w-2 h-2 rounded-full; }
.status-online { @apply bg-green-500; }
.status-offline { @apply bg-slate-400; }
.status-away { @apply bg-yellow-500; }
.status-busy { @apply bg-red-500; }
```

### Loading States
- Spinner animations with gradient backgrounds
- Skeleton loading for complex components
- Progressive disclosure for data-heavy interfaces

## Implementation Best Practices

### CSS Architecture
1. **Utility-First Approach**: Tailwind CSS as foundation
2. **Component Classes**: Custom classes for repeated patterns
3. **Responsive Design**: Mobile-first breakpoint strategy
4. **Dark Mode**: Comprehensive dark variant support

### Performance Considerations
1. **CSS-in-JS Avoidance**: Static CSS classes for better performance
2. **Animation Optimization**: Hardware-accelerated transforms
3. **Reduced Motion**: Respects `prefers-reduced-motion` settings
4. **Selective Rendering**: Conditional component rendering

### Accessibility Standards
1. **WCAG AA Compliance**: 4.5:1 minimum contrast ratios
2. **Focus Management**: Clear focus indicators with 2px minimum width
3. **Screen Reader Support**: Proper ARIA labels and semantic markup
4. **Keyboard Navigation**: Full keyboard accessibility

## Form Design System

### Dynamic Form Components
#### AutocompleteTagSelector
- Multi-step selection process (Quick Select → Search → Selected Tags)
- Glassmorphism fieldset containers
- Responsive tag cloud displays

#### DrugSectionWidget
- Grid-based layout (1-3 columns responsive)
- Checkbox selection with conditional inputs
- Color-coded drug categories

#### RadioButtonGroup & CheckboxGroup
- CSS Grid with auto-fit columns (`minmax(180px, 1fr)`)
- Consistent spacing and typography
- Accessible focus states

### Form Layout Patterns
```css
/* Responsive form grids */
.grid.grid-cols-[repeat(auto-fit,minmax(200px,1fr))].gap-x-4.gap-y-2
```

## Page-Specific Design Patterns

### Dashboard Design
- **Greeting Card**: Animated background elements with glassmorphism
- **Project Grid**: Card-based layout with hover effects and status indicators
- **Sidebar Widgets**: News, quick tasks, notifications with colorful cards

### Project Context Design
- **Active Project Display**: Interactive project switching with dropdown
- **Role-Based Navigation**: Disabled states for insufficient permissions
- **Context Headers**: Page-specific toolbars with relevant actions

### Form Builder Interface
- **Three-Panel Layout**: Metadata editor, schema editor, preview panel
- **JSON Syntax Highlighting**: Monospace fonts with error state styling
- **Real-time Preview**: Dynamic form rendering with error boundaries

## Typography System

### Font Hierarchy
```css
/* System font stack */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
             'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
             sans-serif;

/* Code/monospace */
font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
```

### Heading Scales
- **Page Headers**: `text-2xl sm:text-3xl font-bold` with gradient text
- **Card Titles**: `text-xl font-semibold` with consistent spacing
- **Section Headers**: `text-lg font-semibold` with border accents

## Future Extensibility

### Design Token System
The color palette and spacing system is designed to be easily extensible:
```css
/* CSS Custom Properties for theming */
--color-primary-500: #3b82f6;
--color-primary-600: #2563eb;
--spacing-unit: 0.25rem;
```

### Component Modularity
- Each component is self-contained with its own styling
- Shared utilities via Tailwind classes
- Easy theme switching through CSS custom properties

### Responsive Scaling
- All measurements use relative units (rem, em, %)
- Breakpoint-specific utilities for different screen sizes
- Container queries ready for future CSS support

This design system creates a cohesive, professional, and accessible interface that scales well across devices while maintaining the vibrant, modern aesthetic appropriate for medical research applications.
