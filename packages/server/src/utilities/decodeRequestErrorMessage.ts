/**
 * Extracts a human-readable error message from an API response body or a `Response` object.
 * Checks `data.message`, `data.operator_erro_message`, `data.error`, `data.error.message`,
 * and `response.statusText` in that order. Falls back to `"Missing error message"`.
 *
 * @param data - Parsed response body that may contain error info.
 * @param response - The raw `Response` object, used as a fallback for `statusText`.
 * @returns The first non-empty string error message found.
 *
 * @example
 * ```typescript
 * const res = await fetch("/api/orders");
 * const data = await res.json().catch(() => null);
 * const message = decodeRequestErrorMessage(data, res);
 * ```
 */

// biome-ignore lint/suspicious/noExplicitAny: intentional
function decodeRequestErrorMessage(data: any, response: Response): string {
	if (data?.message && typeof data?.message === "string") {
		return data?.message;
	}

	if (
		data?.operator_erro_message &&
		typeof data?.operator_erro_message === "string"
	) {
		return data?.operator_erro_message;
	}

	if (data?.error && typeof data?.error === "string") {
		return data?.error;
	}

	if (data?.error?.message && typeof data?.error?.message === "string") {
		return data?.error?.message;
	}

	if (response?.statusText && typeof response?.statusText === "string") {
		return response?.statusText;
	}

	return "Missing error message";
}

export { decodeRequestErrorMessage };
