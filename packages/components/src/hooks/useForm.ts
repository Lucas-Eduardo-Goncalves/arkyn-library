import { useContext } from "react";
import { formContext } from "../providers/formProvider";

/**
 * useForm — reads the nearest `FormProvider` context to access field-level validation errors.
 *
 * All form inputs (`Input`, `Select`, `Checkbox`, etc.) call this hook internally,
 * so you rarely need it directly. Use it when you want to read errors outside of
 * an input component, or build a custom input.
 *
 * @returns Form context containing:
 * - `fieldErrors` — `Record<string, string>` mapping field names to error messages.
 *
 * @example
 * ```tsx
 * // Wrapping a form with FormProvider
 * function App() {
 *   return (
 *     <FormProvider fieldErrors={{ email: "Invalid email" }}>
 *       <MyForm />
 *     </FormProvider>
 *   );
 * }
 *
 * // Reading errors manually
 * function CustomField() {
 *   const { fieldErrors } = useForm();
 *   return <span>{fieldErrors?.username}</span>;
 * }
 * ```
 */

function useForm() {
	const context = useContext(formContext);
	return context;
}

export { useForm };
