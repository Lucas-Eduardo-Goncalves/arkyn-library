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

  validateInputFormat(format: string): void {
    const validFormats = ["brazilianDate", "isoDate", "timestamp"];
    if (!validFormats.includes(format)) {
      throw new Error(`Invalid input format: ${format}`);
    }
  }
}

export { ValidateDateService };
