import { BadResponse } from "./_badResponse";

/**
 * Represents an HTTP error response with a status code of 501 (Not Implemented).
 * This class is used to standardize the structure of a "Not Implemented" error response,
 * including the response body, headers, status, and status text.
 */

class NotImplemented extends BadResponse {
  body: any;
  cause?: any;
  status: number = 501;
  statusText: string;

  /**
   * Creates an instance of the `NotImplemented` class.
   *
   * @param message - A descriptive message explaining why the functionality is not implemented.
   * @param cause - Optional additional information about the cause of the error.
   */

  constructor(message: string, cause?: any) {
    super();

    this.body = { name: "NotImplemented", message: message };
    this.statusText = message;
    this.cause = cause ? JSON.stringify(cause) : undefined;

    this.onDebug({
      name: "NotImplemented",
      body: this.body,
      cause: this.cause,
      message: this.statusText,
    });
  }

  /**
   * Converts the `NotImplemented` instance into a `Response` object with a JSON body.
   * This method ensures the response has the appropriate headers, status, and status text.
   *
   * @returns A `Response` object with the serialized JSON body and response metadata.
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
   * Converts the `NotImplemented` instance into a `Response` object using the `Response.json` method.
   * This method is an alternative to `toResponse` for generating JSON error responses.
   *
   * @returns A `Response` object with the JSON body and response metadata.
   */

  toJson(): Response {
    const responseInit: ResponseInit = {
      status: this.status,
      statusText: this.statusText,
    };

    return Response.json(this.body, responseInit);
  }
}

export { NotImplemented };
