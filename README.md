# Arkyn

A TypeScript ecosystem of independent, framework-friendly packages for building React/Remix/React Router applications — UI components, server-side utilities, framework-agnostic helpers, and reference data — designed so each package can be adopted on its own or combined across the stack.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 📦 Packages

Arkyn is a monorepo of four published packages, plus an internal development app used to preview and test them.

### [@arkyn/components](./packages/components)

A complete, accessible, TypeScript-first React UI kit — 51 components, 10 hooks, 5 context providers, and 2 services — so teams stop rebuilding the same buttons, inputs, modals, drawers, and tables on every project.

- 🧱 **Forms & inputs** - `Input`, `Select`, `MultiSelect`, `Checkbox`, `Switch`, `RadioGroup`, `CurrencyInput`, `MaskedInput`, `PhoneInput`, `Slider`, and more, all wired into a shared form-validation context
- 🪟 **Overlays** - Modals, drawers, popovers, and tooltips with their own providers/hooks
- 📁 **Uploads, tables, calendars, rich text** - `FileUpload`/`ImageUpload`/`AudioUpload`, a full table set, `Calendar`/`FullCalendar`, and a Slate.js-based `RichText` editor
- 🗺️ **Integrations** - Google Places/Maps, Mapbox, Google Analytics, Google Tag Manager, Facebook Pixel

### [@arkyn/server](./packages/server)

Server-side building blocks for Remix/React Router loaders and actions (or any fetch-based backend): typed HTTP responses, request parsing, Zod-based schema validation, and validators for Brazilian documents and common fields.

- 🌐 **HTTP responses** - 5 success classes (`Success`, `Created`, `Updated`, `Found`, `NoContent`) and 9 error classes (`BadRequest`, `Unauthorized`, `Forbidden`, `NotFound`, `Conflict`, `UnprocessableEntity`, `ServerError`, `BadGateway`, `NotImplemented`)
- 🧵 **Request utilities** - `decodeRequestBody`, `formParse`/`formAsyncParse`, `getScopedParams`, `errorHandler`
- 🇧🇷 **Validators** - `validateCpf`, `validateCnpj`, `validateCep`, `validateRg`, plus `validateEmail`, `validatePassword`, `validatePhone`, `validateDate`
- 🛠️ **Services** - `ApiService` (typed fetch client), `SchemaValidator` (Zod wrapper), `DebugService`/`LogService`

### [@arkyn/shared](./packages/shared)

A dependency-light, framework-agnostic toolkit for formatting, validating, generating, and parsing data — the shared foundation consumed by both `@arkyn/components` and `@arkyn/server`, and safe to use directly in your own client or server code.

- 📅 **Formatting** - dates, currency, CPF/CNPJ/CEP, phone numbers, text capitalization/ellipsis/digit-hiding
- 🔧 **Generators** - UUID (v4/v7) ids, URL slugs, deterministic colors from strings
- 🧩 **Parsers & utilities** - JSON pretty-printing, large-field truncation, sensitive-data masking, HTML stripping

### [@arkyn/templates](./packages/templates)

Ready-to-use static reference data — country lists with phone masks, Brazilian states, and currency/locale metadata — so you don't have to source and maintain it yourself. Zero dependencies.

- 🌍 **`countries`** - 245 countries with ISO code, dialing code, flag, and phone mask(s)
- 🇧🇷 **`brazilianStates`** - all 26 states plus the Federal District
- 💱 **`countryCurrencies`** / **`maximumFractionDigits`** - locale/currency pairs for `Intl.NumberFormat`, used internally by `@arkyn/shared`'s `formatToCurrency`

## 🚀 Quick Start

### Installation

Install only the packages you need — each one works standalone:

```bash
# UI components (also needs its peer deps — see the package README)
npm install @arkyn/components

# Server-side utilities (needs zod + libphonenumber-js)
npm install @arkyn/server zod libphonenumber-js

# Framework-agnostic utilities
npm install @arkyn/shared

# Static reference data
npm install @arkyn/templates
```

### Basic Usage

```tsx
// Using components
import { Button, FieldWrapper, FieldLabel, Input } from "@arkyn/components";
import "@arkyn/components/styles";

function LoginForm() {
  return (
    <FieldWrapper>
      <FieldLabel>Email</FieldLabel>
      <Input name="email" type="email" placeholder="you@example.com" />
      <Button type="submit">Sign in</Button>
    </FieldWrapper>
  );
}
```

```ts
// Using server utilities
import { Success, errorHandler } from "@arkyn/server";

export async function loader() {
  try {
    const data = await fetchData();
    return new Success("Data fetched", data).toJson();
  } catch (error) {
    return errorHandler(error);
  }
}
```

```ts
// Using shared utilities
import { formatToCpf } from "@arkyn/shared";

const cpf = formatToCpf("12345678909"); // "123.456.789-09"
```

```ts
// Using templates
import { countries, brazilianStates } from "@arkyn/templates";

const brazil = countries.find((country) => country.iso === "BR");
const saoPaulo = brazilianStates.find((state) => state.value === "SP");
```

## 🛠️ Development

This monorepo uses [Bun](https://bun.sh/) as the package manager, workspace runner, and build tool.

### Prerequisites

- [Bun](https://bun.sh/) `>=1.0.0`
- Node.js `>=18.0.0`

### Setup

```bash
# Clone the repository
git clone https://github.com/Lucas-Eduardo-Goncalves/arkyn-library.git
cd arkyn-library

# Install dependencies
bun install

# Build all publishable packages (templates → shared → components → server)
bun run all:build

# Run tests across all packages
bun run all:test

# Type check all packages
bun run all:typecheck
```

### Available Scripts

- `bun run all:build` - Build `templates`, `shared`, `components`, and `server` in dependency order
- `bun run all:test` - Run tests for `components`, `server`, and `shared`
- `bun run all:typecheck` - Type check every package
- `bun run all:audit` - Run `bun audit` across every package
- `bun run development:dev` - Start the internal preview app (`packages/development`) used to test components locally
- `bun run all:release:beta` / `all:release:patch` / `all:release:minor` / `all:release:major` - Bump versions across all packages
- `bun run all:publish:beta` - Publish beta versions of all packages to npm
- `bun run biome:check` / `bun run biome:format` - Lint/format the codebase with Biome

## 📖 Documentation

Full guides, live previews, and prop tables live at [docs.arkyn.dev](https://docs.arkyn.dev). Each package also has its own README with a complete API reference:

- [Components Documentation](./packages/components/README.md)
- [Server Documentation](./packages/server/README.md)
- [Shared Documentation](./packages/shared/README.md)
- [Templates Documentation](./packages/templates/README.md)

## 📄 License

This project is licensed under the Apache 2.0 License — see each package's `LICENSE.txt` (e.g. [packages/components/LICENSE.txt](./packages/components/LICENSE.txt)) for details.

## 👨‍💻 Author

**Arkyn | Lucas Gonçalves**

- GitHub: [@Lucas-Eduardo-Goncalves](https://github.com/Lucas-Eduardo-Goncalves)

---

Made with ❤️ by the Arkyn team
