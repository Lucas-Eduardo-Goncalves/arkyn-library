import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Conflict } from "../../badResponses/conflict";

describe("Conflict", () => {
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
			const error = new Conflict("Resource conflict");

			expect(error.name).toBe("Conflict");
			expect(error.status).toBe(409);
			expect(error.statusText).toBe("Resource conflict");
		});

		it("should set custom message", () => {
			const error = new Conflict("Email already exists");

			expect(error.statusText).toBe("Email already exists");
		});

		it("should set cause when provided", () => {
			const cause = { field: "email", value: "user@example.com" };
			const error = new Conflict("Duplicate email", cause);

			expect(error.cause).toBe(JSON.stringify(cause));
		});

		it("should not set cause when not provided", () => {
			const error = new Conflict("Resource conflict");

			expect(error.cause).toBeUndefined();
		});

		it("should stringify complex cause object", () => {
			const cause = {
				resource: "user",
				conflictingFields: ["email", "username"],
				existingId: "123",
			};
			const error = new Conflict("Multiple conflicts detected", cause);

			expect(error.cause).toBe(JSON.stringify(cause));
		});

		it("should call onDebug on instantiation", () => {
			const _error = new Conflict("Resource conflict");

			expect(consoleLogSpy).toHaveBeenCalled();
		});
	});

	describe("makeBody method", () => {
		it("should return correct body structure", () => {
			const error = new Conflict("Resource conflict");
			const body = error.makeBody();

			expect(body).toEqual({
				name: "Conflict",
				message: "Resource conflict",
				cause: undefined,
			});
		});

		it("should include cause in body when provided", () => {
			const cause = { field: "username", value: "john_doe" };
			const error = new Conflict("Username already taken", cause);
			const body = error.makeBody();

			expect(body).toEqual({
				name: "Conflict",
				message: "Username already taken",
				cause: JSON.stringify(cause),
			});
		});
	});

	describe("toResponse method", () => {
		it("should return Response object", () => {
			const error = new Conflict("Resource conflict");
			const response = error.toResponse();

			expect(response).toBeInstanceOf(Response);
		});

		it("should have correct status code", () => {
			const error = new Conflict("Resource conflict");
			const response = error.toResponse();

			expect(response.status).toBe(409);
		});

		it("should have correct status text", () => {
			const error = new Conflict("Resource conflict");
			const response = error.toResponse();

			expect(response.statusText).toBe("Resource conflict");
		});

		it("should have correct Content-Type header", () => {
			const error = new Conflict("Resource conflict");
			const response = error.toResponse();

			expect(response.headers.get("Content-Type")).toBe("application/json");
		});

		it("should have correct JSON body", async () => {
			const error = new Conflict("Resource conflict");
			const response = error.toResponse();
			const body = await response.json();

			expect(body).toEqual({
				name: "Conflict",
				message: "Resource conflict",
				cause: undefined,
			});
		});

		it("should include cause in response body", async () => {
			const cause = { field: "email", existing: "user@example.com" };
			const error = new Conflict("Email already exists", cause);
			const response = error.toResponse();
			const body = await response.json();

			expect(body.cause).toBe(JSON.stringify(cause));
		});

		it("should return valid JSON string", async () => {
			const error = new Conflict("Resource conflict");
			const response = error.toResponse();
			const text = await response.text();

			expect(() => JSON.parse(text)).not.toThrow();
		});
	});

	describe("toJson method", () => {
		it("should return Response object", () => {
			const error = new Conflict("Resource conflict");
			const response = error.toJson();

			expect(response).toBeInstanceOf(Response);
		});

		it("should have correct status code", () => {
			const error = new Conflict("Resource conflict");
			const response = error.toJson();

			expect(response.status).toBe(409);
		});

		it("should have correct status text", () => {
			const error = new Conflict("Resource conflict");
			const response = error.toJson();

			expect(response.statusText).toBe("Resource conflict");
		});

		it("should have correct JSON body", async () => {
			const error = new Conflict("Resource conflict");
			const response = error.toJson();
			const body = await response.json();

			expect(body).toEqual({
				name: "Conflict",
				message: "Resource conflict",
				cause: undefined,
			});
		});

		it("should include cause in response body", async () => {
			const cause = { resource: "post", id: "456" };
			const error = new Conflict("Post already exists", cause);
			const response = error.toJson();
			const body = await response.json();

			expect(body.cause).toBe(JSON.stringify(cause));
		});

		it("should automatically set Content-Type to application/json", () => {
			const error = new Conflict("Resource conflict");
			const response = error.toJson();

			expect(response.headers.get("Content-Type")).toContain(
				"application/json",
			);
		});
	});

	describe("integration scenarios", () => {
		it("should handle duplicate email scenario", async () => {
			const cause = {
				field: "email",
				value: "user@example.com",
				existingUserId: "12345",
			};
			const error = new Conflict("Email already registered", cause);
			const response = error.toResponse();
			const body = await response.json();

			expect(response.status).toBe(409);
			expect(body.message).toBe("Email already registered");
			expect(body.cause).toBe(JSON.stringify(cause));
		});

		it("should handle duplicate username scenario", async () => {
			const cause = {
				field: "username",
				value: "johndoe",
				suggestion: "johndoe123",
			};
			const error = new Conflict("Username already taken", cause);
			const response = error.toJson();
			const body = await response.json();

			expect(response.status).toBe(409);
			expect(body.name).toBe("Conflict");
			expect(body.message).toBe("Username already taken");
		});

		it("should handle resource version conflict", async () => {
			const cause = {
				resource: "document",
				id: "doc-123",
				expectedVersion: 5,
				actualVersion: 7,
			};
			const error = new Conflict("Document version conflict", cause);
			const response = error.toResponse();
			const body = await response.json();

			expect(response.status).toBe(409);
			expect(body.cause).toBe(JSON.stringify(cause));
		});

		it("should handle concurrent modification", async () => {
			const error = new Conflict(
				"Resource was modified by another user. Please refresh and try again.",
			);
			const response = error.toJson();

			expect(response.status).toBe(409);
			expect(response.statusText).toBe(
				"Resource was modified by another user. Please refresh and try again.",
			);
		});
	});

	describe("comparison between toResponse and toJson", () => {
		it("should produce equivalent responses", async () => {
			const error = new Conflict("Resource conflict");
			const response1 = error.toResponse();
			const response2 = error.toJson();

			const body1 = await response1.json();
			const body2 = await response2.json();

			expect(body1).toEqual(body2);
			expect(response1.status).toBe(response2.status);
			expect(response1.statusText).toBe(response2.statusText);
		});

		it("should produce equivalent responses with cause", async () => {
			const cause = { field: "slug", value: "my-post" };
			const error = new Conflict("Slug already exists", cause);
			const response1 = error.toResponse();
			const response2 = error.toJson();

			const body1 = await response1.json();
			const body2 = await response2.json();

			expect(body1).toEqual(body2);
		});
	});

	describe("edge cases", () => {
		it("should handle empty message", () => {
			const error = new Conflict("");

			expect(error.statusText).toBe("");
			expect(error.status).toBe(409);
		});

		it("should handle very long message", () => {
			const longMessage = "A".repeat(1000);
			const error = new Conflict(longMessage);

			expect(error.statusText).toBe(longMessage);
		});

		it("should handle null cause", () => {
			const error = new Conflict("Resource conflict", null);

			expect(error.cause).toBeUndefined();
		});

		it("should handle undefined cause explicitly", () => {
			const error = new Conflict("Resource conflict", undefined);

			expect(error.cause).toBeUndefined();
		});

		it("should handle array as cause", () => {
			const cause = ["field1", "field2", "field3"];
			const error = new Conflict("Multiple conflicts", cause);

			expect(error.cause).toBe(JSON.stringify(cause));
		});

		it("should handle nested object as cause", () => {
			const cause = {
				conflicts: {
					email: { value: "test@example.com", existingId: "123" },
					username: { value: "testuser", existingId: "456" },
				},
			};
			const error = new Conflict("Multiple field conflicts", cause);

			expect(error.cause).toBe(JSON.stringify(cause));
		});

		it("should handle special characters in message", () => {
			const message = 'Conflict: {"error": "duplicate"}';
			const error = new Conflict(message);

			expect(error.statusText).toBe(message);
		});

		it("should handle unicode characters in message", () => {
			const message = "Conflito: 冲突";
			const error = new Conflict(message);

			expect(error.statusText).toBe(message);
		});

		it("should handle boolean as cause", () => {
			const error = new Conflict("Resource conflict", true);

			expect(error.cause).toBe("true");
		});

		it("should handle number as cause", () => {
			const error = new Conflict("Resource conflict", 12345);

			expect(error.cause).toBe("12345");
		});
	});
});
