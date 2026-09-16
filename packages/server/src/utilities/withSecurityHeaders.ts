const DEFAULT_SECURITY_HEADERS: Record<string, string> = {
	"X-Content-Type-Options": "nosniff",
	"X-Frame-Options": "DENY",
	"Referrer-Policy": "strict-origin-when-cross-origin",
};

type SecurityHeaderOverrides = Record<string, string | null>;

/**
 * Adds a small set of standard security headers to a `Response`, mutating and
 * returning the same instance (`Response.headers` is mutable for responses
 * constructed via `new Response()`/`Response.json()`, which is what every
 * `@arkyn/server` response class produces).
 *
 * Opt-in only — nothing in `@arkyn/server` calls this automatically, so it
 * never changes behavior for existing consumers unless they call it
 * themselves, e.g. `return withSecurityHeaders(new Success(...).toResponse())`.
 *
 * Defaults applied (each can be replaced or removed via `overrides` — see below):
 * - `X-Content-Type-Options: nosniff`
 * - `X-Frame-Options: DENY`
 * - `Referrer-Policy: strict-origin-when-cross-origin`
 *
 * `Content-Security-Policy` and `Strict-Transport-Security` are intentionally
 * **not** included by default: a wrong CSP can break an app's own scripts/styles,
 * and HSTS assumes HTTPS is already correctly configured — both are too
 * app-specific to guess safely. Pass them via `overrides` if you want them.
 *
 * @param response - The `Response` to add headers to.
 * @param overrides - Per-header customization: a string sets/replaces that
 * header (works for the defaults above or any other header, e.g. `Content-Security-Policy`);
 * `null` removes a default instead of applying it.
 * @returns The same `Response` instance, for chaining.
 *
 * @example
 * ```typescript
 * import { Success, withSecurityHeaders } from "@arkyn/server";
 *
 * export async function loader() {
 *   return withSecurityHeaders(new Success("OK", { data }).toResponse());
 * }
 *
 * // Disable one default, add a CSP
 * withSecurityHeaders(response, {
 *   "X-Frame-Options": null,
 *   "Content-Security-Policy": "default-src 'self'",
 * });
 * ```
 */
function withSecurityHeaders(
	response: Response,
	overrides?: SecurityHeaderOverrides,
): Response {
	const merged = { ...DEFAULT_SECURITY_HEADERS, ...overrides };

	for (const [name, value] of Object.entries(merged)) {
		if (value === null) response.headers.delete(name);
		else response.headers.set(name, value);
	}

	return response;
}

export { withSecurityHeaders };
