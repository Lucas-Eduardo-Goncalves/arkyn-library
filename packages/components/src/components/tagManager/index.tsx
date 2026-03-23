import { ClientOnly } from "../clientOnly";
import { TagManagerClient } from "./tagManager.client";

type TagManagerProps = {
  gtmId: string;
  events?: Record<string, string>;
  dataLayer?: Record<string, string>;
  dataLayerName?: string;
  auth?: string;
  preview?: string;
  showInDevMode?: boolean;
};

/**
 * TagManager component - injects Google Tag Manager snippets into the page
 *
 * @param props - TagManager component properties
 * @param props.gtmId - Google Tag Manager container id (for example: "GTM-XXXXXXX")
 * @param props.events - Additional GTM events payload
 * @param props.dataLayer - Initial data to populate the dataLayer
 * @param props.dataLayerName - Global dataLayer variable name. Default: "dataLayer"
 * @param props.auth - GTM environment auth token
 * @param props.preview - GTM environment preview token
 * @param props.showInDevMode - If true, renders in development mode. Default: false
 *
 * @returns TagManager JSX element
 *
 * @example
 * ```tsx
 * // Basic GTM setup
 * <TagManager gtmId="GTM-XXXXXXX" />
 *
 * // GTM with initial dataLayer values
 * <TagManager
 *  gtmId="GTM-XXXXXXX"
 *  dataLayer={{
 *    pageType: "home",
 *    userType: "anonymous",
 *  }}
 * />
 *
 * // GTM environment (staging)
 * <TagManager
 *  gtmId="GTM-XXXXXXX"
 *  auth="your-auth-token"
 *  preview="env-3"
 *  showInDevMode
 * />
 * ```
 */

function TagManager(props: TagManagerProps) {
  const {
    gtmId,
    auth = "",
    preview = "",
    dataLayerName = "dataLayer",
    events = {},
    dataLayer = {},
    showInDevMode = false,
  } = props;

  if (process.env.NODE_ENV !== "production" && !showInDevMode) {
    return <></>;
  }

  return (
    <ClientOnly>
      {() => (
        <TagManagerClient
          auth={auth}
          dataLayer={dataLayer}
          dataLayerName={dataLayerName}
          events={events}
          gtmId={gtmId}
          preview={preview}
        />
      )}
    </ClientOnly>
  );
}

export { TagManager };
