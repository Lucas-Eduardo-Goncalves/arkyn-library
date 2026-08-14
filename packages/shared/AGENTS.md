# @arkyn/shared — agent guide

Framework-agnostic formatting, validation, generation, and parsing utilities, safe to import in both client and server code (no React/Remix assumptions). Reach for it whenever you need to format/parse dates, currency, Brazilian documents, phone numbers, generate IDs/slugs, or mask sensitive data, instead of writing ad-hoc regex or `Intl` calls. Everything below is exact — signatures, defaults, and throw behavior — read directly from source, no need to open README.md or any other file for correct usage.

## Required setup

- ESM only: `import`, never `require()`.
- No required peer deps. `libphonenumber-js` is an optional peer dep, only needed for `formatToPhone` and `findCountryMask`.
- `formatToCurrency` takes a currency code (e.g. `"BRL"`, `"USD"`) that must exist in `@arkyn/templates`'s `countryCurrencies`, otherwise it throws.

## Import convention — always prefer subpath imports

Prefer importing each function from its own subpath instead of the root barrel (`@arkyn/shared`):

```typescript
import { formatToCpf } from "@arkyn/shared/formatToCpf";
import { generateSlug } from "@arkyn/shared/generateSlug";
```

**Naming rule**: the subpath is always the export name, unchanged (every export here already starts with a lowercase letter, so this is just `@arkyn/shared/<exportName>`) — no casing transformation needed, unlike `@arkyn/components`. This is exact for every export in this package; each entry below states its own import line. There are no per-export CSS files in this package (no UI).

## Formats

#### formatDate
- Import: `import { formatDate } from "@arkyn/shared/formatDate";`
- Signature: `formatDate([date, time = "00:00:00"]: string[], inputFormat: "brazilianDate" | "isoDate" | "timestamp", outputFormat: string, timezone: number = 0): string`
- Formats a date (and optional time) string into a custom output format string (e.g. `"YYYY-MM-DD hh:mm"`). Calculations run in UTC+0; `timezone` shifts the result by that many hours. Throws if the input format string is unrecognized or the resulting date is invalid.
```typescript
formatDate(["25/12/2023", "15:30:00"], "brazilianDate", "YYYY-MM-DD hh:mm"); // "2023-12-25 15:30"
formatDate(["2023-12-25", "15:30:00"], "timestamp", "DD/MM/YYYY hh:mm", -3); // "2023-12-25 12:30"
```

#### formatToCpf
- Import: `import { formatToCpf } from "@arkyn/shared/formatToCpf";`
- Signature: `formatToCpf(value: string): string`
- Formats to `XXX.XXX.XXX-XX`. Throws if the cleaned input isn't exactly 11 digits. `formatToCpf("12345678909")` → `"123.456.789-09"`.

#### formatToCnpj
- Import: `import { formatToCnpj } from "@arkyn/shared/formatToCnpj";`
- Signature: `formatToCnpj(value: string): string`
- Formats to `XX.XXX.XXX/XXXX-XX`. Throws if the cleaned input isn't exactly 14 digits. `formatToCnpj("12345678000195")` → `"12.345.678/0001-95"`.

#### formatToCep
- Import: `import { formatToCep } from "@arkyn/shared/formatToCep";`
- Signature: `formatToCep(value: string): string`
- Formats to `XXXXX-XXX`. Throws if the cleaned input isn't exactly 8 digits. `formatToCep("12345678")` → `"12345-678"`.

#### formatToCurrency
- Import: `import { formatToCurrency } from "@arkyn/shared/formatToCurrency";`
- Signature: `formatToCurrency(value: number, currency: keyof typeof countryCurrencies, config?: { showPrefix?: boolean }): string`
- Locale-aware currency string via `Intl.NumberFormat`, resolving locale/currency from `@arkyn/templates`'s `countryCurrencies`. `config.showPrefix` defaults to `true`; set `false` to strip the currency symbol. Throws `"Unsupported currency code"` if `currency` isn't a key in `countryCurrencies`.
```typescript
formatToCurrency(1234.56, "BRL"); // "R$ 1.234,56"
formatToCurrency(1234.56, "USD", { showPrefix: false }); // "1,234.56"
```

