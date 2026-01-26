import { ValidateDateService } from "../services/validateDateService";

function formatDateString(date: Date, format: string): string {
  const pad = (num: number) => num.toString().padStart(2, "0");

  const replacements: Record<string, string> = {
    YYYY: date.getUTCFullYear().toString(),
    YY: date.getUTCFullYear().toString().slice(-2),
    MM: pad(date.getUTCMonth() + 1),
    DD: pad(date.getUTCDate()),
    hh: pad(date.getUTCHours()),
    mm: pad(date.getUTCMinutes()),
    ss: pad(date.getUTCSeconds()),
  };

  return format.replace(
    /YYYY|YY|MM|DD|hh|mm|ss/g,
    (match) => replacements[match],
  );
}

/**
 * Formats a date and time string based on the provided input and output formats.
 *
 * **Note:** This function works with UTC+0 by default. The returned formatted string is not automatically converted to the machine's local timezone.
 * To adjust the timezone, you must manually specify the `timezone` parameter (e.g., -3 for UTC-3).
 *
 * @param {[string, string]} dateTime - An array containing the date and optional time.
 *   - The first element is the date string.
 *   - The second element is the time string (default is "00:00:00").
 * @param {"brazilianDate" | "isoDate" | "timestamp"} inputFormat - The format of the input date.
 *   - "brazilianDate": Expects the date in "DD/MM/YYYY" or "D/M/YYYY" format.
 *   - "isoDate": Expects the date in "MM-DD-YYYY" or "M-D-YYYY" format.
 *   - "timestamp": Expects the date in "YYYY-MM-DD" or "YYYY-M-D" format.
 * @param {string} outputFormat - The desired output format for the date.
 *   - Use placeholders like "YYYY", "MM", "DD", "hh", "mm", "ss" to define the format.
 * @param {number} [timezone=0] - The timezone offset in hours to apply to the date.
 *   - Defaults to 0 (UTC).
 *
 * @returns {string} The formatted date string based on the output format.
 *
 * @throws {Error} If the date parts are invalid (e.g., month not between 1-12).
 * @throws {Error} If the date created is invalid.
 *
 * @example
 * Format a Brazilian date to ISO format
 * ```typescript
 * const formattedDate = formatDate(
 *   ["25/12/2023", "15:30:00"],
 *   "brazilianDate",
 *   "YYYY-MM-DD hh:mm",
 * );
 *
 * console.log(formattedDate); // Output: "2023-12-25 15:30"
 * ```
 * @example
 * Format an ISO date to a custom format with timezone adjustment
 * ```typescript
 * const formattedDate = formatDate(
 *   ["2023-12-25", "15:30:00"],
 *   "isoDate",
 *   "DD/MM/YYYY hh:mm",
 *   -3,
 * );
 *
 * console.log(formattedDate); // Output: "25/12/2023 12:30"
 * ```
 */

const formatDate = (
  [date, time = "00:00:00"]: [string, string?],
  inputFormat: "brazilianDate" | "isoDate" | "timestamp",
  outputFormat: string,
  timezone: number = 0,
): string => {
  const validateDateService = new ValidateDateService();
  validateDateService.validateInputFormat(inputFormat);

  const dateParts = date.split(/[-/]/).map(Number);
  const timeParts = time.split(".")[0].split(":").map(Number);

  let day: number, month: number, year: number;
  const [hours = 0, minutes = 0, seconds = 0] = timeParts;

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

  const formattedDate = new Date(
    Date.UTC(year, month - 1, day, hours, minutes, seconds),
  );

  if (isNaN(formattedDate.getTime())) throw new Error("Invalid date");

  formattedDate.setUTCHours(formattedDate.getUTCHours() + timezone);

  return formatDateString(formattedDate, outputFormat);
};

export { formatDate };
