import { BadResponse } from "./_badResponse";

/**
 * HTTP 502 Bad Gateway — the upstream server returned an invalid or unexpected response.
 *
 * Throw inside a server action/loader and catch with `errorHandler`, or call `.toJson()` directly.
 *
 * @example
 * ```typescript
 * throw new BadGateway("Payment gateway unavailable");
 * ```
 */
class BadGateway extends BadResponse {
  /**
   * @param message - Error description sent in the response body and logged for debugging.
   * @param cause - Optional extra context (serialized to JSON in the response).
   */
  constructor(message: string, cause?: any) {
    super();

    this.name = "BadGateway";
    this.status = 502;
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

export { BadGateway };
