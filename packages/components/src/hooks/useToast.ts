import { toastContext } from "../providers/toastProvider";
import { useContext } from "react";

/**
 * Custom hook to access toast functionality from ToastProvider context
 *
 * @returns Object containing toast methods and state
 * @returns {function} showToast - Function to display toast notifications
 *
 * @throws {Error} Throws an error if used outside of ToastProvider
 *
 * @example
 * Basic usage:
 * ```tsx
 * function MyComponent() {
 *   const { showToast } = useToast();
 *
 *   const handleSuccess = () => {
 *     showToast({
 *       message: 'Operation completed successfully!',
 *       type: 'success'
 *     });
 *   };
 *
 *   const handleError = () => {
 *     showToast({
 *       message: 'Something went wrong!',
 *       type: 'danger'
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleSuccess}>Success Toast</button>
 *       <button onClick={handleError}>Error Toast</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * Using in async operations:
 * ```tsx
 * function FormComponent() {
 *   const { showToast } = useToast();
 *
 *   const handleSubmit = async (data) => {
 *     try {
 *       await submitForm(data);
 *       showToast({
 *         message: 'Form submitted successfully!',
 *         type: 'success'
 *       });
 *     } catch (error) {
 *       showToast({
 *         message: 'Failed to submit form',
 *         type: 'danger'
 *       });
 *     }
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */

function useToast() {
  const contextData = useContext(toastContext);

  if (Object.entries(contextData).length === 0) {
    throw new Error("useToast must be used within a Provider");
  }

  return contextData;
}

export { useToast };
