import { BadResponse } from "./_badResponse";

/**
 * HTTP 403 Forbidden — authenticated but not authorized to access this resource.
 *
 * @example
 * ```typescript
 * throw new Forbidden("You don't have permission to delete this resource");
 * ```
 */
class Forbidden extends BadResponse {
	/**
	 * @param message - Error description.
	 * @param cause - Optional extra context (serialized to JSON).
	 */
	constructor(message: string, cause?: any) {
		super();

		this.name = "Forbidden";
		this.status = 403;
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

export { Forbidden };
