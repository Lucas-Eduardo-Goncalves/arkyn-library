import { BadResponse } from "./_badResponse";

/**
 * HTTP 400 Bad Request — the request is malformed or contains invalid data.
 *
 * @example
 * ```typescript
 * throw new BadRequest("Invalid request body");
 * ```
 */
class BadRequest extends BadResponse {
	/**
	 * @param message - Error description.
	 * @param cause - Optional extra context (serialized to JSON).
	 */
	// biome-ignore lint/suspicious/noExplicitAny: intentional
	constructor(message: string, cause?: any) {
		super();

		this.name = "BadRequest";
		this.status = 400;
		this.statusText = message;
		this.cause = cause ? JSON.stringify(cause) : undefined;

		this.onDebug();
	}

	/** Converts to a `Response` with `Content-Type: application/json` header. */
	toResponse(): Response {
		const responseInit: ResponseInit = {
			headers: { "Content-Type": "application/json" },
			status: this.status,
			statusText: this.statusText,
		};

		return new Response(JSON.stringify(this.makeBody()), responseInit);
	}

	/** Converts to a `Response` using `Response.json()`. Alternative to `toResponse()`. */
	toJson(): Response {
		const responseInit: ResponseInit = {
			status: this.status,
			statusText: this.statusText,
		};

		return Response.json(this.makeBody(), responseInit);
	}
}

export { BadRequest };
