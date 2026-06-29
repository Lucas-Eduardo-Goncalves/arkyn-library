import { useContext } from "react";
import { toastContext } from "../providers/toastProvider";

/**
 * useToast — reads `ToastProvider` context to display toast notifications.
 *
 * @returns Context containing `showToast(options)`.
 *
 * @throws If called outside a `ToastProvider`.
 *
 * @example
 * ```tsx
 * const { showToast } = useToast();
 *
 * // After a successful save
 * showToast({ message: "Changes saved!", type: "success" });
 *
 * // After a failed request
 * showToast({ message: "Failed to save changes.", type: "danger" });
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
