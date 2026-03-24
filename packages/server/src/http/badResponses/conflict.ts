import { BadResponse } from "./_badResponse";

/**
 * Represents an HTTP error response with a status code of 409 (Conflict).
 * This class is used to standardize the structure of a "Conflict" error response,
 * including the response body, headers, status, and status text.
 */

class Conflict extends BadResponse {
  /**
   * Creates an instance of the `Conflict` class.
   *
   * @param {string} message - A descriptive message explaining the cause of the conflict.
   * @param {any} cause - Optional additional information about the cause of the conflict.
   */

  constructor(message: string, cause?: any) {
    super();

    this.name = "Conflict";
    this.status = 409;
    this.statusText = message;
    this.debugColor = "yellow";
    this.cause = cause ? JSON.stringify(cause) : undefined;

    this.onDebug();
  }

  /**
   * Converts the `Conflict` instance into a `Response` object with a JSON body.
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
   * Converts the `Conflict` instance into a `Response` object using the `Response.json` method.
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

export { Conflict };