#### formatToPhone
- Import: `import { formatToPhone } from "@arkyn/shared/formatToPhone";`
- Signature: `formatToPhone(phoneNumber: string): string`
- Requires peer dependency: `libphonenumber-js`.
- Formats an E.164 phone number using the country mask from `@arkyn/templates`. Throws if the number is invalid or no mask is found. `formatToPhone("+5534920524282")` → `"(34) 92052-4282"`.

#### formatToCapitalizeFirstWordLetter
- Import: `import { formatToCapitalizeFirstWordLetter } from "@arkyn/shared/formatToCapitalizeFirstWordLetter";`
- Signature: `formatToCapitalizeFirstWordLetter(sentence: string): string`
- Capitalizes the first letter of each space-separated word, lowercases the rest. `"HELLO WORLD"` → `"Hello World"`.

#### formatToEllipsis
- Import: `import { formatToEllipsis } from "@arkyn/shared/formatToEllipsis";`
- Signature: `formatToEllipsis(text: string, maxLength: number): string`
- Truncates to `maxLength` without breaking mid-word, appends `"..."` if truncated. `formatToEllipsis("Hello, world!", 5)` → `"Hello..."`.

#### formatToHiddenDigits
- Import: `import { formatToHiddenDigits } from "@arkyn/shared/formatToHiddenDigits";`
- Signature: `formatToHiddenDigits(value: string, options?: { range?: number | [number, number]; hider?: string }): string`
- Replaces digit positions with a mask character, non-digits untouched. `options.range`: positive number = first N digits, negative = last N digits, `[start, end]` tuple = 1-indexed inclusive range. Defaults: `range: 3`, `hider: "*"`.
```typescript
formatToHiddenDigits("123-456-7890", { range: 3 }); // "***-456-7890"
formatToHiddenDigits("123-456-7890", { range: [4, 6], hider: "#" }); // "123-###-7890"
```

#### formatJsonObject
- Import: `import { formatJsonObject } from "@arkyn/shared/formatJsonObject";`
- Signature: `formatJsonObject(value: unknown, indent?: number): string`
- Pretty-prints a JSON-compatible value (object/array/string/primitive) with indentation; strings that parse as JSON are recursively formatted too.

#### formatJsonString
- Import: `import { formatJsonString } from "@arkyn/shared/formatJsonString";`
- Signature: `formatJsonString(jsonString: string): string`
- Parses a JSON string and pretty-prints it. Throws if the input isn't valid JSON.

## Generators

#### generateId
- Import: `import { generateId } from "@arkyn/shared/generateId";`
- Signature: `generateId(type: "text", format: "v4" | "v7"): string` / `generateId(type: "binary", format: "v4" | "v7"): Uint8Array`
- Generates a UUID. `type` picks the representation (`"text"` string or `"binary"` `Uint8Array`), `format` picks `v4` (random) or `v7` (time-ordered, sortable). Throws `"Invalid type or format"` for any other combination.

#### generateSlug
- Import: `import { generateSlug } from "@arkyn/shared/generateSlug";`
- Signature: `generateSlug(rawString: string): string`
- URL-friendly slug: strips accents, removes non-alphanumeric chars (keeps spaces/hyphens), lowercases, spaces → hyphens, collapses/trims hyphens. `"Hello, World!"` → `"hello-world"`.

#### generateColorByString
- Import: `import { generateColorByString } from "@arkyn/shared/generateColorByString";`
- Signature: `generateColorByString(rawString: string): string`
- Deterministic hex color derived from a hash of the input; same input always produces the same color. Useful for stable avatar/tag colors keyed by name/id.

## Parsers

#### parseToDate
- Import: `import { parseToDate } from "@arkyn/shared/parseToDate";`
- Signature: `parseToDate([date, time = "00:00:00"]: string[], inputFormat: "brazilianDate" | "isoDate" | "timestamp", timezone: number = 0): Date`
- Same input contract as `formatDate` but returns a `Date` object instead of a formatted string. Throws under the same conditions.

#### parseLargeFields
- Import: `import { parseLargeFields } from "@arkyn/shared/parseLargeFields";`
- Signature: `parseLargeFields(jsonString: string, maxLength: number = 1000): string`
- Parses JSON and replaces any string field longer than `maxLength` with `"To large information: field as {length} characters"`, recursing into nested objects/arrays. Throws if input isn't valid JSON.

