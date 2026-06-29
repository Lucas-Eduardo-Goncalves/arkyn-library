import { describe, expect, it } from "vitest";
import { removeCurrencySymbols } from "../removeCurrencySymbols";

describe("removeCurrencySymbols", () => {
	it("should remove Brazilian Real symbol (R$)", () => {
		expect(removeCurrencySymbols("R$13,45")).toBe("13,45");
		expect(removeCurrencySymbols("R$ 1.234,56")).toBe("1.234,56");
		expect(removeCurrencySymbols("R$1000")).toBe("1000");
	});

	it("should remove US Dollar symbol ($)", () => {
		expect(removeCurrencySymbols("$123.45")).toBe("123.45");
		expect(removeCurrencySymbols("$ 999.99")).toBe("999.99");
		expect(removeCurrencySymbols("$1,234.56")).toBe("1,234.56");
	});

	it("should remove Euro symbol (€)", () => {
		expect(removeCurrencySymbols("€99.99")).toBe("99.99");
		expect(removeCurrencySymbols("€ 1.234,56")).toBe("1.234,56");
		expect(removeCurrencySymbols("€500")).toBe("500");
	});

	it("should remove Yen symbol (¥)", () => {
		expect(removeCurrencySymbols("¥1,000")).toBe("1,000");
		expect(removeCurrencySymbols("¥ 5000")).toBe("5000");
		expect(removeCurrencySymbols("¥123")).toBe("123");
	});

	it("should remove Pound symbol (£)", () => {
		expect(removeCurrencySymbols("£50.00")).toBe("50.00");
		expect(removeCurrencySymbols("£ 1,234.56")).toBe("1,234.56");
		expect(removeCurrencySymbols("£999")).toBe("999");
	});

	it("should handle strings without currency symbols", () => {
		expect(removeCurrencySymbols("123.45")).toBe("123.45");
		expect(removeCurrencySymbols("1,234.56")).toBe("1,234.56");
		expect(removeCurrencySymbols("1000")).toBe("1000");
	});

	it("should handle empty string", () => {
		expect(removeCurrencySymbols("")).toBe("");
	});

	it("should trim whitespace after removing symbols", () => {
		expect(removeCurrencySymbols("R$ 100")).toBe("100");
		expect(removeCurrencySymbols("  $50.00  ")).toBe("50.00");
		expect(removeCurrencySymbols("€   99")).toBe("99");
	});

	it("should handle multiple spaces", () => {
		expect(removeCurrencySymbols("R$  1234,56")).toBe("1234,56");
		expect(removeCurrencySymbols("$   100.00")).toBe("100.00");
	});

	it("should remove multiple currency symbols if present", () => {
		expect(removeCurrencySymbols("R$$100")).toBe("100");
		expect(removeCurrencySymbols("$$50")).toBe("50");
	});

	it("should handle negative values", () => {
		expect(removeCurrencySymbols("R$-123,45")).toBe("-123,45");
		expect(removeCurrencySymbols("-$100.00")).toBe("-100.00");
		expect(removeCurrencySymbols("€-50")).toBe("-50");
	});

	it("should handle decimal values", () => {
		expect(removeCurrencySymbols("R$0,99")).toBe("0,99");
		expect(removeCurrencySymbols("$0.50")).toBe("0.50");
		expect(removeCurrencySymbols("€0,01")).toBe("0,01");
	});

	it("should handle large numbers with thousand separators", () => {
		expect(removeCurrencySymbols("R$1.234.567,89")).toBe("1.234.567,89");
		expect(removeCurrencySymbols("$1,234,567.89")).toBe("1,234,567.89");
		expect(removeCurrencySymbols("€1.234.567,89")).toBe("1.234.567,89");
	});

	it("should handle zero values", () => {
		expect(removeCurrencySymbols("R$0")).toBe("0");
		expect(removeCurrencySymbols("$0.00")).toBe("0.00");
		expect(removeCurrencySymbols("€0,00")).toBe("0,00");
	});

	it("should handle values with only currency symbol", () => {
		expect(removeCurrencySymbols("R$")).toBe("");
		expect(removeCurrencySymbols("$")).toBe("");
		expect(removeCurrencySymbols("€")).toBe("");
	});

	it("should remove other Unicode currency symbols", () => {
		expect(removeCurrencySymbols("₹100")).toBe("100"); // Indian Rupee
		expect(removeCurrencySymbols("₽500")).toBe("500"); // Russian Ruble
		expect(removeCurrencySymbols("₩1000")).toBe("1000"); // Korean Won
	});

	it("should handle mixed content with text", () => {
		expect(removeCurrencySymbols("R$100 reais")).toBe("100 reais");
		expect(removeCurrencySymbols("Total: $50.00")).toBe("Total: 50.00");
	});

	it("should preserve decimal and thousand separators", () => {
		expect(removeCurrencySymbols("R$1.234,56")).toBe("1.234,56");
		expect(removeCurrencySymbols("$1,234.56")).toBe("1,234.56");
	});
});
