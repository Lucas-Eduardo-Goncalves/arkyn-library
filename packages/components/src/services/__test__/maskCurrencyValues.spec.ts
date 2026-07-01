import { describe, expect, it } from "vitest";
import { maskCurrencyValues, normalizeValue } from "../maskCurrencyValues";

describe("normalizeValue", () => {
	it("should interpret a digit-only string as cents", () => {
		expect(normalizeValue("1050")).toBe(10.5);
	});

	it("should strip non-numeric characters from a formatted string", () => {
		expect(normalizeValue("R$ 10,50")).toBe(10.5);
	});

	it("should treat an integer number as an already-normalized value", () => {
		expect(normalizeValue(10)).toBe(10);
	});

	it("should round a decimal number to two decimal places", () => {
		expect(normalizeValue(10.5)).toBe(10.5);
	});

	it("should return 0 for zero input", () => {
		expect(normalizeValue(0)).toBe(0);
		expect(normalizeValue("0")).toBe(0);
	});

	it("should return 0 for an empty string", () => {
		expect(normalizeValue("")).toBe(0);
	});

	it("should produce the same result for the same input", () => {
		expect(normalizeValue("2599")).toBe(normalizeValue("2599"));
	});
});

describe("maskCurrencyValues", () => {
	it("should default to 0 and a formatted zero string when the value is undefined", () => {
		const [value, masked] = maskCurrencyValues(undefined, "BRL");

		expect(value).toBe(0);
		expect(masked).toBe("R$ 0,00");
	});

	it("should default to 0 when the value is an empty string", () => {
		const [value, masked] = maskCurrencyValues("", "BRL");

		expect(value).toBe(0);
		expect(masked).toBe("R$ 0,00");
	});

	it("should default to 0 when the value is 0", () => {
		const [value, masked] = maskCurrencyValues(0, "BRL");

		expect(value).toBe(0);
		expect(masked).toBe("R$ 0,00");
	});

	it("should convert a raw digit string into the numeric value and its BRL mask", () => {
		const [value, masked] = maskCurrencyValues("1050", "BRL");

		expect(value).toBe(10.5);
		expect(masked).toBe("R$ 10,50");
	});

	it("should format the value using the given locale", () => {
		const [value, masked] = maskCurrencyValues(1234.56, "USD");

		expect(value).toBe(1234.56);
		expect(masked).toBe("$1,234.56");
	});

	it("should return a tuple of [number, string]", () => {
		const result = maskCurrencyValues("500", "BRL");

		expect(Array.isArray(result)).toBe(true);
		expect(typeof result[0]).toBe("number");
		expect(typeof result[1]).toBe("string");
	});
});
