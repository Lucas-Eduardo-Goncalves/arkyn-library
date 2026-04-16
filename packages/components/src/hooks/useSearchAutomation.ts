import { useEffect } from "react";

import { useModal } from "./useModal";
import { useToast } from "./useToast";
import { badResponses } from "../templates/badResponses";
import { successResponses } from "../templates/successResponses";
import { useScopedParams } from "./useScopedParams";

/**
 * Hook for automating actions based on form response data.
 *
 * This hook automates the closing of modals and the display of toast notifications
 * based on the properties provided in the form response data object.
 *
 * @param {string} searchString - Raw search parameters string containing automation data
 * properties (e.g., "closeModal=true&message=Success!&type=success"). This string is typically obtained from the URL's search parameters.
 * @param {string} [scope=""] - Optional scope prefix for parameters. When provided, parameters will be prefixed with "scope:". Default: ""
 *
 * @example
 * ```tsx
 * // Complete usage with success notification
 * const responseData = "closeModal=true&message=Operation%20completed%20successfully!&type=success";
 * useSearchAutomation(responseData);
 * ```
 *
 * @example
 * ```tsx
 * // Close modal only
 * const responseData = "closeModal=true";
 * useSearchAutomation(responseData);
 * ```
 *
 * @example
 * ```tsx
 * // Display error notification
 * const responseData = "message=Error%20processing%20request&type=danger";
 * useSearchAutomation(responseData);
 * ```
 *
 * @example
 * ```tsx
 * // Using scope for parameters
 * const responseData = "filters:closeModal=true&filters:message=Filtered%20successfully!&filters:type=success";
 * useSearchAutomation(responseData, 'filters');
 * ```
 *
 * @remarks
 * - The `closeModal` parameter should be set to "true" to trigger modal closing.
 * - The `message` parameter contains the text to be displayed in the toast notification.
 * - The `type` parameter determines the style of the toast and can be either "success" or "danger".
 * - If the `name` parameter matches any entry in the `badResponses` template, a danger toast will be shown regardless of the `type` parameter.
 * - If the `name` parameter matches any entry in the `successResponses` template, a success toast will be shown regardless of the `type` parameter.
 * - This hook relies on URL search parameters, so it is typically used in conjunction with React Router or similar routing libraries that manage URL state.
 */

function useSearchAutomation(searchString: string, scope: string = "") {
  const { closeAll } = useModal();
  const { showToast } = useToast();

  const { getParam } = useScopedParams(searchString, scope);

  const closeModal = getParam("closeModal") === "true";
  const message = getParam("message");
  const name = getParam("name");
  const type = getParam("type") as "success" | "danger" | null;

  useEffect(() => {
    if (closeModal) closeAll();
    if (message) {
      if (type === "success") showToast({ message, type: "success" });
      if (type === "danger") showToast({ message, type: "danger" });

      if (
        name &&
        badResponses.includes(name) &&
        !badResponses.includes(message)
      ) {
        showToast({ message, type: "danger" });
      }

      if (
        name &&
        successResponses.includes(name) &&
        !successResponses.includes(message)
      ) {
        showToast({ message, type: "success" });
      }
    }
  }, [closeModal, message, name, type]);
}

export { useSearchAutomation };
