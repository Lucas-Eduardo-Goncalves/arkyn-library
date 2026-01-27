import { describe, it, expect, beforeEach } from "vitest";
import { ValidateDateService } from "../validateDateService";

describe("ValidateDateService", () => {
  let service: ValidateDateService;

  beforeEach(() => {
    service = new ValidateDateService();
  });

  describe("validateDateParts", () => {
    describe("Valid dates", () => {
      it("should validate a valid date", () => {
        expect(() => service.validateDateParts(2024, 1, 15)).not.toThrow();
      });

      it("should validate first day of month", () => {
        expect(() => service.validateDateParts(2024, 1, 1)).not.toThrow();
      });

      it("should validate last day of month", () => {
        expect(() => service.validateDateParts(2024, 1, 31)).not.toThrow();
      });

      it("should validate February 29 in leap year", () => {
        expect(() => service.validateDateParts(2024, 2, 29)).not.toThrow();
      });

      it("should validate all months with correct days", () => {
        expect(() => service.validateDateParts(2024, 1, 31)).not.toThrow(); // January
        expect(() => service.validateDateParts(2024, 3, 31)).not.toThrow(); // March
        expect(() => service.validateDateParts(2024, 4, 30)).not.toThrow(); // April
        expect(() => service.validateDateParts(2024, 5, 31)).not.toThrow(); // May
        expect(() => service.validateDateParts(2024, 6, 30)).not.toThrow(); // June
        expect(() => service.validateDateParts(2024, 7, 31)).not.toThrow(); // July
        expect(() => service.validateDateParts(2024, 8, 31)).not.toThrow(); // August
        expect(() => service.validateDateParts(2024, 9, 30)).not.toThrow(); // September
        expect(() => service.validateDateParts(2024, 10, 31)).not.toThrow(); // October
        expect(() => service.validateDateParts(2024, 11, 30)).not.toThrow(); // November
        expect(() => service.validateDateParts(2024, 12, 31)).not.toThrow(); // December
      });
    });

    describe("Invalid year", () => {
      it("should throw error for year with less than 4 digits", () => {
        expect(() => service.validateDateParts(202, 1, 15)).toThrow(
          "Year should be four digits",
        );
      });

      it("should throw error for year with more than 4 digits", () => {
        expect(() => service.validateDateParts(20240, 1, 15)).toThrow(
          "Year should be four digits",
        );
      });

      it("should throw error for year with 1 digit", () => {
        expect(() => service.validateDateParts(2, 1, 15)).toThrow(
          "Year should be four digits",
        );
      });

      it("should throw error for year with 2 digits", () => {
        expect(() => service.validateDateParts(24, 1, 15)).toThrow(
          "Year should be four digits",
        );
      });

      it("should throw error for year with 3 digits", () => {
        expect(() => service.validateDateParts(202, 1, 15)).toThrow(
          "Year should be four digits",
        );
      });
    });

    describe("Invalid month", () => {
      it("should throw error for month less than 1", () => {
        expect(() => service.validateDateParts(2024, 0, 15)).toThrow(
          "Month should be between 1 and 12",
        );
      });

      it("should throw error for month greater than 12", () => {
        expect(() => service.validateDateParts(2024, 13, 15)).toThrow(
          "Month should be between 1 and 12",
        );
      });

      it("should throw error for negative month", () => {
        expect(() => service.validateDateParts(2024, -1, 15)).toThrow(
          "Month should be between 1 and 12",
        );
      });
    });

    describe("Invalid day", () => {
      it("should throw error for day less than 1", () => {
        expect(() => service.validateDateParts(2024, 1, 0)).toThrow(
          "Day should be between 1 and 31",
        );
      });

      it("should throw error for day greater than 31", () => {
        expect(() => service.validateDateParts(2024, 1, 32)).toThrow(
          "Day should be between 1 and 31",
        );
      });

      it("should throw error for negative day", () => {
        expect(() => service.validateDateParts(2024, 1, -1)).toThrow(
          "Day should be between 1 and 31",
        );
      });
    });

    describe("Invalid day for specific months", () => {
      it("should throw error for day 31 in April", () => {
        expect(() => service.validateDateParts(2024, 4, 31)).toThrow(
          "Day 31 is not valid for April",
        );
      });

      it("should throw error for day 31 in June", () => {
        expect(() => service.validateDateParts(2024, 6, 31)).toThrow(
          "Day 31 is not valid for June",
        );
      });

      it("should throw error for day 31 in September", () => {
        expect(() => service.validateDateParts(2024, 9, 31)).toThrow(
          "Day 31 is not valid for September",
        );
      });

      it("should throw error for day 31 in November", () => {
        expect(() => service.validateDateParts(2024, 11, 31)).toThrow(
          "Day 31 is not valid for November",
        );
      });

      it("should throw error for day 30 in February", () => {
        expect(() => service.validateDateParts(2024, 2, 30)).toThrow(
          "Day 30 is not valid for February",
        );
      });

      it("should throw error for day 29 in February non-leap year", () => {
        expect(() => service.validateDateParts(2023, 2, 29)).toThrow(
          "Day 29 is not valid for February 2023 (non-leap year)",
        );
      });
    });

    describe("Leap year validation", () => {
      it("should validate February 29 in leap year divisible by 4", () => {
        expect(() => service.validateDateParts(2024, 2, 29)).not.toThrow();
      });

      it("should throw error for February 29 in non-leap year", () => {
        expect(() => service.validateDateParts(2023, 2, 29)).toThrow(
          "Day 29 is not valid for February 2023 (non-leap year)",
        );
      });

      it("should throw error for February 29 in year divisible by 100 but not 400", () => {
        expect(() => service.validateDateParts(1900, 2, 29)).toThrow(
          "Day 29 is not valid for February 1900 (non-leap year)",
        );
      });

      it("should validate February 29 in year divisible by 400", () => {
        expect(() => service.validateDateParts(2000, 2, 29)).not.toThrow();
      });

      it("should validate February 28 in non-leap year", () => {
        expect(() => service.validateDateParts(2023, 2, 28)).not.toThrow();
      });
    });
  });

  describe("validateInputFormat", () => {
    it("should validate 'brazilianDate' format", () => {
      expect(() => service.validateInputFormat("brazilianDate")).not.toThrow();
    });

    it("should validate 'isoDate' format", () => {
      expect(() => service.validateInputFormat("isoDate")).not.toThrow();
    });

    it("should validate 'timestamp' format", () => {
      expect(() => service.validateInputFormat("timestamp")).not.toThrow();
    });

    it("should throw error for invalid format", () => {
      expect(() => service.validateInputFormat("invalidFormat")).toThrow(
        "Invalid input format: invalidFormat",
      );
    });

    it("should throw error for empty string", () => {
      expect(() => service.validateInputFormat("")).toThrow(
        "Invalid input format: ",
      );
    });

    it("should throw error for similar but wrong format name", () => {
      expect(() => service.validateInputFormat("BrazilianDate")).toThrow(
        "Invalid input format: BrazilianDate",
      );
    });

    it("should throw error for numeric format", () => {
      expect(() => service.validateInputFormat("123")).toThrow(
        "Invalid input format: 123",
      );
    });
  });

  describe("Edge cases", () => {
    it("should validate minimum valid year (1000)", () => {
      expect(() => service.validateDateParts(1000, 1, 1)).not.toThrow();
    });

    it("should validate maximum valid year (9999)", () => {
      expect(() => service.validateDateParts(9999, 12, 31)).not.toThrow();
    });

    it("should validate all valid days in February leap year", () => {
      for (let day = 1; day <= 29; day++) {
        expect(() => service.validateDateParts(2024, 2, day)).not.toThrow();
      }
    });

    it("should validate all valid days in February non-leap year", () => {
      for (let day = 1; day <= 28; day++) {
        expect(() => service.validateDateParts(2023, 2, day)).not.toThrow();
      }
    });
  });
});
