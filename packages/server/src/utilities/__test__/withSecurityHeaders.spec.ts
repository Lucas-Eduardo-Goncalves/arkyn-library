import { describe, expect, it } from "vitest";
import { Success } from "../../http/successResponses/success";
import { withSecurityHeaders } from "../withSecurityHeaders";

describe("withSecurityHeaders (DX-09)", () => {
	it("should apply the default security headers", () => {
		const response = new Response("ok");

		withSecurityHeaders(response);

		expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
		expect(response.headers.get("X-Frame-Options")).toBe("DENY");
		expect(response.headers.get("Referrer-Policy")).toBe(
			"strict-origin-when-cross-origin",
		);
	});

	it("should return the same Response instance (not a clone)", () => {
		const response = new Response("ok");

		const result = withSecurityHeaders(response);

		expect(result).toBe(response);
	});

	it("should preserve the response body and existing headers", async () => {
		const response = new Response("hello", {
			headers: { "Content-Type": "text/plain" },
		});

		const result = withSecurityHeaders(response);

		expect(await result.text()).toBe("hello");
		expect(result.headers.get("Content-Type")).toBe("text/plain");
	});

	it("should preserve status and statusText", () => {
		const response = new Response("nope", {
			status: 404,
			statusText: "Not Found",
		});

		const result = withSecurityHeaders(response);

		expect(result.status).toBe(404);
		expect(result.statusText).toBe("Not Found");
	});

	it("should work on a response produced by an @arkyn/server response class", () => {
		const response = withSecurityHeaders(
			new Success("OK", { id: 1 }).toResponse(),
		);

		expect(response.headers.get("X-Frame-Options")).toBe("DENY");
		expect(response.headers.get("Content-Type")).toBe("application/json");
	});

	describe("overrides", () => {
		it("should replace a default header value with a custom one", () => {
			const response = new Response("ok");

			withSecurityHeaders(response, { "X-Frame-Options": "SAMEORIGIN" });

			expect(response.headers.get("X-Frame-Options")).toBe("SAMEORIGIN");
		});

		it("should remove a default header when overridden with null", () => {
			const response = new Response("ok");

			withSecurityHeaders(response, { "X-Frame-Options": null });

			expect(response.headers.has("X-Frame-Options")).toBe(false);
			// Other defaults are unaffected.
			expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
		});

		it("should not set Content-Security-Policy or Strict-Transport-Security by default", () => {
			const response = new Response("ok");

			withSecurityHeaders(response);

			expect(response.headers.has("Content-Security-Policy")).toBe(false);
			expect(response.headers.has("Strict-Transport-Security")).toBe(false);
		});

		it("should allow adding an arbitrary extra header (e.g. a CSP) via overrides", () => {
			const response = new Response("ok");

			withSecurityHeaders(response, {
				"Content-Security-Policy": "default-src 'self'",
			});

			expect(response.headers.get("Content-Security-Policy")).toBe(
				"default-src 'self'",
			);
		});

		it("should allow multiple overrides at once", () => {
			const response = new Response("ok");

			withSecurityHeaders(response, {
				"X-Frame-Options": null,
				"Referrer-Policy": "no-referrer",
				"Strict-Transport-Security": "max-age=63072000",
			});

			expect(response.headers.has("X-Frame-Options")).toBe(false);
			expect(response.headers.get("Referrer-Policy")).toBe("no-referrer");
			expect(response.headers.get("Strict-Transport-Security")).toBe(
				"max-age=63072000",
			);
			expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
		});
	});
});
