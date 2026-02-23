import { countries } from "@arkyn/templates";
import {
  isValidPhoneNumber,
  parsePhoneNumberWithError,
} from "libphonenumber-js";

/**
 * Validates a phone number against a list of country-specific formats.
 *
 * The function iterates through a predefined list of countries and checks if the
 * provided phone number matches the format for any of the countries. It uses
 * regular expressions to validate the phone number based on the country's code,
 * prefix, and mask.
 *
 * Special handling is applied for Brazilian phone numbers (ISO code "BR"), which
 * allows for an optional ninth digit.
 *
 * @param {string} rawPhone - The phone number to validate as a string.
 * @returns {boolean} `true` if the phone number matches any country's format, otherwise `false`.
 *
 * @example
 * ```typescript
 * import { validatePhone } from "./validatePhone";
 *
 * validatePhone("+5532912345678"); // true for a valid Brazilian phone number
 * validatePhone("+553212345678"); // true for a valid Brazilian phone number
 * validatePhone("+19706574614"); // true for a valid American Samoa phone number
 * validatePhone("+55329123456178"); // false for an invalid Brazilian phone number
 * validatePhone("+55123456789"); // false for an invalid Brazilian phone number
 * ```
 */

function validatePhone(rawPhone: string): boolean {
  if (!isValidPhoneNumber(rawPhone)) return false;

  const parsedPhone = parsePhoneNumberWithError(rawPhone);

  const countryCode = parsedPhone?.country;
  if (!countryCode) return false;

  const country = countries.find((c) => c.iso === countryCode);
  if (!country) return false;

  return true;
}

export { validatePhone };
