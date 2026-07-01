import { describe, expect, it } from "vitest";
import { badResponses } from "../badResponses";

describe("badResponses", () => {
	it("should be an array of strings", () => {
		expect(Array.isArray(badResponses)).toBe(true);
		badResponses.forEach((response) => {
			expect(typeof response).toBe("string");
		});
	});

	it("should contain the known HTTP-error-like identifiers", () => {
		expect(badResponses).toEqual([
			"BadGateway",
			"BadRequest",
			"Conflict",
			"Forbidden",
			"NotFound",
			"NotImplemented",
			"ServerError",
			"Unauthorized",
			"UnprocessableEntity",
		]);
	});

	it("should not contain duplicate entries", () => {
		expect(new Set(badResponses).size).toBe(badResponses.length);
	});

	it("should not overlap with successResponses", async () => {
		const { successResponses } = await import("../successResponses");
		const overlap = badResponses.filter((response) =>
			successResponses.includes(response),
		);

		expect(overlap).toEqual([]);
	});
});
