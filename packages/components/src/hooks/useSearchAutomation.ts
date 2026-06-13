import { useEffect } from "react";

import { useModal } from "./useModal";
import { useToast } from "./useToast";
import { badResponses } from "../templates/badResponses";
import { successResponses } from "../templates/successResponses";
import { useScopedParams } from "./useScopedParams";

/**
 * useSearchAutomation — URL-driven version of `useAutomation`. Reads automation params from a
 * URL search string and executes the same side-effects (close modals, toast) on every change.
 *
 * Reads the following params (optionally prefixed by `scope:`):
 * - `closeModal=true` — closes all open modals.
 * - `message` — text for the toast notification.
 * - `type` — `"success"` or `"danger"` toast style.
 * - `name` — response identifier matched against `successResponses`/`badResponses` lists.
 *
 * @param searchString - Raw URL search string (e.g. `location.search`).
 * @param scope - Optional prefix for all params. Default: `""` (no prefix).
 *
 * @example
 * ```tsx
 * // Remix / Next.js Server Action that redirects with search params
 * // redirect("?closeModal=true&message=Saved!&type=success")
 * const [searchParams] = useSearchParams();
 * useSearchAutomation(searchParams.toString());
 * ```
 *
 * @example
 * ```tsx
 * // Scoped params — avoids collisions when multiple features share the URL
 * // redirect("?filters:closeModal=true&filters:message=Applied!&filters:type=success")
 * useSearchAutomation(location.search, "filters");
 * ```
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
