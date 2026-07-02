# @arkyn/shared

Comprehensive collection of reusable utilities for data formatting, validation, generation, and manipulation, featuring Brazilian document validators and financial tools.

[![npm version](https://img.shields.io/npm/v/@arkyn/shared.svg)](https://www.npmjs.com/package/@arkyn/shared)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 🎯 What it solves

`@arkyn/shared` is a dependency-light, framework-agnostic toolkit for formatting, validating, generating, and parsing common data types in JavaScript/TypeScript applications. It has strong support for Brazilian documents (CPF, CNPJ, CEP) and locale-aware financial formatting, alongside general-purpose helpers for dates, JSON, strings, IDs, and sensitive-data masking. Because it has no framework assumptions, the same functions run identically on the client and the server — it's the shared foundation used by both `@arkyn/components` and `@arkyn/server`.

## ✨ Features

- 📅 **Date formatting & parsing** — configurable input/output formats with timezone shifting
- 💰 **Currency & financial formatting** — locale-aware currency strings and card installment math
- 📝 **Text formatting** — capitalization, ellipsis truncation, digit masking
- 🇧🇷 **Brazilian document formatting** — CPF, CNPJ, CEP
- 📞 **Phone formatting** — country-mask-aware phone number formatting via `libphonenumber-js`
- 🔧 **Generators** — UUID (v4/v7) IDs, URL-friendly slugs, deterministic colors from strings
- 🧩 **JSON parsers** — pretty-printing, large-field truncation, sensitive-key masking
- 🛡️ **Sensitive-data masking** — hide digits/fields in strings and JSON payloads
- 🌐 **HTML utilities** — detect and strip HTML markup
- 🧹 **String/number utilities** — strip non-numeric characters, strip currency symbols, ensure quoting

## 📋 Prerequisites

- **Node.js** `>=24.16.0`
- **Bun** `>=1.3.14`
- **`libphonenumber-js`** `>=1.13.7` — optional peer dependency, required only if you use `formatToPhone` or `findCountryMask`

## 📦 Installation

> **ESM only.** This package ships as native ES modules with no CommonJS build — use `import`, not `require()`.

```bash
npm install @arkyn/shared
```

If you plan to use `formatToPhone` or `findCountryMask`, also install the peer dependency:

```bash
npm install libphonenumber-js
```

## 🚀 Quick Start

```typescript
import {
  formatToCpf,
  formatToCurrency,
  generateId,
  generateSlug,
} from "@arkyn/shared";

// Format a raw CPF string (throws if it doesn't have 11 digits)
const cpf = formatToCpf("12345678909");
// "123.456.789-09"

// Format currency using a currency code from @arkyn/templates
const price = formatToCurrency(1234.56, "BRL");
// "R$ 1.234,56"

// Generate a UUID v4
const id = generateId("text", "v4");
// "550e8400-e29b-41d4-a716-446655440000"

// Generate a URL-friendly slug
const slug = generateSlug("Hello, World! This is a Test.");
// "hello-world-this-is-a-test"
```

## 📖 API Reference

### Formats

#### formatDate

Formats a date (and optional time) string into a custom output format. Calculations are done in UTC+0; use the `timezone` parameter to shift the result. Throws `Error` if the resulting date is invalid or `inputFormat` is not recognized.

```typescript
import { formatDate } from "@arkyn/shared";

formatDate(["25/12/2023", "15:30:00"], "brazilianDate", "YYYY-MM-DD hh:mm");
// "2023-12-25 15:30"

formatDate(["2023-12-25", "15:30:00"], "timestamp", "DD/MM/YYYY hh:mm", -3);
// "2023-12-25 12:30"
```

#### formatJsonObject

Formats a JSON-compatible value (object, array, string, or primitive) into a human-readable, indented string. Strings that parse as JSON are recursively formatted.

```typescript
import { formatJsonObject } from "@arkyn/shared";

const obj = { name: "John", age: 30, hobbies: ["reading", "gaming"] };
formatJsonObject(obj, 0);
// {
//   "name": "John",
//   "age": 30,
//   "hobbies": [
//     "reading",
//     "gaming"
//   ]
// }
```

#### formatJsonString

Parses a JSON string and returns a pretty-printed representation. Throws `Error` if the input is not valid JSON.

```typescript
import { formatJsonString } from "@arkyn/shared";

formatJsonString('{"name":"John","hobbies":["reading","gaming"]}');
// {
//   "name": "John",
//   "hobbies": [
//     "reading",
//     "gaming"
//   ]
// }
```

#### formatToCapitalizeFirstWordLetter

Capitalizes the first letter of each space-separated word and lowercases the rest.

```typescript
import { formatToCapitalizeFirstWordLetter } from "@arkyn/shared";

formatToCapitalizeFirstWordLetter("HELLO WORLD"); // "Hello World"
```

#### formatToCep

Formats a string into the Brazilian postal code (CEP) pattern `XXXXX-XXX`. Throws `Error` if the cleaned input doesn't contain exactly 8 numeric digits.

```typescript
import { formatToCep } from "@arkyn/shared";

formatToCep("12345678"); // "12345-678"
```

#### formatToCnpj

Formats a string into the CNPJ pattern `XX.XXX.XXX/XXXX-XX`. Throws `Error` if the cleaned input doesn't contain exactly 14 numeric digits.

```typescript
import { formatToCnpj } from "@arkyn/shared";

formatToCnpj("12345678000195"); // "12.345.678/0001-95"
```

#### formatToCpf

Formats a string into the CPF pattern `XXX.XXX.XXX-XX`. Throws `Error` if the cleaned input doesn't contain exactly 11 numeric digits.

```typescript
import { formatToCpf } from "@arkyn/shared";

formatToCpf("12345678909"); // "123.456.789-09"
```

#### formatToCurrency

Formats a number into a locale-aware currency string using `Intl.NumberFormat`, based on a currency code from `@arkyn/templates`. Set `config.showPrefix` to `false` to omit the currency symbol. Throws `Error` for unsupported currency codes.

```typescript
import { formatToCurrency } from "@arkyn/shared";

formatToCurrency(1234.56, "BRL"); // "R$ 1.234,56"
formatToCurrency(1234.56, "USD", { showPrefix: false }); // "1,234.56"
```

#### formatToEllipsis

Truncates a string to `maxLength`, avoiding breaking mid-word, and appends `"..."` if truncation occurred.

```typescript
import { formatToEllipsis } from "@arkyn/shared";

formatToEllipsis("Hello, world!", 5); // "Hello..."
```

#### formatToHiddenDigits

Replaces specific digit positions in a string with a masking character, leaving non-digit characters unchanged. `options.range` can be a positive number (first N digits), a negative number (last N digits), or a `[start, end]` tuple (1-indexed, inclusive). Defaults to hiding the first 3 digits with `"*"`.

```typescript
import { formatToHiddenDigits } from "@arkyn/shared";

formatToHiddenDigits("123-456-7890", { range: 3 }); // "***-456-7890"
formatToHiddenDigits("123-456-7890", { range: [4, 6], hider: "#" });
// "123-###-7890"
```

#### formatToPhone

Formats a phone number according to the country mask defined in `@arkyn/templates`, parsing it with `libphonenumber-js`. Throws `Error` if the number is invalid or no country mask is found. Requires the `libphonenumber-js` peer dependency.

```typescript
import { formatToPhone } from "@arkyn/shared";

formatToPhone("+5534920524282"); // "(34) 92052-4282"
formatToPhone("+12125550199"); // "(212) 555-0199"
```

### Generators

#### generateColorByString

Generates a deterministic hexadecimal color code from a hash of the input string — the same input always produces the same color.

```typescript
import { generateColorByString } from "@arkyn/shared";

generateColorByString("example"); // "#5e8f9a" (consistent for the same input)
```

#### generateId

Generates a UUID in the requested version (`"v4"` random or `"v7"` time-ordered) and representation (`"text"` string or `"binary"` `Uint8Array`). Throws `Error` for an invalid type/format combination.

```typescript
import { generateId } from "@arkyn/shared";

generateId("text", "v4"); // "550e8400-e29b-41d4-a716-446655440000"
generateId("binary", "v7"); // Uint8Array([...])
```

#### generateSlug

Converts a string into a URL-friendly slug: strips accents, removes non-alphanumeric characters (except spaces/hyphens), lowercases, replaces spaces with hyphens, and trims/collapses hyphens.

```typescript
import { generateSlug } from "@arkyn/shared";

generateSlug("Hello, World! This is a Test.");
// "hello-world-this-is-a-test"
```

### Parsers

#### parseLargeFields

Parses a JSON string and truncates string fields exceeding `maxLength` (default `1000`), replacing them with a message indicating the original length. Traverses nested objects/arrays. Throws `Error` if the input is not valid JSON.

```typescript
import { parseLargeFields } from "@arkyn/shared";

const json = JSON.stringify({
  name: "John",
  description: "A very long description that exceeds the maximum length...",
});

parseLargeFields(json, 50);
// '{"name":"John","description":"To large information: field as 57 characters"}'
```

#### parseSensitiveData

Parses a JSON string and replaces the values of the given keys with `"****"`, recursively, including JSON-encoded string values. Defaults to masking `password`, `confirmPassword`, and `creditCard`. Returns the original string unchanged if it is not valid JSON (does not throw).

```typescript
import { parseSensitiveData } from "@arkyn/shared";

const jsonString = JSON.stringify({
  username: "user123",
  password: "secret",
  profile: { creditCard: "1234-5678-9012-3456" },
});

parseSensitiveData(jsonString, ["password", "creditCard"]);
// '{"username":"user123","password":"****","profile":{"creditCard":"****"}}'
```

#### parseToDate

Parses a date (and optional time) string into a `Date` object. Calculations are done in UTC+0; use `timezone` to shift the result. Throws `Error` if the resulting date is invalid or `inputFormat` is not recognized.

```typescript
import { parseToDate } from "@arkyn/shared";

parseToDate(["25/12/2023", "15:30:00"], "brazilianDate", -3);
// Date: 2023-12-25T12:30:00.000Z

parseToDate(["2023-12-25"], "timestamp");
// Date: 2023-12-25T00:00:00.000Z
```

### Services

#### ValidateDateService

Class used internally by `formatDate` and `parseToDate` to validate date components and input-format strings — enforces 4-digit years, month/day ranges, month-specific day counts, and leap-year rules. `validateDateParts` and `validateInputFormat` both throw `Error` on invalid input.

```typescript
import { ValidateDateService } from "@arkyn/shared";

const service = new ValidateDateService();
service.validateDateParts(2024, 2, 29); // OK — leap year
service.validateDateParts(2023, 2, 29); // throws — not a leap year
service.validateInputFormat("brazilianDate"); // OK
service.validateInputFormat("custom"); // throws
```

### Utilities

#### calculateCardInstallment

Calculates the total price and per-installment price for a card payment plan with compound interest. No interest is applied when `fees` is `0` or `numberInstallments` is `1`. Throws `Error` if `numberInstallments <= 0` or `fees < 0`.

```typescript
import { calculateCardInstallment } from "@arkyn/shared";

calculateCardInstallment({ cashPrice: 1000, numberInstallments: 12, fees: 0.02 });
// { totalPrice: 1124.62, installmentPrice: 93.72 }
```

#### ensureQuotes

Wraps a string in double quotes unless it is already enclosed in single or double quotes.

```typescript
import { ensureQuotes } from "@arkyn/shared";

ensureQuotes("example"); // '"example"'
ensureQuotes('"already quoted"'); // '"already quoted"'
```

#### findCountryMask

Resolves the matching phone mask (using `"_"` as digit placeholders) and country metadata for an E.164 phone number, using `libphonenumber-js` and `@arkyn/templates`. For countries with multiple mask lengths (e.g. Brazil with/without the ninth digit), the mask matching the number's digit count is returned. Throws `Error` if the number is invalid or no mask is found. Requires the `libphonenumber-js` peer dependency.

```typescript
import { findCountryMask } from "@arkyn/shared";

const [mask, country] = findCountryMask("+5511999999999");
// mask: "(__) _____-____"
// country.name: "Brazil"
```

#### isHtml

Checks whether a string contains HTML markup (opening or closing tags), case-insensitively.

```typescript
import { isHtml } from "@arkyn/shared";

isHtml("<p>Hello world</p>"); // true
isHtml("Plain text"); // false
```

#### removeCurrencySymbols

Removes currency symbols (`R$`, `$`, `€`, `¥`, `£`, and other Unicode currency symbols) from a string and trims whitespace.

```typescript
import { removeCurrencySymbols } from "@arkyn/shared";

removeCurrencySymbols("R$13,45"); // "13,45"
removeCurrencySymbols("€99.99"); // "99.99"
```

#### removeNonNumeric

Strips all non-numeric characters from a string.

```typescript
import { removeNonNumeric } from "@arkyn/shared";

removeNonNumeric("abc123def456"); // "123456"
```

#### stripHtmlTags

Removes HTML tags from a string, including `<script>` and `<style>` blocks and HTML comments.

```typescript
import { stripHtmlTags } from "@arkyn/shared";

stripHtmlTags("<p>Hello <strong>World</strong></p>"); // "Hello World"
```

## 📚 Documentation

Full documentation: [https://docs.arkyn.dev/docs/shared/introduction](https://docs.arkyn.dev/docs/shared/introduction)

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](./LICENSE.txt) file for details.
