import type { ZodType } from "zod";

type SuccessResponse<T extends FormParseProps> = {
  success: true;
  data: T[1] extends ZodType<infer U> ? U : never;
};

type ErrorResponse = {
  success: false;
  fields: { [x: string]: string };
  fieldErrors: { [x: string]: string };
};

type FormParseProps = [formData: { [k: string]: any }, schema: ZodType];

type FormParseReturnType<T extends FormParseProps> =
  | SuccessResponse<T>
  | ErrorResponse;

/**
 * Parses form data using a Zod schema and returns the result.
 *
 * @template T - A type that extends `FormParseProps`.
 *
 * @param {T} param0 - An array containing the form data and the Zod schema.
 * @param {T[0]} param0[0] - The form data to be validated.
 * @param {T[1]} param0[1] - The Zod schema used for validation.
 *
 * @returns {FormParseReturnType<T>} An object containing the validation result.
 * - If validation fails, it includes:
 *   - `success`: A boolean indicating the validation status (false).
 *   - `fieldErrors`: An object mapping field names to their respective error messages.
 *   - `fields`: The original form data.
 * - If validation succeeds, it includes:
 *   - `success`: A boolean indicating the validation status (true).
 *   - `data`: The parsed and validated data.
 *
 * @example
 * ```typescript
 * import { z } from "zod";
 *
 * const schema = z.object({
 *   name: z.string().min(1, "Name is required"),
 *   age: z.number().min(18, "Must be at least 18"),
 * });
 *
 * const formData = { name: "", age: 17 };
 *
 * const result = formParse([formData, schema]);
 *
 * if (!result.success) {
 *   console.log(result.fieldErrors); // { name: "Name is required", age: "Must be at least 18" }
 * } else {
 *   console.log(result.data); // Parsed data
 * }
 * ```
 */

function formParse<T extends FormParseProps>([
  formData,
  schema,
]: T): FormParseReturnType<T> {
  const zodResponse = schema.safeParse(formData);

  if (zodResponse.success === false) {
    const errorsObject = Object.fromEntries(
      zodResponse.error.issues.map((item) => {
        return [item.path.join("."), item.message];
      })
    );

    return {
      success: zodResponse.success,
      fieldErrors: errorsObject,
      fields: formData,
    };
  } else {
    return {
      success: zodResponse.success,
      data: zodResponse.data as T[1] extends ZodType<infer U> ? U : never,
    };
  }
}

export { formParse };
