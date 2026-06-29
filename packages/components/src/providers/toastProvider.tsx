import { createContext, type ReactNode } from "react";
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
 * ToastProvider — mounts a `react-hot-toast` `<Toaster>` and exposes `showToast` via context.
 *
 * Wrap your app once. Then call `useToast()` anywhere in the tree to show notifications.
 * Supports two types: `"success"` (green) and `"danger"` (red).
 *
 * @param props.children - App subtree that will have access to `useToast`.
 *
 * @returns ToastProvider JSX element.
 *
 * @example
 * ```tsx
 * // In your root layout
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 *
 * // Anywhere in the tree
 * const { showToast } = useToast();
 * showToast({ message: "Order placed!", type: "success" });
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

export { ToastProvider, toastContext };
