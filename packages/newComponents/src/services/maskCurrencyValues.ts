import { formatToCurrency, removeNonNumeric } from "@arkyn/shared";

type Locale =
  | "USD"
  | "EUR"
  | "JPY"
  | "GBP"
  | "AUD"
  | "CAD"
  | "CHF"
  | "CNY"
  | "SEK"
  | "NZD"
  | "BRL"
  | "INR"
  | "RUB"
  | "ZAR"
  | "MXN"
  | "SGD"
  | "HKD"
  | "NOK"
  | "KRW"
  | "TRY"
  | "IDR"
  | "THB";

function normalizeValue(number: string | number) {
  let safeNumber = number;

  if (typeof number === "string") {
    safeNumber = +removeNonNumeric(number);
    if (safeNumber % 1 !== 0) safeNumber = safeNumber.toFixed(2);
  } else {
    safeNumber = Number.isInteger(number)
      ? Number(number) * 10 ** 2
      : number.toFixed(2);
  }

  return +removeNonNumeric(String(safeNumber)) / 10 ** 2;
}

function maskCurrencyValues(
  inputFieldValue: string | number | undefined,
  locale: Locale
): [number, string] {
  if (!inputFieldValue) return [0, formatToCurrency(0, locale)];

  const value = normalizeValue(inputFieldValue);
  const maskedValue = formatToCurrency(value, locale);

  return [value, maskedValue];
}

export { maskCurrencyValues };
