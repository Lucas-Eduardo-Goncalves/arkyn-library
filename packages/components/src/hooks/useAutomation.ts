import { useEffect } from "react";

import { useModal } from "./useModal";
import { useToast } from "./useToast";

/**
 * Hook for automating actions based on form data.
 *
 * This hook automates the closing of modals and the display of giveaways
 * based on the properties provided in the formResponseData object.
 *
 * @param {Object} formResponseData - Object containing form data for automation
 * @param {boolean} [formResponseData.closeModal] - If true, closes all open modals
 * @param {string} [formResponseData.message] - Message to be displayed in the giveaway
 * @param {"success" | "danger"} [formResponseData.type] - Type of giveaway to be displayed
 *
 * @example
 * ```tsx
 * // Basic usage example
 * const formResponseData = {
 *   closeModal: true,
 *   message: "Operation successfully completed!",
 *   type: "success"
 * };
 *
 * useAutomation(formResponseData);
 * ```
 *
 * @example
 * ```tsx
 * // Use with only modal closing
 * const formResponseData = {
 *   closeModal: true
 * };
 *
 * useAutomation(formResponseData);
 * ```
 *
 * @example
 * ```tsx
 * // Use with only error message display
 * const formResponseData = {
 *   message: "Error processing request",
 *   type: "danger" // "success" | "danger"
 * };
 *
 * useAutomation(formResponseData);
 * ```
 */

function useAutomation(formResponseData: any) {
  const { closeAll } = useModal();
  const { showToast } = useToast();

  const closeModal = formResponseData?.closeModal;
  const message = formResponseData?.message;
  const type = formResponseData?.type;

  useEffect(() => {
    if (closeModal) closeAll();
    if (message && type === "success") showToast({ message, type: "success" });
    if (message && type === "danger") showToast({ message, type: "danger" });
  }, [formResponseData]);
}

export { useAutomation };
