import { SuccessResponse } from "./_successResponse";

/**
 * HTTP 200 OK — the request succeeded and the response body contains the result.
 *
 * @example
 * ```typescript
 * return new Success("Order fetched", { order }).toJson();
 * ```
 */
class Success extends SuccessResponse {
	/**
	 * @param message - Description included in the response status text.
	 * @param body - Data to include in the response body.
	 */
	// biome-ignore lint/suspicious/noExplicitAny: intentional
	constructor(message: string, body?: any) {
		super();

		this.name = "Success";
		this.status = 200;
		this.statusText = message;
		this.body = body || undefined;

		this.onDebug();
	}

	/** Converts to a `Response` with `Content-Type: application/json` header. */
	toResponse(): Response {
		const responseInit: ResponseInit = {
			headers: { "Content-Type": "application/json" },
			status: this.status,
			statusText: this.statusText,
		};

		return new Response(JSON.stringify(this.body), responseInit);
	}

	/** Converts to a `Response` using `Response.json()`. Alternative to `toResponse()`. */
	toJson(): Response {
		const responseInit: ResponseInit = {
			status: this.status,
			statusText: this.statusText,
		};

		return Response.json(this.body, responseInit);
	}
}

export { Success };
