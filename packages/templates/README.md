# @arkyn/templates

Ready-to-use data templates and constants for international and Brazilian applications. Provides comprehensive country data, Brazilian states, currency information, and locale configurations to accelerate your development workflow.

[![npm version](https://img.shields.io/npm/v/@arkyn/templates.svg)](https://www.npmjs.com/package/@arkyn/templates)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## ✨ Features

- 🌍 **Global Countries Data** - Complete list of 195+ countries with flags, codes, and phone masks
- 🇧🇷 **Brazilian States** - All 26 states plus Federal District with codes and names
- 💱 **Currency Information** - Country-specific currency data and formatting rules
- 📊 **Locale Configurations** - Maximum fraction digits for different currencies
- 🎯 **TypeScript Support** - Fully typed data structures
- 📱 **Phone Number Masks** - Country-specific phone formatting patterns

## 📦 Installation

```bash
npm install @arkyn/templates
```

## 🚀 Quick Start

```typescript
import {
  countries,
  brazilianStates,
  countryCurrencies,
} from "@arkyn/templates";

// Find a specific country
const brazil = countries.find((country) => country.iso === "BR");
console.log(brazil);
// {
//   name: "Brazil",
//   code: "+55",
//   prefix: null,
//   iso: "BR",
//   flag: "https://cdn.kcak11.com/CountryFlags/countries/br.svg",
//   mask: "(__) _____-____"
// }

// Get Brazilian states
const saoPaulo = brazilianStates.find((state) => state.code === "SP");
console.log(saoPaulo); // { code: 'SP', name: 'São Paulo' }

// Access currency data
console.log(countryCurrencies.USD); // Currency information for USD
```

## 📋 API Reference

### 🌍 Countries Data

The `countries` array contains comprehensive data for all world countries:

```typescript
interface Country {
  name: string; // Country name in English
  code: string; // International dialing code (e.g., "+55")
  prefix: string | null; // Additional prefix for specific regions
  iso: string; // ISO 3166-1 alpha-2 country code
  flag: string; // URL to country flag SVG
  mask: string; // Phone number formatting mask
}
```

#### Usage Examples

```typescript
import { countries } from "@arkyn/templates";

// Get all countries
console.log(countries.length); // 195+

// Find by ISO code
const usa = countries.find((country) => country.iso === "US");

// Find by country code
const brazilianCountries = countries.filter(
  (country) => country.code === "+55"
);

// Get all European countries (you'll need additional logic)
const europeanCountries = countries.filter((country) =>
  ["FR", "DE", "IT", "ES", "PT"].includes(country.iso)
);

// Create a phone input selector
function CountrySelector() {
  return (
    <select>
      {countries.map((country) => (
        <option key={country.iso} value={country.code}>
          <img src={country.flag} alt={country.name} />
          {country.name} ({country.code})
        </option>
      ))}
    </select>
  );
}
```

### 🇧🇷 Brazilian States

The `brazilianStates` array contains all Brazilian states and the Federal District:

```typescript
interface BrazilianState {
  code: string; // Two-letter state code (e.g., "SP", "RJ")
  name: string; // State name in Portuguese (e.g., "São Paulo")
}
```

#### Usage Examples

```typescript
import { brazilianStates } from "@arkyn/templates";

// Get all states
console.log(brazilianStates.length); // 27 (26 states + Federal District)

// Find specific state
const rioDeJaneiro = brazilianStates.find((state) => state.code === "RJ");
console.log(rioDeJaneiro); // { code: 'RJ', name: 'Rio de Janeiro' }

// Create a state selector
function StateSelector() {
  return (
    <select>
      {brazilianStates.map((state) => (
        <option key={state.code} value={state.code}>
          {state.name}
        </option>
      ))}
    </select>
  );
}

// Validate state code
function isValidState(stateCode: string): boolean {
  return brazilianStates.some((state) => state.code === stateCode);
}
```

### 💱 Country Currencies

The `countryCurrencies` object provides currency information mapped by currency codes:

```typescript
interface CountryCurrency {
  [currencyCode: string]: {
    symbol: string;
    name: string;
    countries: string[];
  };
}
```

#### Usage Examples

```typescript
import { countryCurrencies } from "@arkyn/templates";

// Get USD information
console.log(countryCurrencies.USD);
// {
//   symbol: '$',
//   name: 'US Dollar',
//   countries: ['US', 'EC', 'SV', ...]
// }

// Get Brazilian Real
console.log(countryCurrencies.BRL);
// {
//   symbol: 'R$',
//   name: 'Brazilian Real',
//   countries: ['BR']
// }

// Find all countries using EUR
const euroCountries = countryCurrencies.EUR.countries;

// Get currency by country
function getCurrencyByCountry(countryCode: string): string | null {
  for (const [currency, data] of Object.entries(countryCurrencies)) {
    if (data.countries.includes(countryCode)) {
      return currency;
    }
  }
  return null;
}

const brazilCurrency = getCurrencyByCountry("BR"); // 'BRL'
```

### 📊 Maximum Fraction Digits

The `maximumFractionDigits` object provides locale-specific decimal place configurations:

```typescript
interface MaximumFractionDigits {
  [locale: string]: number;
}
```

#### Usage Examples

```typescript
import { maximumFractionDigits } from "@arkyn/templates";

// Get maximum decimal places for different locales
console.log(maximumFractionDigits["pt-BR"]); // 2 (for Brazilian Real)
console.log(maximumFractionDigits["en-US"]); // 2 (for US Dollar)
console.log(maximumFractionDigits["ja-JP"]); // 0 (for Japanese Yen)

// Format currency with correct decimal places
function formatCurrency(amount: number, locale: string): string {
  const fractionDigits = maximumFractionDigits[locale] || 2;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: getCurrencyForLocale(locale),
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(amount);
}
```

## 🔧 Advanced Usage

### International Phone Input

```typescript
import { countries } from "@arkyn/templates";

function InternationalPhoneInput() {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");

  const formatPhoneNumber = (number: string) => {
    let formatted = number;
    const mask = selectedCountry.mask;

    // Apply mask logic here
    return formatted;
  };

  return (
    <div className="phone-input">
      <select
        value={selectedCountry.iso}
        onChange={(e) => {
          const country = countries.find((c) => c.iso === e.target.value);
          setSelectedCountry(country);
        }}
      >
        {countries.map((country) => (
          <option key={country.iso} value={country.iso}>
            <img src={country.flag} alt="" />
            {country.name} ({country.code})
          </option>
        ))}
      </select>

      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
        placeholder={selectedCountry.mask.replace(/_/g, "0")}
      />
    </div>
  );
}
```

### Multi-Currency Calculator

```typescript
import { countryCurrencies, maximumFractionDigits } from "@arkyn/templates";

class CurrencyCalculator {
  private exchangeRates: Record<string, number> = {};

  setExchangeRates(rates: Record<string, number>) {
    this.exchangeRates = rates;
  }

  convert(amount: number, fromCurrency: string, toCurrency: string): number {
    if (!this.exchangeRates[fromCurrency] || !this.exchangeRates[toCurrency]) {
      throw new Error("Exchange rate not available");
    }

    const usdAmount = amount / this.exchangeRates[fromCurrency];
    return usdAmount * this.exchangeRates[toCurrency];
  }

  format(amount: number, currency: string, locale: string): string {
    const fractionDigits = maximumFractionDigits[locale] || 2;
    const currencyInfo = countryCurrencies[currency];

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: fractionDigits,
    }).format(amount);
  }
}
```

### Address Form with Brazilian States

```typescript
import { brazilianStates } from "@arkyn/templates";

function AddressForm() {
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  return (
    <form>
      <input
        type="text"
        placeholder="Street Address"
        value={address.street}
        onChange={(e) => setAddress({ ...address, street: e.target.value })}
      />

      <input
        type="text"
        placeholder="City"
        value={address.city}
        onChange={(e) => setAddress({ ...address, city: e.target.value })}
      />

      <select
        value={address.state}
        onChange={(e) => setAddress({ ...address, state: e.target.value })}
      >
        <option value="">Select State</option>
        {brazilianStates.map((state) => (
          <option key={state.code} value={state.code}>
            {state.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="ZIP Code"
        value={address.zipCode}
        onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
      />
    </form>
  );
}
```

## 🧪 Development

```bash
# Install dependencies
bun install

# Build the package
bun run build

# Type check
bun run typecheck
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to help improve the package.

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](./LICENSE.txt) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/Lucas-Eduardo-Goncalves/arkyn)
- [NPM Package](https://www.npmjs.com/package/@arkyn/templates)
- [Full Documentation](https://github.com/Lucas-Eduardo-Goncalves/arkyn#readme)

---

Made with ❤️ by the Arkyn team
