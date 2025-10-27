type ValidateDateConfig = {
  inputFormat?: "DD/MM/YYYY" | "MM-DD-YYYY" | "YYYY-MM-DD";
  minYear?: number;
  maxYear?: number;
};

type ValidateDateFunction = (
  rawDate: string,
  config?: ValidateDateConfig
) => boolean;

/**
 * Validates a date string based on the provided format and configuration.
 *
 * @param rawDate - The date string to validate.
 * @param config - Optional configuration object to customize validation.
 * @param config.inputFormat - The expected format of the input date.
 *                            Supported formats are "DD/MM/YYYY", "MM-DD-YYYY", and "YYYY-MM-DD".
 *                            Defaults to "DD/MM/YYYY".
 * @param config.minYear - The minimum allowed year for the date. Defaults to 1900.
 * @param config.maxYear - The maximum allowed year for the date. Defaults to 3000.
 *
 * @returns `true` if the date is valid according to the specified format and configuration, otherwise `false`.
 *
 * @throws {Error} If an invalid date format is provided in the configuration.
 *
 * @example
 * ```typescript
 * validateDate("31/12/2023"); // true
 * validateDate("12-31-2023", { inputFormat: "MM-DD-YYYY" }); // true
 * validateDate("2023-12-31", { inputFormat: "YYYY-MM-DD", minYear: 2000, maxYear: 2100 }); // true
 * validateDate("29/02/2024", { inputFormat: "DD/MM/YYYY" }); // true (leap year)
 * validateDate("29/02/2023", { inputFormat: "DD/MM/YYYY" }); // false (not a leap year)
 * validateDate("31/04/2023", { inputFormat: "DD/MM/YYYY" }); // false (April has 30 days)
 * ```
 */

const validateDate: ValidateDateFunction = (rawDate, config) => {
  let day: string, month: string, year: string;

  const inputFormat = config?.inputFormat || "DD/MM/YYYY";
  const minYear = config?.minYear || 1900;
  const maxYear = config?.maxYear || 3000;

  if (inputFormat === "DD/MM/YYYY") {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(rawDate)) return false;
    [, day, month, year] = rawDate.match(dateRegex) || [];
  } else if (inputFormat === "MM-DD-YYYY") {
    const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
    if (!dateRegex.test(rawDate)) return false;
    [, month, day, year] = rawDate.match(dateRegex) || [];
  } else if (inputFormat === "YYYY-MM-DD") {
    const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
    if (!dateRegex.test(rawDate)) return false;
    [, year, month, day] = rawDate.match(dateRegex) || [];
  } else {
    throw new Error("Invalid date format");
  }

  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  if (dayNum < 1 || dayNum > 31) return false;
  if (monthNum < 1 || monthNum > 12) return false;

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (monthNum === 2) {
    const isLeapYear =
      (yearNum % 4 === 0 && yearNum % 100 !== 0) || yearNum % 400 === 0;
    if (dayNum > (isLeapYear ? 29 : 28)) return false;
  } else if (dayNum > daysInMonth[monthNum - 1]) {
    return false;
  }

  if (yearNum < minYear || yearNum > maxYear) return false;

  const isValidDate =
    new Date(yearNum, monthNum - 1, dayNum).getDate() === dayNum;

  return isValidDate;
};

export { validateDate };
