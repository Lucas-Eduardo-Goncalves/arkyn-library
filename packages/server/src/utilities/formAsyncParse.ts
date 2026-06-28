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
 * Async variant of `formParse` — uses `safeParseAsync` to support Zod schemas with async refinements.
 * Returns `{ success: true, data }` on success or `{ success: false, fieldErrors, fields }` on failure.
 *
 * @param formData - The raw form data object to validate.
 * @param schema - The Zod schema to validate against.
 *
 * @example
 * ```typescript
 * const schema = z.object({ email: z.string().email() });
 * const result = await formAsyncParse([{ email: "bad" }, schema]);
 *
 * if (!result.success) {
 *   console.log(result.fieldErrors); // { email: "Invalid email" }
 * }
 * ```
 */

async function formAsyncParse<T extends FormParseProps>([
  formData,
  schema,
]: T): Promise<FormParseReturnType<T>> {
  const zodResponse = await schema.safeParseAsync(formData);

  if (zodResponse.success === false) {
    const errorsObject = Object.fromEntries(
      zodResponse.error.issues.map((item) => {
        return [item.path.join("."), item.message];
      }),
    );

    return {
      success: false,
      fieldErrors: errorsObject,
      fields: formData,
    };
  } else {
    return {
      success: true,
      data: zodResponse.data as T[1] extends ZodType<infer U> ? U : never,
    };
  }
}

export { formAsyncParse };
