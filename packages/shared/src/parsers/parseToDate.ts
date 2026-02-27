import { ValidateDateService } from "../services/validateDateService";

/**
 * Converts a date and time input into a JavaScript `Date` object, formatted according to the specified input format and timezone.
 *
 * @remarks
 * **Note:** This function works with UTC+0 by default. The returned Date object is not automatically converted to the machine's local timezone.
 * To adjust the timezone, you must manually specify the `timezone` parameter (e.g., -3 for UTC-3).
 *
 * @param {string[]} dateTime - An array containing the date and optional time.
 *   - The first element is the date string.
 *   - The second element is the time string (default is "00:00:00")
 * @param {"brazilianDate" | "isoDate" | "timestamp"} inputFormat - The format of the input date.
 *   - "brazilianDate": Expects the date in "DD/MM/YYYY" or "D/M/YYYY" format.
 *   - "isoDate": Expects the date in "MM-DD-YYYY" or "M-D-YYYY" format.
 *   - "timestamp": Expects the date in "YYYY-MM-DD" or "YYYY-M-D" format.
 * @param {number} [timezone=0] - The timezone offset in hours to apply to the date.
 *   - Defaults to 0 (UTC).
 *
 * @returns {Date} A `Date` object representing the parsed date and time, adjusted for the specified timezone.
 *
 * @throws {Error} If the `inputFormat` is invalid.
 * @throws {Error} If the provided date or time is invalid.
 *
 * @example Format a Brazilian date to Date
 * ```typescript
 * const date = parseToDate(["25/12/2023", "15:30:00"], "brazilianDate", -3);
 * console.log(date); // Outputs a Date object for "2023-12-25T12:30:00.000Z" (UTC)
 * ```
 * @example Format an ISO date to Date
 * ```typescript
 * const date = parseToDate(["12-25-2023", "15:30:00"], "isoDate", 2);
 * console.log(date); // Outputs a Date object for "2023-12-25T13:30:00.000Z" (UTC)
 * ```
 * @example Format a timestamp date to Date
 * ```typescript
 * const date = parseToDate(["2023-12-25", "15:30:00"], "timestamp");
 * console.log(date); // Outputs a Date object for "2023-12-25T15:30:00.000Z" (UTC)
 * ```
 */

function parseToDate(
  [date, time = "00:00:00"]: string[],
  inputFormat: "brazilianDate" | "isoDate" | "timestamp",
  timezone: number = 0,
): Date {
  const validateDateService = new ValidateDateService();
  validateDateService.validateInputFormat(inputFormat);

  const dateParts = date.split(/[-/]/).map(Number);
  const timeParts = time.split(".")[0].split(":").map(Number);

  let day, month, year;
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

  return formattedDate;
}

export { parseToDate };
