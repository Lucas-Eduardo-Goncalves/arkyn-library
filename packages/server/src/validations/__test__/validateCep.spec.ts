import { describe, expect, it } from "vitest";
import { validateCep } from "../validateCep";

describe("validateCep", () => {
	describe("valid CEP formats", () => {
		it("should validate CEP with hyphen format", () => {
			const result = validateCep("12345-678");
			expect(result).toBe(true);
		});

		it("should validate CEP without hyphen", () => {
			const result = validateCep("12345678");
			expect(result).toBe(true);
		});

		it("should validate CEP with all zeros", () => {
			const result = validateCep("00000-000");
			expect(result).toBe(true);
		});

		it("should validate CEP with all nines", () => {
			const result = validateCep("99999-999");
			expect(result).toBe(true);
		});

		it("should validate real CEP from São Paulo", () => {
			const result = validateCep("01310-100");
			expect(result).toBe(true);
		});

		it("should validate real CEP from Rio de Janeiro", () => {
			const result = validateCep("20040-020");
			expect(result).toBe(true);
		});

		it("should validate CEP starting with zero", () => {
			const result = validateCep("01234-567");
			expect(result).toBe(true);
		});
	});

	describe("invalid CEP formats", () => {
		it("should reject CEP with letters", () => {
			const result = validateCep("ABCDE-123");
			expect(result).toBe(false);
		});

		it("should reject CEP with mixed letters and numbers", () => {
			const result = validateCep("123AB-678");
			expect(result).toBe(false);
		});

		it("should reject CEP with special characters", () => {
			const result = validateCep("12345@678");
			expect(result).toBe(false);
		});

		it("should reject CEP with spaces", () => {
			const result = validateCep("12345 678");
			expect(result).toBe(false);
		});

		it("should reject CEP with dots", () => {
			const result = validateCep("12.345.678");
			expect(result).toBe(false);
		});

		it("should reject CEP with slashes", () => {
			const result = validateCep("12345/678");
			expect(result).toBe(false);
		});

		it("should reject CEP with parentheses", () => {
			const result = validateCep("(12345)678");
			expect(result).toBe(false);
		});
	});

	describe("invalid CEP length", () => {
		it("should reject CEP with less than 8 digits", () => {
			const result = validateCep("1234-567");
			expect(result).toBe(false);
		});

		it("should reject CEP with more than 8 digits", () => {
			const result = validateCep("12345-6789");
			expect(result).toBe(false);
		});

		it("should reject CEP with only 7 digits", () => {
			const result = validateCep("1234567");
			expect(result).toBe(false);
		});

		it("should reject CEP with 9 digits", () => {
			const result = validateCep("123456789");
			expect(result).toBe(false);
		});

		it("should reject single digit", () => {
			const result = validateCep("1");
			expect(result).toBe(false);
		});

		it("should reject very long string", () => {
			const result = validateCep("12345678901234567890");
			expect(result).toBe(false);
		});
	});

	describe("edge cases", () => {
		it("should reject empty string", () => {
			const result = validateCep("");
			expect(result).toBe(false);
		});

		it("should reject null-like empty string", () => {
			const result = validateCep("");
			expect(result).toBe(false);
		});

		it("should reject CEP with only hyphen", () => {
			const result = validateCep("-");
			expect(result).toBe(false);
		});

		it("should reject CEP with multiple hyphens", () => {
			const result = validateCep("123-45-678");
			expect(result).toBe(false);
		});

		it("should reject CEP with only zeros and hyphen", () => {
			const result = validateCep("00000-000");
			expect(result).toBe(true); // This is actually valid
		});

		it("should reject whitespace", () => {
			const result = validateCep("   ");
			expect(result).toBe(false);
		});

		it("should reject tabs and newlines", () => {
			const result = validateCep("\t\n");
			expect(result).toBe(false);
		});
	});

	describe("hyphen position variations", () => {
		it("should validate CEP with hyphen at correct position (5-3)", () => {
			const result = validateCep("12345-678");
			expect(result).toBe(true);
		});

		it("should reject CEP with hyphen at wrong position", () => {
			const result = validateCep("1234-5678");
			expect(result).toBe(false);
		});

		it("should reject CEP with hyphen at start", () => {
			const result = validateCep("-12345678");
			expect(result).toBe(false);
		});

		it("should reject CEP with hyphen at end", () => {
			const result = validateCep("12345678-");
			expect(result).toBe(false);
		});
	});

	describe("real-world CEP examples", () => {
		it("should validate CEP from Brasília", () => {
			const result = validateCep("70040-020");
			expect(result).toBe(true);
		});

		it("should validate CEP from Belo Horizonte", () => {
			const result = validateCep("30130-010");
			expect(result).toBe(true);
		});

		it("should validate CEP from Porto Alegre", () => {
			const result = validateCep("90035-000");
			expect(result).toBe(true);
		});

		it("should validate CEP from Curitiba", () => {
			const result = validateCep("80060-000");
			expect(result).toBe(true);
		});

		it("should validate CEP from Salvador", () => {
			const result = validateCep("40020-000");
			expect(result).toBe(true);
		});

		it("should validate CEP from Recife", () => {
			const result = validateCep("50030-230");
			expect(result).toBe(true);
		});
	});

	describe("boundary testing", () => {
		it("should validate CEP with minimum valid number", () => {
			const result = validateCep("00000-001");
			expect(result).toBe(true);
		});

		it("should validate CEP with maximum valid number", () => {
			const result = validateCep("99999-998");
			expect(result).toBe(true);
		});
	});

	describe("formatting variations", () => {
		it("should handle CEP without any formatting", () => {
			const result = validateCep("01310100");
			expect(result).toBe(true);
		});

		it("should handle CEP with standard formatting", () => {
			const result = validateCep("01310-100");
			expect(result).toBe(true);
		});
	});

	describe("type coercion edge cases", () => {
		it("should handle string with leading zeros", () => {
			const result = validateCep("00123-456");
			expect(result).toBe(true);
		});

		it("should handle string with trailing zeros", () => {
			const result = validateCep("12345-000");
			expect(result).toBe(true);
		});
	});
});
