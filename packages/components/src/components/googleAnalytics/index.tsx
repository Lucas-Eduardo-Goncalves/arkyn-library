import { JSX } from "react";
import { ClientOnly } from "../clientOnly";
import { GoogleAnalyticsClient } from "./googleAnalytics.client";

type GoogleAnalyticsProps = {
  measurementId: string;
  showInDevMode?: boolean;
};

/**
 * GoogleAnalytics component - injects Google Analytics 4 snippets into the page
 *
 * @param props - GoogleAnalytics component properties
 * @param {string} props.measurementId - Google Analytics 4 Measurement ID (for example: "G-XXXXXXXXXX")
 * @param {boolean} [props.showInDevMode] - If true, renders in development mode. Default: false
 *
 * @returns {JSX.Element} GoogleAnalytics JSX element
 *
 * @example
 * ```tsx
 * // Basic GA4 setup
 * <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
 *
 * // GA4 in development mode
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
