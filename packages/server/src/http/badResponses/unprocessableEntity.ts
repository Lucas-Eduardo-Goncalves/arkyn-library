import { BadResponse } from "./_badResponse";

/**
 * HTTP 422 Unprocessable Entity — the request is well-formed but contains semantic validation errors.
 * Typically used for form field validation failures.
 *
 * @example
 * ```typescript
 * throw new UnprocessableEntity({
 *   message: "Validation failed",
 *   fieldErrors: { email: "Invalid email format", age: "Must be 18 or older" },
 *   fields: { email: "not-an-email", age: "15" },
 * });
 * ```
 */
class UnprocessableEntity extends BadResponse {
	/**
	 * @param props.message - Human-readable description of the error.
	 * @param props.fieldErrors - Per-field validation messages keyed by field name.
	 * @param props.fields - Original submitted field values (useful for repopulating forms).
	 * @param props.data - Any extra data to include in the response body.
	 */
	constructor(props: {
		// biome-ignore lint/suspicious/noExplicitAny: intentional
		data?: any;
		fieldErrors?: Record<string, string>;
		fields?: Record<string, string>;
		message?: string;
	}) {
		super();

		this.name = "UnprocessableEntity";
		this.status = 422;
		this.statusText = props.message || "Unprocessable entity";
		this.debugColor = "yellow";
		this.cause = {
			data: props.data,
			fieldErrors: props.fieldErrors,
			fields: props.fields,
		};

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

export { UnprocessableEntity };
