import type { ZodType, z } from "zod";

import { ServerError } from "../http/badResponses/serverError";
import { UnprocessableEntity } from "../http/badResponses/unprocessableEntity";
import { formAsyncParse } from "./formAsyncParse";
import { formParse } from "./formParse";

function formatErrorMessage(error: z.ZodError) {
  const title = "Error validating:";
  const lines = error.issues.map(
    ({ path, message }) => `-> ${path.join(".")}: ${message}`,
  );

  return [title, ...lines].join("\n");
}

/**
 * Wraps a Zod schema with convenience validation methods suited for server-side use:
 * - `isValid` — boolean check, no throws
 * - `safeValidate` — raw Zod result, no throws
 * - `validate` — throws `ServerError` on failure (for trusted/internal data)
 * - `formValidate` / `formAsyncValidate` — throws `UnprocessableEntity` on failure (for user-submitted forms)
 *
 * @example
 * ```typescript
 * const validator = new SchemaValidator(z.object({ email: z.string().email() }));
 *
 * // Inside a Remix action:
 * const body = validator.formValidate(await decodeRequestBody(request));
 * ```
 */
class SchemaValidator<T extends ZodType> {
  /**
   * @param schema - The Zod schema used for all validation methods on this instance.
   */
  constructor(readonly schema: T) {}

  /**
   * Returns `true` if the data satisfies the schema, `false` otherwise. Never throws.
   *
   * @param data - The value to check.
   */
  isValid(data: any): boolean {
    return this.schema.safeParse(data).success;
  }

  /**
   * Validates data and returns the raw Zod `safeParseResult` without throwing.
   * Useful when you need access to the full error details.
   *
   * @param data - The value to validate.
   */
  safeValidate(data: any): z.ZodSafeParseResult<z.infer<T>> {
    return this.schema.safeParse(data);
  }

  /**
   * Validates data and returns the typed result, throwing `ServerError` on failure.
   * Use for validating internal/trusted data (e.g. env vars, config objects).
   *
   * @param data - The value to validate.
   * @throws `ServerError` with a formatted field-by-field error message.
   */
  validate(data: any): z.infer<T> {
    try {
      return this.schema.parse(data);
    } catch (error: any) {
      throw new ServerError(formatErrorMessage(error));
    }
  }

  /**
   * Validates form data and returns the typed result, throwing `UnprocessableEntity` on failure.
   * The error includes `fieldErrors`, `fields`, and `data.scrollTo` (first failing field name).
   *
   * @param data - The raw form data to validate.
   * @param message - Optional human-readable error message for the 422 response.
   * @throws `UnprocessableEntity` with structured field errors for client-side form handling.
   *
   * @example
   * ```typescript
   * const validator = new SchemaValidator(registerSchema);
   * const body = validator.formValidate(await decodeRequestBody(request));
   * ```
   */
  formValidate(data: any, message?: string): z.infer<T> {
    const formParsed = formParse([data, this.schema]);

    if (!formParsed.success) {
      const firstErrorKey = Object.keys(formParsed.fieldErrors)[0];

      throw new UnprocessableEntity({
        fields: formParsed.fields,
        fieldErrors: formParsed.fieldErrors,
        data: { scrollTo: firstErrorKey },
        message,
      });
    }

    return formParsed.data as z.infer<T>;
  }

  /**
   * Async version of `formValidate` for schemas with async refinements (e.g. uniqueness checks).
   *
   * @param data - The raw form data to validate.
   * @param message - Optional human-readable error message for the 422 response.
   * @throws `UnprocessableEntity` with structured field errors for client-side form handling.
   *
   * @example
   * ```typescript
   * const validator = new SchemaValidator(registerSchema);
   * const body = await validator.formAsyncValidate(await decodeRequestBody(request));
   * ```
   */
  async formAsyncValidate(data: any, message?: string): Promise<z.infer<T>> {
    const formParsed = await formAsyncParse([data, this.schema]);

    if (!formParsed.success) {
      const firstErrorKey = Object.keys(formParsed.fieldErrors)[0];

      throw new UnprocessableEntity({
        fields: formParsed.fields,
        fieldErrors: formParsed.fieldErrors,
        data: { scrollTo: firstErrorKey },
        message,
      });
    }

    return formParsed.data as z.infer<T>;
  }
}

export { SchemaValidator };
