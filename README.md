# Arkyn

A comprehensive TypeScript ecosystem for building modern web applications with React and Remix. Arkyn provides a complete set of tools, components, and utilities to accelerate your development workflow.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1+-blue.svg)](https://reactjs.org/)

## 📦 Packages

Arkyn is organized as a monorepo containing four main packages:

### [@arkyn/components](./packages/components)

A modern React component library designed specifically for Remix applications, featuring:

- 🎨 **40+ UI Components** - Buttons, inputs, modals, tables, and more
- 🎭 **Smooth Animations** - Powered by Framer Motion
- 🪝 **Custom Hooks** - Form handling, modals, drawers, and utilities
- 🎯 **TypeScript First** - Full type safety and IntelliSense support
- 📱 **Responsive Design** - Mobile-first approach with modern CSS

### [@arkyn/server](./packages/server)

Server-side utilities and configurations for backend development:

- 🌐 **HTTP Utilities** - Pre-configured responses and error handlers
- ⚙️ **API Instances** - Ready-to-use configurations for external services
- 🔍 **Request Helpers** - Body parsing, parameter extraction, and debugging
- ☁️ **AWS Integration** - S3 file upload utilities
- 🛡️ **Schema Validation** - Data validation with Zod integration

### [@arkyn/shared](./packages/shared)

Reusable utilities for consistent data handling across your application:

- 📅 **Date Formatting** - Flexible date manipulation and timezone support
- 🏦 **Financial Utilities** - Currency formatting and installment calculations
- 🔒 **Data Validation** - CPF, CNPJ, CEP, phone number validators
- 🎨 **String Utilities** - Slug generation, masking, and formatting
- 🔧 **General Helpers** - ID generation, color utilities, and more

### [@arkyn/templates](./packages/templates)

Ready-to-use data templates and constants:

- 🌍 **Countries Data** - Complete list with flags, codes, and phone masks
- 🇧🇷 **Brazilian States** - State codes and names
- 💱 **Currency Information** - Country currencies and formatting rules
- 📊 **Locale Data** - Maximum fraction digits for different currencies

## 🚀 Quick Start

### Installation

Install the packages you need for your project:

```bash
# For React applications
npm install @arkyn/components

# For server-side development
npm install @arkyn/server

# For shared utilities
npm install @arkyn/shared

# For data templates
npm install @arkyn/templates
```

### Basic Usage

```tsx
// Using components
import { Button, Input, Modal } from "@arkyn/components";

function App() {
  return (
    <div>
      <Input placeholder="Enter your name" />
      <Button variant="primary">Submit</Button>
    </div>
  );
}
```

```ts
// Using server utilities
import { Success, errorHandler } from "@arkyn/server";

export async function loader() {
  try {
    const data = await fetchData();
    return Success(data);
  } catch (error) {
    return errorHandler(error);
  }
}
```

```ts
// Using shared utilities
import { formatToCpf, validateCpf } from "@arkyn/shared";

const cpf = formatToCpf("12345678901"); // 123.456.789-01
const isValid = validateCpf(cpf); // true
```

```ts
// Using templates
import { countries, brazilianStates } from "@arkyn/templates";

const brazil = countries.find((country) => country.iso === "BR");
const saoPaulo = brazilianStates.find((state) => state.code === "SP");
```

## 🛠️ Development

This project uses Bun as the package manager and build tool.

### Prerequisites

- [Bun](https://bun.sh/) (latest version)
- Node.js 18.3.1 or higher

### Setup

```bash
# Clone the repository
git clone https://github.com/Lucas-Eduardo-Goncalves/arkyn.git
cd arkyn

# Install dependencies
bun install

# Build all packages
bun run all:build

# Run tests
bun run all:test

# Type check all packages
bun run all:typecheck
```

### Available Scripts

- `bun run all:build` - Build all packages
- `bun run all:test` - Run tests for all packages
- `bun run all:typecheck` - Type check all packages
- `bun run dev:components` - Start components development server
- `bun run all:beta` - Publish beta versions
- `bun run all:prod` - Publish production versions

## 📖 Documentation

Each package has its own documentation:

- [Components Documentation](./packages/components/README.md)
- [Server Documentation](./packages/server/README.md)
- [Shared Documentation](./packages/shared/README.md)
- [Templates Documentation](./packages/templates/README.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for more details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](./LICENSE) file for details.

## 👨‍💻 Author

**Arkyn | Lucas Gonçalves**

- GitHub: [@Lucas-Eduardo-Goncalves](https://github.com/Lucas-Eduardo-Goncalves)

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Remix](https://remix.run/)
- Styled with modern CSS and [Framer Motion](https://www.framer.com/motion/)
- Powered by [TypeScript](https://www.typescriptlang.org/) and [Bun](https://bun.sh/)

---

Made with ❤️ by the Arkyn team
