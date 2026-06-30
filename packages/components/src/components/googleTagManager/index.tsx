import { ClientOnly } from "../clientOnly";
import { GoogleTagManagerClient } from "./googleTagManager.client";

type GoogleTagManagerProps = {
	/** Google Tag Manager container ID (e.g. `"GTM-XXXXXXX"`). Required. */
	gtmId: string;
	/** Additional key-value pairs pushed to the dataLayer on initialization. */
	events?: Record<string, string>;
	/** Initial key-value pairs added to the dataLayer before GTM loads. */
	dataLayer?: Record<string, string>;
	/** Global variable name for the dataLayer array. @default "dataLayer" */
	dataLayerName?: string;
	/** GTM environment auth token (for staging/testing environments). */
	auth?: string;
	/** GTM environment preview token (e.g. `"env-3"`). */
	preview?: string;
	/** When true, renders the GTM snippet in development mode (bypasses the production check). @default false */
	showInDevMode?: boolean;
};

/**
 * GoogleTagManager — injects the GTM `<script>` and `<noscript>` snippets into the page client-side.
 *
 * Renders nothing in development mode unless `showInDevMode` is `true`.
 * Wrapped in `ClientOnly` to avoid SSR errors.
 *
 * @param props.gtmId - GTM container ID (e.g. `"GTM-XXXXXXX"`). Required.
 * @param props.dataLayer - Initial key-value pairs for the dataLayer.
 * @param props.dataLayerName - Global dataLayer variable name. Default: "dataLayer"
 * @param props.events - Additional key-value pairs pushed on initialization.
 * @param props.auth - GTM environment auth token.
 * @param props.preview - GTM environment preview token (e.g. `"env-3"`).
 * @param props.showInDevMode - Renders in development mode. Default: false
 *
 * @returns GoogleTagManager JSX element, or an empty fragment in dev mode.
 *
 * @example
 * ```tsx
 * // Basic setup in your root layout
 * <GoogleTagManager gtmId="GTM-XXXXXXX" />
 *
 * // With initial dataLayer values
 * <GoogleTagManager
 *   gtmId="GTM-XXXXXXX"
 *   dataLayer={{ pageType: "home", userType: "anonymous" }}
 * />
 *
 * // Staging/preview environment
 * <GoogleTagManager
 *   gtmId="GTM-XXXXXXX"
 *   auth="your-auth-token"
 *   preview="env-3"
 *   showInDevMode
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
		return null;
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