#### parseSensitiveData
- Import: `import { parseSensitiveData } from "@arkyn/shared/parseSensitiveData";`
- Signature: `parseSensitiveData(jsonString: string, sensitiveKeys: string[] = ["password", "confirmPassword", "creditCard"]): string`
- Parses JSON and replaces the value of every matching key (recursively, including JSON-encoded string values) with `"****"`. Unlike the other parsers, this one does **not** throw on invalid JSON — it returns the original string unchanged. Safe to call on arbitrary log/debug payloads.

## Utilities

#### calculateCardInstallment
- Import: `import { calculateCardInstallment } from "@arkyn/shared/calculateCardInstallment";`
- Signature: `calculateCardInstallment(props: { cashPrice: number; numberInstallments: number; fees?: number }): { totalPrice: number; installmentPrice: number }`
- Compound-interest installment math. `fees` defaults to `0.0349` (3.49%); no interest applied when `fees === 0` or `numberInstallments === 1`. Throws if `numberInstallments <= 0` or `fees < 0`.
```typescript
calculateCardInstallment({ cashPrice: 1000, numberInstallments: 12, fees: 0.02 });
// { totalPrice: 1124.62, installmentPrice: 93.72 }
```

#### findCountryMask
- Import: `import { findCountryMask } from "@arkyn/shared/findCountryMask";`
- Signature: `findCountryMask(phoneNumber: string): [mask: string, country: CountryType]`
- Requires peer dependency: `libphonenumber-js`.
- Resolves the phone mask (`"_"` placeholders) and `@arkyn/templates` `CountryType` metadata for an E.164 number. Picks the mask matching the number's digit count for countries with multiple valid lengths (e.g. Brazil with/without the ninth digit). Throws if invalid or no mask found.

#### ensureQuotes
- Import: `import { ensureQuotes } from "@arkyn/shared/ensureQuotes";`
- Signature: `ensureQuotes(rawValue: string): string`
- Wraps in double quotes unless already single- or double-quoted.

#### isHtml
- Import: `import { isHtml } from "@arkyn/shared/isHtml";`
- Signature: `isHtml(rawString: string): boolean`
- Case-insensitive check for HTML opening/closing tags.

#### stripHtmlTags
- Import: `import { stripHtmlTags } from "@arkyn/shared/stripHtmlTags";`
- Signature: `stripHtmlTags(rawHtml: string): string`
- Removes HTML tags, including `<script>`/`<style>` blocks and comments.

#### removeCurrencySymbols
- Import: `import { removeCurrencySymbols } from "@arkyn/shared/removeCurrencySymbols";`
- Signature: `removeCurrencySymbols(rawString: string): string`
- Strips `R$`, `$`, `€`, `¥`, `£`, and other Unicode currency symbols, trims whitespace.

#### removeNonNumeric
- Import: `import { removeNonNumeric } from "@arkyn/shared/removeNonNumeric";`
- Signature: `removeNonNumeric(rawString: string): string`
- Strips every non-digit character.

## Services

#### ValidateDateService
- Import: `import { ValidateDateService } from "@arkyn/shared/validateDateService";`
- Used internally by `formatDate`/`parseToDate`. Use directly only for standalone date-part validation:
  - `validateDateParts(year: number, month: number, day: number): void` — throws on invalid month/day ranges, month-specific day counts, or non-leap-year Feb 29.
  - `validateInputFormat(format: string): void` — throws unless `format` is `"brazilianDate"`, `"isoDate"`, or `"timestamp"`.

## Quick example

```typescript
import { formatToCpf } from "@arkyn/shared/formatToCpf";
import { formatToCurrency } from "@arkyn/shared/formatToCurrency";
import { generateSlug } from "@arkyn/shared/generateSlug";

formatToCpf("12345678909"); // "123.456.789-09"
formatToCurrency(1234.56, "BRL"); // "R$ 1.234,56"
generateSlug("Hello, World!"); // "hello-world"
```

## Related packages

- `@arkyn/templates` — supplies the currency/locale and country-mask data `formatToCurrency`/`formatToPhone`/`findCountryMask` depend on.
- `@arkyn/components` and `@arkyn/server` — both use this package internally; prefer importing these utilities directly rather than duplicating formatting/validation logic in app code.
