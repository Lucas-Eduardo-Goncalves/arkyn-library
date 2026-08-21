import { describe, expect, it } from "vitest";
import { countries } from "../countries";

describe("countries", () => {
	it("should export a non-empty array", () => {
		expect(Array.isArray(countries)).toBe(true);
		expect(countries.length).toBeGreaterThan(0);
	});

	it("should have a non-empty name for every entry", () => {
		for (const country of countries) {
			expect(typeof country.name).toBe("string");
			expect(country.name.length).toBeGreaterThan(0);
		}
	});

	it("should have a dial code formatted as a plus sign followed by digits", () => {
		for (const country of countries) {
			expect(country.code).toMatch(/^\+\d+$/);
		}
	});

	it("should have a 2-3 letter uppercase ISO code", () => {
		for (const country of countries) {
			expect(country.iso).toMatch(/^[A-Z]{2,3}$/);
		}
	});

	it("should have an https flag URL", () => {
		for (const country of countries) {
			expect(country.flag).toMatch(/^https:\/\//);
		}
	});

	it("should have a mask that is a string or an array of strings", () => {
		for (const country of countries) {
			if (Array.isArray(country.mask)) {
				expect(country.mask.length).toBeGreaterThan(0);
				for (const maskVariant of country.mask) {
					expect(typeof maskVariant).toBe("string");
					expect(maskVariant.length).toBeGreaterThan(0);
				}
			} else {
				expect(typeof country.mask).toBe("string");
				expect(country.mask.length).toBeGreaterThan(0);
			}
		}
	});

	it("should not contain duplicate ISO codes", () => {
		const isoCodes = countries.map((country) => country.iso);
		const uniqueIsoCodes = new Set(isoCodes);

		expect(uniqueIsoCodes.size).toBe(isoCodes.length);
	});

	it("should not contain duplicate country names", () => {
		const names = countries.map((country) => country.name);
		const uniqueNames = new Set(names);

		expect(uniqueNames.size).toBe(names.length);
	});
});
