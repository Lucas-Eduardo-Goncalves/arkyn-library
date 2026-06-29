import { ClientOnly } from "../clientOnly";
import { FacebookPixelClient } from "./facebookPixel.client";

type FacebookPixelProps = {
	/** Facebook Pixel ID from your Ads Manager account. Required. */
	pixelId: string;
	/** When true, renders the pixel in development mode (bypasses the production check). @default false */
	showInDevMode?: boolean;
	/** Pixel initialization options. */
	options?: {
		/** Enables automatic configuration. @default true */
		autoConfig?: boolean;
		/** Enables debug logging in the browser console. @default false */
		debug?: boolean;
	};
	/** When true, fires a standard `PageView` event on mount. */
	pageView?: boolean;
	/** When true, grants cookie/tracking consent via `fbq("consent", "grant")`. */
	grantConsent?: boolean;
	/** When true, revokes cookie/tracking consent via `fbq("consent", "revoke")`. */
	revokeConsent?: boolean;
	/** Standard event to track: `[eventName, eventData?]`. */
	track?: [string, any?];
	/** Custom event to track: `[eventName, eventData?]`. */
	trackCustom?: [string, any?];
	/** Single-pixel standard event: `[eventName, eventData?]`. */
	trackSingle?: [string, any?];
	/** Single-pixel custom event: `[eventName, eventData?]`. */
	trackSingleCustom?: [string, any?];
};

/**
 * FacebookPixel — injects the Facebook Pixel tracking script client-side.
 *
 * Renders nothing in development mode unless `showInDevMode` is `true`.
 * Wrapped in `ClientOnly` to avoid SSR errors.
 *
 * @param props.pixelId - Facebook Pixel ID. Required.
 * @param props.showInDevMode - Renders in development mode. Default: false
 * @param props.pageView - Fires a `PageView` event on mount.
 * @param props.grantConsent - Grants tracking consent.
 * @param props.revokeConsent - Revokes tracking consent.
 * @param props.track - Standard event to fire: `[eventName, params?]`.
 * @param props.trackCustom - Custom event to fire: `[eventName, params?]`.
 *
 * @returns Empty fragment in dev mode; otherwise the pixel script component.
 *
 * @example
 * ```tsx
 * // Basic page view tracking in root layout
 * <FacebookPixel pixelId="123456789012345" pageView />
 *
 * // With LGPD consent handling
 * <FacebookPixel
 *   pixelId="123456789012345"
 *   pageView
 *   grantConsent={userAcceptedCookies}
 * />
 *
 * // Track a purchase event
 * <FacebookPixel
 *   pixelId="123456789012345"
 *   track={["Purchase", { value: 99.90, currency: "BRL" }]}
 * />
 * ```
 */
function FacebookPixel(props: FacebookPixelProps) {
	if (process.env.NODE_ENV !== "production" && !props.showInDevMode) {
		return <></>;
	}

	return <ClientOnly>{() => <FacebookPixelClient {...props} />}</ClientOnly>;
}

export { FacebookPixel, type FacebookPixelProps };
