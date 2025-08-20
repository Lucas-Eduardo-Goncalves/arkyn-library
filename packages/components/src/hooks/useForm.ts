import { useContext } from "react";
import { formContext } from "../providers/formProvider";

/**
 * useForm hook - provides access to form context data including field errors
 *
 * @returns Form context object containing:
 * - `fieldErrors`: Object with field validation errors indexed by field name
 *
 * @example
 * ```tsx
 * // Basic usage in a component
 * function MyComponent() {
 *   const { fieldErrors } = useForm();
 *
 *   return (
 *     <Input
 *       name="email"
 *       errorMessage={fieldErrors?.email}
 *     />
 *   );
 * }
 *
 * // Usage with FormProvider
 * function App() {
 *   const errors = { email: "Invalid email format" };
 *
 *   return (
 *     <FormProvider fieldErrors={errors}>
 *       <MyForm />
 *     </FormProvider>
 *   );
 * }
 *
 * // Checking for specific field errors
 * function FormField() {
 *   const { fieldErrors } = useForm();
 *   const hasError = !!fieldErrors?.username;
 *
 *   return (
 *     <div>
 *       <Input name="username" />
 *       {hasError && <span>Error: {fieldErrors.username}</span>}
 *     </div>
 *   );
 * }
 * ```
 */

function useForm() {
  const context = useContext(formContext);
  return context;
}

export { useForm };
