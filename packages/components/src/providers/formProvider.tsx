import { cloneElement, createContext, type ReactNode } from "react";

type FormContextProps = {
	fieldErrors: { [x: string]: any };
};

type FormProviderProps = {
	children: ReactNode;
	fieldErrors?: any;
	form?: React.ReactElement;
};

const formContext = createContext({} as FormContextProps);

/**
 * FormProvider — distributes field-level validation errors to all form input components in its subtree.
 *
 * All inputs (`Input`, `Select`, `Checkbox`, etc.) read `fieldErrors[name]` automatically,
 * so you don't need to pass errors manually to each field. Use the `form` prop to also wrap
 * children in a `<form>` element (e.g. for Remix `<Form />`).
 *
 * @param props.children - Form fields and other components.
 * @param props.fieldErrors - Map of field name → error message (e.g. from Zod / server validation).
 * @param props.form - Optional `<form>` element to wrap children in (cloned with `children`).
 *
 * @returns FormProvider JSX element.
 *
 * @example
 * ```tsx
 * // With Remix action errors
 * const actionData = useActionData<typeof action>();
 *
 * <FormProvider fieldErrors={actionData?.fieldErrors}>
 *   <Input name="email" label="Email" />
 *   <Input name="password" label="Password" type="password" />
 *   <Button type="submit">Login</Button>
 * </FormProvider>
 * ```
 */

function FormProvider(props: FormProviderProps) {
	const { children, fieldErrors, form } = props;

	return (
		<formContext.Provider value={{ fieldErrors }}>
			{!form && children}
			{form &&
				cloneElement(
					form as React.ReactElement,
					form.props as React.ReactElement,
					children,
				)}
		</formContext.Provider>
	);
}

export { FormProvider, formContext };
