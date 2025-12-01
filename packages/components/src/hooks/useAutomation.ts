import { useEffect } from "react";

import { useModal } from "./useModal";
import { useToast } from "./useToast";
import { badResponses } from "../templates/badResponses";
import { successResponses } from "../templates/successResponses";

/**
 * Hook for automating actions based on form response data.
 *
 * This hook automates the closing of modals and the display of toast notifications
 * based on the properties provided in the form response data object.
 *
 * @param {Object} formResponseData - Object containing form response data for automation
 * @param {boolean} [formResponseData.closeModal] - If true, closes all open modals
 * @param {string} [formResponseData.message] - Message to be displayed in the toast notification
 * @param {string} [formResponseData.name] - Response name used to check against known error responses
 * @param {"success" | "danger"} [formResponseData.type] - Type of toast notification to be displayed
 *
 * @example
 * ```tsx
 * // Complete usage with success notification
 * const responseData = {
 *   closeModal: true,
 *   message: "Operation completed successfully!",
 *   type: "success"
 * };
 *
 * useAutomation(responseData);
 * ```
 *
 * @example
 * ```tsx
 * // Close modal only
 * useAutomation({ closeModal: true });
 * ```
 *
 * @example
 * ```tsx
 * // Display error notification
 * useAutomation({
 *   message: "Error processing request",
 *   type: "danger"
 * });
 * ```
 */

function useAutomation(formResponseData: any) {
  const { closeAll } = useModal();
  const { showToast } = useToast();

  const closeModal = formResponseData?.closeModal;
  const message = formResponseData?.message;
  const name = formResponseData?.name;
  const type = formResponseData?.type;

  useEffect(() => {
    if (closeModal) closeAll();
    if (message) {
      if (type === "success") showToast({ message, type: "success" });
      if (type === "danger") showToast({ message, type: "danger" });
      if (badResponses.includes(name)) showToast({ message, type: "danger" });
      if (successResponses.includes(name))
        showToast({ message, type: "success" });
    }
  }, [formResponseData]);
}

export { useAutomation };
