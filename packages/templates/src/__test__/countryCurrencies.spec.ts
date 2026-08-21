import { describe, expect, it } from "vitest";
import { countryCurrencies } from "../countryCurrencies";

describe("countryCurrencies", () => {
	it("should export a non-empty object", () => {
		expect(typeof countryCurrencies).toBe("object");
		expect(Object.keys(countryCurrencies).length).toBeGreaterThan(0);
	});

	it("should key every entry by a 3-letter uppercase currency code", () => {
		for (const key of Object.keys(countryCurrencies)) {
			expect(key).toMatch(/^[A-Z]{3}$/);
		}
	});

	it("should have a countryCurrency field that matches its own object key", () => {
		for (const [key, value] of Object.entries(countryCurrencies)) {
			expect(value.countryCurrency).toBe(key);
		}
	});

	it("should have a countryLanguage formatted as a lowercase-uppercase BCP 47 locale tag", () => {
		for (const value of Object.values(countryCurrencies)) {
			expect(value.countryLanguage).toMatch(/^[a-z]{2}-[A-Z]{2}$/);
		}
	});
});
