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
 * Validates form data against a Zod schema synchronously.
 * Returns `{ success: true, data }` on success or `{ success: false, fieldErrors, fields }` on failure.
 *
 * @param formData - The raw form data object to validate.
 * @param schema - The Zod schema to validate against.
 *
 * @example
 * ```typescript
 * const schema = z.object({ name: z.string().min(1, "Required"), age: z.number().min(18) });
 * const result = formParse([{ name: "", age: 15 }, schema]);
 *
 * if (!result.success) {
 *   console.log(result.fieldErrors); // { name: "Required", age: "..." }
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

export { formParse };
