# @arkyn/templates

Ready-to-use static data for international and Brazilian applications — country lists, phone masks, Brazilian states, and currency/locale metadata — so you don't have to source and maintain this data yourself.

[![npm version](https://img.shields.io/npm/v/@arkyn/templates.svg)](https://www.npmjs.com/package/@arkyn/templates)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 🎯 What it solves

Building phone inputs, address forms, or currency formatters usually means sourcing and hand-maintaining reference data: every country's dialing code and phone mask, all Brazilian states, and locale/currency pairs for `Intl.NumberFormat`. `@arkyn/templates` ships that data as typed, ready-to-import constants, so `@arkyn/components` (phone/currency inputs, address selects) and `@arkyn/shared` (currency formatting) — or your own app — can consume it directly without any setup, network calls, or extra dependencies.

## ✨ Features

- 🌍 **Countries Data** - 245 countries with name, ISO code, dialing code, flag URL, and phone input mask
- 🇧🇷 **Brazilian States** - All 26 states plus the Federal District, as `{ label, value }` pairs
- 💱 **Country Currencies** - Currency code → locale/currency pairs ready for `Intl.NumberFormat`
- 📊 **Fraction Digits Constant** - The default number of decimal places used across the Arkyn ecosystem
- 🎯 **Fully Typed** - Every export ships its own TypeScript type
- 📦 **Zero Runtime Dependencies** - Pure static data, no peer dependencies required

## 📋 Prerequisites

- Node.js `>=24.16.0`
- Bun `>=1.3.14` (only if building/developing the monorepo itself)

This package has no runtime dependencies and no peer dependencies — it can be installed standalone.

## 📦 Installation

> **ESM only.** This package ships as native ES modules with no CommonJS build — use `import`, not `require()`.

```bash
npm install @arkyn/templates
```

## 🚀 Quick Start

```typescript
import {
  countries,
  brazilianStates,
  countryCurrencies,
  maximumFractionDigits,
} from "@arkyn/templates";

// Find a specific country
const brazil = countries.find((country) => country.iso === "BR");
console.log(brazil);
// {
//   name: "Brasil",
//   code: "+55",
//   iso: "BR",
//   flag: "https://cdn.kcak11.com/CountryFlags/countries/br.svg",
//   mask: ["(__) _____-____", "(__) ____-____"]
// }

// Get a Brazilian state
const saoPaulo = brazilianStates.find((state) => state.value === "SP");
console.log(saoPaulo); // { label: "São Paulo", value: "SP" }

// Get locale/currency info for Intl.NumberFormat
console.log(countryCurrencies.BRL); // { countryLanguage: "pt-BR", countryCurrency: "BRL" }

// Default decimal places used across Arkyn's currency formatting
console.log(maximumFractionDigits); // 2
```

## 📖 API Reference

### 🌍 `countries`

An array of 245 countries, typed as `CountryType[]`:

```typescript
type CountryType = {
  name: string; // Country name
  code: string; // International dialing code (e.g. "+55")
  iso: string; // ISO 3166-1 alpha-2 code (e.g. "BR")
  flag: string; // URL to an SVG flag icon
  mask: string | string[]; // Phone input mask(s); some countries have more than one valid mask
};
```

```typescript
import { countries, type CountryType } from "@arkyn/templates";

const usa = countries.find((country) => country.iso === "US");
const brazilianOptions = countries.filter((country) => country.code === "+55");
```

Used internally by `@arkyn/components`' `PhoneInput` to render the country selector and apply the correct input mask.

### 🇧🇷 `brazilianStates`

An array of the 26 Brazilian states plus the Federal District:

```typescript
type BrazilianState = { label: string; value: string };
```

```typescript
import { brazilianStates } from "@arkyn/templates";

console.log(brazilianStates.length); // 27
const rio = brazilianStates.find((state) => state.value === "RJ");
// { label: "Rio de Janeiro", value: "RJ" }
```

The `{ label, value }` shape maps directly onto `@arkyn/components`' `Select` / `MultiSelect` `options` prop.

### 💱 `countryCurrencies`

A record keyed by ISO 4217 currency code, mapping each currency to the locale/currency pair `Intl.NumberFormat` expects:

```typescript
type CountryCurrencies = Record<
  string,
  { countryLanguage: string; countryCurrency: string }
>;
```

```typescript
import { countryCurrencies } from "@arkyn/templates";

const { countryLanguage, countryCurrency } = countryCurrencies.BRL;
// { countryLanguage: "pt-BR", countryCurrency: "BRL" }

new Intl.NumberFormat(countryLanguage, {
  style: "currency",
  currency: countryCurrency,
}).format(1234.56); // "R$ 1.234,56"
```

This is exactly what `@arkyn/shared`'s `formatToCurrency` uses under the hood to resolve a currency code into a locale-aware formatter.

### 📊 `maximumFractionDigits`

A single constant (`2`) representing the default number of decimal places used for currency values across the Arkyn ecosystem.

```typescript
import { maximumFractionDigits } from "@arkyn/templates";

console.log(maximumFractionDigits); // 2
```

## 📚 Documentation

For more context on how this data is consumed across the ecosystem, see the [full documentation](https://docs.arkyn.dev/docs/templates/introduction).

## 📄 License

This project is licensed under the Apache 2.0 License — see the [LICENSE](./LICENSE.txt) file for details.
