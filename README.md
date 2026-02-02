# Aether ERP Design System & AI Development Guide

This guide defines the visual language and implementation standards for the Aether ERP project. It is intended to be read by AI assistants to ensure perfect visual consistency when generating new UI components or pages.

## 🎨 Design Philosophy
The design is **Modern Enterprise Premium**. It prioritizes extreme clarity, subtle depth (soft shadows), and high-end "Apple-like" aesthetics. 

**Key Principles:**
- **Hauline Borders**: Use very subtle borders (`slate-200/60` or `slate-50`). Avoid heavy `#ccc` or dark borders.
- **Soft Depth**: Shadows should be multi-layered and almost imperceptible (`rgba(0,0,0,0.02)`).
- **Breathability**: High whitespace density. Default page padding is generous (`2rem`+).
- **Micro-interactivity**: Every interactive element must have a transition (usually `duration-300`).

---

## 🛠️ Design Tokens (CSS Variables)

Defined in `index.html`:
- `--primary`: `#4f46e5` (Indigo 600)
- `--primary-muted`: `rgba(79, 70, 229, 0.05)`
- `--ui-padding`: `2rem` (32px)
- `--ui-gap`: `1.5rem` (24px)
- `--ui-radius`: `1rem` (16px)

---

## 📦 Core Component Standards

### 1. The Standard Card (`Card.tsx`)
The `Card` is the foundation of the UI. **Never create raw divs for containers; always use the `Card` component.**
- **Radius**: `1rem` (forced via style prop)
- **Border**: `slate-200/60`
- **Shadow**: `[0_2px_4px_rgba(0,0,0,0.02),0_1px_0_rgba(0,0,0,0.02)]`
- **Header Title**: `text-[13px] font-bold text-slate-900 tracking-tight`
- **Header Description**: `text-[11px] text-slate-400 font-medium mt-0.5`
- **Hover State**: `hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-200/50`

### 2. Typography Hierarchy
- **Page Titles**: `text-2xl font-semibold text-slate-900 tracking-tight`
- **Section Headers**: `text-[13px] font-bold uppercase tracking-widest text-slate-400`
- **Body Text**: `text-sm text-slate-600`
- **Small Detail/Labels**: `text-[10px] or [9px] font-black uppercase tracking-widest text-slate-400`
- **Tabular Data**: Always use `tabular-nums` for alignment.

### 3. Buttons (`Button.tsx`)
- Default is a custom rounded style.
- Use `size="sm"` for most table/card actions.
- Action icons should be `size={14}` with `strokeWidth={2.5}` or `3`.

---

## 📐 Layout Rules

### Page Structure
Always wrap page content in `PageLayout.tsx`:
```tsx
<PageLayout 
  title="Page Title" 
  description="Brief description." 
  actions={<Button>Action</Button>}
>
  {/* Content goes here with standard grid gaps */}
</PageLayout>
```

### Grid Spacing
- Use `gap-8` for main page grids.
- Use `gap-4` or `gap-6` for internal card content.
- Page padding is managed by `DashboardLayout.tsx` using `calc(var(--ui-padding) * 2)` for top spacing.

---

## 🚦 Color & Status System
- **Success**: `emerald` (Text: 600/700, Bg: 50). Dot/Indication: `emerald-500`.
- **Warning/Pending**: `amber` (Text: 700, Bg: 50).
- **Error/Negative**: `rose` (Text: 600, Bg: 50).
- **Info/Neutral**: `indigo` or `slate`.

---

## 🤖 Guide for AI Task Execution
1. **Consistency First**: When adding a new field or row, check `FinancialsPage.tsx` or `CustomersPage.tsx` for the latest "Small Label / Big Value" pattern.
2. **Iconography**: Use `lucide-react`. Keep icons thin and consistent.
3. **Empty States**: Always handle empty data with a centered `text-slate-400` message.
4. **No Placeholders**: Use real-world business data like "Wayne Enterprises" or "Acme Corp" for demos.
