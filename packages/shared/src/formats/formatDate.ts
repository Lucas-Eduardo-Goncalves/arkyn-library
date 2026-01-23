type InputFormatTypes = "brazilianDate" | "isoDate";

type FormatDateFunction = (
  date: string[], // [date: string, time?: string]
  inputFormat: InputFormatTypes,
  outputFormat: string,
  timezone?: number,
) => string;

function formatDateString(date: Date, format: string): string {
  const pad = (num: number) => num.toString().padStart(2, "0");

  const replacements: Record<string, string> = {
    YYYY: date.getFullYear().toString(),
    YY: date.getFullYear().toString().slice(-2),
    MM: pad(date.getMonth() + 1),
    DD: pad(date.getDate()),
    hh: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
  };

  return format.replace(
    /YYYY|YY|MM|DD|hh|mm|ss/g,
    (match) => replacements[match],
  );
}

function validateDayInMonth(day: number, month: number, year: number): void {
  const maxDays = getDaysInMonth(month, year);

  if (day > maxDays) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const errorMessage = `Day ${day} is not valid for ${monthNames[month - 1]}`;
    throw new Error(errorMessage);
  }
}

function validateDateParts(year: number, month: number, day: number): void {
  const messageErrors = {
    year: "Year should be four digits",
    month: "Month should be between 1 and 12",
    day: "Day should be between 1 and 31",
  };

  if (`${year}`.length !== 4) throw new Error(messageErrors.year);
  if (month < 1 || month > 12) throw new Error(messageErrors.month);
  if (day < 1 || day > 31) throw new Error(messageErrors.day);

  validateDayInMonth(day, month, year);
}

function validateInputFormat(format: string): void {
  const validFormats = ["brazilianDate", "isoDate"];
  if (!validFormats.includes(format)) {
    throw new Error(`Invalid input format: ${format}`);
  }
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDaysInMonth(month: number, year: number): number {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isLeapYear(year)) return 29;
  return daysInMonth[month - 1];
}

/**
 * Formats a date and time string based on the provided input and output formats.
 *
 * @param {[string, string]} dateTime - An array containing the date and optional time.
 *   - The first element is the date string.
 *   - The second element is the time string (default is "00:00:00").
 * @param {"brazilianDate" | "isoDate"} inputFormat - The format of the input date.
 *   - "brazilianDate": Expects the date in "DD/MM/YYYY" or "D/M/YYYY" format.
 *   - "isoDate": Expects the date in "YYYY-MM-DD" or "YYYY-M-D" format.
 * @param {string} outputFormat - The desired output format for the date.
 *   - Use placeholders like "YYYY", "MM", "DD", "hh", "mm", "ss" to define the format.
 * @param {number} [timezone=0] - The timezone offset in hours to apply to the date.
 *   - Defaults to 0 (UTC).]
 *
 * @returns {string} The formatted date string based on the output format.
 *
 * @throws {Error} If the date parts are invalid (e.g., month not between 1-12).
 * @throws {Error} If the date created is invalid.
 *
 * @example
 * // Format a Brazilian date to ISO format
 * formatDate(["25/12/2023", "15:30:00"], "brazilianDate", "YYYY-MM-DD hh:mm");
 * // Returns: "2023-12-25 15:30"
 *
 * @example
 * // Format an ISO date to a custom format with timezone adjustment
 * formatDate(["2023-12-25", "15:30:00"], "isoDate", "DD/MM/YYYY hh:mm", -3);
 * // Returns: "25/12/2023 12:30"
 */

const formatDate: FormatDateFunction = (
  [date, time = "00:00:00"],
  inputFormat,
  outputFormat,
  timezone = 0,
): string => {
  validateInputFormat(inputFormat);

  const dateParts = date.split(/[-/]/).map(Number);
  const timeParts = time.split(".")[0].split(":").map(Number);

  let day: number, month: number, year: number;
  const [hours = 0, minutes = 0, seconds = 0] = timeParts;

  switch (inputFormat) {
    case "brazilianDate":
      [day, month, year] = dateParts;
      validateDateParts(year, month, day);
      break;
    case "isoDate":
      [year, month, day] = dateParts;
      validateDateParts(year, month, day);
      break;
    default:
      throw new Error("Invalid input format");
  }

  const formattedDate = new Date(year, month - 1, day, hours, minutes, seconds);
  if (isNaN(formattedDate.getTime())) throw new Error("Invalid date");

  formattedDate.setUTCHours(formattedDate.getUTCHours() + timezone);

  return formatDateString(formattedDate, outputFormat);
};

export { formatDate };
