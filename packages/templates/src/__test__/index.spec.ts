import { describe, expect, it } from "vitest";
import {
	brazilianStates,
	countries,
	countryCurrencies,
	maximumFractionDigits,
} from "../index";

describe("index public exports", () => {
	it("should re-export brazilianStates as an array", () => {
		expect(Array.isArray(brazilianStates)).toBe(true);
	});

	it("should re-export countries as an array", () => {
		expect(Array.isArray(countries)).toBe(true);
	});

	it("should re-export countryCurrencies as an object", () => {
		expect(typeof countryCurrencies).toBe("object");
		expect(countryCurrencies).not.toBeNull();
	});

	it("should re-export maximumFractionDigits as a number", () => {
		expect(typeof maximumFractionDigits).toBe("number");
	});
});
