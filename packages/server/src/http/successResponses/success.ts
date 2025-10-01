import { SuccessResponse } from "./_successResponse";

/**
 * Represents a successful HTTP response with a status code of 200 (OK).
 * This class is used to standardize the structure of a "Success" response,
 * including the response body, headers, status, and status text.
 *
 * @template T - The type of the response body.
 */

class Success<T> extends SuccessResponse {
  body: T;
  headers: ResponseInit["headers"];
  status: number;
  statusText: string;

  /**
   * Creates an instance of the `Success` class.
   *
   * @param body - The response body to be included in the HTTP response.
   * @param init - Optional initialization object for customizing headers, status, and status text.
   */

  constructor(body: T, init?: ResponseInit) {
    super();

    this.body = body;
    this.headers = init?.headers || {};
    this.status = init?.status || 200;
    this.statusText = init?.statusText ?? "OK";

    this.onDebug("Success", body);
  }

  /**
   * Converts the `Success` instance into a `Response` object with a JSON body.
   * This method ensures the response has the appropriate headers, status, and status text.
   *
   * @returns A `Response` object with the serialized JSON body and response metadata.
   */

  toResponse(): Response {
    const responseInit: ResponseInit = {
      headers: { "Content-Type": "application/json", ...this.headers },
      status: this.status,
      statusText: this.statusText,
    };

    return new Response(JSON.stringify(this.body), responseInit);
  }

  /**
   * Converts the `Success` instance into a `Response` object using the `Response.json` method.
   * This method is an alternative to `toResponse` for generating JSON responses.
   *
   * @returns A `Response` object with the JSON body and response metadata.
   */

  toJson(): Response {
    const responseInit: ResponseInit = {
      headers: this.headers,
      status: this.status,
      statusText: this.statusText,
    };

    return Response.json(this.body, responseInit);
  }
}

export { Success };
