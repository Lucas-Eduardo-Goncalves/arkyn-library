import { SuccessResponse } from "./_successResponse";

/**
 * Class representing a successful HTTP 204 NoContent response.
 */

class NoContent extends SuccessResponse {
  /**
   * Creates an instance of the `NoContent` class.
   * @param {string} message - A message describing the creation status.
   */

  constructor(message: string) {
    super();

    this.name = "NoContent";
    this.status = 204;
    this.statusText = message;

    this.onDebug();
  }

  /**
   * Converts the `NoContent` instance into a `Response` object.
   * @returns {Response} A `Response` object with the body and response metadata.
   */

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
