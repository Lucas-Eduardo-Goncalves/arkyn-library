import { BadResponse } from "./_badResponse";

/**
 * Represents an HTTP error response with a status code of 400 (Bad Request).
 * This class is used to standardize the structure of a "Bad Request" error response,
 * including the response body, headers, status, and status text.
 */

class BadRequest extends BadResponse {
  /**
   * Creates an instance of the `BadRequest` class.
   *
   * @param {string} message - A descriptive message explaining the cause of the error.
   * @param {any} cause - Optional additional information about the cause of the error.
   */

  constructor(message: string, cause?: any) {
    super();

    this.name = "BadRequest";
    this.status = 400;
    this.statusText = message;
    this.cause = cause ? JSON.stringify(cause) : undefined;

    this.onDebug();
  }

  /**
   * Converts the `BadRequest` instance into a `Response` object with a JSON body.
   * This method ensures the response has the appropriate headers, status, and status text.
   *
   * @returns {Response} A `Response` object with the serialized JSON body and response metadata.
   */

  toResponse(): Response {
    const responseInit: ResponseInit = {
      headers: { "Content-Type": "application/json" },
      status: this.status,
      statusText: this.statusText,
    };

    return new Response(JSON.stringify(this.makeBody()), responseInit);
  }

  /**
   * Converts the `BadRequest` instance into a `Response` object using the `Response.json` method.
   * This method is an alternative to `toResponse` for generating JSON error responses.
   *
   * @returns {Response["json"]} A `Response` object with the JSON body and response metadata.
   */

  toJson(): Response {
    const responseInit: ResponseInit = {
      status: this.status,
      statusText: this.statusText,
    };

    return Response.json(this.makeBody(), responseInit);
  }
}

export { BadRequest };
