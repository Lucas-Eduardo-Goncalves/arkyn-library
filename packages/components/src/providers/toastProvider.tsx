import { createContext, ReactNode } from "react";
import toast, { Toaster } from "react-hot-toast";

type ToastProps = {
  message: string;
  type: "success" | "danger";
};

type ToastContextProps = {
  showToast(toast: ToastProps): void;
};

type ToastProviderProps = {
  children: ReactNode;
};

const toastContext = createContext({} as ToastContextProps);

/**
 * ToastProvider component - provides toast context for managing toast notifications
 *
 * @param props - ToastProvider component properties
 * @param props.children - React elements that will have access to the toast context
 *
 * @returns ToastProvider JSX element that wraps children with toast context
 *
 * @example
 * Basic usage:
 * ```tsx
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * ```
 *
 * @example
 * Using toast in component:
 * ```tsx
 * function MyComponent() {
 *   const { showToast } = useToast();
 *
 *   const handleClick = () => {
 *     showToast({
 *       message: 'Success!',
 *       type: 'success'
 *     });
 *   };
 *
 *   return <button onClick={handleClick}>Show Toast</button>;
 * }
 * ```
 */

function ToastProvider({ children }: ToastProviderProps) {
  function showToast(props: ToastProps) {
    switch (props.type) {
      case "success":
        return toast.success(props.message, {
          style: {
            background: "#10B981",
            color: "#ffffff",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: 600,
          },
          iconTheme: {
            primary: "#059669",
            secondary: "#ffffff",
          },
        });
      case "danger":
        return toast.error(props.message, {
          style: {
            background: "#E11D48",
            color: "#ffffff",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: 600,
          },
          iconTheme: {
            primary: "#BE123C",
            secondary: "#ffffff",
          },
        });
    }
  }

  return (
    <toastContext.Provider value={{ showToast }}>
      <Toaster
        position="top-right"
        containerStyle={{ zIndex: 999999999999999 }}
      />
      {children}
    </toastContext.Provider>
  );
}

export { toastContext, ToastProvider };
