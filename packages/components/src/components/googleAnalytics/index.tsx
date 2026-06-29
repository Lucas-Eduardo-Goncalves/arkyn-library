import type { JSX } from "react";
import { ClientOnly } from "../clientOnly";
import { GoogleAnalyticsClient } from "./googleAnalytics.client";

type GoogleAnalyticsProps = {
	/** Google Analytics 4 Measurement ID (e.g. `"G-XXXXXXXXXX"`). Required. */
	measurementId: string;
	/** When true, renders the GA4 snippet in development mode (bypasses the production check). @default false */
	showInDevMode?: boolean;
};

/**
 * GoogleAnalytics — injects the Google Analytics 4 script into the page client-side.
 *
 * Renders nothing in development mode unless `showInDevMode` is `true`.
 * Wrapped in `ClientOnly` to avoid SSR errors.
 *
 * @param props.measurementId - GA4 Measurement ID (e.g. `"G-XXXXXXXXXX"`). Required.
 * @param props.showInDevMode - Renders in development mode. Default: false
 *
 * @returns GoogleAnalytics JSX element, or an empty fragment in dev mode.
 *
 * @example
 * ```tsx
 * // In your root layout
 * <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
 *
 * // Enable in development for testing
 * <GoogleAnalytics measurementId="G-XXXXXXXXXX" showInDevMode />
 * ```
 */

function GoogleAnalytics(props: GoogleAnalyticsProps): JSX.Element {
	const { measurementId, showInDevMode = false } = props;

	if (process.env.NODE_ENV !== "production" && !showInDevMode) {
		return <></>;
	}

	return (
		<ClientOnly>
			{() => <GoogleAnalyticsClient measurementId={measurementId} />}
		</ClientOnly>
	);
}

export { GoogleAnalytics };
