import { describe, expect, it } from "vitest";
import { maximumFractionDigits } from "../maximumFractionDigits";

describe("maximumFractionDigits", () => {
	it("should be a non-negative integer", () => {
		expect(typeof maximumFractionDigits).toBe("number");
		expect(Number.isInteger(maximumFractionDigits)).toBe(true);
		expect(maximumFractionDigits).toBeGreaterThanOrEqual(0);
	});

	it("should be within the range accepted by Intl.NumberFormat's maximumFractionDigits option", () => {
		// Intl.NumberFormat accepts 0-20 for maximumFractionDigits; this constant
		// is consumed as that option elsewhere, so it must stay in range.
		expect(maximumFractionDigits).toBeLessThanOrEqual(20);
	});
});
