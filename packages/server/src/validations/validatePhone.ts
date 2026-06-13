import { countries } from "@arkyn/templates";
import {
  isValidPhoneNumber,
  parsePhoneNumberWithError,
} from "libphonenumber-js";

/**
 * Validates an international phone number using `libphonenumber-js`, then confirms
 * the parsed country code is present in the supported countries list.
 *
 * @param rawPhone - Phone number in E.164 format (e.g. `"+5532912345678"`).
 * @returns `true` if the number is valid and the country is supported, otherwise `false`.
 *
 * @example
 * ```typescript
 * validatePhone("+5532912345678"); // true (Brazil)
 * validatePhone("+55329123456178"); // false (invalid)
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
