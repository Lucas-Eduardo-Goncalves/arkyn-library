import { countries, type CountryType } from "@arkyn/templates";
import { parsePhoneNumberWithError } from "libphonenumber-js";
import { removeNonNumeric } from "./removeNonNumeric";

/**
 * Resolves the matching phone mask and country metadata for a given phone number.
 * Masks use `"_"` as digit placeholders. For countries with multiple mask lengths
 * (e.g. Brazil with and without the ninth digit), the mask matching the number's
 * digit count is returned.
 *
 * @param phoneNumber - Phone number in E.164 format (e.g. `"+5511999999999"`).
 * @returns A tuple of `[maskString, CountryType]`.
 * @throws If the number is invalid or no mask is found for the parsed country.
 *
 * @example
 * ```typescript
 * const [mask, country] = findCountryMask("+5511999999999");
 * // mask: "(__) _____-____"
 * // country.name: "Brazil"
 * ```
 */

function findCountryMask(phoneNumber: string): [string, CountryType] {
  try {
    const parsedPhone = parsePhoneNumberWithError(phoneNumber);

    const countryCode = parsedPhone?.country;
    if (!countryCode) throw new Error("Invalid phone number");

    const country = countries.find((c) => c.iso === countryCode);
    if (!country) throw new Error("Phone number country not supported");

    if (typeof country.mask === "string") return [country.mask, country];

    const maskForLength = country.mask.find((mask) => {
      const maskDigits = mask.replace(/[^_]/g, "");
      const phoneDigits = removeNonNumeric(parsedPhone.nationalNumber);

      const maskDigitsCount = maskDigits.length;
      const phoneDigitsCount = phoneDigits.length;

      return maskDigitsCount === phoneDigitsCount;
    });

    if (!maskForLength) {
      throw new Error("No mask found for the given phone number length");
    }

    return [maskForLength, country];
  } catch (rawError) {
    const error = rawError as Error;
    throw new Error(error.message);
  }
}

export { findCountryMask };
