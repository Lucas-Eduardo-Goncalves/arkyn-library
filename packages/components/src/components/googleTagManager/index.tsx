import { ClientOnly } from "../clientOnly";
import { GoogleTagManagerClient } from "./googleTagManager.client";

type GoogleTagManagerProps = {
  gtmId: string;
  events?: Record<string, string>;
  dataLayer?: Record<string, string>;
  dataLayerName?: string;
  auth?: string;
  preview?: string;
  showInDevMode?: boolean;
};

/**
 * GoogleTagManager component - injects Google Tag Manager snippets into the page
 *
 * @param props - GoogleTagManager component properties
 * @param props.gtmId - Google Tag Manager container id (for example: "GTM-XXXXXXX")
 * @param props.events - Additional GTM events payload
 * @param props.dataLayer - Initial data to populate the dataLayer
 * @param props.dataLayerName - Global dataLayer variable name. Default: "dataLayer"
 * @param props.auth - GTM environment auth token
 * @param props.preview - GTM environment preview token
 * @param props.showInDevMode - If true, renders in development mode. Default: false
 *
 * @returns GoogleTagManager JSX element
 *
 * @example
 * ```tsx
 * // Basic GTM setup
 * <GoogleTagManager gtmId="GTM-XXXXXXX" />
 *
 * // GTM with initial dataLayer values
 * <GoogleTagManager
 *  gtmId="GTM-XXXXXXX"
 *  dataLayer={{
 *    pageType: "home",
 *    userType: "anonymous",
 *  }}
 * />
 *
 * // GTM environment (staging)
 * <GoogleTagManager
 *  gtmId="GTM-XXXXXXX"
 *  auth="your-auth-token"
 *  preview="env-3"
 *  showInDevMode
 * />
 * ```
 */

function GoogleTagManager(props: GoogleTagManagerProps) {
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
        <GoogleTagManagerClient
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

export { GoogleTagManager };
