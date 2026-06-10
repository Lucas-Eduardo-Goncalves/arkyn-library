import { useEffect } from "react";
import { scroller } from "react-scroll";

import { useModal } from "./useModal";
import { useToast } from "./useToast";
import { badResponses } from "../templates/badResponses";
import { successResponses } from "../templates/successResponses";

/**
 * Executes UI automations based on a form response payload.
 *
 * Current behaviors:
 * - Closes all open modals when `closeModal` is `true`.
 * - Scrolls to a target element when `cause.data.scrollTo` is provided.
 * - Shows a toast according to response `name`, `message`, and `cause.fieldErrors`.
 *
 * Toast rules:
 * - Success responses (`successResponses`) show a success toast with `message`.
 * - Bad responses (`badResponses`) show a danger toast.
 * - When `cause.fieldErrors` exists, the first field error message has priority.
 * - The message `"Unprocessable entity"` is intentionally ignored.
 *
 * @param {any} formResponseData Response payload used to trigger automations.
 * @param {boolean} [formResponseData.closeModal] Closes all modals when `true`.
 * @param {string} [formResponseData.message] Message used in toast notifications.
 * @param {string} [formResponseData.name] Response identifier used to classify success/error.
 * @param {Object} [formResponseData.cause] Additional payload metadata.
 * @param {Object} [formResponseData.cause.data] Additional response data.
 * @param {string} [formResponseData.cause.data.scrollTo] Scroll target name for `react-scroll`.
 * @param {Record<string, string>} [formResponseData.cause.fieldErrors] Field-level error messages.
 *
 * @example
 * ```tsx
 * useAutomation({
 *   closeModal: true,
 *   name: "created",
 *   message: "Saved successfully"
 * });
 * ```
 *
 * @example
 * ```tsx
 * useAutomation({
 *   name: "validation_error",
 *   message: "Invalid payload",
 *   cause: {
 *     data: { scrollTo: "email" },
 *     fieldErrors: { email: "E-mail is required" }
 *   }
 * });
 * ```
 */

function useAutomation(formResponseData: any) {
  const { closeAll } = useModal();
  const { showToast } = useToast();

  const closeModal = formResponseData?.closeModal;
  const message = formResponseData?.message;
  const name = formResponseData?.name;
  const scrollTo = formResponseData?.cause?.data?.scrollTo;
  const firstErrorField = formResponseData?.cause?.fieldErrors
    ? (Object.values(formResponseData?.cause?.fieldErrors)[0] as string)
    : null;

  function fireToast() {
    if (!message && !firstErrorField) return;

    if (successResponses.includes(name))
      return showToast({ message, type: "success" });

    if (!badResponses.includes(name)) return;
    if (!!firstErrorField)
      return showToast({ message: firstErrorField, type: "danger" });

    if (message === "Unprocessable entity") return;
    return showToast({ message, type: "danger" });
  }

  useEffect(() => {
    if (closeModal) closeAll();
    if (scrollTo) scroller.scrollTo(scrollTo, { smooth: true, offset: 20 });
    fireToast();
  }, [formResponseData]);
}

export { useAutomation };
