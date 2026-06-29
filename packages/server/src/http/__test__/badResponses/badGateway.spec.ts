import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BadGateway } from "../../badResponses/badGateway";

describe("BadGateway", () => {
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
			const error = new BadGateway("Bad Gateway error");

			expect(error.name).toBe("BadGateway");
			expect(error.status).toBe(502);
			expect(error.statusText).toBe("Bad Gateway error");
		});

		it("should set custom message", () => {
			const error = new BadGateway("Custom gateway error");

			expect(error.statusText).toBe("Custom gateway error");
		});

		it("should set cause when provided", () => {
			const cause = { error: "Upstream service unavailable" };
			const error = new BadGateway("Gateway error", cause);

			expect(error.cause).toBe(JSON.stringify(cause));
		});

		it("should not set cause when not provided", () => {
			const error = new BadGateway("Gateway error");

			expect(error.cause).toBeUndefined();
		});

		it("should stringify complex cause object", () => {
			const cause = {
				error: "Connection failed",
				service: "payment-api",
				retryAfter: 5000,
			};
			const error = new BadGateway("Gateway error", cause);

			expect(error.cause).toBe(JSON.stringify(cause));
		});

		it("should call onDebug on instantiation", () => {
			const _error = new BadGateway("Gateway error");
			expect(consoleLogSpy).toHaveBeenCalled();
		});
	});

	describe("makeBody method", () => {
		it("should return correct body structure", () => {
			const error = new BadGateway("Gateway error");
			const body = error.makeBody();

			expect(body).toEqual({
				name: "BadGateway",
				message: "Gateway error",
				cause: undefined,
			});
		});

		it("should include cause in body when provided", () => {
			const cause = { error: "Service timeout" };
			const error = new BadGateway("Gateway error", cause);
			const body = error.makeBody();

			expect(body).toEqual({
				name: "BadGateway",
				message: "Gateway error",
				cause: JSON.stringify(cause),
			});
		});
	});

	describe("toResponse method", () => {
		it("should return Response object", () => {
			const error = new BadGateway("Gateway error");
			const response = error.toResponse();

			expect(response).toBeInstanceOf(Response);
		});

		it("should have correct status code", async () => {
			const error = new BadGateway("Gateway error");
			const response = error.toResponse();

			expect(response.status).toBe(502);
		});

		it("should have correct status text", async () => {
			const error = new BadGateway("Gateway error");
			const response = error.toResponse();

			expect(response.statusText).toBe("Gateway error");
		});

		it("should have correct Content-Type header", () => {
			const error = new BadGateway("Gateway error");
			const response = error.toResponse();

			expect(response.headers.get("Content-Type")).toBe("application/json");
		});

		it("should have correct JSON body", async () => {
			const error = new BadGateway("Gateway error");
			const response = error.toResponse();
			const body = await response.json();

			expect(body).toEqual({
				name: "BadGateway",
				message: "Gateway error",
				cause: undefined,
			});
		});

		it("should include cause in response body", async () => {
			const cause = { error: "Upstream error" };
			const error = new BadGateway("Gateway error", cause);
			const response = error.toResponse();
			const body = await response.json();

			expect(body.cause).toBe(JSON.stringify(cause));
		});

		it("should return valid JSON string", async () => {
			const error = new BadGateway("Gateway error");
			const response = error.toResponse();
			const text = await response.text();

			expect(() => JSON.parse(text)).not.toThrow();
		});
	});

	describe("toJson method", () => {
		it("should return Response object", () => {
			const error = new BadGateway("Gateway error");
			const response = error.toJson();

			expect(response).toBeInstanceOf(Response);
		});

		it("should have correct status code", () => {
			const error = new BadGateway("Gateway error");
			const response = error.toJson();

			expect(response.status).toBe(502);
		});

		it("should have correct status text", () => {
			const error = new BadGateway("Gateway error");
			const response = error.toJson();

			expect(response.statusText).toBe("Gateway error");
		});

		it("should have correct JSON body", async () => {
			const error = new BadGateway("Gateway error");
			const response = error.toJson();
			const body = await response.json();

			expect(body).toEqual({
				name: "BadGateway",
				message: "Gateway error",
				cause: undefined,
			});
		});

		it("should include cause in response body", async () => {
			const cause = { error: "Service error" };
			const error = new BadGateway("Gateway error", cause);
			const response = error.toJson();
			const body = await response.json();

			expect(body.cause).toBe(JSON.stringify(cause));
		});

		it("should automatically set Content-Type to application/json", () => {
			const error = new BadGateway("Gateway error");
			const response = error.toJson();

			expect(response.headers.get("Content-Type")).toContain(
				"application/json",
			);
		});
	});

	describe("integration scenarios", () => {
		it("should handle upstream service timeout", async () => {
			const cause = {
				error: "Connection timeout",
				service: "payment-gateway",
				timeout: 30000,
			};
			const error = new BadGateway("Upstream service timeout", cause);
			const response = error.toResponse();
			const body = await response.json();

			expect(response.status).toBe(502);
			expect(body.message).toBe("Upstream service timeout");
			expect(body.cause).toBe(JSON.stringify(cause));
		});

		it("should handle invalid upstream response", async () => {
			const cause = { error: "Invalid JSON response from upstream" };
			const error = new BadGateway("Invalid upstream response", cause);
			const response = error.toJson();
			const body = await response.json();

			expect(response.status).toBe(502);
			expect(body.name).toBe("BadGateway");
			expect(body.message).toBe("Invalid upstream response");
		});

		it("should handle upstream service unavailable", async () => {
			const error = new BadGateway("Upstream service unavailable");
			const response = error.toResponse();

			expect(response.status).toBe(502);
			expect(response.statusText).toBe("Upstream service unavailable");
		});
	});

	describe("comparison between toResponse and toJson", () => {
		it("should produce equivalent responses", async () => {
			const error = new BadGateway("Gateway error");
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
			const error = new BadGateway("Gateway error", cause);
			const response1 = error.toResponse();
			const response2 = error.toJson();

			const body1 = await response1.json();
			const body2 = await response2.json();

			expect(body1).toEqual(body2);
		});
	});

	describe("edge cases", () => {
		it("should handle empty message", () => {
			const error = new BadGateway("");

			expect(error.statusText).toBe("");
			expect(error.status).toBe(502);
		});

		it("should handle very long message", () => {
			const longMessage = "A".repeat(1000);
			const error = new BadGateway(longMessage);

			expect(error.statusText).toBe(longMessage);
		});

		it("should handle null cause", () => {
			const error = new BadGateway("Gateway error", null);
			expect(error.cause).toBeUndefined();
		});

		it("should handle undefined cause explicitly", () => {
			const error = new BadGateway("Gateway error", undefined);
			expect(error.cause).toBeUndefined();
		});

		it("should handle array as cause", () => {
			const cause = ["error1", "error2", "error3"];
			const error = new BadGateway("Gateway error", cause);
			expect(error.cause).toBe(JSON.stringify(cause));
		});

		it("should handle nested object as cause", () => {
			const cause = {
				error: "Connection failed",
				details: { service: "api", endpoint: "/users", method: "GET" },
			};

			const error = new BadGateway("Gateway error", cause);
			expect(error.cause).toBe(JSON.stringify(cause));
		});
	});
});
