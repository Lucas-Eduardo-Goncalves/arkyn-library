import { SuccessResponse } from "./_successResponse";

/**
 * Represents a successful HTTP response with a status code of 204 (No Content).
 * This class is used to standardize the structure of a "No Content" response,
 * including headers, status, and status text.
 */

class NoContent extends SuccessResponse {
  headers: ResponseInit["headers"];
  status: number;
  statusText: string;

  /**
   * Creates an instance of the `NoContent` class.
   *
   * @param init - Optional initialization object for customizing headers, status, and status text.
   */

  constructor(init?: ResponseInit) {
    super();

    this.headers = init?.headers || {};
    this.status = init?.status || 204;
    this.statusText = init?.statusText ?? "No content";

    this.onDebug("No content", null);
  }

  /**
   * Converts the `NoContent` instance into a `Response` object.
   * This method ensures the response has the appropriate headers, status, and status text.
   *
   * @returns A `Response` object with no body and response metadata.
   */

  toResponse(): Response {
    const responseInit: ResponseInit = {
      headers: this.headers,
      status: this.status,
      statusText: this.statusText,
    };

    return new Response(null, responseInit);
  }
}

export { NoContent };
