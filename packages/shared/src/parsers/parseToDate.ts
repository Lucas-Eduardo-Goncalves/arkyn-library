import { ValidateDateService } from "../services/validateDateService";

/**
 * Parses a date (and optional time) string into a JavaScript `Date` object.
 * All calculations are in UTC+0; use `timezone` to shift the result.
 *
 * @param date - Date string in the format determined by `inputFormat`.
 * @param time - Optional time string `"HH:mm:ss"` (defaults to `"00:00:00"`).
 * @param inputFormat - Parsing format:
 *   - `"brazilianDate"`: DD/MM/YYYY
 *   - `"isoDate"`: MM-DD-YYYY
 *   - `"timestamp"`: YYYY-MM-DD
 * @param timezone - UTC offset in hours (e.g. `-3` for UTC-3). Defaults to `0`.
 * @returns A `Date` object representing the parsed date and time.
 *
 * @example
 * ```typescript
 * parseToDate(["25/12/2023", "15:30:00"], "brazilianDate", -3);
 * // Date: 2023-12-25T12:30:00.000Z
 *
 * parseToDate(["2023-12-25"], "timestamp");
 * // Date: 2023-12-25T00:00:00.000Z
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
