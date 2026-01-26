import { describe, expect, it } from "vitest";
import { parseToDate } from "../parseDate";

describe("parseToDate", () => {
  describe("brazilianDate format", () => {
    it("should parse Brazilian date to Date object", () => {
      const result = parseToDate(["25/12/2023", "15:30:00"], "brazilianDate");
      expect(result).toBeInstanceOf(Date);
      expect(result.getUTCFullYear()).toBe(2023);
      expect(result.getUTCMonth()).toBe(11); // December is month 11
      expect(result.getUTCDate()).toBe(25);
      expect(result.getUTCHours()).toBe(15);
      expect(result.getUTCMinutes()).toBe(30);
      expect(result.getUTCSeconds()).toBe(0);
    });

    it("should parse Brazilian date without time", () => {
      const result = parseToDate(["25/12/2023"], "brazilianDate");
      expect(result.getUTCFullYear()).toBe(2023);
      expect(result.getUTCMonth()).toBe(11);
      expect(result.getUTCDate()).toBe(25);
      expect(result.getUTCHours()).toBe(0);
      expect(result.getUTCMinutes()).toBe(0);
      expect(result.getUTCSeconds()).toBe(0);
    });

    it("should parse Brazilian date with single-digit day and month", () => {
      const result = parseToDate(["5/6/2023"], "brazilianDate");
      expect(result.getUTCMonth()).toBe(5); // June is month 5
      expect(result.getUTCDate()).toBe(5);
    });

    it("should parse Brazilian date at midnight", () => {
      const result = parseToDate(["01/01/2024", "00:00:00"], "brazilianDate");
      expect(result.getUTCHours()).toBe(0);
      expect(result.getUTCMinutes()).toBe(0);
      expect(result.getUTCSeconds()).toBe(0);
    });

    it("should parse Brazilian date at end of day", () => {
      const result = parseToDate(["31/12/2023", "23:59:59"], "brazilianDate");
      expect(result.getUTCHours()).toBe(23);
      expect(result.getUTCMinutes()).toBe(59);
      expect(result.getUTCSeconds()).toBe(59);
    });
  });

  describe("isoDate format", () => {
    it("should parse ISO date to Date object", () => {
      const result = parseToDate(["12-25-2023", "15:30:00"], "isoDate");
      expect(result).toBeInstanceOf(Date);
      expect(result.getUTCFullYear()).toBe(2023);
      expect(result.getUTCMonth()).toBe(11);
      expect(result.getUTCDate()).toBe(25);
      expect(result.getUTCHours()).toBe(15);
      expect(result.getUTCMinutes()).toBe(30);
    });

    it("should parse ISO date without time", () => {
      const result = parseToDate(["12-25-2023"], "isoDate");
      expect(result.getUTCFullYear()).toBe(2023);
      expect(result.getUTCMonth()).toBe(11);
      expect(result.getUTCDate()).toBe(25);
      expect(result.getUTCHours()).toBe(0);
      expect(result.getUTCMinutes()).toBe(0);
    });

    it("should parse ISO date with single-digit day and month", () => {
      const result = parseToDate(["6-5-2023"], "isoDate");
      expect(result.getUTCMonth()).toBe(5); // June is month 5
      expect(result.getUTCDate()).toBe(5);
    });
  });

  describe("timezone adjustments", () => {
    it("should apply positive timezone offset", () => {
      const result = parseToDate(
        ["25/12/2023", "12:00:00"],
        "brazilianDate",
        3,
      );
      const utcHours = result.getUTCHours();
      expect(utcHours).toBe(15); // 12 + 3
    });

    it("should apply negative timezone offset", () => {
      const result = parseToDate(
        ["25/12/2023", "15:00:00"],
        "brazilianDate",
        -3,
      );

      const utcHours = result.getUTCHours();
      expect(utcHours).toBe(12); // 15 - 3
    });

    it("should use default timezone (0) when not provided", () => {
      const result = parseToDate(["25/12/2023", "12:00:00"], "brazilianDate");
      const utcHours = result.getUTCHours();
      expect(utcHours).toBe(12);
    });

    it("should handle timezone that changes the day", () => {
      const result = parseToDate(
        ["31/12/2023", "23:00:00"],
        "brazilianDate",
        2,
      );
      expect(result.getUTCDate()).toBe(1); // Crosses to next day
      expect(result.getUTCMonth()).toBe(0); // January
      expect(result.getUTCFullYear()).toBe(2024);
    });

    it("should handle timezone that crosses to previous day", () => {
      const result = parseToDate(
        ["01/01/2024", "01:00:00"],
        "brazilianDate",
        -3,
      );
      expect(result.getUTCDate()).toBe(31);
      expect(result.getUTCMonth()).toBe(11); // December
      expect(result.getUTCFullYear()).toBe(2023);
    });
  });

  describe("time handling", () => {
    it("should use default time (00:00:00) when not provided", () => {
      const result = parseToDate(["25/12/2023"], "brazilianDate");
      expect(result.getUTCHours()).toBe(0);
      expect(result.getUTCMinutes()).toBe(0);
      expect(result.getUTCSeconds()).toBe(0);
    });

    it("should handle time with milliseconds", () => {
      const result = parseToDate(
        ["25/12/2023", "15:30:45.123"],
        "brazilianDate",
      );
      expect(result.getUTCHours()).toBe(15);
      expect(result.getUTCMinutes()).toBe(30);
      expect(result.getUTCSeconds()).toBe(45);
    });

    it("should handle partial time (hours and minutes only)", () => {
      const result = parseToDate(["25/12/2023", "15:30"], "brazilianDate");
      expect(result.getUTCHours()).toBe(15);
      expect(result.getUTCMinutes()).toBe(30);
      expect(result.getUTCSeconds()).toBe(0);
    });

    it("should handle single digit hours and minutes", () => {
      const result = parseToDate(["25/12/2023", "5:5:5"], "brazilianDate");
      expect(result.getUTCHours()).toBe(5);
      expect(result.getUTCMinutes()).toBe(5);
      expect(result.getUTCSeconds()).toBe(5);
    });
  });

  describe("edge cases", () => {
    it("should handle leap year date", () => {
      const result = parseToDate(["29/02/2024"], "brazilianDate");
      expect(result.getUTCDate()).toBe(29);
      expect(result.getUTCMonth()).toBe(1); // February
      expect(result.getUTCFullYear()).toBe(2024);
    });

    it("should handle first day of year", () => {
      const result = parseToDate(["01/01/2023"], "brazilianDate");
      expect(result.getUTCDate()).toBe(1);
      expect(result.getUTCMonth()).toBe(0);
    });

    it("should handle last day of year", () => {
      const result = parseToDate(["31/12/2023"], "brazilianDate");
      expect(result.getUTCDate()).toBe(31);
      expect(result.getUTCMonth()).toBe(11);
    });

    it("should handle midnight time", () => {
      const result = parseToDate(["25/12/2023", "00:00:00"], "brazilianDate");
      expect(result.getUTCHours()).toBe(0);
      expect(result.getUTCMinutes()).toBe(0);
      expect(result.getUTCSeconds()).toBe(0);
    });

    it("should handle end of day time", () => {
      const result = parseToDate(["25/12/2023", "23:59:59"], "brazilianDate");
      expect(result.getUTCHours()).toBe(23);
      expect(result.getUTCMinutes()).toBe(59);
      expect(result.getUTCSeconds()).toBe(59);
    });
  });

  describe("error handling", () => {
    it("should throw error for invalid input format", () => {
      expect(() => {
        // @ts-expect-error - Testing invalid format
        parseToDate(["25/12/2023"], "invalidFormat");
      }).toThrow("Invalid input format");
    });

    it("should throw error for Brazilian date with invalid year", () => {
      expect(() => {
        parseToDate(["25/12/23"], "brazilianDate");
      }).toThrow("Year should be four digits");
    });

    it("should throw error for Brazilian date with invalid month", () => {
      expect(() => {
        parseToDate(["25/13/2023"], "brazilianDate");
      }).toThrow("Month should be between 1 and 12");
    });

    it("should throw error for Brazilian date with invalid day", () => {
      expect(() => {
        parseToDate(["32/12/2023"], "brazilianDate");
      }).toThrow("Day should be between 1 and 31");
    });

    it("should throw error for day 30 in February", () => {
      expect(() => {
        parseToDate(["30/02/2023"], "brazilianDate");
      }).toThrow("Day 30 is not valid for February");
    });

    it("should throw error for day 31 in April", () => {
      expect(() => {
        parseToDate(["31/04/2023"], "brazilianDate");
      }).toThrow("Day 31 is not valid for April");
    });

    it("should throw error for February 29 in non-leap year", () => {
      expect(() => {
        parseToDate(["29/02/2023"], "brazilianDate");
      }).toThrow("Day 29 is not valid for February 2023 (non-leap year)");
    });

    it("should throw error for ISO date with invalid month", () => {
      expect(() => {
        parseToDate(["13-25-2023"], "isoDate");
      }).toThrow("Month should be between 1 and 12");
    });

    it("should throw error for ISO date with invalid day", () => {
      expect(() => {
        parseToDate(["12-32-2023"], "isoDate");
      }).toThrow("Day should be between 1 and 31");
    });
  });

  describe("return type validation", () => {
    it("should return a valid Date instance", () => {
      const result = parseToDate(["25/12/2023"], "brazilianDate");
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).not.toBeNaN();
    });

    it("should return different Date instances for different inputs", () => {
      const date1 = parseToDate(["25/12/2023"], "brazilianDate");
      const date2 = parseToDate(["26/12/2023"], "brazilianDate");
      expect(date1.getTime()).not.toBe(date2.getTime());
    });

    it("should return Date with correct timestamp", () => {
      const result = parseToDate(["01/01/2024", "00:00:00"], "brazilianDate");
      expect(typeof result.getTime()).toBe("number");
      expect(result.getTime()).toBeGreaterThan(0);
    });
  });
});
