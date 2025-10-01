import { BadResponse } from "./_badResponse";

type UnprocessableEntityProps = {
  data?: any;
  fieldErrors?: Record<string, string>;
  fields?: Record<string, string>;
  message?: string;
};

/**
 * Represents an HTTP error response with a status code of 422 (Unprocessable Entity).
 * This class is used to standardize the structure of an "Unprocessable Entity" error response,
 * including the response body, headers, status, and status text.
 */

class UnprocessableEntity extends BadResponse {
  body: any;
  status: number = 422;
  statusText: string;

  /**
   * Creates an instance of the `UnprocessableEntity` class.
   *
   * @param props - An object containing details about the error, such as:
   *   - `data`: Additional data related to the error.
   *   - `fieldErrors`: A record of field-specific error messages.
   *   - `fields`: A record of field values that caused the error.
   *   - `message`: A descriptive message explaining the error.
   * @param enableDebug - A boolean indicating whether to enable debug logging for this error.
   */

  constructor(props: UnprocessableEntityProps) {
    super();

    this.statusText = props.message || "Unprocessable Entity";
    this.body = {
      name: "UnprocessableEntity",
      message: props.message || null,
      data: props.data,
      fieldErrors: props.fieldErrors,
      fields: props.fields,
    };

    this.onDebug("UnprocessableEntity", this.body, this.body);
  }

  /**
   * Converts the `UnprocessableEntity` instance into a `Response` object with a JSON body.
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
   * Converts the `UnprocessableEntity` instance into a `Response` object using the `Response.json` method.
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

export { UnprocessableEntity };
