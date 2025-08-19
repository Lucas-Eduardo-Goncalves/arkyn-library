import { ReactNode, createContext, cloneElement, isValidElement } from "react";

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
 * FormProvider component - provides form context including field errors to child components
 *
 * @param props - FormProvider component properties
 * @param props.children - React elements that will have access to the form context
 * @param props.fieldErrors - Object containing validation errors indexed by field name
 * @param props.form - Optional form element to wrap the children with
 *
 * @returns FormProvider JSX element that wraps children with form context
 *
 * @example
 * ```tsx
 * // Basic form provider with field errors
 * function App() {
 *   const errors = {
 *     email: "Invalid email format",
 *     password: "Password is required"
 *   };
 *
 *   return (
 *     <FormProvider fieldErrors={errors}>
 *       <Input name="email" label="Email" />
 *       <Input name="password" label="Password" type="password" />
 *     </FormProvider>
 *   );
 * }
 *
 * // Form provider with custom form element
 * function FormWithValidation() {
 *   const [errors, setErrors] = useState({});
 *
 *   const handleSubmit = (e) => {
 *     e.preventDefault();
 *     // validation logic
 *   };
 *
 *   return (
 *     <FormProvider
 *       fieldErrors={errors}
 *       form={<form onSubmit={handleSubmit} />}
 *     >
 *       <Input name="username" label="Username" />
 *       <Button type="submit">Submit</Button>
 *     </FormProvider>
 *   );
 * }
 *
 * // Using with useForm hook
 * function FormField() {
 *   const { fieldErrors } = useForm();
 *
 *   return (
 *     <Input
 *       name="email"
 *       label="Email"
 *       errorMessage={fieldErrors?.email}
 *     />
 *   );
 * }
 * ```
 */

function FormProvider(props: FormProviderProps) {
  const { children, fieldErrors, form } = props;

  return (
    <formContext.Provider value={{ fieldErrors }}>
      {!form && children}
      {form && cloneElement(form, form.props, children)}
    </formContext.Provider>
  );
}

export { formContext, FormProvider };
