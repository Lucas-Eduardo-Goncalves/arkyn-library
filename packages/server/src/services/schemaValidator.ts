import { ZodType, z } from "zod";

import { ServerError } from "../http/badResponses/serverError";
import { UnprocessableEntity } from "../http/badResponses/unprocessableEntity";
import { formAsyncParse } from "./formAsyncParse";
import { formParse } from "./formParse";
import { getCaller } from "./getCaller";

function formatErrorMessage(error: z.ZodError) {
  const title = "Error validating:";
  const lines = error.issues.map(
    ({ path, message }) => `-> ${path.join(".")}: ${message}`
  );

  return [title, ...lines].join("\n");
}

/**
 * A schema validator class that provides multiple validation methods for Zod schemas.
 *
 * @template T - A type that extends ZodType.
 *
 * @example
 * ```typescript
 * import { z } from "zod";
 *
 * const userSchema = z.object({
 *   name: z.string().min(1, "Name is required"),
 *   email: z.string().email("Invalid email"),
 *   age: z.number().min(18, "Must be at least 18")
 * });
 *
 * const validator = new SchemaValidator(userSchema);
 *
 * // Check if data is valid without throwing
 * const isValid = validator.isValid({ name: "John", email: "john@example.com", age: 25 });
 *
 * // Validate and throw ServerError on failure
 * try {
 *   const validData = validator.validate({ name: "John", email: "john@example.com", age: 25 });
 * } catch (error) {
 *   console.error(error.message);
 * }
 *
 * // Form validation with UnprocessableEntity error
 * try {
 *   const formData = validator.formValidate(requestBody);
 * } catch (error) {
 *   // Returns structured error with fieldErrors for forms
 * }
 * ```
 */
class SchemaValidator<T extends ZodType> {
  functionName: string;
  callerInfo: string;

  /**
   * Creates a new SchemaValidator instance.
   *
   * @param {T} schema - The Zod schema to use for validation.
   */
  constructor(readonly schema: T) {
    const { callerInfo, functionName } = getCaller();
    this.callerInfo = callerInfo;
    this.functionName = functionName;
  }

  /**
   * Checks if the provided data is valid according to the schema without throwing errors.
   *
   * @param {any} data - The data to validate.
   *
   * @returns {boolean} True if the data is valid, false otherwise.
   *
   * @example
   * ```typescript
   * const validator = new SchemaValidator(userSchema);
   * const isValid = validator.isValid({ name: "John", email: "invalid-email" });
   * console.log(isValid); // false
   * ```
   */
  isValid(data: any): boolean {
    return this.schema.safeParse(data).success;
  }

  /**
   * Safely validates data and returns the complete parse result without throwing errors.
   *
   * @param {any} data - The data to validate.
   *
   * @returns {z.ZodSafeParseResult<z.infer<T>>} The Zod safe parse result containing success status and data or error.
   *
   * @example
   * ```typescript
   * const validator = new SchemaValidator(userSchema);
   * const result = validator.safeValidate({ name: "", email: "john@example.com" });
   *
   * if (result.success) {
   *   console.log(result.data); // Validated data
   * } else {
   *   console.log(result.error.issues); // Validation errors
   * }
   * ```
   */
  safeValidate(data: any): z.ZodSafeParseResult<z.infer<T>> {
    return this.schema.safeParse(data);
  }

  /**
   * Validates data and returns the parsed result, throwing a ServerError on validation failure.
   *
   * @param {any} data - The data to validate.
   *
   * @returns {z.infer<T>} The validated and parsed data.
   *
   * @throws {ServerError} When validation fails, with a formatted error message.
   *
   * @example
   * ```typescript
   * const validator = new SchemaValidator(userSchema);
   *
   * try {
   *   const validUser = validator.validate({ name: "John", email: "john@example.com", age: 25 });
   *   console.log(validUser); // { name: "John", email: "john@example.com", age: 25 }
   * } catch (error) {
   *   console.error(error.message); // "Error validating:\n-> name: String must contain at least 1 character(s)"
   * }
   * ```
   */
  validate(data: any): z.infer<T> {
    try {
      return this.schema.parse(data);
    } catch (error: any) {
      throw new ServerError(formatErrorMessage(error));
    }
  }

  /**
   * Validates form data and returns the parsed result, throwing an UnprocessableEntity error on validation failure.
   * This method is specifically designed for form validation in web applications.
   *
   * @param {any} data - The form data to validate.
   * @param {string} [message] - Optional custom error message.
   *
   * @returns {z.infer<T>} The validated and parsed form data.
   *
   * @throws {UnprocessableEntity} When validation fails, with structured field errors for form handling.
   *
   * @example
   * ```typescript
   * const validator = new SchemaValidator(userSchema);
   *
   * try {
   *   const validFormData = validator.formValidate(requestBody, "User data is invalid");
   *   console.log(validFormData);
   * } catch (error) {
   *   // UnprocessableEntity with fieldErrors, fields, and scrollTo data
   *   console.log(error.fieldErrors); // { name: "Name is required", email: "Invalid email" }
   *   console.log(error.data.scrollTo); // "name" (first error field)
   * }
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
   * Asynchronously validates form data and returns the parsed result, throwing an UnprocessableEntity error on validation failure.
   * This method is the async version of formValidate, designed for form validation with async schemas.
   *
   * @param {any} data - The form data to validate.
   * @param {string} [message] - Optional custom error message.
   *
   * @returns {Promise<z.infer<T>>} A promise that resolves to the validated and parsed form data.
   *
   * @throws {UnprocessableEntity} When validation fails, with structured field errors for form handling.
   *
   * @example
   * ```typescript
   * const validator = new SchemaValidator(userSchemaWithAsyncValidation);
   *
   * try {
   *   const validFormData = await validator.formAsyncValidate(requestBody, "User data is invalid");
   *   console.log(validFormData);
   * } catch (error) {
   *   // UnprocessableEntity with fieldErrors, fields, and scrollTo data
   *   console.log(error.fieldErrors); // { name: "Name is required", email: "Invalid email" }
   *   console.log(error.data.scrollTo); // "name" (first error field)
   * }
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
