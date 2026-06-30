import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BadRequest } from "../../badResponses/badRequest";

describe("BadRequest", () => {
	// biome-ignore lint/suspicious/noExplicitAny: intentional
	let consoleLogSpy: any;

	beforeEach(() => {
		consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		process.env.NODE_ENV = "development";
	});

	afterEach(() => {
		consoleLogSpy.mockRestore();
		delete process.env.NODE_ENV;
	});

	describe("constructor", () => {
		it("should create instance with correct default values", () => {
			const error = new BadRequest("Invalid request");

			expect(error.name).toBe("BadRequest");
			expect(error.status).toBe(400);
			expect(error.statusText).toBe("Invalid request");
		});

		it("should set custom message", () => {
			const error = new BadRequest("Missing required field");

			expect(error.statusText).toBe("Missing required field");
		});

		it("should set cause when provided", () => {
			const cause = { field: "email", error: "Invalid format" };
			const error = new BadRequest("Validation error", cause);

			expect(error.cause).toBe(JSON.stringify(cause));
		});

		it("should not set cause when not provided", () => {
			const error = new BadRequest("Invalid request");

			expect(error.cause).toBeUndefined();
		});

		it("should stringify complex cause object", () => {
			const cause = {
				errors: [
					{ field: "email", message: "Invalid email" },
					{ field: "password", message: "Too short" },
				],
			};
			const error = new BadRequest("Validation failed", cause);

			expect(error.cause).toBe(JSON.stringify(cause));
		});

		it("should call onDebug on instantiation", () => {
			const _error = new BadRequest("Invalid request");

			expect(consoleLogSpy).toHaveBeenCalled();
		});
	});

	describe("makeBody method", () => {
		it("should return correct body structure", () => {
			const error = new BadRequest("Invalid request");
			const body = error.makeBody();

			expect(body).toEqual({
				name: "BadRequest",
				message: "Invalid request",
				cause: undefined,
			});
		});

		it("should include cause in body when provided", () => {
			const cause = { field: "username", error: "Already exists" };
			const error = new BadRequest("Validation error", cause);
			const body = error.makeBody();

			expect(body).toEqual({
				name: "BadRequest",
				message: "Validation error",
				cause: JSON.stringify(cause),
			});
		});
	});

	describe("toResponse method", () => {
		it("should return Response object", () => {
			const error = new BadRequest("Invalid request");
			const response = error.toResponse();

			expect(response).toBeInstanceOf(Response);
		});

		it("should have correct status code", () => {
			const error = new BadRequest("Invalid request");
			const response = error.toResponse();

			expect(response.status).toBe(400);
		});

		it("should have correct status text", () => {
			const error = new BadRequest("Invalid request");
			const response = error.toResponse();

			expect(response.statusText).toBe("Invalid request");
		});

		it("should have correct Content-Type header", () => {
			const error = new BadRequest("Invalid request");
			const response = error.toResponse();

			expect(response.headers.get("Content-Type")).toBe("application/json");
		});

		it("should have correct JSON body", async () => {
			const error = new BadRequest("Invalid request");
			const response = error.toResponse();
			const body = await response.json();

			expect(body).toEqual({
				name: "BadRequest",
				message: "Invalid request",
				cause: undefined,
			});
		});

		it("should include cause in response body", async () => {
			const cause = { field: "email", error: "Required" };
			const error = new BadRequest("Missing field", cause);
			const response = error.toResponse();
			const body = await response.json();

			expect(body.cause).toBe(JSON.stringify(cause));
		});

		it("should return valid JSON string", async () => {
			const error = new BadRequest("Invalid request");
			const response = error.toResponse();
			const text = await response.text();

			expect(() => JSON.parse(text)).not.toThrow();
		});
	});

	describe("toJson method", () => {
		it("should return Response object", () => {
			const error = new BadRequest("Invalid request");
			const response = error.toJson();

			expect(response).toBeInstanceOf(Response);
		});

		it("should have correct status code", () => {
			const error = new BadRequest("Invalid request");
			const response = error.toJson();

			expect(response.status).toBe(400);
		});

		it("should have correct status text", () => {
			const error = new BadRequest("Invalid request");
			const response = error.toJson();

			expect(response.statusText).toBe("Invalid request");
		});

		it("should have correct JSON body", async () => {
			const error = new BadRequest("Invalid request");
			const response = error.toJson();
			const body = await response.json();

			expect(body).toEqual({
				name: "BadRequest",
				message: "Invalid request",
				cause: undefined,
			});
		});

		it("should include cause in response body", async () => {
			const cause = { field: "password", error: "Too weak" };
			const error = new BadRequest("Validation failed", cause);
			const response = error.toJson();
			const body = await response.json();

			expect(body.cause).toBe(JSON.stringify(cause));
		});

		it("should automatically set Content-Type to application/json", () => {
			const error = new BadRequest("Invalid request");
			const response = error.toJson();

			expect(response.headers.get("Content-Type")).toContain(
				"application/json",
			);
		});
	});

	describe("integration scenarios", () => {
		it("should handle missing required fields", async () => {
			const cause = {
				missingFields: ["email", "password", "name"],
			};
			const error = new BadRequest("Missing required fields", cause);
			const response = error.toResponse();
			const body = await response.json();

			expect(response.status).toBe(400);
			expect(body.message).toBe("Missing required fields");
			expect(body.cause).toBe(JSON.stringify(cause));
		});

		it("should handle validation errors", async () => {
			const cause = {
				errors: [
					{ field: "email", message: "Invalid email format" },
					{ field: "age", message: "Must be a positive number" },
				],
			};
			const error = new BadRequest("Validation failed", cause);
			const response = error.toJson();
			const body = await response.json();

			expect(response.status).toBe(400);
			expect(body.name).toBe("BadRequest");
			expect(body.message).toBe("Validation failed");
		});

		it("should handle malformed request body", async () => {
			const error = new BadRequest("Malformed JSON in request body");
			const response = error.toResponse();

			expect(response.status).toBe(400);
			expect(response.statusText).toBe("Malformed JSON in request body");
		});

		it("should handle invalid query parameters", async () => {
			const cause = {
				parameter: "limit",
				value: "-10",
				expected: "positive integer",
			};
			const error = new BadRequest("Invalid query parameter", cause);
			const response = error.toJson();
			const body = await response.json();

			expect(response.status).toBe(400);
			expect(body.cause).toBe(JSON.stringify(cause));
		});
	});

	describe("comparison between toResponse and toJson", () => {
		it("should produce equivalent responses", async () => {
			const error = new BadRequest("Invalid request");
			const response1 = error.toResponse();
			const response2 = error.toJson();

			const body1 = await response1.json();
			const body2 = await response2.json();

			expect(body1).toEqual(body2);
			expect(response1.status).toBe(response2.status);
			expect(response1.statusText).toBe(response2.statusText);
		});

		it("should produce equivalent responses with cause", async () => {
			const cause = { error: "Test error" };
			const error = new BadRequest("Invalid request", cause);
			const response1 = error.toResponse();
			const response2 = error.toJson();

			const body1 = await response1.json();
			const body2 = await response2.json();

			expect(body1).toEqual(body2);
		});
	});

	describe("edge cases", () => {
		it("should handle empty message", () => {
			const error = new BadRequest("");
			expect(error.statusText).toBe("");
			expect(error.status).toBe(400);
		});

		it("should handle very long message", () => {
			const longMessage = "A".repeat(1000);
			const error = new BadRequest(longMessage);
			expect(error.statusText).toBe(longMessage);
		});

		it("should handle null cause", () => {
			const error = new BadRequest("Invalid request", null);
			expect(error.cause).toBeUndefined();
		});

		it("should handle undefined cause explicitly", () => {
			const error = new BadRequest("Invalid request", undefined);

			expect(error.cause).toBeUndefined();
		});

		it("should handle array as cause", () => {
			const cause = ["error1", "error2", "error3"];
			const error = new BadRequest("Multiple errors", cause);

			expect(error.cause).toBe(JSON.stringify(cause));
		});

		it("should handle nested object as cause", () => {
			const cause = {
				validation: {
					fields: { email: "Invalid format", password: "Too short" },
				},
			};
			const error = new BadRequest("Validation failed", cause);
			expect(error.cause).toBe(JSON.stringify(cause));
		});

		it("should handle special characters in message", () => {
			const message = 'Invalid request: {"error": "test"}';
			const error = new BadRequest(message);

			expect(error.statusText).toBe(message);
		});

		it("should handle unicode characters in message", () => {
			const message = "Requisição inválida: 请求无效";
			const error = new BadRequest(message);

			expect(error.statusText).toBe(message);
		});
	});
});
