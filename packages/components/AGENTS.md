# @arkyn/components — agent guide

React UI kit: 55 components, 11 hooks, 5 context providers, 2 services. Use it whenever you're asked to build forms, modals/drawers, tables, tabs, uploads, calendars, or similar UI in a React/Remix/React Router/Next project that has this package installed. Prefer these exports over hand-rolled markup or other UI libraries. Every prop, default, and behavior note below was read directly from source — this file is meant to be fully self-sufficient, you shouldn't need to open `node_modules` or README.md to use any of these correctly.

## Required setup

- ESM only: `import`, never `require()`.
- Always-required peer deps: `react`, `react-dom`, `lucide-react`.
- Optional peer deps, install only if the matching component/hook is used:
  - `RichText` → `slate`, `slate-history`, `slate-react`, `is-hotkey`
  - `MaskedInput`, `PhoneInput` → `@react-input/mask`
  - `PlacesProvider`, `SearchPlaces` → `@react-google-maps/api`
  - `MapView` → `mapbox-gl`
  - `ToastProvider` / `useToast` → `react-hot-toast`
  - `useAutomation`, `useSearchAutomation` → `react-scroll`
  - `toRichTextValue` service → `html-react-parser`

## Import convention — always prefer subpath imports

Prefer importing each component/hook from its own subpath instead of the root barrel (`@arkyn/components`). It keeps editor/TS resolution scoped to what you actually use and lets you import only the CSS you need:

```tsx
import { Button } from "@arkyn/components/button";
import "@arkyn/components/button.css";

import { IconButton } from "@arkyn/components/iconButton";
import "@arkyn/components/iconButton.css";
```

**Naming rule**: the subpath is always the export name with only its first letter lowercased — nothing else changes. `Button` → `button`, `IconButton` → `iconButton`, `AlertContainer` → `alertContainer`, `useScopedParams` → `useScopedParams` (already lowercase-first, unchanged). This is exact and holds for every single export in this package — every subpath below follows it.

