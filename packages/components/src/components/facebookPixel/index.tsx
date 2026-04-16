import { ClientOnly } from "../clientOnly";
import { FacebookPixelClient } from "./facebookPixel.client";

type FacebookPixelProps = {
  pixelId: string;
  showInDevMode?: boolean;
  options?: {
    autoConfig?: boolean;
    debug?: boolean;
  };
  pageView?: boolean;
  grantConsent?: boolean;
  revokeConsent?: boolean;
  track?: [string, any?];
  trackCustom?: [string, any?];
  trackSingle?: [string, any?];
  trackSingleCustom?: [string, any?];
};

function FacebookPixel(props: FacebookPixelProps) {
  if (process.env.NODE_ENV !== "production" && !props.showInDevMode) {
    return <></>;
  }

  return <ClientOnly>{() => <FacebookPixelClient {...props} />}</ClientOnly>;
}

export { FacebookPixel, type FacebookPixelProps };
