import { ValidateDateService } from "@arkyn/shared";

type ValidateDateConfig = {
  inputFormat?: "brazilianDate" | "isoDate" | "timestamp";
  minYear?: number;
  maxYear?: number;
};

/**
 * Validates a date string based on the provided format and configuration.
 *
 * @param {string} date - The date string to validate.
 * @param {object} config - Optional configuration object to customize validation.
 * @param {"brazilianDate" | "isoDate" | "timestamp"} inputFormat - The format of the input date.
 *   - "brazilianDate": Expects the date in "DD/MM/YYYY" or "D/M/YYYY" format.
 *   - "isoDate": Expects the date in "MM-DD-YYYY" or "M-D-YYYY" format.
 *   - "timestamp": Expects the date in "YYYY-MM-DD" or "YYYY-M-D" format.
 * @param {number} config.minYear - The minimum allowed year for the date. Defaults to 1900.
 * @param {number} config.maxYear - The maximum allowed year for the date. Defaults to 3000.
 *
 * @returns {boolean} `true` if the date is valid according to the specified format and configuration, otherwise `false`.
 *
 * @throws {Error} If an invalid input format is provided.
 *
 * @example
 * ```typescript
 * validateDate("31/12/2023"); // true
 * validateDate("12-31-2023", { inputFormat: "isoDate" }); // true
 * validateDate("2023-12-31", { inputFormat: "timestamp", minYear: 2000, maxYear: 2100 }); // true
 * validateDate("29/02/2024", { inputFormat: "brazilianDate" }); // true (leap year)
 * validateDate("29/02/2023", { inputFormat: "brazilianDate" }); // false (not a leap year)
 * validateDate("31/04/2023", { inputFormat: "brazilianDate" }); // false (April has 30 days)
 * ```
 */

function validateDate(date: string, config?: ValidateDateConfig): boolean {
  const inputFormat = config?.inputFormat || "brazilianDate";
  const minYear = config?.minYear || 1900;
  const maxYear = config?.maxYear || 3000;

  const validateDateService = new ValidateDateService();
  validateDateService.validateInputFormat(inputFormat);

  let day: number, month: number, year: number;
  const dateParts = date.split(/[-/]/).map(Number);

  if (dateParts.length !== 3) return false;

  try {
    switch (inputFormat) {
      case "brazilianDate":
        [day, month, year] = dateParts;
        validateDateService.validateDateParts(year, month, day);
        break;
      case "isoDate":
        [month, day, year] = dateParts;
        validateDateService.validateDateParts(year, month, day);
        break;
      case "timestamp":
        [year, month, day] = dateParts;
        validateDateService.validateDateParts(year, month, day);
        break;
    }
    if (year < minYear || year > maxYear) return false;
    return true;
  } catch {
    return false;
  }
}

export { validateDate };
