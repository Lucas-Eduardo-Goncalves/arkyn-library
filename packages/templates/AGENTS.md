# @arkyn/templates — agent guide

Static reference data: countries, Brazilian states, currency/locale metadata. Zero runtime dependencies, safe to import anywhere (client, server, or edge). Use it instead of hardcoding country/state lists or currency locale pairs in app code. Everything below is exact — read directly from source, no need to open README.md or any other file for correct usage.

## Required setup

- ESM only: `import`, never `require()`.
- No peer dependencies.

## Import convention — always prefer subpath imports

Prefer importing each export from its own subpath instead of the root barrel (`@arkyn/templates`):

```typescript
import { countries } from "@arkyn/templates/countries";
import { brazilianStates } from "@arkyn/templates/brazilianStates";
```

**Naming rule**: the subpath is always the export name, unchanged (every export here already starts with a lowercase letter) — no casing transformation needed. This is exact for every export in this package. There are no per-export CSS files (no UI).

## Available exports

#### countries
- Import: `import { countries, type CountryType } from "@arkyn/templates/countries";`
- Type: `CountryType[]` — 245 entries, each `{ name: string; code: string; iso: string; flag: string; mask: string | string[] }`.
  - `code` — international dialing code, e.g. `"+55"`.
  - `iso` — ISO 3166-1 alpha-2 code, e.g. `"BR"`.
  - `flag` — URL to an SVG flag icon.
  - `mask` — phone input mask using `"_"` placeholders; an array when the country has more than one valid mask length (e.g. Brazil with/without the ninth digit: `["(__) _____-____", "(__) ____-____"]`).
- Feeds `@arkyn/components`'s `PhoneInput` internally and `@arkyn/shared`'s `findCountryMask`/`formatToPhone`.

#### brazilianStates
- Import: `import { brazilianStates } from "@arkyn/templates/brazilianStates";`
- Type: `{ label: string; value: string }[]` — 27 entries (all 26 states plus the Federal District, `value: "DF"`).
- Shape matches `@arkyn/components`'s `Select`/`MultiSelect` `options` prop directly — pass it straight through, no mapping needed.

#### countryCurrencies
- Import: `import { countryCurrencies } from "@arkyn/templates/countryCurrencies";`
- Type: `Record<string, { countryLanguage: string; countryCurrency: string }>` — 22 entries keyed by ISO 4217 currency code (`USD`, `EUR`, `JPY`, `GBP`, `AUD`, `CAD`, `CHF`, `CNY`, `SEK`, `NZD`, `BRL`, `INR`, `RUB`, `ZAR`, `MXN`, `SGD`, `HKD`, `NOK`, `KRW`, `TRY`, `IDR`, `THB`).
- Each value gives the `Intl.NumberFormat` locale/currency pair, e.g. `BRL` → `{ countryLanguage: "pt-BR", countryCurrency: "BRL" }`.
- Used internally by `@arkyn/shared`'s `formatToCurrency` to resolve a currency code — passing a code not in this map throws there.

#### maximumFractionDigits
- Import: `import { maximumFractionDigits } from "@arkyn/templates/maximumFractionDigits";`
- Type: `number` — constant value `2`. Default decimal places used for currency formatting across the ecosystem.

## Quick example

```typescript
import { countries } from "@arkyn/templates/countries";
import { brazilianStates } from "@arkyn/templates/brazilianStates";
import { countryCurrencies } from "@arkyn/templates/countryCurrencies";

const brazil = countries.find((c) => c.iso === "BR");
const saoPaulo = brazilianStates.find((s) => s.value === "SP");
const { countryLanguage, countryCurrency } = countryCurrencies.BRL;
```

## Related packages

- `@arkyn/shared` — `formatToCurrency`/`formatToPhone`/`findCountryMask` consume this data instead of you resolving it manually.
- `@arkyn/components` — `PhoneInput`, `Select`, and `MultiSelect` are natural homes for `countries`/`brazilianStates`.
