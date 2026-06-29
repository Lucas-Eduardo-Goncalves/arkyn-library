import { describe, expect, it } from "vitest";
import { formatToCep } from "../formatToCep";

describe("formatToCep", () => {
	describe("valid CEP formatting", () => {
		it("should format a valid 8-digit CEP", () => {
			const result = formatToCep("12345678");
			expect(result).toBe("12345-678");
		});

		it("should format a CEP that already has the hyphen", () => {
			const result = formatToCep("12345-678");
			expect(result).toBe("12345-678");
		});

		it("should format a CEP with dots", () => {
			const result = formatToCep("12.345.678");
			expect(result).toBe("12345-678");
		});

		it("should format a CEP with spaces", () => {
			const result = formatToCep("12 345 678");
			expect(result).toBe("12345-678");
		});

		it("should format a CEP with mixed special characters", () => {
			const result = formatToCep("12.345-678");
			expect(result).toBe("12345-678");
		});

		it("should format a CEP with parentheses", () => {
			const result = formatToCep("(12345)678");
			expect(result).toBe("12345-678");
		});

		it("should format a CEP with slashes", () => {
			const result = formatToCep("12345/678");
			expect(result).toBe("12345-678");
		});

		it("should format a real CEP from São Paulo", () => {
			const result = formatToCep("01310100");
			expect(result).toBe("01310-100");
		});

		it("should format a real CEP from Rio de Janeiro", () => {
			const result = formatToCep("20040020");
			expect(result).toBe("20040-020");
		});

		it("should format a CEP starting with zero", () => {
			const result = formatToCep("01234567");
			expect(result).toBe("01234-567");
		});
	});

	describe("error handling", () => {
		it("should throw error for CEP with less than 8 digits", () => {
			expect(() => {
				formatToCep("1234567");
			}).toThrow("CEP must be contain 8 numeric digits: 1234567");
		});

		it("should throw error for CEP with more than 8 numeric digits", () => {
			expect(() => {
				formatToCep("123456789");
			}).toThrow("CEP must be contain 8 numeric digits: 123456789");
		});

		it("should throw error for empty string", () => {
			expect(() => {
				formatToCep("");
			}).toThrow("CEP must be contain 8 numeric digits: ");
		});

		it("should throw error for only special characters", () => {
			expect(() => {
				formatToCep("---...///");
			}).toThrow("CEP must be contain 8 numeric digits: ---...///");
		});

		it("should throw error for letters only", () => {
			expect(() => {
				formatToCep("abcdefgh");
			}).toThrow("CEP must be contain 8 numeric digits: abcdefgh");
		});

		it("should throw error for mixed letters and numbers", () => {
			expect(() => {
				formatToCep("12345abc");
			}).toThrow("CEP must be contain 8 numeric digits: 12345abc");
		});

		it("should throw error for CEP with only 1 digit", () => {
			expect(() => {
				formatToCep("1");
			}).toThrow("CEP must be contain 8 numeric digits: 1");
		});

		it("should throw error for CEP with only 5 digits", () => {
			expect(() => {
				formatToCep("12345");
			}).toThrow("CEP must be contain 8 numeric digits: 12345");
		});
	});

	describe("edge cases", () => {
		it("should handle CEP with leading zeros", () => {
			const result = formatToCep("00000000");
			expect(result).toBe("00000-000");
		});

		it("should handle CEP with all nines", () => {
			const result = formatToCep("99999999");
			expect(result).toBe("99999-999");
		});

		it("should handle CEP with multiple hyphens", () => {
			const result = formatToCep("12-34-5-678");
			expect(result).toBe("12345-678");
		});

		it("should handle CEP with Unicode characters", () => {
			const result = formatToCep("12345★678");
			expect(result).toBe("12345-678");
		});

		it("should handle CEP with tabs and newlines", () => {
			const result = formatToCep("12345\t678\n");
			expect(result).toBe("12345-678");
		});
	});
});
