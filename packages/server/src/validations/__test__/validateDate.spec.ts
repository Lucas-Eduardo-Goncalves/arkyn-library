import { describe, expect, it } from "vitest";
import { validateDate } from "../validateDate";

describe("validateDate", () => {
	describe("valid Brazilian date format", () => {
		it("should validate date with default brazilianDate format", () => {
			const result = validateDate("31/12/2023");
			expect(result).toBe(true);
		});

		it("should validate date with explicit brazilianDate format", () => {
			const result = validateDate("25/12/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should validate date with single digit day", () => {
			const result = validateDate("5/12/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should validate date with single digit month", () => {
			const result = validateDate("25/6/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should validate date with single digit day and month", () => {
			const result = validateDate("5/6/2023", { inputFormat: "brazilianDate" });
			expect(result).toBe(true);
		});

		it("should validate first day of year", () => {
			const result = validateDate("01/01/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should validate last day of year", () => {
			const result = validateDate("31/12/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});
	});

	describe("valid ISO date format", () => {
		it("should validate ISO date format", () => {
			const result = validateDate("12-31-2023", { inputFormat: "isoDate" });
			expect(result).toBe(true);
		});

		it("should validate ISO date with single digit month", () => {
			const result = validateDate("6-25-2023", { inputFormat: "isoDate" });
			expect(result).toBe(true);
		});

		it("should validate ISO date with single digit day", () => {
			const result = validateDate("12-5-2023", { inputFormat: "isoDate" });
			expect(result).toBe(true);
		});

		it("should validate ISO date with single digits", () => {
			const result = validateDate("6-5-2023", { inputFormat: "isoDate" });
			expect(result).toBe(true);
		});
	});

	describe("valid timestamp format", () => {
		it("should validate timestamp format", () => {
			const result = validateDate("2023-12-31", { inputFormat: "timestamp" });
			expect(result).toBe(true);
		});

		it("should validate timestamp with single digit month", () => {
			const result = validateDate("2023-6-25", { inputFormat: "timestamp" });
			expect(result).toBe(true);
		});

		it("should validate timestamp with single digit day", () => {
			const result = validateDate("2023-12-5", { inputFormat: "timestamp" });
			expect(result).toBe(true);
		});

		it("should validate timestamp with single digits", () => {
			const result = validateDate("2023-6-5", { inputFormat: "timestamp" });
			expect(result).toBe(true);
		});
	});

	describe("leap year validation", () => {
		it("should validate February 29 on leap year", () => {
			const result = validateDate("29/02/2024", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should reject February 29 on non-leap year", () => {
			const result = validateDate("29/02/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(false);
		});

		it("should validate February 28 on non-leap year", () => {
			const result = validateDate("28/02/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should validate leap year 2000", () => {
			const result = validateDate("29/02/2000", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should reject leap year exception 1900", () => {
			const result = validateDate("29/02/1900", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(false);
		});
	});

	describe("month validation", () => {
		it("should reject invalid month 0", () => {
			const result = validateDate("15/0/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(false);
		});

		it("should reject invalid month 13", () => {
			const result = validateDate("15/13/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(false);
		});

		it("should validate month 1 (January)", () => {
			const result = validateDate("15/1/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should validate month 12 (December)", () => {
			const result = validateDate("15/12/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});
	});

	describe("day validation for months with 31 days", () => {
		it("should validate January 31", () => {
			const result = validateDate("31/01/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should validate March 31", () => {
			const result = validateDate("31/03/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should validate May 31", () => {
			const result = validateDate("31/05/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should validate July 31", () => {
			const result = validateDate("31/07/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should validate August 31", () => {
			const result = validateDate("31/08/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should validate October 31", () => {
			const result = validateDate("31/10/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should validate December 31", () => {
			const result = validateDate("31/12/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});
	});

	describe("day validation for months with 30 days", () => {
		it("should validate April 30", () => {
			const result = validateDate("30/04/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should reject April 31", () => {
			const result = validateDate("31/04/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(false);
		});

		it("should validate June 30", () => {
			const result = validateDate("30/06/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should reject June 31", () => {
			const result = validateDate("31/06/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(false);
		});

		it("should validate September 30", () => {
			const result = validateDate("30/09/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should reject September 31", () => {
			const result = validateDate("31/09/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(false);
		});

		it("should validate November 30", () => {
			const result = validateDate("30/11/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should reject November 31", () => {
			const result = validateDate("31/11/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(false);
		});
	});

	describe("year range validation", () => {
		it("should validate date within default year range", () => {
			const result = validateDate("15/06/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should validate minimum year (1900)", () => {
			const result = validateDate("15/06/1900", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should validate maximum year (3000)", () => {
			const result = validateDate("15/06/3000", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should reject year below minimum", () => {
			const result = validateDate("15/06/1899", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(false);
		});

		it("should reject year above maximum", () => {
			const result = validateDate("15/06/3001", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(false);
		});

		it("should validate custom minimum year", () => {
			const result = validateDate("15/06/2000", {
				inputFormat: "brazilianDate",
				minYear: 2000,
			});
			expect(result).toBe(true);
		});

		it("should reject date below custom minimum year", () => {
			const result = validateDate("15/06/1999", {
				inputFormat: "brazilianDate",
				minYear: 2000,
			});
			expect(result).toBe(false);
		});

		it("should validate custom maximum year", () => {
			const result = validateDate("15/06/2100", {
				inputFormat: "brazilianDate",
				maxYear: 2100,
			});
			expect(result).toBe(true);
		});

		it("should reject date above custom maximum year", () => {
			const result = validateDate("15/06/2101", {
				inputFormat: "brazilianDate",
				maxYear: 2100,
			});
			expect(result).toBe(false);
		});

		it("should validate with both custom min and max years", () => {
			const result = validateDate("15/06/2050", {
				inputFormat: "brazilianDate",
				minYear: 2000,
				maxYear: 2100,
			});
			expect(result).toBe(true);
		});
	});

	describe("invalid date formats", () => {
		it("should reject date with letters", () => {
			const result = validateDate("AB/CD/EFGH", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(false);
		});

		it("should reject date with special characters", () => {
			const result = validateDate("@@/##/$$$$", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(false);
		});

		it("should reject incomplete date", () => {
			const result = validateDate("15/06", { inputFormat: "brazilianDate" });
			expect(result).toBe(false);
		});

		it("should reject date with extra parts", () => {
			const result = validateDate("15/06/2023/01", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(false);
		});

		it("should reject empty string", () => {
			const result = validateDate("", { inputFormat: "brazilianDate" });
			expect(result).toBe(false);
		});

		it("should reject whitespace", () => {
			const result = validateDate("   ", { inputFormat: "brazilianDate" });
			expect(result).toBe(false);
		});
	});

	describe("invalid day validation", () => {
		it("should reject day 0", () => {
			const result = validateDate("0/06/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(false);
		});

		it("should reject day 32", () => {
			const result = validateDate("32/06/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(false);
		});

		it("should reject negative day", () => {
			const result = validateDate("-1/06/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(false);
		});
	});

	describe("edge cases", () => {
		it("should reject February 30", () => {
			const result = validateDate("30/02/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(false);
		});

		it("should reject February 31", () => {
			const result = validateDate("31/02/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(false);
		});

		it("should validate date with leading zeros", () => {
			const result = validateDate("01/01/2023", {
				inputFormat: "brazilianDate",
			});
			expect(result).toBe(true);
		});

		it("should handle date at year boundary", () => {
			const result = validateDate("31/12/2099", {
				inputFormat: "brazilianDate",
				maxYear: 2099,
			});
			expect(result).toBe(true);
		});

		it("should handle date at minimum year boundary", () => {
			const result = validateDate("01/01/2000", {
				inputFormat: "brazilianDate",
				minYear: 2000,
			});
			expect(result).toBe(true);
		});
	});

	describe("format consistency", () => {
		it("should validate same date in different formats", () => {
			const brazilian = validateDate("31/12/2023", {
				inputFormat: "brazilianDate",
			});
			const iso = validateDate("12-31-2023", { inputFormat: "isoDate" });
			const timestamp = validateDate("2023-12-31", {
				inputFormat: "timestamp",
			});

			expect(brazilian).toBe(true);
			expect(iso).toBe(true);
			expect(timestamp).toBe(true);
		});
	});
});
