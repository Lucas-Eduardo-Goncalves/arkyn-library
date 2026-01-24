import { countryCurrencies } from "@arkyn/templates";
import { removeCurrencySymbols } from "../services/removeCurrencySymbols";

type Currencies = keyof typeof countryCurrencies;

type Config = {
  showPrefix?: boolean;
};

type FormatToCurrency = (
  value: number,
  currency: Currencies,
  config?: Config,
) => string;

/**
 * Formats a numeric value into a currency string based on the specified currency and configuration.
 *
 * @param {number} value - The numeric value to be formatted.
 * @param {Currencies} currency - The currency code used to determine the formatting style.
 * @param {Config} [config] - Optional configuration object.
 * @param {boolean} [config.showPrefix=true] - Determines whether the currency symbol/prefix should be included in the formatted string. Defaults to `true`.
 *
 * @returns {string} A formatted currency string. If `config.showPrefix` is `false`, the currency symbol is removed.
 *
 * @example Format a value in USD with prefix
 * ```typescript
 * const formatted = formatToCurrency(1234.56, "USD", { showPrefix: true });
 * console.log(formatted); // "$1,234.56"
 * ```
 * @example Format a value in USD without prefix
 * ```typescript
 * const withoutPrefix = formatToCurrency(1234.56, "USD", { showPrefix: false });
 * console.log(withoutPrefix); // "1,234.56"
 * ```
 * @example Format a value in BRL with prefix
 * ```typescript
 * const formattedBRL = formatToCurrency(1234.56, "BRL", { showPrefix: true });
 * console.log(formattedBRL); // "R$ 1.234,56"
 * ```
 * @example Format a value in BRL without prefix
 * ```typescript
 * const withoutPrefixBRL = formatToCurrency(1234.56, "BRL", { showPrefix: false });
 * console.log(withoutPrefixBRL); // "1.234,56"
 * ```
 */

const formatToCurrency: FormatToCurrency = (
  value,
  currency,
  config,
): string => {
  if (!countryCurrencies?.[currency]) {
    throw new Error("Unsupported currency code");
  }

  const showPrefix = config?.showPrefix ?? true;

  const { countryCurrency, countryLanguage } = countryCurrencies[currency];

  const format = new Intl.NumberFormat(countryLanguage, {
    style: "currency",
    currency: countryCurrency,
  }).format(value);

  return showPrefix
    ? format.replace(/\s/g, " ")
    : removeCurrencySymbols(format).replace(/\s/g, " ");
};

export { formatToCurrency };
