# @arkyn/shared

A comprehensive collection of reusable utilities for consistent data handling across your applications. Provides formatting functions, validation tools, generators, and services to streamline common development tasks.

[![npm version](https://img.shields.io/npm/v/@arkyn/shared.svg)](https://www.npmjs.com/package/@arkyn/shared)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## ✨ Features

- 📅 **Date Utilities** - Flexible date manipulation and timezone support
- 🏦 **Financial Tools** - Currency formatting and installment calculations
- 🔒 **Brazilian Validators** - CPF, CNPJ, CEP, RG, and phone number validation
- 🎨 **String Utilities** - Formatting, masking, and text manipulation
- 🔧 **Generators** - ID generation, slugs, colors, and more
- 🛡️ **Data Security** - Sensitive data masking and sanitization
- 🌐 **Internationalization** - Multi-locale support for formatting

## 📦 Installation

```bash
npm install @arkyn/shared
```

## 🚀 Quick Start

```typescript
import {
  formatToCpf,
  validateCpf,
  formatToCurrency,
  generateId,
} from "@arkyn/shared";

// Format and validate CPF
const cpf = formatToCpf("12345678901"); // "123.456.789-01"
const isValid = validateCpf(cpf); // true

// Format currency
const price = formatToCurrency(1299.99); // "R$ 1.299,99"

// Generate unique ID
const id = generateId(); // "uuid-v4-string"
```

## 📋 API Reference

### 📅 Date Formatting

#### formatDate(date, inputFormat, outputFormat, timezone?)

Formats dates with timezone support.

```typescript
import { formatDate } from "@arkyn/shared";

// Format ISO date to Brazilian format
const formatted = formatDate("2023-12-25", "isoDate", "DD/MM/YYYY");
// Result: "25/12/2023"

// With timezone
const withTz = formatDate(
  "2023-12-25T10:00:00Z",
  "isoDate",
  "DD/MM/YYYY HH:mm",
  -3
);
// Result: "25/12/2023 07:00"
```

#### formatToDate(date, inputFormat, timezone?)

Converts strings to Date objects.

```typescript
import { formatToDate } from "@arkyn/shared";

const date = formatToDate("25/12/2023", "brazilianDate");
// Result: Date object
```

### 🏦 Financial Formatting

#### formatToCurrency(value: number): string

Formats numbers to Brazilian currency format.

```typescript
import { formatToCurrency } from "@arkyn/shared";

formatToCurrency(1299.99); // "R$ 1.299,99"
formatToCurrency(0.5); // "R$ 0,50"
```

#### calculateCardInstallment(total: number, installments: number): number[]

Calculates installment values for credit card payments.

```typescript
import { calculateCardInstallment } from "@arkyn/shared";

const installments = calculateCardInstallment(1000, 10);
// Result: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
```

### 🇧🇷 Brazilian Document Formatting

#### formatToCpf(value: string): string

Formats strings to CPF format.

```typescript
import { formatToCpf } from "@arkyn/shared";

formatToCpf("12345678901"); // "123.456.789-01"
```

#### formatToCnpj(value: string): string

Formats strings to CNPJ format.

```typescript
import { formatToCnpj } from "@arkyn/shared";

formatToCnpj("12345678000195"); // "12.345.678/0001-95"
```

#### formatToCpfCnpj(value: string): string

Auto-detects and formats CPF or CNPJ.

```typescript
import { formatToCpfCnpj } from "@arkyn/shared";

formatToCpfCnpj("12345678901"); // "123.456.789-01" (CPF)
formatToCpfCnpj("12345678000195"); // "12.345.678/0001-95" (CNPJ)
```

#### formatToCep(value: string): string

Formats strings to CEP format.

```typescript
import { formatToCep } from "@arkyn/shared";

formatToCep("01234567"); // "01234-567"
```

#### formatToPhone(value: string): string

Formats phone numbers.

```typescript
import { formatToPhone } from "@arkyn/shared";

formatToPhone("11987654321"); // "(11) 98765-4321"
```

---

### 🎨 String Utilities

#### formatToEllipsis(value: string, maxLength: number): string

Truncates strings with ellipsis.

```typescript
import { formatToEllipsis } from "@arkyn/shared";

formatToEllipsis("This is a very long text", 10); // "This is a..."
```

#### formatToHiddenDigits(value: string): string

Masks sensitive information.

```typescript
import { formatToHiddenDigits } from "@arkyn/shared";

formatToHiddenDigits("123456789"); // "12***6789"
```

#### formatToCapitalizeFirstWordLetter(value: string): string

Capitalizes the first letter of each word.

```typescript
import { formatToCapitalizeFirstWordLetter } from "@arkyn/shared";

formatToCapitalizeFirstWordLetter("hello world"); // "Hello World"
```

#### stripHtmlTags(value: string): string

Removes HTML tags from strings.

```typescript
import { stripHtmlTags } from "@arkyn/shared";

stripHtmlTags("<p>Hello <strong>World</strong></p>"); // "Hello World"
```

### 📄 JSON Utilities

#### formatJsonObject(obj: object): string

Converts objects to formatted JSON strings.

```typescript
import { formatJsonObject } from "@arkyn/shared";

const obj = { name: "John", age: 30 };
formatJsonObject(obj); // Pretty-printed JSON string
```

#### formatJsonString(json: string): object

Parses JSON strings safely.

```typescript
import { formatJsonString } from "@arkyn/shared";

const parsed = formatJsonString('{"name":"John"}');
// Result: { name: "John" }
```

---

### 🔧 Generators

#### generateId(): string

Generates unique identifiers using UUID v4.

```typescript
import { generateId } from "@arkyn/shared";

const id = generateId(); // "f47ac10b-58cc-4372-a567-0e02b2c3d479"
```

#### generateSlug(value: string): string

Creates URL-friendly slugs.

```typescript
import { generateSlug } from "@arkyn/shared";

generateSlug("Hello World! How are you?"); // "hello-world-how-are-you"
```

#### generateColorByString(value: string): string

Generates consistent colors from strings.

```typescript
import { generateColorByString } from "@arkyn/shared";

generateColorByString("John Doe"); // "#3498db" (always same color for same input)
```

### 🛡️ Data Security & Sanitization

#### maskSensitiveData(data: string): string

Masks sensitive information in logs and outputs.

```typescript
import { maskSensitiveData } from "@arkyn/shared";

maskSensitiveData("user@email.com"); // "us***@email.com"
```

#### removeNonNumeric(value: string): string

Removes all non-numeric characters.

```typescript
import { removeNonNumeric } from "@arkyn/shared";

removeNonNumeric("(11) 98765-4321"); // "11987654321"
```

#### removeCurrencySymbols(value: string): string

Removes currency symbols and formatting.

```typescript
import { removeCurrencySymbols } from "@arkyn/shared";

removeCurrencySymbols("R$ 1.299,99"); // "1299.99"
```

#### ensureQuotes(rawValue: string): string

Ensures strings are properly quoted.

```typescript
import { ensureQuotes } from "@arkyn/shared";

ensureQuotes("hello"); // '"hello"'
ensureQuotes('"hello"'); // '"hello"' (no double quotes)
```

#### truncateLargeFields(obj: object, maxLength: number): object

Truncates large text fields in objects.

```typescript
import { truncateLargeFields } from "@arkyn/shared";

const data = { description: "Very long text..." };
truncateLargeFields(data, 10); // { description: 'Very long...' }
```

---

### ✅ Validation Functions

#### validateCpf(value: string): boolean

Validates Brazilian CPF numbers.

```typescript
import { validateCpf } from "@arkyn/shared";

validateCpf("123.456.789-01"); // true/false
validateCpf("12345678901"); // true/false (accepts without formatting)
```

#### validateCnpj(value: string): boolean

Validates Brazilian CNPJ numbers.

```typescript
import { validateCnpj } from "@arkyn/shared";

validateCnpj("12.345.678/0001-95"); // true/false
```

#### validateCep(value: string): boolean

Validates Brazilian postal codes.

```typescript
import { validateCep } from "@arkyn/shared";

validateCep("01234-567"); // true/false
validateCep("01234567"); // true/false (accepts without formatting)
```

#### validatePhone(value: string): boolean

Validates Brazilian phone numbers.

```typescript
import { validatePhone } from "@arkyn/shared";

validatePhone("(11) 98765-4321"); // true/false
validatePhone("11987654321"); // true/false
```

#### validateRg(value: string): boolean

Validates Brazilian RG (ID) numbers.

```typescript
import { validateRg } from "@arkyn/shared";

validateRg("12.345.678-9"); // true/false
```

#### validateDate(value: string): boolean

Validates date strings.

```typescript
import { validateDate } from "@arkyn/shared";

validateDate("25/12/2023"); // true/false
validateDate("2023-12-25"); // true/false
```

#### validatePassword(value: string): boolean

Validates password strength.

```typescript
import { validatePassword } from "@arkyn/shared";

validatePassword("MyPassword123!"); // true/false
```

## 🔧 Advanced Usage

### Complete Form Validation

```typescript
import {
  validateCpf,
  validatePhone,
  validateCep,
  formatToCpf,
  formatToPhone,
  formatToCep,
} from "@arkyn/shared";

function validateUserForm(data) {
  const errors = {};

  // Validate and format CPF
  if (!validateCpf(data.cpf)) {
    errors.cpf = "Invalid CPF";
  } else {
    data.cpf = formatToCpf(data.cpf);
  }

  // Validate and format phone
  if (!validatePhone(data.phone)) {
    errors.phone = "Invalid phone number";
  } else {
    data.phone = formatToPhone(data.phone);
  }

  // Validate and format CEP
  if (!validateCep(data.cep)) {
    errors.cep = "Invalid postal code";
  } else {
    data.cep = formatToCep(data.cep);
  }

  return { isValid: Object.keys(errors).length === 0, errors, data };
}
```

### Data Processing Pipeline

```typescript
import {
  removeNonNumeric,
  formatToCurrency,
  calculateCardInstallment,
  generateId,
} from "@arkyn/shared";

function processOrder(orderData) {
  // Clean price input
  const numericPrice = removeNonNumeric(orderData.price);
  const price = parseFloat(numericPrice) / 100; // Convert cents to reais

  // Format for display
  const formattedPrice = formatToCurrency(price);

  // Calculate installments
  const installments = calculateCardInstallment(price, 12);

  // Generate order ID
  const orderId = generateId();

  return {
    id: orderId,
    price: formattedPrice,
    installmentOptions: installments.map((value, index) => ({
      number: index + 1,
      value: formatToCurrency(value),
    })),
  };
}
```

## 🧪 Development

```bash
# Install dependencies
bun install

# Build the package
bun run build

# Run tests
bun run test

# Type check
bun run typecheck
```

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to help improve the package.

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](./LICENSE.txt) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/Lucas-Eduardo-Goncalves/arkyn)
- [NPM Package](https://www.npmjs.com/package/@arkyn/shared)
- [Full Documentation](https://github.com/Lucas-Eduardo-Goncalves/arkyn#readme)

---

Made with ❤️ by the Arkyn team