**CSS imports**: `import "@arkyn/components/<subpath>.css"` exists only for components that render their own visible markup. It does **not** exist (the import will fail) for: hooks, providers, services, and these specific components that render no styled markup of their own — `ClientOnly`, `FacebookPixel`, `GoogleAnalytics`, `GoogleTagManager`, `SearchPlaces` (inherits `Input`'s styling). Every other component listed below has a matching `.css` subpath — it's called out explicitly in each entry.

If you're using many components, importing the aggregate stylesheet once (`import "@arkyn/components/styles"`) instead of per-component CSS is simpler and avoids duplicate CSS between files that share internals (e.g. `FileUpload` and `Button`).

## Core patterns

Form field (label + input + error), wrap the tree in a `FormProvider` supplying field errors so error messages render automatically:

```tsx
import { FieldWrapper } from "@arkyn/components/fieldWrapper";
import { FieldLabel } from "@arkyn/components/fieldLabel";
import { Input } from "@arkyn/components/input";
import { FieldError } from "@arkyn/components/fieldError";
import { Button } from "@arkyn/components/button";
import "@arkyn/components/fieldWrapper.css";
import "@arkyn/components/fieldLabel.css";
import "@arkyn/components/input.css";
import "@arkyn/components/fieldError.css";
import "@arkyn/components/button.css";

<FieldWrapper>
  <FieldLabel showAsterisk>Email</FieldLabel>
  <Input name="email" type="email" placeholder="you@example.com" />
  <FieldError>{errors.email}</FieldError>
</FieldWrapper>
<Button type="submit" scheme="primary">Save</Button>
```

Note: most form inputs (`Input`, `Textarea`, `Select`, etc.) already read `fieldErrors[name]` from `FormProvider` internally via `useForm()` and render their own error text — an explicit `FieldError` is only needed for fields without built-in error display, or to override.

Modal/drawer: wrap the app (or subtree) in the provider, open/close via the scoped hook by name:

```tsx
import { ModalProvider } from "@arkyn/components/modalProvider";
import { ModalContainer } from "@arkyn/components/modalContainer";
import { ModalHeader } from "@arkyn/components/modalHeader";
import { ModalFooter } from "@arkyn/components/modalFooter";
import { useModal } from "@arkyn/components/useModal";
import "@arkyn/components/modalContainer.css";
import "@arkyn/components/modalHeader.css";
import "@arkyn/components/modalFooter.css";

const { modalIsOpen, openModal, closeModal } = useModal("confirm-delete");
```

Same pattern for `DrawerProvider`/`useDrawer` (`drawerIsOpen`/`openDrawer`/`closeDrawer`). Toasts: `ToastProvider` + `useToast().showToast({ message, type })`.

---

## Forms & inputs

### Button
- Import: `import { Button } from "@arkyn/components/button";`
- Styles: `import "@arkyn/components/button.css";`
- Extends: native `<button>` attributes
- Props:
  - `isLoading?: boolean` — shows a spinner and disables the button during async operations. Default: `false`.
  - `loadingText?: string` — text displayed beside the spinner when `isLoading` is true.
  - `size?: "xs" | "sm" | "md" | "lg"` — Default: `"md"`.
  - `variant?: "solid" | "outline" | "ghost" | "invisible"` — `solid`: filled background. `outline`: bordered, transparent. `ghost`: no border, subtle hover. `invisible`: no visual styling. Default: `"solid"`.
  - `scheme?: "primary" | "secondary" | "success" | "warning" | "danger" | "info"` — Default: `"primary"`.
  - `leftIcon?: LucideIcon`
  - `rightIcon?: LucideIcon`

### IconButton
- Import: `import { IconButton } from "@arkyn/components/iconButton";`
- Styles: `import "@arkyn/components/iconButton.css";`
- Extends: native `<button>` attributes, omitting `children` and `aria-label` (both redeclared)
- Notable: always requires `aria-label` for accessibility; disables itself and shows a spinner while `isLoading`.
- Props:
  - `icon: LucideIcon` — required.
  - `aria-label: string` — required (re-declared as required, unlike native optional `aria-label`).
  - `isLoading?: boolean` — Default: `false`.
  - `size?: "xs" | "sm" | "md" | "lg"` — Default: `"md"`.
  - `variant?: "solid" | "outline" | "ghost" | "invisible"` — Default: `"solid"`.
  - `scheme?: "primary" | "secondary" | "success" | "warning" | "danger" | "info"` — Default: `"primary"`.

### Input
- Import: `import { Input } from "@arkyn/components/input";`
- Styles: `import "@arkyn/components/input.css";`
- Extends: native `<input>` attributes, omitting `size`, `prefix`, `name`, `value`, `defaultValue` (redeclared below)
- Notable: renders wrapped in a field template (label/error/orientation); when `type="hidden"` it short-circuits to a plain hidden `<input>` ignoring most styling props.
- Requires context: reads `useForm()` internally for `fieldErrors[name]` — optional, but wrap in `FormProvider` to surface server-side validation errors automatically.
- Props:
  - `name: string` — required.
  - `label?: string`
  - `errorMessage?: string` — validation error shown below the input.
  - `isLoading?: boolean` — Default: `false`.
  - `unShowFieldTemplate?: boolean` — skip the label/error wrapper. Default: `false`.
  - `size?: "md" | "lg"` — Default: `"md"`.
  - `variant?: "solid" | "outline" | "underline"` — Default: `"solid"`.
  - `prefix?: string | LucideIcon` — rendered outside the input area, far left.
  - `suffix?: string | LucideIcon` — rendered outside the input area, far right.
  - `showAsterisk?: boolean`
  - `orientation?: "horizontal" | "vertical" | "horizontalReverse"` — Default: `"horizontal"`.
  - `leftIcon?: LucideIcon` / `rightIcon?: LucideIcon` — rendered inside the input.
  - `value?: string` / `defaultValue?: string`

### Textarea
- Import: `import { Textarea } from "@arkyn/components/textarea";`
- Styles: `import "@arkyn/components/textarea.css";`
- Extends: native `<textarea>` attributes, omitting `name`, `value`, `defaultValue` (redeclared)
- Notable: integrates with `useForm` for validation errors by field name; wraps the field in a clickable `<section>` that focuses the textarea when clicked anywhere in it.
- Props:
  - `name: string` — required.
  - `label?: string`
  - `showAsterisk?: boolean`
  - `errorMessage?: string`
  - `size?: "md" | "lg"` — Default: `"md"`.
  - `variant?: "solid" | "outline"` — Default: `"solid"`.
  - `value?: string` / `defaultValue?: string`

### Checkbox
- Import: `import { Checkbox } from "@arkyn/components/checkbox";`
- Styles: `import "@arkyn/components/checkbox.css";`
- Extends: native `<button>` attributes minus `size`, `prefix`, `type`, `name`, `defaultValue`, `value`, `onChange`, `onSelect`, `onClick` (all redeclared)
- Notable: stores its value in a hidden `<input>` for native form submission.
- Requires context: reads `useForm()` for `fieldErrors[name]` — optional, works standalone without `FormProvider`.
- Props:
  - `name: string` — required.
  - `label?: string`
  - `showAsterisk?: boolean`
  - `unShowFieldTemplate?: boolean` — Default: `false`.
  - `errorMessage?: string`
  - `size?: "sm" | "md" | "lg"` — Default: `"md"`.
  - `value?: string` — value stored when checked. Default: `"checked"`.
  - `checked?: boolean` / `defaultChecked?: boolean` (default `false`)
  - `onCheck?: (value: string) => void` — receives the value string (or `""` when unchecked).
  - `orientation?: "horizontal" | "vertical" | "horizontalReverse"` — Default: `"horizontalReverse"`.

### Switch
- Import: `import { Switch } from "@arkyn/components/switch";`
- Styles: `import "@arkyn/components/switch.css";`
- Extends: native `<button>` attributes minus `children`, `onChange`, `defaultValue`, `onCheck`, `value` (redeclared)
- Notable: renders as a `<button>` storing its value in a hidden `<input>`; integrates with `useForm`.
- Props:
  - `name: string` — required.
  - `label?: string`
  - `size?: "sm" | "md" | "lg"` — Default: `"lg"`.
  - `checked?: boolean` / `defaultChecked?: boolean` (default `false`)
  - `value?: string` — value emitted when on. Default: `"checked"`.
  - `unCheckedValue?: string` — value emitted when off. Default: `""`.
  - `onCheck?: (value: string) => void`
  - `orientation?: "vertical" | "horizontal" | "horizontalReverse"` — Default: `"horizontalReverse"`.
  - `unShowFieldTemplate?: boolean` — Default: `false`.
  - `showAsterisk?: boolean`
  - `errorMessage?: string`

### Select
- Import: `import { Select } from "@arkyn/components/select";`
- Styles: `import "@arkyn/components/select.css";`
- Extends: no native element, own props only
- Notable: single-option dropdown with optional search; integrates with `useForm` by field name.
- Props:
  - `name: string` — required.
  - `options: { label: string; value: string }[]` — required.
  - `id?: string`
  - `value?: string` / `defaultValue?: string` (default `""`)
  - `showAsterisk?: boolean`
  - `label?: string`
  - `errorMessage?: string`
  - `placeholder?: string` — Default: `"Selecione..."`.
  - `notFoundText?: string` — Default: `"Sem opções disponíveis"`.
  - `className?: string`
  - `disabled?: boolean` / `readOnly?: boolean` / `isLoading?: boolean` — all default `false`.
  - `isSearchable?: boolean` — Default: `false`.
  - `closeOnSelect?: boolean` — Default: `true`.
  - `onSearch?: (value: string) => void` — for async option loading.
  - `onChange?: (value: string) => void`
  - `onFocus?: () => void` / `onBlur?: (e: FocusEvent<HTMLDivElement>) => void`
  - `size?: "md" | "lg"` — Default: `"md"`.
  - `variant?: "solid" | "outline" | "underline"` — Default: `"solid"`.
  - `prefix?: string | LucideIcon` / `leftIcon?: LucideIcon`
  - `optionMaxHeight?: number`
  - `unShowFieldTemplate?: boolean` — Default: `false`.
  - `orientation?: "horizontal" | "vertical" | "horizontalReverse"` — runtime default is `"vertical"` (JSDoc says `"horizontal"`, code differs — verify visually if it matters).

### MultiSelect
- Import: `import { MultiSelect } from "@arkyn/components/multiSelect";`
- Styles: `import "@arkyn/components/multiSelect.css";`
- Extends: no native element, own props only
- Notable: same as `Select` but `value`/`defaultValue`/`onChange` work on `string[]`; selected values stored as a JSON array in a hidden `<input>`.
- Props: same as `Select` above, except:
  - `value?: string[]` / `defaultValue?: string[]` (default `[]`)
  - `onChange?: (value: string[]) => void`
  - `closeOnSelect?: boolean` — Default: `false` (differs from `Select`'s `true`).
  - (no `readOnly` documented — check before relying on it)

### RadioGroup
- Import: `import { RadioGroup } from "@arkyn/components/radioGroup";`
- Styles: `import "@arkyn/components/radioGroup.css";`
- Extends: native `<div>` attributes minus `onChange`
- Notable: renders a hidden `<input>` for native form submission; reads `fieldErrors[name]` from `FormProvider` when no `errorMessage` is explicitly provided. Provides `RadioProvider` context consumed by child `RadioBox`.
- Props:
  - `name: string` — required.
  - `label?: string`
  - `showAsterisk?: boolean` — Default: `false`.
  - `errorMessage?: string` — overrides the `FormProvider` error.
  - `value?: string` / `defaultValue?: string` (default `""`)
  - `onChange?: (value: string) => void`
  - `size?: "sm" | "md" | "lg"` — applied to all `RadioBox` children. Default: `"md"`.
  - `disabled?: boolean` — disables all children. Default: `false`.
  - `unShowFieldTemplate?: boolean` — Default: `false`.
  - `orientation?: "horizontal" | "vertical" | "horizontalReverse"` — runtime default `"vertical"`.

### RadioBox
- Import: `import { RadioBox } from "@arkyn/components/radioBox";`
- Styles: `import "@arkyn/components/radioBox.css";`
- Extends: native `<button>` attributes
- Notable: renders as a `<label>` wrapping a hidden `<button>`.
- Requires context: must be a direct child of `RadioGroup` — reads active value/size/error/disabled via its context.
- Props:
  - `value: string` — required.
  - `isError?: boolean` — inherited from `RadioGroup` when unset.
  - `size?: "sm" | "md" | "lg"` — inherited from `RadioGroup` when unset.

### CurrencyInput
- Import: `import { CurrencyInput } from "@arkyn/components/currencyInput";`
- Styles: `import "@arkyn/components/currencyInput.css";`
- Extends: native `<input>` attributes minus `size`, `prefix`, `name`, `type`, `max`, `defaultValue`, `value`, `onChange`, `placeholder` (redeclared)
- Notable: raw numeric value stored in a separate hidden `<input>` for form submission; visible input shows the locale-formatted string.
- Props:
  - `name: string` — required.
  - `locale: "USD" | "EUR" | "JPY" | "GBP" | "AUD" | "CAD" | "CHF" | "CNY" | "SEK" | "NZD" | "BRL" | "INR" | "RUB" | "ZAR" | "MXN" | "SGD" | "HKD" | "NOK" | "KRW" | "TRY" | "IDR" | "THB"` — required.
  - `label?: string` / `errorMessage?: string`
  - `isLoading?: boolean` — Default: `false`.
  - `unShowFieldTemplate?: boolean` — Default: `false`.
  - `size?: "md" | "lg"` — Default: `"md"`.
  - `variant?: "solid" | "outline" | "underline"` — Default: `"solid"`.
  - `orientation?: "horizontal" | "vertical" | "horizontalReverse"` — Default: `"horizontal"`.
  - `prefix?: string | LucideIcon` / `suffix?: string | LucideIcon`
  - `showAsterisk?: boolean`
  - `leftIcon?: LucideIcon` / `rightIcon?: LucideIcon`
  - `max?: number` — Default: `1_000_000_000`.
  - `value?: number` / `defaultValue?: number`
  - `onChange?: (event: ChangeEvent<HTMLInputElement>, originalValue: string, maskedValue: string) => void` — `originalValue` e.g. `"1234.56"`, `maskedValue` e.g. `"$ 1,234.56"`.

### MaskedInput
- Import: `import { MaskedInput } from "@arkyn/components/maskedInput";`
- Styles: `import "@arkyn/components/maskedInput.css";`
- Extends: native `<input>` attributes, omitting `size`, `prefix`, `name`, `type`
- Requires peer dependency: `@react-input/mask`.
- Notable: integrates with `useForm` for validation errors.
- Props:
  - `name: string` — required.
  - `mask: string` — e.g. `"(__) _____-____"`. Required.
  - `replacement: string | Replacement` — editable placeholder character/map. Required.
  - `separate?: boolean` — strip mask characters from the underlying value.
  - `showMask?: boolean` — show full mask pattern before typing.
  - `label?: string` / `errorMessage?: string`
  - `isLoading?: boolean` — Default: `false`.
  - `size?: "md" | "lg"` — Default: `"md"`.
  - `variant?: "solid" | "outline" | "underline"` — Default: `"solid"`.
  - `prefix?: string | LucideIcon` / `suffix?: string | LucideIcon`
  - `showAsterisk?: boolean`
  - `leftIcon?: LucideIcon` / `rightIcon?: LucideIcon`
  - `value?: string` / `defaultValue?: string`

### PhoneInput
- Import: `import { PhoneInput } from "@arkyn/components/phoneInput";`
- Styles: `import "@arkyn/components/phoneInput.css";`
- Extends: no native element, own props only
- Requires peer dependency: `@react-input/mask`. Also uses `@arkyn/shared` (`findCountryMask`, `formatToPhone`, `removeNonNumeric`) and `@arkyn/templates` (`countries`) internally.
- Notable: integrated country selector with automatic mask per country; hidden `<input>` stores a numeric string prefixed with the country dial code.
- Props:
  - `name: string` — required (stored value includes country code).
  - `id?: string`
  - `disabled?: boolean` / `readOnly?: boolean` — default `false`.
  - `errorMessage?: string` — overrides the `useForm` context error.
  - `label?: string` / `showAsterisk?: boolean`
  - `isLoading?: boolean` — Default: `false`.
  - `size?: "md" | "lg"` — Default: `"md"`.
  - `variant?: "solid" | "outline"` — Default: `"solid"`.
  - `className?: string`
  - `defaultValue?: string` — numeric string, with or without country code. Default: `""`.
  - `notFoundCountryText?: string` — Default: `"Nenhum país encontrado"`.
  - `searchCountryPlaceholder?: string` — Default: `"Pesquisar país"`.
  - `defaultCountryIso?: (typeof countries)[number]["iso"]` — Default: `"BR"`.
  - `onChange?: (e: string) => void` — receives numeric string with country dial code.
  - `value?: string` — controlled, without country code.
  - `unShowFieldTemplate?: boolean` — Default: `false`.
  - `orientation?: "horizontal" | "vertical" | "horizontalReverse"` — Default: `"vertical"`.

### Slider
- Import: `import { Slider } from "@arkyn/components/slider";`
- Styles: `import "@arkyn/components/slider.css";`
- Extends: native `<div>` attributes minus `onChange`
- Notable: supports click-to-set and drag-to-set positioning; pairs naturally with the `useSlider` hook for managed state.
- Props:
  - `value: number` — 0–100. Required.
  - `onChange: (value: number) => void` — required.
  - `disabled?: boolean` — Default: `false`.
  - `onDragging?: (isDragging: boolean) => void` — fires on drag start/end.

### FieldWrapper
- Import: `import { FieldWrapper } from "@arkyn/components/fieldWrapper";`
- Styles: `import "@arkyn/components/fieldWrapper.css";`
- Extends: native `<section>` attributes
- Notable: pure layout container grouping a field with its label/error.
- Props:
  - `children: ReactNode` — required.
  - `orientation?: "vertical" | "horizontal" | "horizontalReverse"` — Default: `"vertical"`.

### FieldLabel
- Import: `import { FieldLabel } from "@arkyn/components/fieldLabel";`
- Styles: `import "@arkyn/components/fieldLabel.css";`
- Extends: native `<label>` attributes
- Props:
  - `showAsterisk?: boolean` — appends `*`. Default: `false`.

### FieldError
- Import: `import { FieldError } from "@arkyn/components/fieldError";`
- Styles: `import "@arkyn/components/fieldError.css";`
- Extends: native `<strong>` attributes
- Notable: renders nothing (`null`) when `children` is empty/falsy.
- Props: none beyond `<strong>` attributes.

---

## Uploads

All three uploaders share the same shape: drag-and-drop UI, `fetch` a `multipart/form-data` request to `action`, store the returned URL in a hidden `<input name={name}>` for native form submission, read `useForm()`'s `fieldErrors[name]` optionally (works standalone without `FormProvider`).

### FileUpload
- Import: `import { FileUpload } from "@arkyn/components/fileUpload";`
- Styles: `import "@arkyn/components/fileUpload.css";`
- Props:
  - `name: string` / `action: string` — both required.
  - `disabled?: boolean` — Default: `false`.
  - `label?: string` / `showAsterisk?: boolean` (default `false`)
  - `changeFileButtonText?: string` — Default: `"Alterar arquivo"`.
  - `selectFileButtonText?: string` — Default: `"Selecionar arquivo"`.
  - `dropFileText?: string` — Default: `"Ou arraste e solte o arquivo aqui"`.
  - `method?: string` — Default: `"POST"`.
  - `fileName?: string` — form-data field name. Default: `"file"`.
  - `fileResponseName?: string` — response property holding the URL. Default: `"url"`.
  - `acceptFile?: string` — Default: `"*"`.
  - `onChange?: (url?: string) => void` — fires after successful upload.

### ImageUpload
- Import: `import { ImageUpload } from "@arkyn/components/imageUpload";`
- Styles: `import "@arkyn/components/imageUpload.css";`
- Props:
  - `name: string` / `action: string` — both required.
  - `defaultValue?: string | null` — pre-populated preview URL. Default: `""`.
  - `className?: string`
  - `disabled?: boolean` — Default: `false`.
  - `label?: string` / `showAsterisk?: boolean` (default `false`)
  - `changeImageButtonText?: string` — Default: `"Alterar imagem"`.
  - `selectImageButtonText?: string` — Default: `"Selecionar imagem"`.
  - `dropImageText?: string` — Default: `"Ou arraste e solte a imagem aqui"`.
  - `method?: string` — Default: `"POST"`.
  - `fileName?: string` — Default: `"file"`.
  - `fileResponseName?: string` — Default: `"url"`.
  - `acceptImage?: string` — Default: `"image/*"`.
  - `onChange?: (url: string) => void`
  - `unShowFieldTemplate?: boolean` — Default: `false`.
  - `orientation?: "horizontal" | "vertical" | "horizontalReverse"` — runtime default `"vertical"`.

### AudioUpload
- Import: `import { AudioUpload } from "@arkyn/components/audioUpload";`
- Styles: `import "@arkyn/components/audioUpload.css";`
- Props:
  - `name: string` / `action: string` — both required.
  - `fileName?: string` — Default: `"file"`.
  - `method?: string` — Default: `"POST"`.
  - `acceptAudio?: string` — Default: `"audio/*"`.
  - `dropAudioText?: string` — Default: `"Ou arraste e solte um arquivo de áudio aqui"`.
  - `selectAudioButtonText?: string` — Default: `"Selecionar arquivo de áudio"`.
  - `changeAudioButtonText?: string` — Default: `"Trocar arquivo de áudio"`.
  - `onChange?: (url?: string) => void`
  - `fileResponseName?: string` — Default: `"url"`.
  - `label?: string` / `showAsterisk?: boolean` (default `false`)
  - `disabled?: boolean` — Default: `false`.
  - `defaultValue?: string` — Default: `""`.

---

## Layout & navigation

### TabContainer
- Import: `import { TabContainer } from "@arkyn/components/tabContainer";`
- Styles: `import "@arkyn/components/tabContainer.css";`
- Extends: native `<nav>`/HTMLElement attributes minus `onChange`, `children`, `ref`, `onClick`
- Notable: manages active-tab state for `TabButton` children; renders as `<nav>`.
- Props:
  - `children: ReactNode` — `TabButton`s. Required.
  - `disabled?: boolean` — disables all tabs. Default: `false`.
  - `defaultValue?: string`
  - `onChange?: (index: string) => void`

### TabButton
- Import: `import { TabButton } from "@arkyn/components/tabButton";`
- Styles: `import "@arkyn/components/tabButton.css";`
- Extends: native `<button>` attributes minus `children`, `value`, `type` (always renders `type="button"`)
- Requires context: must be inside a `TabContainer`.
- Notable: own `disabled` is OR'd with the container's `disabled`.
- Props:
  - `children: ReactNode` — required.
  - `value: string` — matched against the container's active value. Required.
  - `disabled?: boolean` — disables this tab individually.

### CardTabContainer
- Import: `import { CardTabContainer } from "@arkyn/components/cardTabContainer";`
- Styles: `import "@arkyn/components/cardTabContainer.css";`
- Extends: native HTMLElement attributes (renders `<nav>`) minus `onClick`, `children`, `ref`, `onChange`
- Notable: same active-tab management pattern as `TabContainer`, styled as cards.
- Props: same shape as `TabContainer` — `children: ReactNode` (required), `disabled?: boolean` (default `false`), `defaultValue?: string`, `onChange?: (index: string) => void`.

### CardTabButton
- Import: `import { CardTabButton } from "@arkyn/components/cardTabButton";`
- Styles: `import "@arkyn/components/cardTabButton.css";`
- Extends: native `<button>` attributes minus `children`, `value`, `type`
- Requires context: must be inside a `CardTabContainer`.
- Props:
  - `children: ReactNode` — required.
  - `value: string` — required.

### Pagination
- Import: `import { Pagination } from "@arkyn/components/pagination";`
- Styles: `import "@arkyn/components/pagination.css";`
- Extends: native `<div>` attributes minus `onChange`
- Notable: renders page number buttons, prev/next chevrons, and `…` spread indicators.
- Props:
  - `totalCountRegisters: number` — required.
  - `currentPage: number` — 1-indexed. Required.
  - `siblingsCount?: number` — Default: `1`.
  - `registerPerPage?: number` — Default: `10`.
  - `onChange?: (page: number) => void`

### Divider
- Import: `import { Divider } from "@arkyn/components/divider";`
- Styles: `import "@arkyn/components/divider.css";`
- Extends: native `<div>` attributes
- Props:
  - `orientation?: "horizontal" | "vertical"` — Default: `"horizontal"`.

### Badge
- Import: `import { Badge } from "@arkyn/components/badge";`
- Styles: `import "@arkyn/components/badge.css";`
- Extends: native `<div>` attributes
- Props:
  - `size?: "md" | "lg"` — Default: `"lg"`.
  - `variant?: "solid" | "outline" | "ghost"` — Default: `"ghost"`.
  - `scheme?: "primary" | "secondary" | "success" | "warning" | "danger" | "info"` — Default: `"primary"`.
  - `leftIcon?: LucideIcon` / `rightIcon?: LucideIcon`

---

## Overlays

### ModalContainer
- Import: `import { ModalContainer } from "@arkyn/components/modalContainer";`
- Styles: `import "@arkyn/components/modalContainer.css";`
- Extends: native HTMLElement attributes
- Notable: animated centered modal over a backdrop, locks body scroll while open, closes on overlay click. Provides context consumed by `ModalHeader`.
- Props:
  - `isVisible: boolean` — required.
  - `makeInvisible: () => void` — called when the overlay is clicked. Required.

### ModalHeader
- Import: `import { ModalHeader } from "@arkyn/components/modalHeader";`
- Styles: `import "@arkyn/components/modalHeader.css";`
- Extends: native `<header>` attributes
- Requires context: must be rendered inside `ModalContainer`.
- Props:
  - `showCloseButton?: boolean` — Default: `true`.

### ModalFooter
- Import: `import { ModalFooter } from "@arkyn/components/modalFooter";`
- Styles: `import "@arkyn/components/modalFooter.css";`
- Extends: native `<footer>` attributes
- Props:
  - `alignment?: "left" | "center" | "right" | "between" | "around"` — Default: `"right"`.

### DrawerContainer
- Import: `import { DrawerContainer } from "@arkyn/components/drawerContainer";`
- Styles: `import "@arkyn/components/drawerContainer.css";`
- Extends: native `<aside>` attributes
- Notable: animated slide-in panel, locks body scroll while open, closes on overlay click. Provides context consumed by `DrawerHeader`.
- Props:
  - `isVisible: boolean` — required.
  - `makeInvisible: () => void` — required.
  - `orientation?: "left" | "right"` — side it slides in from. Default: `"left"`.

### DrawerHeader
- Import: `import { DrawerHeader } from "@arkyn/components/drawerHeader";`
- Styles: `import "@arkyn/components/drawerHeader.css";`
- Extends: native `<header>` attributes
- Requires context: must be rendered inside `DrawerContainer`.
- Props:
  - `showCloseButton?: boolean` — Default: `true`.

### Popover
- Import: `import { Popover } from "@arkyn/components/popover";`
- Styles: `import "@arkyn/components/popover.css";`
- Extends: no native element, own props only
- Notable: dismisses on outside click; locks body scroll while open.
- Props:
  - `children: ReactNode` — floating panel content. Required.
  - `button: ReactNode` — trigger element. Required.
  - `closeOnClick?: boolean` — clicking content also closes it. Default: `false`.
  - `orientation?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "top" | "left" | "bottom" | "right"` — Default: `"bottomLeft"`.
  - `className?: string`

### Tooltip
- Import: `import { Tooltip } from "@arkyn/components/tooltip";`
- Styles: `import "@arkyn/components/tooltip.css";`
- Extends: native `<div>` attributes minus `children`
- Notable: viewport-aware — flips to the opposite side automatically if it would overflow (checked again after first flip).
- Props:
  - `text: string` — supports inline HTML (rendered via `dangerouslySetInnerHTML`). Required.
  - `children: ReactNode` — trigger element. Required.
  - `orientation?: "top" | "right" | "bottom" | "left"` — preferred side. Default: `"top"`.
  - `size?: "md" | "lg"` — Default: `"lg"`.

---

## Feedback

### AlertContainer
- Import: `import { AlertContainer } from "@arkyn/components/alertContainer";`
- Styles: `import "@arkyn/components/alertContainer.css";`
- Extends: native `<div>` attributes
- Notable: auto-detects a nested `AlertTitle` to switch centered vs left-aligned layout; provides `scheme` context to children (e.g. `AlertIcon`).
- Props:
  - `scheme: "success" | "danger" | "warning" | "info"` — required, no default.

### AlertTitle
- Import: `import { AlertTitle } from "@arkyn/components/alertTitle";`
- Styles: `import "@arkyn/components/alertTitle.css";`
- Extends: native `<div>` attributes
- Notable: its presence among `AlertContainer`'s children switches the container to left-aligned layout.
- Props: none beyond `<div>` attributes.

### AlertDescription
- Import: `import { AlertDescription } from "@arkyn/components/alertDescription";`
- Styles: `import "@arkyn/components/alertDescription.css";`
- Extends: native `<div>` attributes
- Props: none beyond `<div>` attributes.

### AlertContent
- Import: `import { AlertContent } from "@arkyn/components/alertContent";`
- Styles: `import "@arkyn/components/alertContent.css";`
- Extends: native `<div>` attributes
- Notable: wraps `AlertTitle`/`AlertDescription`.
- Props: none beyond `<div>` attributes.

### AlertIcon
- Import: `import { AlertIcon } from "@arkyn/components/alertIcon";`
- Styles: `import "@arkyn/components/alertIcon.css";`
- Extends: `LucideProps` (no native HTML element)
- Requires context: must be inside `AlertContainer` — reads `scheme` to pick the icon (`success`→`CheckCircle2`, `danger`→`XCircle`, `warning`→`AlertTriangle`, `info`→`Info`).
- Props: none beyond `LucideProps` (`size`, `color`, `strokeWidth`, `className`, etc.).

---

## Data display (Table)

All four sub-parts render inside `TableContainer`.

### TableContainer
- Import: `import { TableContainer } from "@arkyn/components/tableContainer";`
- Styles: `import "@arkyn/components/tableContainer.css";`
- Extends: native `<table>` attributes
- Notable: root wrapper; renders a responsive scrollable `<div>` around an inner `<table>` (props apply to the outer `<div>`, not the `<table>` itself).
- Props: none beyond `<table>` attributes.

### TableHeader
- Import: `import { TableHeader } from "@arkyn/components/tableHeader";`
- Styles: `import "@arkyn/components/tableHeader.css";`
- Extends: native `<thead>` attributes
- Notable: wraps children (expected `<th>` elements) in an automatic `<tr>`, followed by an automatic spacing `<tr className="spacingRow" />`.
- Props: none beyond `<thead>` attributes.

### TableBody
- Import: `import { TableBody } from "@arkyn/components/tableBody";`
- Styles: `import "@arkyn/components/tableBody.css";`
- Extends: native `<tbody>` attributes
- Notable: when `children` is empty, renders a full-width (`colSpan={100}`) empty-state row instead.
- Props:
  - `emptyMessage?: string` — Default: `"Nenhum dado adicionado."`.

### TableFooter
- Import: `import { TableFooter } from "@arkyn/components/tableFooter";`
- Styles: `import "@arkyn/components/tableFooter.css";`
- Extends: native `<tfoot>` attributes
- Notable: auto-inserts a spacing `<tr>` above the content row; children wrapped in `<th colSpan={100}>` (commonly used for `Pagination`).
- Props: none beyond `<tfoot>` attributes.

### TableCaption
- Import: `import { TableCaption } from "@arkyn/components/tableCaption";`
- Styles: `import "@arkyn/components/tableCaption.css";`
- Extends: native HTMLElement attributes (renders `<caption>`)
- Notable: wraps children in an inner `<div className="arkynTableCaptionContent">`.
- Props: none beyond `<caption>` attributes.

---

## Calendars & media

### Calendar
- Import: `import { Calendar } from "@arkyn/components/calendar";`
- Styles: `import "@arkyn/components/calendar.css";`
- Extends: no native element — discriminated union `SingleCalendarProps | RangeCalendarProps` on `type`
- Notable: manages navigation state internally via its own provider.
- Props (common):
  - `type: "single" | "range"` — required.
  - `variant?: "basic" | "complete"` — `basic` = simplified header. Default: `"complete"`.
  - `viewValue?: Date` / `defaultViewValue?: Date`
  - `onChangeView?: (date: Date) => void`
  - When `type: "single"`: `value?: Date`, `defaultValue?: Date`, `onChange?: (date: Date) => void`.
  - When `type: "range"`: `value?: [Date, Date]`, `defaultValue?: [Date, Date]`, `onChange?: (date: [Date, Date]) => void`.

### DatePicker
- Import: `import { DatePicker } from "@arkyn/components/datePicker";`
- Styles: `import "@arkyn/components/datePicker.css";`
- Extends: no native element — discriminated union `SingleDatePickerProps | RangeDatePickerProps` on `type`
- Notable: opens a popover `Calendar` (same flip-based positioning as `Select`'s options list). **Missing from README.md — it's a real public export, don't skip it.**
- Requires context: reads `useForm()` optionally.
- Props (common):
  - `name: string` — required.
  - `type: "single" | "range"` — required.
  - `id?: string` / `showAsterisk?: boolean` / `label?: string` / `errorMessage?: string`
  - `placeholder?: string` — Default: `"Selecione uma data..."`.
  - `className?: string`
  - `disabled?: boolean` / `readOnly?: boolean` / `isLoading?: boolean` — default `false`.
  - `closeOnSelect?: boolean` — Default: `true` for `single`, `false` for `range`.
  - `onFocus?: () => void` / `onBlur?: (e: FocusEvent<HTMLDivElement>) => void`
  - `size?: "md" | "lg"` — Default: `"md"`.
  - `variant?: "solid" | "outline" | "underline"` — Default: `"solid"`.
  - `prefix?: string | LucideIcon` / `leftIcon?: LucideIcon`
  - `unShowFieldTemplate?: boolean` — Default: `false`.
  - `orientation?: "horizontal" | "vertical" | "horizontalReverse"` — Default: `"vertical"`.
  - `calendarVariant?: "basic" | "complete"` — forwarded to internal `Calendar`. Default: `"complete"`.
  - When `type: "single"`: `value?: Date`, `defaultValue?: Date`, `onChange?: (date: Date) => void`, plus `viewValue?`/`defaultViewValue?`/`onChangeView?`.
  - When `type: "range"`: `value?: [Date, Date]`, `defaultValue?: [Date, Date]`, `onChange?: (date: [Date, Date]) => void`, plus `viewValue?`/`defaultViewValue?`/`onChangeView?`, and `rangeSeparator?: string` (Default: `" até "`).

### FullCalendar
- Import: `import { FullCalendar } from "@arkyn/components/fullCalendar";`
- Styles: `import "@arkyn/components/fullCalendar.css";`
- Extends: no native element, own props only
- Notable: day/week/month views; internal state managed by its own internal provider.
- Props:
  - `viewValue?: Date` / `defaultViewValue?: Date`
  - `events?: FullCalendarEvent[]` — each: `{ title: string; initialDate: Date; endDate?: Date; data?: any; scheme?: "primary"|"success"|"warning"|"danger"|"info" (default "primary"); onClick?: (data: any) => void }`.
  - `blockedTimestamps?: BlockTimestamp[]` — each: `{ initialDate: Date; endDate: Date }`.
  - `onChangeView?: (date: Date) => void` / `onClickDate?: (date: Date) => void`

### AudioPlayer
- Import: `import { AudioPlayer } from "@arkyn/components/audioPlayer";`
- Styles: `import "@arkyn/components/audioPlayer.css";`
- Extends: native `<audio>` attributes minus `onEnded`, `src` (redeclared)
- Notable: renders play/pause, elapsed/total time (`MM:SS`), and a scrubbable `Slider` progress bar.
- Props:
  - `src: string` — required.
  - `disabled?: boolean` — Default: `false`.
  - `onPlayAudio?: (props: AudioInformationProps) => void` / `onPauseAudio?: (props: AudioInformationProps) => void` — `AudioInformationProps`: `{ currentTime, totalTime, formattedCurrentTime, formattedTotalTime }`.

---

## Maps & places

### SearchPlaces
- Import: `import { SearchPlaces } from "@arkyn/components/searchPlaces";`
- Styles: none — reuses `Input`'s styles, don't try to import `searchPlaces.css` (doesn't exist).
- Extends: `Input`'s props minus `onLoad`, `onChange`, `type`
- Requires peer dependency: `@react-google-maps/api` (`StandaloneSearchBox`). Requires the Google Maps JS API loaded (typically via `PlacesProvider`).
- Props:
  - `options?: StandaloneSearchBoxProps["options"]` — e.g. `componentRestrictions`, `bounds`.
  - `onChange?: (e: string) => void` — fires on every input change.
  - `onPlaceChanged?: (e: PlaceData) => void` — `PlaceData`: `{ street, city, state, neighborhood, postalCode, stateShortName, streetNumber, coordinates: { lat, lng } }`.

### MapView
- Import: `import { MapView } from "@arkyn/components/mapView";`
- Styles: `import "@arkyn/components/mapView.css";`
- Extends: native `<div>` attributes
- Requires peer dependency: `mapbox-gl`.
- Notable: renders client-side only; shows a placeholder pin before hydration or when `coordinates` is empty.
- Props:
  - `accessToken: string` — Mapbox public token. Required.
  - `zoom?: number` — Default: `18`.
  - `coordinates?: Coordinate | Coordinate[]` — `Coordinate`: `{ lat: number; lng: number; data?: any; popUp?: ReactNode }`.
  - `onMarkerClick?: (coordinate: Coordinate) => void`

---

## Tracking (no-op outside production unless `showInDevMode`)

All three render nothing in development mode unless `showInDevMode` is `true`, and are wrapped in `ClientOnly` internally (no SSR errors). None have a `.css` subpath — they render no visible markup.

### GoogleAnalytics
- Import: `import { GoogleAnalytics } from "@arkyn/components/googleAnalytics";`
- Props:
  - `measurementId: string` — e.g. `"G-XXXXXXXXXX"`. Required.
  - `showInDevMode?: boolean` — Default: `false`.

### GoogleTagManager
- Import: `import { GoogleTagManager } from "@arkyn/components/googleTagManager";`
- Notable: injects both the `<script>` and `<noscript>` GTM snippets.
- Props:
  - `gtmId: string` — e.g. `"GTM-XXXXXXX"`. Required.
  - `events?: Record<string, string>` — pushed to the dataLayer on init.
  - `dataLayer?: Record<string, string>` — initial dataLayer entries before GTM loads.
  - `dataLayerName?: string` — Default: `"dataLayer"`.
  - `auth?: string` / `preview?: string` — GTM environment tokens.
  - `showInDevMode?: boolean` — Default: `false`.

### FacebookPixel
- Import: `import { FacebookPixel } from "@arkyn/components/facebookPixel";`
- Props:
  - `pixelId: string` — required.
  - `showInDevMode?: boolean` — Default: `false`.
  - `options?: { autoConfig?: boolean; debug?: boolean }` — defaults `true`/`false`.
  - `pageView?: boolean` — fires standard `PageView` on mount.
  - `grantConsent?: boolean` / `revokeConsent?: boolean` — cookie/tracking consent via `fbq("consent", ...)`.
  - `track?: [string, any?]` — standard event `[eventName, eventData?]`.
  - `trackCustom?: [string, any?]` — custom event.
  - `trackSingle?: [string, any?]` / `trackSingleCustom?: [string, any?]` — single-pixel variants.

---

## Rich text

### RichText
- Import: `import { RichText } from "@arkyn/components/richText";`
- Styles: `import "@arkyn/components/richText.css";`
- Extends: no native element, own `RichTextProps` type
- Requires peer dependencies: `slate`, `slate-history`, `slate-react`, `is-hotkey`.
- Notable: content stored as a Slate JSON string in a hidden `<input>` for form submission. Toolbar buttons: Heading 1, Heading 2, Block Quote, Bold, Italic, Underline, Code, Align Left/Right/Center/Justify, Insert Image (only if `imageConfig` given), Insert Video, Insert Link. Pressing Space/Enter right after a link stops new text from continuing the link.
- Props:
  - `name: string` — required.
  - `className?: string`
  - `unShowFieldTemplate?: boolean` — Default: `false`.
  - `orientation?: "horizontal" | "vertical" | "horizontalReverse"` — runtime default `"vertical"`.
  - `hiddenButtons?: RichTextHiddenButtonKey[]` — e.g. `["image", "code"]`.
  - `maxLimit?: number` — Default: `10000`.
  - `enforceCharacterLimit?: boolean` — blocks typing past `maxLimit`. Default: `false`.
  - `baseErrorMessage?: string` — overrides `useForm` context error.
  - `defaultValue?: string` — Slate JSON string. Default: `"[]"`.
  - `isError?: boolean` — forces error visual state.
  - `id?: string` / `label?: string` / `showAsterisk?: boolean`
  - `imageConfig?: RichTextInsertImageProps` — enables image insertion; `action: string` required inside, plus modal label overrides (`tabLabels?`, `modalTitle?`, `modalInputUrlLabel?`, `modalInputImageLabel?`, `modalCancelButton?`, `modalConfirmButton?`).
  - `videoConfig?: RichTextInsertVideoProps` — modal label overrides (`modalTitle?`, `modalInputUrlLabel?`, `modalCancelButton?`, `modalConfirmButton?`, `invalidUrlMessage?`).
  - `linkConfig?: RichTextInsertLinkProps` — same shape as `videoConfig`.
  - `onChangeCharactersCount?: (e: number) => void` — fires on every keystroke.
  - `onChange?: (value: Descendant[]) => void` — Slate `Descendant[]`.

Convert between this editor's value and HTML with the `toHtml`/`toRichTextValue` services below.

---

## SSR safety

### ClientOnly
- Import: `import { ClientOnly } from "@arkyn/components/clientOnly";`
- Styles: none — renders no markup of its own, `clientOnly.css` doesn't exist.
- Extends: no native element, own props only
- Notable: prevents hydration mismatches for components relying on `window`/`navigator`/`document`; uses `useHydrated` internally.
- Props:
  - `children(): React.ReactNode` — render function called after hydration. Required (a function, not a plain node).
  - `fallback?: React.ReactNode` — rendered during SSR/before hydration. Default: `null`.

---

## Hooks

### useForm
- Import: `import { useForm } from "@arkyn/components/useForm";`
- Signature: `useForm(): { fieldErrors: { [x: string]: any } }`
- Requires: intended for use inside `FormProvider`, but does **not** throw if missing (unlike `useModal`/`useDrawer`/`useToast`) — just returns the default empty context, so `fieldErrors` would be `undefined`.

### useModal
- Import: `import { useModal } from "@arkyn/components/useModal";`
- Signature (no key): `useModal<T = any>(): { modalIsOpen(key): boolean; modalData(key): T; openModal(key, data?): void; closeModal(key): void; closeAll(): void }`
- Signature (with key): `useModal<T = any>(key: string): { modalIsOpen: boolean; modalData: T; openModal: (data?: T) => void; closeModal: () => void }` — note `closeAll` is only on the no-key form.
- Requires: must be inside `ModalProvider` — throws `"useModal must be used within a Provider"` otherwise.

### useDrawer
- Import: `import { useDrawer } from "@arkyn/components/useDrawer";`
- Signature (no key): `useDrawer<T = any>(): { drawerIsOpen(key): boolean; drawerData(key): T; openDrawer(key, data?): void; closeDrawer(key): void }`
- Signature (with key): `useDrawer<T = any>(key: string): { drawerIsOpen: boolean; drawerData: T; openDrawer: (data?: T) => void; closeDrawer: () => void }`
- Requires: must be inside `DrawerProvider` — throws `"useDrawer must be used within a Provider"` otherwise. (No `closeAll` equivalent, unlike `useModal`.)

### useToast
- Import: `import { useToast } from "@arkyn/components/useToast";`
- Signature: `useToast(): { showToast(toast: { message: string; type: "success" | "danger" }): void }`
- Requires: must be inside `ToastProvider` — throws `"useToast must be used within a Provider"` otherwise.

### useSlider
- Import: `import { useSlider } from "@arkyn/components/useSlider";`
- Signature: `useSlider(defaultValue?: number): [sliderValue: number, changeSliderValue: (value: number) => void]`
- Notable: value is clamped to `[0, 100]` both on init (default `0`) and on every update.

### useHydrated
- Import: `import { useHydrated } from "@arkyn/components/useHydrated";`
- Signature: `useHydrated(): boolean`
- Notable: `true` once hydrated client-side, `false` during SSR. Built on `useSyncExternalStore`.

### useScopedParams
- Import: `import { useScopedParams } from "@arkyn/components/useScopedParams";`
- Signature: `useScopedParams(searchString: string, scope?: string = ""): { getParam: (key: string) => string | null; getScopedSearch: (params: Record<string, string|number|boolean|undefined>) => string }`
- Notable: does not read `location.search` itself — you pass the search string in. `getScopedSearch` deletes a key when its value is `undefined`; returns `""` if no params remain, otherwise a `?`-prefixed string.

### useScrollLock
- Import: `import { useScrollLock } from "@arkyn/components/useScrollLock";`
- Signature: `useScrollLock(isLocked: boolean): void`
- Notable: while locked, sets `document.body.style.overflow = "hidden"` and pads `paddingRight` by the scrollbar width to prevent layout shift; used internally by `ModalContainer`/`DrawerContainer`.

### useAutomation
- Import: `import { useAutomation } from "@arkyn/components/useAutomation";`
- Signature: `useAutomation(formResponseData: any): void`
- Requires: must be inside both `ModalProvider` and `ToastProvider` (calls `useModal()`/`useToast()` internally, both throw if missing). Also needs `react-scroll` peer dep.
- Notable: side-effect only — reads a server-action response shape (`{ name, message, cause }`) and: closes all modals if `closeModal` is truthy, smooth-scrolls if `cause.data.scrollTo` is set, and fires a success/danger toast based on `name` matching known success/error response names.

### useSearchAutomation
- Import: `import { useSearchAutomation } from "@arkyn/components/useSearchAutomation";`
- Signature: `useSearchAutomation(searchString: string, scope?: string = ""): void`
- Requires: same as `useAutomation` (`ModalProvider` + `ToastProvider`), plus `react-scroll`.
- Notable: URL-driven sibling of `useAutomation` — reads `closeModal`/`message`/`name`/`type` from scoped URL params instead of a response object.

### useCopyToClipboard
- Import: `import { useCopyToClipboard } from "@arkyn/components/useCopyToClipboard";`
- Signature: `useCopyToClipboard(): { copyToClipboard: (text: string) => Promise<boolean> }`
- Notable: tries `navigator.clipboard.writeText` first, falls back to a hidden `<textarea>` + `document.execCommand("copy")`. Never throws — resolves `false` on any failure.

---

## Providers

### FormProvider
- Import: `import { FormProvider } from "@arkyn/components/formProvider";`
- Props: `children: ReactNode` (required); `fieldErrors?: any` — map of field name → error message, typically from Zod/server validation; `form?: React.ReactElement` — if given, cloned and `children` placed inside it (e.g. wrap a Remix `<Form>`).
- Exposes (via `useForm`): `fieldErrors`.

### ModalProvider
- Import: `import { ModalProvider } from "@arkyn/components/modalProvider";`
- Props: `children: ReactNode` (required).
- Exposes (via `useModal`): `modalIsOpen(key)`, `modalData(key)`, `openModal(key, data?)` (replaces existing entry for that key), `closeModal(key)`, `closeAll()`.

### DrawerProvider
- Import: `import { DrawerProvider } from "@arkyn/components/drawerProvider";`
- Props: `children: ReactNode` (required).
- Exposes (via `useDrawer`): `drawerIsOpen(key)`, `drawerData(key)`, `openDrawer(key, data?)`, `closeDrawer(key)`. No `closeAll` (unlike `ModalProvider`).

### ToastProvider
- Import: `import { ToastProvider } from "@arkyn/components/toastProvider";`
- Props: `children: ReactNode` (required).
- Exposes (via `useToast`): `showToast({ message, type: "success" | "danger" })`.
- Notable: also renders a `react-hot-toast` `<Toaster position="top-right">` alongside `children` — don't render your own `Toaster` too.

### PlacesProvider
- Import: `import { PlacesProvider } from "@arkyn/components/placesProvider";`
- Props: `apiKey: string` (required, Google Maps API key); `children: (isLoaded: boolean) => ReactNode` (required — **render-prop, not plain children**); `preventFontsLoading?: boolean` (default `true`).
- Notable: no matching custom hook — unlike Modal/Drawer/Toast/Form, `isLoaded` is only available through the render-prop callback, not via context.

---

## Services

### toHtml
- Import: `import { toHtml } from "@arkyn/components/toHtml";`
- Signature: `toHtml(richTextValue: RichTextValue): string`
- Converts a `RichText` editor's Slate `Descendant[]` value into an HTML string.

### toRichTextValue
- Import: `import { toRichTextValue } from "@arkyn/components/toRichTextValue";`
- Requires peer dependency: `html-react-parser`.
- Signature: `toRichTextValue(html: string): RichTextValue`
- Converts an HTML string into a `RichText` editor's `defaultValue` (Slate `Descendant[]`).

## Related packages

- `@arkyn/shared` — formatting/validation utilities used alongside these components (e.g. `formatToCpf` for display, independent of `MaskedInput`'s input-time masking).
- `@arkyn/templates` — `countries`/`brazilianStates` shape matches `Select`/`MultiSelect`'s `options` prop directly; `PhoneInput` uses it internally for country masks.
