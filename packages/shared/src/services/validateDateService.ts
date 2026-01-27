/**
 * Service for validating date components and input formats.
 *
 * This service provides methods to validate date parts (year, month, day) and
 * input format strings used in date parsing operations. It includes leap year
 * validation and month-specific day validation.
 *
 * @remarks
 * The service validates:
 * - Year must be exactly 4 digits (1000-9999)
 * - Month must be between 1 and 12
 * - Day must be between 1 and 31
 * - Day must be valid for the specific month (e.g., no February 30)
 * - Leap year rules for February 29
 *
 * @example Validate a valid date
 * ```typescript
 * const service = new ValidateDateService();
 * service.validateDateParts(2024, 1, 15); // No error thrown
 * ```
 *
 * @example Validate an invalid date
 * ```typescript
 * const service = new ValidateDateService();
 * service.validateDateParts(2023, 2, 29); // Throws: "Day 29 is not valid for February 2023 (non-leap year)"
 * ```
 *
 * @example Validate input format
 * ```typescript
 * const service = new ValidateDateService();
 * service.validateInputFormat("brazilianDate"); // No error thrown
 * service.validateInputFormat("invalidFormat"); // Throws: "Invalid input format: invalidFormat"
 * ```
 */

class ValidateDateService {
  private isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  private getDaysInMonth(month: number, year: number): number {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && this.isLeapYear(year)) return 29;
    return daysInMonth[month - 1];
  }

  private validateDayInMonth(day: number, month: number, year: number): void {
    const maxDays = this.getDaysInMonth(month, year);

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
      const leapYearMessage = `Day ${day} is not valid for February ${year} (non-leap year)`;

      if (month === 2 && day === 29) throw new Error(leapYearMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Validates the components of a date (year, month, and day).
   *
   * @param {number} year - The year to validate (must be 4 digits).
   * @param {number} month - The month to validate (must be between 1 and 12).
   * @param {number} day - The day to validate (must be between 1 and 31, and valid for the month).
   *
   * @throws {Error} "Year should be four digits" - If the year doesn't have exactly 4 digits.
   * @throws {Error} "Month should be between 1 and 12" - If the month is out of valid range.
   * @throws {Error} "Day should be between 1 and 31" - If the day is out of valid range.
   * @throws {Error} Month-specific error - If the day is invalid for the specific month.
   *
   * @example
   * ```typescript
   * const service = new ValidateDateService();
   * service.validateDateParts(2024, 2, 29); // Valid leap year date
   * service.validateDateParts(2023, 2, 29); // Throws error - not a leap year
   * service.validateDateParts(2024, 4, 31); // Throws error - April has only 30 days
   * ```
   */
  validateDateParts(year: number, month: number, day: number): void {
    const messageErrors = {
      year: "Year should be four digits",
      month: "Month should be between 1 and 12",
      day: "Day should be between 1 and 31",
    };

    if (`${year}`.length !== 4) throw new Error(messageErrors.year);
    if (month < 1 || month > 12) throw new Error(messageErrors.month);
    if (day < 1 || day > 31) throw new Error(messageErrors.day);

    this.validateDayInMonth(day, month, year);
  }

  /**
   * Validates that a given format string is supported.
   *
   * @param {string} format - The format string to validate.
   *
   * @throws {Error} "Invalid input format: {format}" - If the format is not one of the valid formats.
   *
   * @remarks
   * Valid formats are:
   * - "brazilianDate": DD/MM/YYYY format
   * - "isoDate": MM-DD-YYYY format
   * - "timestamp": YYYY-MM-DD format
   *
   * @example
   * ```typescript
   * const service = new ValidateDateService();
   * service.validateInputFormat("brazilianDate"); // Valid
   * service.validateInputFormat("isoDate"); // Valid
   * service.validateInputFormat("timestamp"); // Valid
   * service.validateInputFormat("customFormat"); // Throws error
   * ```
   */
  validateInputFormat(format: string): void {
    const validFormats = ["brazilianDate", "isoDate", "timestamp"];
    if (!validFormats.includes(format)) {
      throw new Error(`Invalid input format: ${format}`);
    }
  }
}

export { ValidateDateService };
