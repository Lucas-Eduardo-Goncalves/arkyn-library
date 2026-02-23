import { parsePhoneNumberWithError } from "libphonenumber-js";
import { findCountryMask } from "../utilities/findCountryMask";

/**
 * Formats a phone number string according to the country mask defined in `@arkyn/templates`.
 *
 * The function parses the input using libphonenumber-js to determine the country and
 * national number, then applies the corresponding country's mask (underscore `_` used
 * as digit placeholder) replacing placeholders with actual digits.
 *
 * @param {string} phoneNumber - The input phone number (can include country code or be in national format).
 *
 * @returns {string} The phone number formatted following the country's mask.
 *
 * @throws {Error} If the phone number is invalid or if no country mask is found for the parsed country.
 *
 * @example
 * ```typescript
 * console.log(formatToPhone("+5534920524282")); // Output: "(34) 92052-4282" (Brazilian format)
 * console.log(formatToPhone("+553420524282")); // Output: "(34) 2052-4282" (Brazilian format with optional ninth digit)
 * console.log(formatToPhone("+12125550199")); // Output: "(212) 555-0199" (American Samoa format)
 * ```
 */

function formatToPhone(phoneNumber: string): string {
  try {
    const parsedPhone = parsePhoneNumberWithError(phoneNumber);
    const phoneNumberDigits = parsedPhone.nationalNumber.toString();

    let formattedNumber = findCountryMask(phoneNumber)[0];

    for (
      let i = 0, j = 0;
      i < formattedNumber.length && j < phoneNumberDigits.length;
      i++
    ) {
      if (formattedNumber[i] === "_") {
        formattedNumber =
          formattedNumber.substring(0, i) +
          phoneNumberDigits[j] +
          formattedNumber.substring(i + 1);
        j++;
      }
    }

    return formattedNumber;
  } catch (rawError) {
    const error = rawError as Error;
    throw new Error(error.message);
  }
}

export { formatToPhone };
