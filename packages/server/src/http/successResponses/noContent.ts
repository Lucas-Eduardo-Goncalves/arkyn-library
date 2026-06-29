import { SuccessResponse } from "./_successResponse";

/**
 * HTTP 204 No Content — the request succeeded but there is no content to return.
 * Typically used for delete or update operations where a body is not needed.
 *
 * @example
 * ```typescript
 * return new NoContent("Record deleted").toResponse();
 * ```
 */
class NoContent extends SuccessResponse {
	/**
	 * @param message - Description included in the response status text.
	 */
	constructor(message: string) {
		super();

		this.name = "NoContent";
		this.status = 204;
		this.statusText = message;

		this.onDebug();
	}

	/** Converts to a `Response` with `Content-Type: application/json` header and no body. */
	toResponse(): Response {
		const responseInit: ResponseInit = {
			headers: { "Content-Type": "application/json" },
			status: this.status,
			statusText: this.statusText,
		};

		return new Response(null, responseInit);
	}
}

export { NoContent };
