import { SuccessResponse } from "./_successResponse";

/**
 * HTTP 201 Created — the request succeeded and a new resource was created.
 *
 * @example
 * ```typescript
 * return new Created("User created successfully", { id: user.id }).toJson();
 * ```
 */
class Created extends SuccessResponse {
	/**
	 * @param message - Description included in the response status text.
	 * @param body - Data to include in the response body.
	 */
	constructor(message: string, body?: any) {
		super();

		this.name = "Created";
		this.status = 201;
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

export { Created };
