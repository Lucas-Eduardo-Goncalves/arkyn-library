import { BadResponse } from "./_badResponse";

/**
 * Represents an HTTP error response with a status code of 422 (Unprocessable Entity).
 * This class is used to standardize the structure of an "Unprocessable Entity" error response,
 * including the response body, headers, status, and status text.
 */

class UnprocessableEntity extends BadResponse {
  /**
   * Creates an instance of the `UnprocessableEntity` class.
   *
   * @param {object} props - An object containing details about the error, such as:
   * @param {any} [props.data] - `data`: Additional data related to the error.
   * @param {Record<string, string>} [props.fieldErrors] - `fieldErrors`: A record of field-specific error messages.
   * @param {Record<string, string>} [props.fields] - `fields`: A record of field values that caused the error.
   * @param {string} [props.message] - `message`: A descriptive message explaining the error.
   */

  constructor(props: {
    data?: any;
    fieldErrors?: Record<string, string>;
    fields?: Record<string, string>;
    message?: string;
  }) {
    super();

    this.name = "UnprocessableEntity";
    this.status = 422;
    this.statusText = props.message || "Unprocessable entity";
    this.cause = {
      data: props.data,
      fieldErrors: props.fieldErrors,
      fields: props.fields,
    };

    this.onDebug();
  }

  /**
   * Converts the `UnprocessableEntity` instance into a `Response` object with a JSON body.
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
   * Converts the `UnprocessableEntity` instance into a `Response` object using the `Response.json` method.
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

export { UnprocessableEntity };
