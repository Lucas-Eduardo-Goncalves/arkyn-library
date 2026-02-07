import { SuccessResponse } from "./_successResponse";

/**
 * Class representing a successful HTTP 302 Found response.
 */

class Found extends SuccessResponse {
  /**
   * Creates an instance of the `Found` class.
   *
   * @param {string} message - A message describing the creation status.
   * @param {any} body - The response body to be included in the HTTP response.
   */

  constructor(message: string, body?: any) {
    super();

    this.name = "Found";
    this.status = 302;
    this.statusText = message;
    this.body = body || undefined;

    this.onDebug();
  }

  /**
   * Converts the `Found` instance into a `Response` object.
   * @returns {Response} A `Response` object with the body and response metadata.
   */

  toResponse(): Response {
    const responseInit: ResponseInit = {
      headers: { "Content-Type": "application/json" },
      status: this.status,
      statusText: this.statusText,
    };

    return new Response(JSON.stringify(this.body), responseInit);
  }

  /**
   * Converts the `Found` instance into a `Response` object using the `Response.json` method.
   * This method is an alternative to `toResponse` for generating JSON responses.
   * @returns {Response["json"]} A `Response` object with the JSON body and response metadata.
   */

  toJson(): Response {
    const responseInit: ResponseInit = {
      status: this.status,
      statusText: this.statusText,
    };

    return Response.json(this.body, responseInit);
  }
}

export { Found };
