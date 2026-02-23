import { countries, type CountryType } from "@arkyn/templates";
import { parsePhoneNumberWithError } from "libphonenumber-js";
import { removeNonNumeric } from "./removeNonNumeric";

/**
 * Finds and returns the phone mask for a given phone number based on the project's
 * country templates (masks use "_" as digit placeholders).
 *
 * The function typically:
 * - Parses the provided phone number to determine the country (using libphonenumber-js).
 * - Looks up the corresponding country mask in the `@arkyn/templates` list.
 * - Returns the mask string (e.g. "(__) _____-____") to be used for formatting.
 *
 * @param {string} phoneNumber - The input phone number (can include country code or be in national format).
 * @returns {string} The country mask string containing "_" placeholders for digits.
 *
 * @throws {Error} If the phone number is invalid or if no mask is found for the parsed country.
 *
 * @example
 * ```typescript
 * console.log(findCountryMask("+5511999999999"));
 * // output:
 * [
 *  ["(__) _____-____", ["(__) ____-____"]],
 *  {
 *    name: "Brazil",
 *    code: "+55",
 *    iso: "BR",
 *    flag: "🇧🇷",
 *    mask: ["(__) _____-____", ["(__) ____-____"]] }
 * ]
 *
 * console.log(findCountryMask("+19700000000"));
 * // output:
 * [
 *  "(___) ___-____",
 *  {
 *    name: "United States",
 *    code: "+1",
 *    iso: "US",
 *    flag: "🇺🇸",
 *    mask: "(___) ___-____" }
 * ]
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
