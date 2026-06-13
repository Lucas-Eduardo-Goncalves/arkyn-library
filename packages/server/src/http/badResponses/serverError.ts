import { BadResponse } from "./_badResponse";

/**
 * HTTP 500 Internal Server Error — an unexpected condition prevented the server from fulfilling the request.
 *
 * @example
 * ```typescript
 * throw new ServerError("Failed to connect to the database");
 * ```
 */
class ServerError extends BadResponse {
  /**
   * @param message - Error description.
   * @param cause - Optional extra context (serialized to JSON).
   */
  constructor(message: string, cause?: any) {
    super();

    this.name = "ServerError";
    this.status = 500;
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

export { ServerError };
