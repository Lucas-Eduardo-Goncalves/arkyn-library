import { describe, expect, it } from "vitest";
import { brazilianStates } from "../brazilianStates";

describe("brazilianStates", () => {
	it("should export a non-empty array", () => {
		expect(Array.isArray(brazilianStates)).toBe(true);
		expect(brazilianStates.length).toBeGreaterThan(0);
	});

	it("should have a non-empty string label and a 2-letter uppercase UF code for every entry", () => {
		for (const state of brazilianStates) {
			expect(typeof state.label).toBe("string");
			expect(state.label.length).toBeGreaterThan(0);

			expect(typeof state.value).toBe("string");
			expect(state.value).toMatch(/^[A-Z]{2}$/);
		}
	});

	it("should not contain duplicate UF codes", () => {
		const values = brazilianStates.map((state) => state.value);
		const uniqueValues = new Set(values);

		expect(uniqueValues.size).toBe(values.length);
	});

	it("should not contain duplicate labels", () => {
		const labels = brazilianStates.map((state) => state.label);
		const uniqueLabels = new Set(labels);

		expect(uniqueLabels.size).toBe(labels.length);
	});
});
