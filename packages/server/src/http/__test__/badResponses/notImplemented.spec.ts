import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NotImplemented } from "../../badResponses/notImplemented";

describe("NotImplemented", () => {
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
			const error = new NotImplemented("Feature not implemented");

			expect(error.name).toBe("NotImplemented");
			expect(error.status).toBe(501);
			expect(error.statusText).toBe("Feature not implemented");
		});

		it("should set custom message", () => {
			const error = new NotImplemented("This endpoint is not implemented yet");

			expect(error.statusText).toBe("This endpoint is not implemented yet");
		});

		it("should set cause when provided", () => {
			const cause = { feature: "export-pdf", expectedVersion: "2.0" };
			const error = new NotImplemented("PDF export not implemented", cause);

			expect(error.cause).toBe(JSON.stringify(cause));
		});

		it("should not set cause when not provided", () => {
			const error = new NotImplemented("Feature not implemented");

			expect(error.cause).toBeUndefined();
		});

		it("should stringify complex cause object", () => {
			const cause = {
				feature: "advanced-search",
				plannedRelease: "v3.0",
				alternatives: ["basic-search", "filter-by-tag"],
			};
			const error = new NotImplemented("Advanced search not available", cause);

			expect(error.cause).toBe(JSON.stringify(cause));
		});

		it("should call onDebug on instantiation", () => {
			const _error = new NotImplemented("Feature not implemented");

			expect(consoleLogSpy).toHaveBeenCalled();
		});
	});

	describe("makeBody method", () => {
		it("should return correct body structure", () => {
			const error = new NotImplemented("Feature not implemented");
			const body = error.makeBody();

			expect(body).toEqual({
				name: "NotImplemented",
				message: "Feature not implemented",
				cause: undefined,
			});
		});

		it("should include cause in body when provided", () => {
			const cause = { feature: "bulk-delete" };
			const error = new NotImplemented("Bulk delete not implemented", cause);
			const body = error.makeBody();

			expect(body).toEqual({
				name: "NotImplemented",
				message: "Bulk delete not implemented",
				cause: JSON.stringify(cause),
			});
		});
	});

	describe("toResponse method", () => {
		it("should return Response object", () => {
			const error = new NotImplemented("Feature not implemented");
			const response = error.toResponse();

			expect(response).toBeInstanceOf(Response);
		});

		it("should have correct status code", () => {
			const error = new NotImplemented("Feature not implemented");
			const response = error.toResponse();

			expect(response.status).toBe(501);
		});

		it("should have correct status text", () => {
			const error = new NotImplemented("Feature not implemented");
			const response = error.toResponse();

			expect(response.statusText).toBe("Feature not implemented");
		});

		it("should have correct Content-Type header", () => {
			const error = new NotImplemented("Feature not implemented");
			const response = error.toResponse();

			expect(response.headers.get("Content-Type")).toBe("application/json");
		});

		it("should have correct JSON body", async () => {
			const error = new NotImplemented("Feature not implemented");
			const response = error.toResponse();
			const body = await response.json();

			expect(body).toEqual({
				name: "NotImplemented",
				message: "Feature not implemented",
				cause: undefined,
			});
		});

		it("should include cause in response body", async () => {
			const cause = { endpoint: "/api/v2/users" };
			const error = new NotImplemented("API v2 not implemented", cause);
			const response = error.toResponse();
			const body = await response.json();

			expect(body.cause).toBe(JSON.stringify(cause));
		});

		it("should return valid JSON string", async () => {
			const error = new NotImplemented("Feature not implemented");
			const response = error.toResponse();
			const text = await response.text();

			expect(() => JSON.parse(text)).not.toThrow();
		});
	});

	describe("toJson method", () => {
		it("should return Response object", () => {
			const error = new NotImplemented("Feature not implemented");
			const response = error.toJson();

			expect(response).toBeInstanceOf(Response);
		});

		it("should have correct status code", () => {
			const error = new NotImplemented("Feature not implemented");
			const response = error.toJson();

			expect(response.status).toBe(501);
		});

		it("should have correct status text", () => {
			const error = new NotImplemented("Feature not implemented");
			const response = error.toJson();

			expect(response.statusText).toBe("Feature not implemented");
		});

		it("should have correct JSON body", async () => {
			const error = new NotImplemented("Feature not implemented");
			const response = error.toJson();
			const body = await response.json();

			expect(body).toEqual({
				name: "NotImplemented",
				message: "Feature not implemented",
				cause: undefined,
			});
		});

		it("should include cause in response body", async () => {
			const cause = { method: "PATCH" };
			const error = new NotImplemented("PATCH method not implemented", cause);
			const response = error.toJson();
			const body = await response.json();

			expect(body.cause).toBe(JSON.stringify(cause));
		});

		it("should automatically set Content-Type to application/json", () => {
			const error = new NotImplemented("Feature not implemented");
			const response = error.toJson();

			expect(response.headers.get("Content-Type")).toContain(
				"application/json",
			);
		});
	});

	describe("integration scenarios", () => {
		it("should handle unimplemented API version", async () => {
			const cause = {
				requestedVersion: "v3",
				availableVersions: ["v1", "v2"],
			};
			const error = new NotImplemented("API version not available", cause);
			const response = error.toResponse();
			const body = await response.json();

			expect(response.status).toBe(501);
			expect(body.message).toBe("API version not available");
			expect(body.cause).toBe(JSON.stringify(cause));
		});

		it("should handle unimplemented HTTP method", async () => {
			const cause = {
				method: "TRACE",
				resource: "/api/users",
				supportedMethods: ["GET", "POST", "PUT", "DELETE"],
			};
			const error = new NotImplemented("HTTP method not supported", cause);
			const response = error.toJson();
			const body = await response.json();

			expect(response.status).toBe(501);
			expect(body.name).toBe("NotImplemented");
			expect(body.message).toBe("HTTP method not supported");
		});

		it("should handle planned feature scenario", async () => {
			const cause = {
				feature: "real-time-notifications",
				plannedRelease: "Q2 2026",
				trackingIssue: "FEAT-1234",
			};
			const error = new NotImplemented("Feature coming soon", cause);
			const response = error.toResponse();
			const body = await response.json();

			expect(response.status).toBe(501);
			expect(body.cause).toBe(JSON.stringify(cause));
		});

		it("should handle deprecated endpoint replacement", async () => {
			const error = new NotImplemented(
				"This endpoint has been deprecated and its replacement is not yet available",
			);
			const response = error.toJson();

			expect(response.status).toBe(501);
			expect(response.statusText).toBe(
				"This endpoint has been deprecated and its replacement is not yet available",
			);
		});

		it("should handle unsupported file format", async () => {
			const cause = {
				requestedFormat: "xlsx",
				supportedFormats: ["csv", "json"],
				plannedFormats: ["xlsx", "pdf"],
			};
			const error = new NotImplemented("Export format not supported", cause);
			const response = error.toResponse();
			const body = await response.json();

			expect(response.status).toBe(501);
			expect(body.message).toBe("Export format not supported");
		});

		it("should handle third-party integration not available", async () => {
			const cause = {
				integration: "slack",
				status: "in-development",
				availableIntegrations: ["email", "webhook"],
			};
			const error = new NotImplemented(
				"Slack integration not available",
				cause,
			);
			const response = error.toResponse();

			expect(response.status).toBe(501);
		});
	});

	describe("comparison between toResponse and toJson", () => {
		it("should produce equivalent responses", async () => {
			const error = new NotImplemented("Feature not implemented");
			const response1 = error.toResponse();
			const response2 = error.toJson();

			const body1 = await response1.json();
			const body2 = await response2.json();

			expect(body1).toEqual(body2);
			expect(response1.status).toBe(response2.status);
			expect(response1.statusText).toBe(response2.statusText);
		});

		it("should produce equivalent responses with cause", async () => {
			const cause = { feature: "test-feature", version: "1.0" };
			const error = new NotImplemented("Feature not implemented", cause);
			const response1 = error.toResponse();
			const response2 = error.toJson();

			const body1 = await response1.json();
			const body2 = await response2.json();

			expect(body1).toEqual(body2);
		});
	});

	describe("edge cases", () => {
		it("should handle empty message", () => {
			const error = new NotImplemented("");

			expect(error.statusText).toBe("");
			expect(error.status).toBe(501);
		});

		it("should handle very long message", () => {
			const longMessage = "A".repeat(1000);
			const error = new NotImplemented(longMessage);

			expect(error.statusText).toBe(longMessage);
		});

		it("should handle null cause", () => {
			const error = new NotImplemented("Feature not implemented", null);

			expect(error.cause).toBeUndefined();
		});

		it("should handle undefined cause explicitly", () => {
			const error = new NotImplemented("Feature not implemented", undefined);

			expect(error.cause).toBeUndefined();
		});

		it("should handle array as cause", () => {
			const cause = ["feature1", "feature2", "feature3"];
			const error = new NotImplemented(
				"Multiple features not implemented",
				cause,
			);

			expect(error.cause).toBe(JSON.stringify(cause));
		});

		it("should handle nested object as cause", () => {
			const cause = {
				features: {
					implemented: ["login", "register"],
					pending: ["oauth", "2fa"],
				},
				timeline: {
					oauth: "Q1 2026",
					"2fa": "Q2 2026",
				},
			};
			const error = new NotImplemented("Feature roadmap", cause);

			expect(error.cause).toBe(JSON.stringify(cause));
		});

		it("should handle special characters in message", () => {
			const message = 'Not Implemented: {"feature": "export/import"}';
			const error = new NotImplemented(message);

			expect(error.statusText).toBe(message);
		});

		it("should handle unicode characters in message", () => {
			const message = "Funcionalidade não implementada: 功能未实现";
			const error = new NotImplemented(message);

			expect(error.statusText).toBe(message);
		});

		it("should handle number as cause", () => {
			const error = new NotImplemented("Feature not implemented", 501);

			expect(error.cause).toBe("501");
		});

		it("should handle empty object as cause", () => {
			const error = new NotImplemented("Feature not implemented", {});

			expect(error.cause).toBe("{}");
		});

		it("should handle empty array as cause", () => {
			const error = new NotImplemented("Feature not implemented", []);

			expect(error.cause).toBe("[]");
		});

		it("should handle date object as cause", () => {
			const cause = { plannedDate: new Date("2026-06-01").toISOString() };
			const error = new NotImplemented("Feature coming soon", cause);

			expect(error.cause).toBe(JSON.stringify(cause));
		});
	});
});
