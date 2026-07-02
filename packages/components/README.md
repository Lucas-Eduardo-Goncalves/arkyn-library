# @arkyn/components

A modern React component library featuring 40+ UI components, smooth animations, custom hooks, and TypeScript support.

[![npm version](https://img.shields.io/npm/v/@arkyn/components.svg)](https://www.npmjs.com/package/@arkyn/components)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## ✨ What it solves

Every React/Remix/React Router/Next app ends up rebuilding the same UI primitives — buttons, inputs, modals, drawers, tables, tabs, alerts — with slightly different accessibility, validation, and animation behavior each time. `@arkyn/components` packages a complete, accessible, TypeScript-first set of these primitives (40+ components, plus supporting hooks and providers) so teams can compose screens instead of rebuilding foundations. Components integrate with a shared form-validation context (`FormProvider`/`useForm`), share consistent styling and motion, and cover everything from basic inputs to rich text editing, calendars, maps, and third-party tracking scripts.

## 🧩 Features

- 🧱 **Forms & inputs** — `Input`, `Textarea`, `Checkbox`, `Switch`, `Select`, `MultiSelect`, `RadioGroup`/`RadioBox`, `CurrencyInput`, `MaskedInput`, `PhoneInput`, `Slider`, `FieldWrapper`/`FieldLabel`/`FieldError` for labeled, validated fields with consistent layout
- 📁 **Uploads** — `FileUpload`, `ImageUpload`, and `AudioUpload` with drag-and-drop, server upload, and preview built in
- 🧭 **Layout & navigation** — `TabContainer`/`TabButton`, `CardTabContainer`/`CardTabButton`, `Pagination`, `Divider`, `Badge`
- 🪟 **Overlays** — `ModalContainer`/`ModalHeader`/`ModalFooter` + `ModalProvider`/`useModal`, `DrawerContainer`/`DrawerHeader` + `DrawerProvider`/`useDrawer`, `Popover`, `Tooltip`
- 🔔 **Feedback** — `AlertContainer`/`AlertTitle`/`AlertDescription`/`AlertIcon`/`AlertContent`, `ToastProvider`/`useToast`
- 📊 **Data display** — `TableContainer`/`TableHeader`/`TableBody`/`TableFooter`/`TableCaption`
- 📅 **Calendars & media** — `Calendar` (single/range date picking), `FullCalendar` (day/week/month views with events), `AudioPlayer`
- 🗺️ **Google Places & Maps** — `SearchPlaces`, `PlacesProvider`, and Mapbox-powered `MapView`
- 📈 **Tracking integrations** — `GoogleAnalytics`, `GoogleTagManager`, `FacebookPixel`, all dev-mode aware
- ✍️ **Rich text editing** — `RichText` (Slate.js-based WYSIWYG editor) with `toHtml`/`toRichTextValue` conversion services
- 🪝 **Hooks** — `useForm`, `useModal`, `useDrawer`, `useToast`, `useSlider`, `useHydrated`, `useScopedParams`, `useScrollLock`, `useAutomation`, `useSearchAutomation`
- 🧑‍💻 **SSR-safe** — `ClientOnly` and `useHydrated` guard against hydration mismatches for browser-only UI

## 📋 Prerequisites

- **Node.js** `>=24.16.0` or **Bun** `>=1.3.14`
- Always-required peer dependencies:
  - `react >=18.0.0`
  - `react-dom >=18.0.0`
  - `lucide-react >=1.14.0` — used for icons across most components

### Optional peer dependencies

Only install these if you use the specific component/hook that needs them:

- `mapbox-gl >=3.0.0` — required by `MapView`
- `is-hotkey >=0.2.0` — required by `RichText`
- `slate >=0.100.0`, `slate-history >=0.100.0`, `slate-react >=0.100.0` — required by `RichText`
- `@react-google-maps/api >=2.0.0` — required by `PlacesProvider` and `SearchPlaces`
- `react-scroll >=1.8.0` — required by `useAutomation`
- `@react-input/mask >=2.0.0` — required by `MaskedInput` and `PhoneInput`
- `html-react-parser >=5.0.0` — required by the `toRichTextValue` service
- `react-hot-toast >=2.0.0` — required by `ToastProvider` / `useToast`

## 📦 Installation

> **ESM only.** This package ships as native ES modules with no CommonJS build — use `import`, not `require()`.

```bash
npm install @arkyn/components react react-dom lucide-react
```

Then install any optional peer dependencies your app actually uses. For example:

```bash
# Using RichText
npm install slate slate-react slate-history is-hotkey

# Using MaskedInput or PhoneInput
npm install @react-input/mask

# Using ToastProvider / useToast
npm install react-hot-toast
```

## 🎨 Styles

This package ships its own stylesheet, which must be imported once (e.g. in your app's root/entry file) for components to render correctly:

```tsx
import "@arkyn/components/styles";
```

## 🚀 Quick Start

```tsx
import {
  Button,
  FieldError,
  FieldLabel,
  FieldWrapper,
  Input,
} from "@arkyn/components";
import "@arkyn/components/styles";

export function LoginForm() {
  return (
    <form>
      <FieldWrapper>
        <FieldLabel showAsterisk>Email</FieldLabel>
        <Input name="email" type="email" placeholder="you@example.com" />
        <FieldError>Invalid email address</FieldError>
      </FieldWrapper>

      <Button type="submit" scheme="primary">
        Sign in
      </Button>
    </form>
  );
}
```

## 📖 API Reference

### Components

| Export | Description |
| --- | --- |
| `AlertContainer` | Root wrapper for the Alert component set that provides scheme context to its children and switches between centered and left-aligned layout depending on whether an `AlertTitle` is present. |
| `AlertContent` | Text/content area inside an `AlertContainer` that wraps `AlertTitle` and `AlertDescription`. |
| `AlertDescription` | Body text for an alert, meant to be placed inside `AlertContent`. |
| `AlertIcon` | Renders a scheme-appropriate Lucide icon (check, X, warning, or info) based on the `AlertContainer` context it is placed inside. |
| `AlertTitle` | Bold heading for an alert, placed inside `AlertContent`; its presence is detected by `AlertContainer` to switch layout. |
| `AudioPlayer` | Provides play/pause controls, a scrubable progress bar, and elapsed/total time display for an audio source. |
| `AudioUpload` | Drag-and-drop audio file uploader that uploads to a server as multipart/form-data and shows a playback preview, integrating with `useForm` for validation errors. |
| `Badge` | Displays labels, statuses, and categorization tags. |
| `Button` | Used for user interactions and form submissions. |
| `Calendar` | Calendar component supporting single-date and range selection modes. |
| `CardTabButton` | Individual tab button inside a `CardTabContainer` that reads active/disabled state from the container's context. |
| `CardTabContainer` | Wrapper (rendered as `<nav>`) that manages active state for a group of `CardTabButton` components. |
| `Checkbox` | Interactive checkbox input with label, validation, and form integration. |
| `ClientOnly` | Renders its children only after client-side hydration to prevent hydration mismatches for browser-only UI. |
| `CurrencyInput` | Numeric input that formats its displayed value according to a currency locale, storing the raw numeric value for form submission. |
| `Divider` | Visually separates content sections. |
| `DrawerContainer` | Animated slide-in panel over an overlay backdrop that locks body scroll while open and closes on overlay click. |
| `DrawerHeader` | Header section for a `DrawerContainer` with an optional close button. |
| `FacebookPixel` | Injects the Facebook Pixel tracking script client-side; renders nothing in development mode unless `showInDevMode` is set. |
| `FieldError` | Displays a validation error message below a form field; renders nothing when empty. |
| `FieldLabel` | Label for form fields, with an optional required-field asterisk. |
| `FieldWrapper` | `<section>` container that groups a form field with its label and error message. |
| `FileUpload` | Drag-and-drop file uploader with server upload and file-name preview, integrating with `useForm`. |
| `FullCalendar` | Full-featured calendar with day, week, and month views, supporting event display, blocked time ranges, and date navigation. |
| `GoogleAnalytics` | Injects the Google Analytics 4 script client-side; renders nothing in development mode unless `showInDevMode` is set. |
| `GoogleTagManager` | Injects the Google Tag Manager script and noscript snippets client-side; renders nothing in development mode unless `showInDevMode` is set. |
| `IconButton` | Compact button that renders a single icon without a text label, requiring an `aria-label` for accessibility. |
| `ImageUpload` | Drag-and-drop image uploader with server upload and image preview. |
| `Input` | Text input field with label, validation, icons, prefix/suffix, and loading state. |
| `MapView` | Interactive Mapbox map with optional clickable markers, rendered client-side only. |
| `MaskedInput` | Text input with a configurable mask for structured values such as phone numbers, CPF, or credit cards. |
| `ModalContainer` | Animated centered modal over a backdrop overlay that locks body scroll while open and closes on overlay click. |
| `ModalFooter` | Action bar at the bottom of a modal dialog. |
| `ModalHeader` | Header section for a `ModalContainer`, with an optional close button. |
| `MultiSelect` | Multi-option dropdown with optional search, label, validation, and form integration. |
| `Pagination` | Navigation control for paginated data sets, rendering page buttons, prev/next arrows, and spread indicators. |
| `PhoneInput` | Phone number field with an integrated country selector and automatic mask formatting. |
| `Popover` | Floating panel that appears relative to a trigger element and dismisses on outside click. |
| `RadioBox` | Individual option inside a `RadioGroup`, rendered as a label/hidden-button pair. |
| `RadioGroup` | Managed group of `RadioBox` options with form integration. |
| `RichText` | WYSIWYG rich-text editor built on Slate.js with a configurable toolbar (bold, italic, underline, code, headings, quote, alignment, image/video insertion). |
| `SearchPlaces` | Text input with Google Places autocomplete that returns structured address data. |
| `Select` | Single-option dropdown with optional search, label, validation, and form integration. |
| `Slider` | Interactive track for selecting a numeric value between 0 and 100. |
| `Switch` | Toggle input for binary on/off states with form integration. |
| `TabButton` | Individual tab button inside a `TabContainer`. |
| `TabContainer` | Wrapper that manages active state for a group of `TabButton` components. |
| `TableBody` | `<tbody>` section with built-in empty state handling. |
| `TableCaption` | Title/description placed above a table, rendered as a `<caption>` element. |
| `TableContainer` | Root wrapper for the Table component set, rendering a responsive scrollable container around a `<table>`. |
| `TableFooter` | `<tfoot>` section with an automatic spacing row above the content, commonly used for pagination. |
| `TableHeader` | `<thead>` section with an automatic spacing row below the header row. |
| `Textarea` | Multi-line text input with label, validation, and form integration. |
| `Tooltip` | Contextual text bubble shown on hover with smart viewport-aware positioning that flips sides to avoid overflow. |

### Hooks

| Export | Description |
| --- | --- |
| `useAutomation` | Runs UI side-effects (closing modals, scrolling to an element, showing a toast) in response to a server action response payload. |
| `useDrawer` | Accesses the nearest `DrawerProvider` context, returning either the full context or a scoped open/close/data API for one named drawer. |
| `useForm` | Reads the nearest `FormProvider` context to access field-level validation errors. |
| `useHydrated` | Returns `true` once the component has hydrated on the client and `false` during SSR, to safely defer client-only rendering. |
| `useModal` | Accesses the nearest `ModalProvider` context, returning either the full context or a scoped open/close/data API for one named modal. |
| `useScopedParams` | Reads and writes URL search parameters, optionally namespaced with a scope prefix to avoid collisions between features. |
| `useScrollLock` | Locks document body scroll while an overlay is open, compensating for scrollbar width to prevent layout shift. |
| `useSearchAutomation` | URL-driven version of `useAutomation` that reads automation parameters from a URL search string. |
| `useSlider` | State manager for the `Slider` component that clamps its value to the 0–100 range. |
| `useToast` | Reads `ToastProvider` context to display toast notifications via `showToast`. |

### Providers

| Export | Description |
| --- | --- |
| `DrawerProvider` | Context provider that manages open/close state and data for named drawers, exposed to descendants via `useDrawer`. |
| `FormProvider` | Distributes field-level validation errors to all form input components in its subtree so they can display errors automatically. |
| `ModalProvider` | Context provider that manages open/close state and data for named modals, exposed to descendants via `useModal`. |
| `PlacesProvider` | Loads the Google Maps JS API (places, marker, and maps libraries) and renders children via a render-prop that reports load status. |
| `ToastProvider` | Mounts a react-hot-toast `Toaster` and exposes a `showToast` function via context for success/danger notifications. |

### Services

| Export | Description |
| --- | --- |
| `toHtml` | Converts a `RichTextValue` (Slate.js `Descendant` array) to an HTML string. |
| `toRichTextValue` | Converts an HTML string to a `RichTextValue` (Slate.js `Descendant` array) for use as a `RichText` editor's default value. |

## 📚 Documentation

Full component docs, live previews, and prop tables: [https://docs.arkyn.dev](https://docs.arkyn.dev)

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](./LICENSE.txt) file for details.
