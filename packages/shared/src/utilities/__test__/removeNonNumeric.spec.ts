import { describe, expect, it } from "vitest";
import { removeNonNumeric } from "../removeNonNumeric";

describe("removeNonNumeric", () => {
	it("should remove all non-numeric characters", () => {
		expect(removeNonNumeric("abc123def456")).toBe("123456");
	});

	it("should handle strings with only numbers", () => {
		expect(removeNonNumeric("123456")).toBe("123456");
	});

	it("should handle strings with only letters", () => {
		expect(removeNonNumeric("abcdef")).toBe("");
	});

	it("should handle empty string", () => {
		expect(removeNonNumeric("")).toBe("");
	});

	it("should remove spaces", () => {
		expect(removeNonNumeric("123 456 789")).toBe("123456789");
	});

	it("should remove special characters", () => {
		expect(removeNonNumeric("!@#$123%^&*456")).toBe("123456");
	});

	it("should remove currency symbols", () => {
		expect(removeNonNumeric("R$1.234,56")).toBe("123456");
		expect(removeNonNumeric("$1,234.56")).toBe("123456");
	});

	it("should remove dots and commas", () => {
		expect(removeNonNumeric("1,234.56")).toBe("123456");
		expect(removeNonNumeric("1.234,56")).toBe("123456");
	});

	it("should remove hyphens and dashes", () => {
		expect(removeNonNumeric("123-456-789")).toBe("123456789");
		expect(removeNonNumeric("123–456—789")).toBe("123456789");
	});

	it("should remove parentheses", () => {
		expect(removeNonNumeric("(123) 456-7890")).toBe("1234567890");
	});

	it("should handle phone numbers", () => {
		expect(removeNonNumeric("+55 (11) 98765-4321")).toBe("5511987654321");
		expect(removeNonNumeric("(123) 456-7890")).toBe("1234567890");
	});

	it("should handle CPF format", () => {
		expect(removeNonNumeric("123.456.789-01")).toBe("12345678901");
	});

	it("should handle CNPJ format", () => {
		expect(removeNonNumeric("12.345.678/0001-90")).toBe("12345678000190");
	});

	it("should handle credit card format", () => {
		expect(removeNonNumeric("1234 5678 9012 3456")).toBe("1234567890123456");
		expect(removeNonNumeric("1234-5678-9012-3456")).toBe("1234567890123456");
	});

	it("should remove plus and minus signs", () => {
		expect(removeNonNumeric("+123")).toBe("123");
		expect(removeNonNumeric("-456")).toBe("456");
		expect(removeNonNumeric("+123-456")).toBe("123456");
	});

	it("should handle mixed alphanumeric strings", () => {
		expect(removeNonNumeric("ABC123XYZ456")).toBe("123456");
		expect(removeNonNumeric("test123test456")).toBe("123456");
	});

	it("should handle strings with line breaks", () => {
		expect(removeNonNumeric("123\n456\n789")).toBe("123456789");
	});

	it("should handle strings with tabs", () => {
		expect(removeNonNumeric("123\t456\t789")).toBe("123456789");
	});

	it("should handle Unicode characters", () => {
		expect(removeNonNumeric("①②③123")).toBe("123");
		expect(removeNonNumeric("hello世界123")).toBe("123");
	});

	it("should handle very long strings", () => {
		const longString = `${"a".repeat(1000)}123${"b".repeat(1000)}456`;
		expect(removeNonNumeric(longString)).toBe("123456");
	});

	it("should preserve leading zeros", () => {
		expect(removeNonNumeric("00123")).toBe("00123");
		expect(removeNonNumeric("0000")).toBe("0000");
	});
});
