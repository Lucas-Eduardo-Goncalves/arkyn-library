import { describe, expect, it } from "vitest";
import { formatDate } from "../formatDate";

describe("formatDate", () => {
  describe("brazilianDate format", () => {
    it("should format Brazilian date to ISO format", () => {
      const result = formatDate(
        ["25/12/2023", "15:30:00"],
        "brazilianDate",
        "YYYY-MM-DD hh:mm:ss",
      );

      expect(result).toBe("2023-12-25 12:30:00");
    });

    it("should format Brazilian date without time", () => {
      const result = formatDate(["25/12/2023"], "brazilianDate", "YYYY-MM-DD");
      expect(result).toBe("2023-12-25");
    });

    it("should format Brazilian date to custom format", () => {
      const result = formatDate(
        ["01/01/2024", "08:15:30"],
        "brazilianDate",
        "DD/MM/YYYY hh:mm",
      );

      expect(result).toBe("01/01/2024 08:15");
    });

    it("should format Brazilian date with single-digit month", () => {
      const result = formatDate(["15/6/2023"], "brazilianDate", "DD/MM/YYYY");
      expect(result).toBe("15/06/2023");
    });

    it("should format Brazilian date with single-digit day", () => {
      const result = formatDate(["5/06/2023"], "brazilianDate", "DD/MM/YYYY");
      expect(result).toBe("05/06/2023");
    });
  });

  describe("isoDate format", () => {
    it("should format ISO date to Brazilian format", () => {
      const result = formatDate(
        ["12-25-2023", "15:30:00"],
        "isoDate",
        "DD/MM/YYYY hh:mm:ss",
      );

      expect(result).toBe("25/12/2023 15:30:00");
    });

    it("should format ISO date without time", () => {
      const result = formatDate(["12-25-2023"], "isoDate", "DD/MM/YYYY");
      expect(result).toBe("25/12/2023");
    });

    it("should format ISO date to custom format", () => {
      const result = formatDate(
        ["03-15-2024", "22:45:10"],
        "isoDate",
        "YYYY/MM/DD hh:mm:ss",
      );

      expect(result).toBe("2024/03/15 22:45:10");
    });

    it("should format isoDate date with single-digit month", () => {
      const result = formatDate(["06-15-2023"], "isoDate", "DD/MM/YYYY");
      expect(result).toBe("15/06/2023");
    });

    it("should format isoDate date with single-digit day", () => {
      const result = formatDate(["06-05-2023"], "isoDate", "DD/MM/YYYY");
      expect(result).toBe("05/06/2023");
    });
  });

  describe("timestamp format", () => {
    it("should format timestamp date to Brazilian format", () => {
      const result = formatDate(
        ["2023-12-25", "15:30:00"],
        "timestamp",
        "DD/MM/YYYY hh:mm:ss",
      );

      expect(result).toBe("25/12/2023 15:30:00");
    });

    it("should format timestamp date without time", () => {
      const result = formatDate(["2023-12-25"], "timestamp", "DD/MM/YYYY");
      expect(result).toBe("25/12/2023");
    });

    it("should format timestamp date to custom format", () => {
      const result = formatDate(
        ["2024-03-15", "22:45:10"],
        "timestamp",
        "YYYY/MM/DD hh:mm:ss",
      );

      expect(result).toBe("2024/03/15 22:45:10");
    });

    it("should format timestamp date with single-digit month", () => {
      const result = formatDate(["2023-06-15"], "timestamp", "DD/MM/YYYY");
      expect(result).toBe("15/06/2023");
    });

    it("should format timestamp date with single-digit day", () => {
      const result = formatDate(["2023-06-05"], "timestamp", "DD/MM/YYYY");
      expect(result).toBe("05/06/2023");
    });
  });

  describe("timezone adjustments", () => {
    it("should apply positive timezone offset", () => {
      const result = formatDate(
        ["12-25-2023", "12:00:00"],
        "isoDate",
        "YYYY-MM-DD hh:mm:ss",
        3,
      );

      expect(result).toBe("2023-12-25 15:00:00");
    });

    it("should apply negative timezone offset", () => {
      const result = formatDate(
        ["2023-12-25", "15:00:00"],
        "timestamp",
        "DD/MM/YYYY hh:mm:ss",
        -3,
      );

      expect(result).toBe("25/12/2023 12:00:00");
    });

    it("should handle timezone that changes the day", () => {
      const result = formatDate(
        ["12-31-2023", "23:00:00"],
        "isoDate",
        "YYYY-MM-DD hh:mm:ss",
        2,
      );

      expect(result).toBe("2024-01-01 01:00:00");
    });

    it("should use default timezone (0) when not provided", () => {
      const result = formatDate(
        ["12-25-2023", "12:00:00"],
        "isoDate",
        "YYYY-MM-DD hh:mm:ss",
      );

      expect(result).toBe("2023-12-25 12:00:00");
    });
  });

  describe("time handling", () => {
    it("should use default time (00:00:00) when not provided", () => {
      const result = formatDate(
        ["12-25-2023"],
        "isoDate",
        "YYYY-MM-DD hh:mm:ss",
      );

      expect(result).toBe("2023-12-25 00:00:00");
    });

    it("should handle time with milliseconds", () => {
      const result = formatDate(
        ["12-25-2023", "15:30:45.123"],
        "isoDate",
        "YYYY-MM-DD hh:mm:ss",
      );

      expect(result).toBe("2023-12-25 15:30:45");
    });

    it("should handle partial time (hours and minutes only)", () => {
      const result = formatDate(
        ["12-25-2023", "15:30"],
        "isoDate",
        "YYYY-MM-DD hh:mm:ss",
      );

      expect(result).toBe("2023-12-25 15:30:00");
    });

    it("should handle single digit hours and minutes", () => {
      const result = formatDate(
        ["12-25-2023", "5:5:5"],
        "isoDate",
        "YYYY-MM-DD hh:mm:ss",
      );

      expect(result).toBe("2023-12-25 05:05:05");
    });
  });

  describe("output format variations", () => {
    it("should format with only date components", () => {
      const result = formatDate(
        ["12-25-2023", "15:30:00"],
        "isoDate",
        "YYYY-MM-DD",
      );

      expect(result).toBe("2023-12-25");
    });

    it("should format with only time components", () => {
      const result = formatDate(
        ["12-25-2023", "15:30:45"],
        "isoDate",
        "hh:mm:ss",
      );

      expect(result).toBe("15:30:45");
    });

    it("should format with custom separators", () => {
      const result = formatDate(
        ["12-25-2023", "15:30:00"],
        "isoDate",
        "YYYY.MM.DD - hh:mm:ss",
      );

      expect(result).toBe("2023.12.25 - 15:30:00");
    });

    it("should format with text in between", () => {
      const result = formatDate(
        ["12-25-2023", "15:30:00"],
        "isoDate",
        "DD de MM de YYYY às hh:mm",
      );

      expect(result).toBe("25 de 12 de 2023 às 15:30");
    });
  });

  describe("edge cases", () => {
    it("should handle leap year date", () => {
      const result = formatDate(["29/02/2024"], "brazilianDate", "YYYY-MM-DD");
      expect(result).toBe("2024-02-29");
    });

    it("should handle first day of year", () => {
      const result = formatDate(["01/01/2023"], "brazilianDate", "YYYY-MM-DD");
      expect(result).toBe("2023-01-01");
    });

    it("should handle last day of year", () => {
      const result = formatDate(["31/12/2023"], "brazilianDate", "YYYY-MM-DD");
      expect(result).toBe("2023-12-31");
    });

    it("should handle midnight time", () => {
      const result = formatDate(
        ["12-25-2023", "00:00:00"],
        "isoDate",
        "YYYY-MM-DD hh:mm:ss",
      );
      expect(result).toBe("2023-12-25 00:00:00");
    });

    it("should handle end of day time", () => {
      const result = formatDate(
        ["12-25-2023", "23:59:59"],
        "isoDate",
        "YYYY-MM-DD hh:mm:ss",
      );
      expect(result).toBe("2023-12-25 23:59:59");
    });
  });

  describe("error handling", () => {
    it("Brazilian dates shouldn't be formatted with years that are not four digits long.", () => {
      expect(() => {
        formatDate(["25/12/2"], "brazilianDate", "YYYY-MM-DD");
      }).toThrow("Year should be four digits");

      expect(() => {
        formatDate(["25/12/12"], "brazilianDate", "YYYY-MM-DD");
      }).toThrow("Year should be four digits");

      expect(() => {
        formatDate(["25/12/123"], "brazilianDate", "YYYY-MM-DD");
      }).toThrow("Year should be four digits");

      expect(() => {
        formatDate(["25/12/12345"], "brazilianDate", "YYYY-MM-DD");
      }).toThrow("Year should be four digits");
    });

    it("Brazilian dates shouldn't be formatted with months outside the 1-12 range.", () => {
      expect(() => {
        formatDate(["25/0/2023"], "brazilianDate", "YYYY-MM-DD");
      }).toThrow("Month should be between 1 and 12");

      expect(() => {
        formatDate(["25/13/2023"], "brazilianDate", "YYYY-MM-DD");
      }).toThrow("Month should be between 1 and 12");
    });

    it("Brazilian dates shouldn't be formatted with days outside the 1-31 range.", () => {
      expect(() => {
        formatDate(["0/12/2023"], "brazilianDate", "YYYY-MM-DD");
      }).toThrow("Day should be between 1 and 31");

      expect(() => {
        formatDate(["32/12/2023"], "brazilianDate", "YYYY-MM-DD");
      }).toThrow("Day should be between 1 and 31");
    });

    it("should throw error for invalid input format", () => {
      expect(() => {
        // @ts-expect-error - Testing invalid format
        formatDate(["2023-12-25"], "invalidFormat", "YYYY-MM-DD");
      }).toThrow("Invalid input format: invalidFormat");
    });

    it("should throw error for invalid day in ISO date", () => {
      expect(() => {
        formatDate(["02-30-2023"], "isoDate", "YYYY-MM-DD");
      }).toThrow("Day 30 is not valid for February");
    });

    it("should throw error for non-leap year February 29th", () => {
      expect(() => {
        formatDate(["29/02/2023"], "brazilianDate", "YYYY-MM-DD");
      }).toThrow("Day 29 is not valid for February");
    });
  });
});
