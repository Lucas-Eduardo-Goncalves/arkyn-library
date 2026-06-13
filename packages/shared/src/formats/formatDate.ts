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
 * Formats a date (and optional time) string into a custom output format.
 * All calculations are in UTC+0; use the `timezone` parameter to shift the result.
 *
 * @param date - Date string in the format determined by `inputFormat`.
 * @param time - Optional time string `"HH:mm:ss"` (defaults to `"00:00:00"`).
 * @param inputFormat - Parsing format:
 *   - `"brazilianDate"`: DD/MM/YYYY
 *   - `"isoDate"`: MM-DD-YYYY
 *   - `"timestamp"`: YYYY-MM-DD
 * @param outputFormat - Output template using `YYYY`, `MM`, `DD`, `hh`, `mm`, `ss` placeholders.
 * @param timezone - UTC offset in hours (e.g. `-3` for UTC-3). Defaults to `0`.
 * @returns The formatted date string.
 *
 * @example
 * ```typescript
 * formatDate(["25/12/2023", "15:30:00"], "brazilianDate", "YYYY-MM-DD hh:mm");
 * // "2023-12-25 15:30"
 *
 * formatDate(["2023-12-25", "15:30:00"], "timestamp", "DD/MM/YYYY hh:mm", -3);
 * // "2023-12-25 12:30"
 * ```
 */

function formatDate(
  [date, time = "00:00:00"]: string[],
  inputFormat: "brazilianDate" | "isoDate" | "timestamp",
  outputFormat: string,
  timezone: number = 0,
): string {
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
}

export { formatDate };
