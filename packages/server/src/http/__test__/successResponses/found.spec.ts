import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Found } from "../../successResponses/found";

describe("Found", () => {
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
			const response = new Found("Resource found");

			expect(response.name).toBe("Found");
			expect(response.status).toBe(302);
			expect(response.statusText).toBe("Resource found");
		});

		it("should set custom message", () => {
			const response = new Found("Redirecting to new location");

			expect(response.statusText).toBe("Redirecting to new location");
		});

		it("should set body when provided", () => {
			const body = { redirectUrl: "https://example.com/new-location" };
			const response = new Found("Redirect", body);

			expect(response.body).toEqual(body);
		});

		it("should set body as undefined when not provided", () => {
			const response = new Found("Resource found");

			expect(response.body).toBeNull();
		});

		it("should handle complex body object", () => {
			const body = {
				location: "https://example.com/redirect",
				metadata: {
					reason: "moved_permanently",
					originalPath: "/old-path",
				},
			};
			const response = new Found("Redirecting", body);

			expect(response.body).toEqual(body);
		});

		it("should call onDebug on instantiation", () => {
			const _response = new Found("Resource found");

			expect(consoleLogSpy).toHaveBeenCalled();
		});

		it("should handle null body", () => {
			const response = new Found("Resource found", null);

			expect(response.body).toBeNull();
		});

		it("should handle empty object body", () => {
			const response = new Found("Resource found", {});

			expect(response.body).toEqual({});
		});

		it("should handle array as body", () => {
			const body = [{ url: "/location-1" }, { url: "/location-2" }];
			const response = new Found("Multiple redirects", body);

			expect(response.body).toEqual(body);
		});
	});

	describe("toResponse method", () => {
		it("should return Response object", () => {
			const response = new Found("Resource found");
			const httpResponse = response.toResponse();

			expect(httpResponse).toBeInstanceOf(Response);
		});

		it("should have correct status code", () => {
			const response = new Found("Resource found");
			const httpResponse = response.toResponse();

			expect(httpResponse.status).toBe(302);
		});

		it("should have correct status text", () => {
			const response = new Found("Redirecting to dashboard");
			const httpResponse = response.toResponse();

			expect(httpResponse.statusText).toBe("Redirecting to dashboard");
		});

		it("should have correct Content-Type header", () => {
			const response = new Found("Resource found");
			const httpResponse = response.toResponse();

			expect(httpResponse.headers.get("Content-Type")).toBe("application/json");
		});

		it("should have correct JSON body", async () => {
			const body = { redirectUrl: "https://example.com" };
			const response = new Found("Redirect", body);
			const httpResponse = response.toResponse();
			const responseBody = await httpResponse.json();

			expect(responseBody).toEqual(body);
		});

		it("should handle undefined body", async () => {
			const response = new Found("Resource found");
			const httpResponse = response.toResponse();
			const text = await httpResponse.text();

			expect(text).toBe("null");
		});

		it("should return valid JSON string when body is provided", async () => {
			const body = { url: "https://example.com" };
			const response = new Found("Redirect", body);
			const httpResponse = response.toResponse();
			const text = await httpResponse.text();

			expect(() => JSON.parse(text)).not.toThrow();
		});

		it("should handle complex nested body", async () => {
			const body = {
				redirect: {
					primary: "https://example.com/primary",
					fallback: "https://example.com/fallback",
					options: {
						preserveQuery: true,
						timeout: 5000,
					},
				},
			};
			const response = new Found("Redirect with options", body);
			const httpResponse = response.toResponse();
			const responseBody = await httpResponse.json();

			expect(responseBody).toEqual(body);
		});
	});

	describe("toJson method", () => {
		it("should return Response object", () => {
			const response = new Found("Resource found");
			const httpResponse = response.toJson();

			expect(httpResponse).toBeInstanceOf(Response);
		});

		it("should have correct status code", () => {
			const response = new Found("Resource found");
			const httpResponse = response.toJson();

			expect(httpResponse.status).toBe(302);
		});

		it("should have correct status text", () => {
			const response = new Found("Redirecting to login");
			const httpResponse = response.toJson();

			expect(httpResponse.statusText).toBe("Redirecting to login");
		});

		it("should have correct JSON body", async () => {
			const body = { location: "/new-path" };
			const response = new Found("Redirect", body);
			const httpResponse = response.toJson();
			const responseBody = await httpResponse.json();

			expect(responseBody).toEqual(body);
		});

		it("should automatically set Content-Type to application/json", () => {
			const response = new Found("Redirect", { url: "/path" });
			const httpResponse = response.toJson();

			expect(httpResponse.headers.get("Content-Type")).toContain(
				"application/json",
			);
		});

		it("should handle null body in response", async () => {
			const response = new Found("Resource found");
			const httpResponse = response.toJson();
			const responseBody = await httpResponse.json();

			expect(responseBody).toBeNull();
		});

		it("should handle array body", async () => {
			const body = [{ url: "/path-1" }, { url: "/path-2" }];
			const response = new Found("Multiple options", body);
			const httpResponse = response.toJson();
			const responseBody = await httpResponse.json();

			expect(responseBody).toEqual(body);
		});
	});

	describe("integration scenarios", () => {
		it("should handle OAuth redirect response", async () => {
			const body = {
				redirectUrl: "https://oauth.provider.com/authorize",
				state: "abc123",
				nonce: "xyz789",
			};
			const response = new Found("Redirecting to OAuth provider", body);
			const httpResponse = response.toResponse();
			const responseBody = await httpResponse.json();

			expect(httpResponse.status).toBe(302);
			expect(responseBody.redirectUrl).toContain("oauth.provider.com");
			expect(responseBody.state).toBe("abc123");
		});

		it("should handle login redirect response", async () => {
			const body = {
				location: "/dashboard",
				user: {
					id: "user-123",
					sessionToken: "sess-abc-xyz",
				},
			};
			const response = new Found("Login successful, redirecting", body);
			const httpResponse = response.toJson();
			const responseBody = await httpResponse.json();

			expect(httpResponse.status).toBe(302);
			expect(responseBody.location).toBe("/dashboard");
			expect(responseBody.user.id).toBe("user-123");
		});

		it("should handle payment redirect response", async () => {
			const body = {
				paymentUrl: "https://payment.gateway.com/checkout/abc123",
				orderId: "order-456",
				expiresAt: "2026-02-02T11:00:00Z",
			};
			const response = new Found("Redirecting to payment gateway", body);
			const httpResponse = response.toResponse();
			const responseBody = await httpResponse.json();

			expect(httpResponse.status).toBe(302);
			expect(responseBody.paymentUrl).toContain("payment.gateway.com");
			expect(responseBody.orderId).toBe("order-456");
		});

		it("should handle URL shortener redirect", async () => {
			const body = {
				originalUrl: "https://example.com/very/long/path/to/resource",
				shortCode: "abc123",
				clicks: 42,
			};
			const response = new Found("Redirecting to original URL", body);
			const httpResponse = response.toJson();
			const responseBody = await httpResponse.json();

			expect(httpResponse.status).toBe(302);
			expect(responseBody.originalUrl).toContain("example.com");
			expect(responseBody.clicks).toBe(42);
		});

		it("should handle temporary redirect for maintenance", async () => {
			const body = {
				maintenanceUrl: "/maintenance",
				estimatedEndTime: "2026-02-02T14:00:00Z",
				message: "System under maintenance",
			};
			const response = new Found("Temporary redirect", body);
			const httpResponse = response.toResponse();
			const responseBody = await httpResponse.json();

			expect(httpResponse.status).toBe(302);
			expect(responseBody.maintenanceUrl).toBe("/maintenance");
		});

		it("should handle A/B testing redirect", async () => {
			const body = {
				variant: "B",
				redirectUrl: "/experiment/variant-b",
				experimentId: "exp-001",
			};
			const response = new Found("Redirecting to experiment variant", body);
			const httpResponse = response.toJson();
			const responseBody = await httpResponse.json();

			expect(httpResponse.status).toBe(302);
			expect(responseBody.variant).toBe("B");
		});
	});

	describe("comparison between toResponse and toJson", () => {
		it("should produce equivalent responses with body", async () => {
			const body = { url: "/redirect-target" };
			const response = new Found("Redirect", body);
			const response1 = response.toResponse();
			const response2 = response.toJson();

			const body1 = await response1.json();
			const body2 = await response2.json();

			expect(body1).toEqual(body2);
			expect(response1.status).toBe(response2.status);
			expect(response1.statusText).toBe(response2.statusText);
		});

		it("should produce equivalent responses with complex body", async () => {
			const body = {
				redirect: { primary: "/main", fallback: "/backup" },
				metadata: { reason: "moved" },
			};
			const response = new Found("Complex redirect", body);
			const response1 = response.toResponse();
			const response2 = response.toJson();

			const body1 = await response1.json();
			const body2 = await response2.json();

			expect(body1).toEqual(body2);
		});

		it("should have consistent status codes", () => {
			const response = new Found("Redirect");
			const response1 = response.toResponse();
			const response2 = response.toJson();

			expect(response1.status).toBe(302);
			expect(response2.status).toBe(302);
		});

		it("should have consistent status text", () => {
			const response = new Found("Custom redirect message");
			const response1 = response.toResponse();
			const response2 = response.toJson();

			expect(response1.statusText).toBe("Custom redirect message");
			expect(response2.statusText).toBe("Custom redirect message");
		});
	});

	describe("edge cases", () => {
		it("should handle empty message", () => {
			const response = new Found("");

			expect(response.statusText).toBe("");
			expect(response.status).toBe(302);
		});

		it("should handle very long message", () => {
			const longMessage = "A".repeat(1000);
			const response = new Found(longMessage);

			expect(response.statusText).toBe(longMessage);
		});

		it("should handle special characters in message", () => {
			const message = 'Found: {"redirect": "/path"}';
			const response = new Found(message);

			expect(response.statusText).toBe(message);
		});

		it("should handle unicode characters in message", () => {
			const message = "Redirecionando: リダイレクト中";
			const response = new Found(message);

			expect(response.statusText).toBe(message);
		});

		it("should handle deeply nested body object", () => {
			const body = {
				level1: {
					level2: {
						level3: {
							level4: {
								url: "/deep-path",
							},
						},
					},
				},
			};
			const response = new Found("Deep redirect", body);

			expect(response.body.level1.level2.level3.level4.url).toBe("/deep-path");
		});

		it("should handle body with Date object", async () => {
			const date = new Date("2026-02-02T10:00:00Z");
			const body = { expiresAt: date.toISOString() };
			const response = new Found("Redirect", body);
			const httpResponse = response.toResponse();
			const responseBody = await httpResponse.json();

			expect(responseBody.expiresAt).toBe("2026-02-02T10:00:00.000Z");
		});

		it("should handle body with boolean values", () => {
			const body = {
				permanent: false,
				preserveMethod: true,
			};
			const response = new Found("Redirect", body);

			expect(response.body.permanent).toBe(false);
			expect(response.body.preserveMethod).toBe(true);
		});

		it("should handle body with numeric values", () => {
			const body = {
				statusCode: 302,
				retryAfter: 5,
				ttl: 3600,
			};
			const response = new Found("Redirect", body);

			expect(response.body.statusCode).toBe(302);
			expect(response.body.retryAfter).toBe(5);
			expect(response.body.ttl).toBe(3600);
		});

		it("should handle empty array as body", () => {
			const response = new Found("Redirect", []);

			expect(response.body).toEqual([]);
		});

		it("should handle string as body", () => {
			const response = new Found("Redirect", "https://example.com");

			expect(response.body).toBe("https://example.com");
		});

		it("should handle URL with query parameters in body", async () => {
			const body = {
				redirectUrl: "https://example.com/path?param1=value1&param2=value2",
			};
			const response = new Found("Redirect with params", body);
			const httpResponse = response.toJson();
			const responseBody = await httpResponse.json();

			expect(responseBody.redirectUrl).toContain("param1=value1");
			expect(responseBody.redirectUrl).toContain("param2=value2");
		});

		it("should handle URL with hash fragment in body", async () => {
			const body = {
				redirectUrl: "https://example.com/page#section",
			};
			const response = new Found("Redirect with hash", body);
			const httpResponse = response.toResponse();
			const responseBody = await httpResponse.json();

			expect(responseBody.redirectUrl).toContain("#section");
		});
	});
});
