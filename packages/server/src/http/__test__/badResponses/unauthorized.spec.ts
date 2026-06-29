import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Unauthorized } from "../../badResponses/unauthorized";

describe("Unauthorized", () => {
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
			const error = new Unauthorized("Authentication required");

			expect(error.name).toBe("Unauthorized");
			expect(error.status).toBe(401);
			expect(error.statusText).toBe("Authentication required");
		});

		it("should set custom message", () => {
			const error = new Unauthorized("Invalid credentials");

			expect(error.statusText).toBe("Invalid credentials");
		});

		it("should set cause when provided", () => {
			const cause = {
				reason: "token_expired",
				expiredAt: "2026-02-01T10:00:00Z",
			};
			const error = new Unauthorized("Token expired", cause);

			expect(error.cause).toBe(JSON.stringify(cause));
		});

		it("should not set cause when not provided", () => {
			const error = new Unauthorized("Authentication required");

			expect(error.cause).toBeUndefined();
		});

		it("should stringify complex cause object", () => {
			const cause = {
				reason: "invalid_token",
				tokenType: "Bearer",
				errors: ["signature_invalid", "issuer_mismatch"],
			};
			const error = new Unauthorized("Invalid token", cause);

			expect(error.cause).toBe(JSON.stringify(cause));
		});

		it("should call onDebug on instantiation", () => {
			const _error = new Unauthorized("Authentication required");

			expect(consoleLogSpy).toHaveBeenCalled();
		});
	});

	describe("makeBody method", () => {
		it("should return correct body structure", () => {
			const error = new Unauthorized("Authentication required");
			const body = error.makeBody();

			expect(body).toEqual({
				name: "Unauthorized",
				message: "Authentication required",
				cause: undefined,
			});
		});

		it("should include cause in body when provided", () => {
			const cause = { reason: "missing_token" };
			const error = new Unauthorized("No token provided", cause);
			const body = error.makeBody();

			expect(body).toEqual({
				name: "Unauthorized",
				message: "No token provided",
				cause: JSON.stringify(cause),
			});
		});
	});

	describe("toResponse method", () => {
		it("should return Response object", () => {
			const error = new Unauthorized("Authentication required");
			const response = error.toResponse();

			expect(response).toBeInstanceOf(Response);
		});

		it("should have correct status code", () => {
			const error = new Unauthorized("Authentication required");
			const response = error.toResponse();

			expect(response.status).toBe(401);
		});

		it("should have correct status text", () => {
			const error = new Unauthorized("Authentication required");
			const response = error.toResponse();

			expect(response.statusText).toBe("Authentication required");
		});

		it("should have correct Content-Type header", () => {
			const error = new Unauthorized("Authentication required");
			const response = error.toResponse();

			expect(response.headers.get("Content-Type")).toBe("application/json");
		});

		it("should have correct JSON body", async () => {
			const error = new Unauthorized("Authentication required");
			const response = error.toResponse();
			const body = await response.json();

			expect(body).toEqual({
				name: "Unauthorized",
				message: "Authentication required",
				cause: undefined,
			});
		});

		it("should include cause in response body", async () => {
			const cause = { reason: "session_expired" };
			const error = new Unauthorized("Session expired", cause);
			const response = error.toResponse();
			const body = await response.json();

			expect(body.cause).toBe(JSON.stringify(cause));
		});

		it("should return valid JSON string", async () => {
			const error = new Unauthorized("Authentication required");
			const response = error.toResponse();
			const text = await response.text();

			expect(() => JSON.parse(text)).not.toThrow();
		});
	});

	describe("toJson method", () => {
		it("should return Response object", () => {
			const error = new Unauthorized("Authentication required");
			const response = error.toJson();

			expect(response).toBeInstanceOf(Response);
		});

		it("should have correct status code", () => {
			const error = new Unauthorized("Authentication required");
			const response = error.toJson();

			expect(response.status).toBe(401);
		});

		it("should have correct status text", () => {
			const error = new Unauthorized("Authentication required");
			const response = error.toJson();

			expect(response.statusText).toBe("Authentication required");
		});

		it("should have correct JSON body", async () => {
			const error = new Unauthorized("Authentication required");
			const response = error.toJson();
			const body = await response.json();

			expect(body).toEqual({
				name: "Unauthorized",
				message: "Authentication required",
				cause: undefined,
			});
		});

		it("should include cause in response body", async () => {
			const cause = { tokenType: "JWT", error: "malformed" };
			const error = new Unauthorized("Malformed token", cause);
			const response = error.toJson();
			const body = await response.json();

			expect(body.cause).toBe(JSON.stringify(cause));
		});

		it("should automatically set Content-Type to application/json", () => {
			const error = new Unauthorized("Authentication required");
			const response = error.toJson();

			expect(response.headers.get("Content-Type")).toContain(
				"application/json",
			);
		});
	});

	describe("integration scenarios", () => {
		it("should handle missing token scenario", async () => {
			const cause = {
				header: "Authorization",
				expected: "Bearer <token>",
			};
			const error = new Unauthorized("No authentication token provided", cause);
			const response = error.toResponse();
			const body = await response.json();

			expect(response.status).toBe(401);
			expect(body.message).toBe("No authentication token provided");
			expect(body.cause).toBe(JSON.stringify(cause));
		});

		it("should handle expired token scenario", async () => {
			const cause = {
				reason: "token_expired",
				expiredAt: "2026-02-01T12:00:00Z",
				issuedAt: "2026-02-01T10:00:00Z",
			};
			const error = new Unauthorized("Token has expired", cause);
			const response = error.toJson();
			const body = await response.json();

			expect(response.status).toBe(401);
			expect(body.name).toBe("Unauthorized");
			expect(body.message).toBe("Token has expired");
		});

		it("should handle invalid credentials scenario", async () => {
			const cause = {
				field: "password",
				attempts: 3,
				maxAttempts: 5,
			};
			const error = new Unauthorized("Invalid email or password", cause);
			const response = error.toResponse();
			const body = await response.json();

			expect(response.status).toBe(401);
			expect(body.cause).toBe(JSON.stringify(cause));
		});

		it("should handle invalid API key scenario", async () => {
			const error = new Unauthorized("Invalid API key");
			const response = error.toJson();

			expect(response.status).toBe(401);
			expect(response.statusText).toBe("Invalid API key");
		});

		it("should handle revoked token scenario", async () => {
			const cause = {
				reason: "token_revoked",
				revokedAt: "2026-02-02T08:00:00Z",
				revokedBy: "admin",
			};
			const error = new Unauthorized("Token has been revoked", cause);
			const response = error.toResponse();
			const body = await response.json();

			expect(response.status).toBe(401);
			expect(body.message).toBe("Token has been revoked");
		});

		it("should handle session expired scenario", async () => {
			const cause = {
				sessionId: "sess-abc-123",
				lastActivity: "2026-02-02T08:00:00Z",
				timeout: 3600,
			};
			const error = new Unauthorized("Session has expired", cause);
			const response = error.toResponse();

			expect(response.status).toBe(401);
		});

		it("should handle invalid signature scenario", async () => {
			const cause = {
				algorithm: "HS256",
				error: "signature_mismatch",
			};
			const error = new Unauthorized("Token signature is invalid", cause);
			const response = error.toJson();
			const body = await response.json();

			expect(response.status).toBe(401);
			expect(body.cause).toBe(JSON.stringify(cause));
		});

		it("should handle OAuth error scenario", async () => {
			const cause = {
				provider: "google",
				error: "invalid_grant",
				errorDescription: "Token has been expired or revoked",
			};
			const error = new Unauthorized("OAuth authentication failed", cause);
			const response = error.toResponse();
			const body = await response.json();

			expect(response.status).toBe(401);
			expect(body.message).toBe("OAuth authentication failed");
		});
	});

	describe("comparison between toResponse and toJson", () => {
		it("should produce equivalent responses", async () => {
			const error = new Unauthorized("Authentication required");
			const response1 = error.toResponse();
			const response2 = error.toJson();

			const body1 = await response1.json();
			const body2 = await response2.json();

			expect(body1).toEqual(body2);
			expect(response1.status).toBe(response2.status);
			expect(response1.statusText).toBe(response2.statusText);
		});

		it("should produce equivalent responses with cause", async () => {
			const cause = { reason: "invalid_token", type: "Bearer" };
			const error = new Unauthorized("Invalid token", cause);
			const response1 = error.toResponse();
			const response2 = error.toJson();

			const body1 = await response1.json();
			const body2 = await response2.json();

			expect(body1).toEqual(body2);
		});
	});

	describe("edge cases", () => {
		it("should handle empty message", () => {
			const error = new Unauthorized("");

			expect(error.statusText).toBe("");
			expect(error.status).toBe(401);
		});

		it("should handle very long message", () => {
			const longMessage = "A".repeat(1000);
			const error = new Unauthorized(longMessage);

			expect(error.statusText).toBe(longMessage);
		});

		it("should handle null cause", () => {
			const error = new Unauthorized("Authentication required", null);

			expect(error.cause).toBeUndefined();
		});

		it("should handle undefined cause explicitly", () => {
			const error = new Unauthorized("Authentication required", undefined);

			expect(error.cause).toBeUndefined();
		});

		it("should handle array as cause", () => {
			const cause = ["missing_token", "invalid_format", "expired"];
			const error = new Unauthorized("Multiple authentication errors", cause);

			expect(error.cause).toBe(JSON.stringify(cause));
		});

		it("should handle nested object as cause", () => {
			const cause = {
				token: {
					type: "JWT",
					errors: {
						header: "invalid_algorithm",
						payload: "missing_claims",
					},
				},
				validation: {
					passed: false,
					checks: ["signature", "expiration", "issuer"],
				},
			};
			const error = new Unauthorized("Token validation failed", cause);

			expect(error.cause).toBe(JSON.stringify(cause));
		});

		it("should handle special characters in message", () => {
			const message = 'Unauthorized: {"error": "invalid_token"}';
			const error = new Unauthorized(message);

			expect(error.statusText).toBe(message);
		});

		it("should handle unicode characters in message", () => {
			const message = "Não autorizado: 未经授权";
			const error = new Unauthorized(message);

			expect(error.statusText).toBe(message);
		});

		it("should handle number as cause", () => {
			const error = new Unauthorized("Authentication required", 401);

			expect(error.cause).toBe("401");
		});

		it("should handle empty object as cause", () => {
			const error = new Unauthorized("Authentication required", {});

			expect(error.cause).toBe("{}");
		});

		it("should handle empty array as cause", () => {
			const error = new Unauthorized("Authentication required", []);

			expect(error.cause).toBe("[]");
		});

		it("should handle JWT claims as cause", () => {
			const cause = {
				iss: "https://auth.example.com",
				sub: "user-123",
				aud: "api.example.com",
				exp: 1738454400,
				iat: 1738450800,
			};
			const error = new Unauthorized("Invalid JWT claims", cause);

			expect(error.cause).toBe(JSON.stringify(cause));
		});

		it("should handle authentication header info as cause", () => {
			const cause = {
				scheme: "Bearer",
				realm: "api",
				error: "invalid_token",
				errorDescription: "The access token expired",
			};
			const error = new Unauthorized("Bearer authentication failed", cause);

			expect(error.cause).toBe(JSON.stringify(cause));
		});
	});
});
