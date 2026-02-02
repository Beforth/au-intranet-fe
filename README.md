# Aether ERP | Enterprise Design System & Documentation

Aether ERP is a high-performance, modern dashboard system built with React and Tailwind CSS. This document serves as the absolute source of truth for the design system, component architecture, and implementation standards.

---

## 🎨 Design Philosophy
The Aether design system is centered around **Subtle Premiumism**. It prioritizes extreme clarity, hairline depth, and high-end "Pro" aesthetics inspired by modern SaaS platforms.

**Core Directives:**
- **Zero Bulk**: No heavy shadows, no thick borders, no high-contrast saturation.
- **Glass & Air**: Use subtle translucency (`/60`) and generous whitespace (`2rem`+).
- **Hauline Borders**: All borders must use `slate-200/60` or lighter (`slate-50`).
- **Micro-Interactivity**: Every click and hover must have a soft transition (default `300ms`).

---

## 🛠️ Visual Specification (Tokens)

### 1. Color Palette
- **Primary**: `#4f46e5` (Indigo 600) - Used for primary actions, active states, and highlights.
- **Primary Muted**: `rgba(79, 70, 229, 0.05)` - Soft Indigo tint for secondary backgrounds and icons.
- **Backgrounds**:
  - Main Body: `#f8fafc` (Slate 50)
  - Component Surface: `#ffffff` (Pure White)
  - Header Surfaces: `#fafafa` (Very light grey for contrast)
- **Text Layers**:
  - `slate-900`: Main content, headings, and critical labels.
  - `slate-600`: Standard body text.
  - `slate-400`: Sub-labels, secondary data, and breadcrumbs.
- **Status Semantic Colors**:
  - **Success**: `emerald` (Text: 600, Bg: 50, Icon: 500)
  - **Warning**: `amber` (Text: 600, Bg: 50, Icon: 500)
  - **Error/Negative**: `rose` (Text: 600, Bg: 50, Icon: 600)

### 2. Typography (Inter Variable)
- **Primary Page Headers**: `text-2xl font-semibold tracking-tight text-slate-900`
- **Component Titles**: `text-[13px] font-bold tracking-tight text-slate-900`
- **Sub-labels/Descriptions**: `text-[11px] font-medium text-slate-400`
- **System Labels (Metadata)**: `text-[9px] or [10px] font-black uppercase tracking-widest text-slate-400`
- **Table Data**: Always use `tabular-nums` for prices, units, and dates to ensure vertical alignment.
- **Main Body**: `text-[13px] or text-sm` for optimal readability.

### 3. Shadows & Depth (The "Pro" Layer)
- **Soft Border**: `border border-slate-200/60`
- **Elevation 1 (Cards)**: `shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_0_rgba(0,0,0,0.02)]`
- **Elevation 2 (Hover)**: `shadow-xl shadow-indigo-500/5 hover:border-indigo-200/50`
- **Corner Radius**: 
  - Main Cards: `1rem` (16px) 
  - Buttons/Inputs: `0.75rem` (12px)
  - Badges/Icons: `0.5rem` (8px)

---

## 📦 Core Component Standards

### `Card.tsx`
The primary layout unit.
- **API**: `title`, `description`, `noPadding`, `headerAction`, `onClick`, `maxHeight`.
- **Implementation**: 
  - Custom `borderRadius: '1rem'` forced via style.
  - Internal header padding: `px-6 py-5`.
  - Content padding: `p-6` (unless `noPadding` is true).
- **Shadow**: Custom multi-layered shadow for that "hauline" feel.

### `StatCard.tsx`
Designed for KPIs and high-level metrics.
- **Metrics**: `text-2xl font-bold tracking-tight`.
- **Icon Container**: `w-9 h-9 bg-slate-50 border border-slate-100 rounded-lg`.
- **Transitions**: Scale and color shift on parent group hover.

### `DeleteButton.tsx`
A specialized reusable semantic button.
- **Design**: Minimalist trash icon, black by default, turns `rose-600` on hover with a splash of `rose-50`.
- **Interaction**: `active:scale-95 transition-all`.

### `DataTable.tsx`
The standard for presenting structured data.
- **Headers**: `px-4 py-3 bg-slate-50/30 border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400`.
- **Cell Content**: `text-[13px] text-slate-600 font-medium`.
- **Row Hover**: `hover:bg-slate-50/20`.

---

## 📐 Layout & Spacing

### 1. Sidebar & Navigation
- **Dimensions**: `w-60` (240px). Reduced from standard bulk to felt more agile.
- **Icons**: Lucide icons at `size={18}` with `strokeWidth={2}`.
- **Spacing**: Internal item padding `px-3 py-2.5`, margin between items `my-0.5`.
- **Active State**: Soft `indigo-50` background with `indigo-600` text and `font-semibold`.

### 2. Page Structure
- **Global Gap**: `gap-8` for major grids (Cards).
- **Page Margins**: 
  - Top: `4rem` (64px) via `calc(var(--ui-padding) * 2)`.
  - Sides: `2rem` (32px).
- **Responsive Handling**: Grids should shift from `grid-cols-1` on mobile to `lg:grid-cols-3` or `lg:grid-cols-4` on desktop.

---

## 🚦 Coding Patterns & Best Practices

1. **Utility-First**: Use Tailwind primitives for everything. Only use `style={{...}}` for dynamic values (like chart heights or specific radii not in the system).
2. **Conditional Classes**: Always use the `cn()` utility (`lib/utils.ts`) to merge classes safely.
3. **Lucide Icon Props**: Stick to `size={14}` and `strokeWidth={2.5}` for small actions and `size={18}` for sidebar items.
4. **Data Integrity**: Populate components with real-world demo data. Never use "Lorem Ipsum" or generic "Card Title 1".
5. **Transitions**: Apply `transition-all duration-300` to all hoverable elements.

---

## 🚀 Development Quickstart
- `npm run dev`: Starts the local development server (default port 3000).
- `npm run build`: Generates the production bundle in `/dist`.
- `npm run preview`: Previews the production build locally.

## 📂 Project Structure
- `/components/ui`: Atomic, reusable UI elements.
- `/components/layout`: Global navigation, sidebar, and page layout wrappers.
- `/pages`: View-level components mapped to routes.
- `/lib`: Helper utilities and shared libraries.
- `demoData.ts`: Centralized data store for simulating a live system environment.
- `types.ts`: Global TypeScript interface definitions.
