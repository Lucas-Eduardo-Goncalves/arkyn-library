import { countryCurrencies } from "@arkyn/templates";
import { removeCurrencySymbols } from "../utilities/removeCurrencySymbols";

type Currencies = keyof typeof countryCurrencies;

/**
 * Formats a number into a locale-aware currency string using `Intl.NumberFormat`.
 *
 * @param value - The numeric value to format.
 * @param currency - A currency code from `@arkyn/templates` (e.g. `"BRL"`, `"USD"`).
 * @param config.showPrefix - Whether to include the currency symbol. Defaults to `true`.
 * @returns The formatted currency string.
 *
 * @example
 * ```typescript
 * formatToCurrency(1234.56, "BRL"); // "R$ 1.234,56"
 * formatToCurrency(1234.56, "USD", { showPrefix: false }); // "1,234.56"
 * ```
 */
function formatToCurrency(
	value: number,
	currency: Currencies,
	config?: { showPrefix?: boolean },
): string {
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
}

export { formatToCurrency };
