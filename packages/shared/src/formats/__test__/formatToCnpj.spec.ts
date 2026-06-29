import { describe, expect, it } from "vitest";
import { formatToCnpj } from "../formatToCnpj";

describe("formatToCnpj", () => {
	describe("valid CNPJ formatting", () => {
		it("should format a valid 14-digit CNPJ", () => {
			const result = formatToCnpj("12345678000195");
			expect(result).toBe("12.345.678/0001-95");
		});

		it("should format a CNPJ that already has formatting", () => {
			const result = formatToCnpj("12.345.678/0001-95");
			expect(result).toBe("12.345.678/0001-95");
		});

		it("should format a CNPJ with dots only", () => {
			const result = formatToCnpj("12.345.678.0001.95");
			expect(result).toBe("12.345.678/0001-95");
		});

		it("should format a CNPJ with spaces", () => {
			const result = formatToCnpj("12 345 678 0001 95");
			expect(result).toBe("12.345.678/0001-95");
		});

		it("should format a CNPJ with mixed special characters", () => {
			const result = formatToCnpj("12.345.678-0001/95");
			expect(result).toBe("12.345.678/0001-95");
		});

		it("should format a CNPJ with hyphens only", () => {
			const result = formatToCnpj("12-345-678-0001-95");
			expect(result).toBe("12.345.678/0001-95");
		});

		it("should format a CNPJ with slashes", () => {
			const result = formatToCnpj("12/345/678/0001/95");
			expect(result).toBe("12.345.678/0001-95");
		});

		it("should format a real CNPJ", () => {
			const result = formatToCnpj("11222333000181");
			expect(result).toBe("11.222.333/0001-81");
		});

		it("should format a CNPJ starting with zeros", () => {
			const result = formatToCnpj("00000000000191");
			expect(result).toBe("00.000.000/0001-91");
		});

		it("should format a CNPJ with parentheses", () => {
			const result = formatToCnpj("(12)(345)(678)(0001)(95)");
			expect(result).toBe("12.345.678/0001-95");
		});
	});

	describe("error handling", () => {
		it("should throw error for CNPJ with less than 14 digits", () => {
			expect(() => {
				formatToCnpj("1234567800019");
			}).toThrow("CNPJ must be contain 14 numeric digits: 1234567800019");
		});

		it("should throw error for CNPJ with more than 14 digits", () => {
			expect(() => {
				formatToCnpj("123456780001955");
			}).toThrow("CNPJ must be contain 14 numeric digits: 123456780001955");
		});

		it("should throw error for empty string", () => {
			expect(() => {
				formatToCnpj("");
			}).toThrow("CNPJ must be contain 14 numeric digits: ");
		});

		it("should throw error for only special characters", () => {
			expect(() => {
				formatToCnpj("...///---");
			}).toThrow("CNPJ must be contain 14 numeric digits: ...///---");
		});

		it("should throw error for letters only", () => {
			expect(() => {
				formatToCnpj("abcdefghijklmn");
			}).toThrow("CNPJ must be contain 14 numeric digits: abcdefghijklmn");
		});

		it("should throw error for mixed letters and numbers", () => {
			expect(() => {
				formatToCnpj("12345678abc195");
			}).toThrow("CNPJ must be contain 14 numeric digits: 12345678abc195");
		});

		it("should throw error for CNPJ with only 1 digit", () => {
			expect(() => {
				formatToCnpj("1");
			}).toThrow("CNPJ must be contain 14 numeric digits: 1");
		});

		it("should throw error for CNPJ with only 10 digits", () => {
			expect(() => {
				formatToCnpj("1234567890");
			}).toThrow("CNPJ must be contain 14 numeric digits: 1234567890");
		});

		it("should throw error for CNPJ with 13 digits", () => {
			expect(() => {
				formatToCnpj("1234567800019");
			}).toThrow("CNPJ must be contain 14 numeric digits: 1234567800019");
		});

		it("should throw error for CNPJ with 15 digits", () => {
			expect(() => {
				formatToCnpj("123456780001951");
			}).toThrow("CNPJ must be contain 14 numeric digits: 123456780001951");
		});
	});

	describe("edge cases", () => {
		it("should handle CNPJ with all zeros", () => {
			const result = formatToCnpj("00000000000000");
			expect(result).toBe("00.000.000/0000-00");
		});

		it("should handle CNPJ with all nines", () => {
			const result = formatToCnpj("99999999999999");
			expect(result).toBe("99.999.999/9999-99");
		});

		it("should handle CNPJ with multiple dots", () => {
			const result = formatToCnpj("12..345..678..0001..95");
			expect(result).toBe("12.345.678/0001-95");
		});

		it("should handle CNPJ with multiple slashes", () => {
			const result = formatToCnpj("12//345//678//0001//95");
			expect(result).toBe("12.345.678/0001-95");
		});

		it("should handle CNPJ with tabs and newlines", () => {
			const result = formatToCnpj("12345678\t0001\n95");
			expect(result).toBe("12.345.678/0001-95");
		});

		it("should handle CNPJ with leading and trailing spaces", () => {
			const result = formatToCnpj("  12345678000195  ");
			expect(result).toBe("12.345.678/0001-95");
		});

		it("should handle CNPJ with mixed formatting styles", () => {
			const result = formatToCnpj("12.345-678/0001.95");
			expect(result).toBe("12.345.678/0001-95");
		});
	});
});
