import { describe, expect, it } from "vitest";
import { successResponses } from "../successResponses";

describe("successResponses", () => {
	it("should be an array of strings", () => {
		expect(Array.isArray(successResponses)).toBe(true);
		successResponses.forEach((response) => {
			expect(typeof response).toBe("string");
		});
	});

	it("should contain the known success identifiers", () => {
		expect(successResponses).toEqual([
			"Created",
			"Found",
			"Success",
			"Updated",
		]);
	});

	it("should not contain duplicate entries", () => {
		expect(new Set(successResponses).size).toBe(successResponses.length);
	});
});
