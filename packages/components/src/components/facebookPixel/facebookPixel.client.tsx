import { FacebookPixelProps } from ".";
import { FacebookPixel } from "./pixel";

function FacebookPixelClient(props: FacebookPixelProps) {
  const {
    pixelId,
    options,
    pageView,
    track,
    trackCustom,
    trackSingle,
    trackSingleCustom,
    grantConsent,
    revokeConsent,
  } = props;

  const pixel = new FacebookPixel(pixelId, options);

  pixel.init();

  if (pageView) pixel.pageView();
  if (grantConsent) pixel.grantConsent();
  if (revokeConsent) pixel.revokeConsent();

  if (track) pixel.track(...track);
  if (trackCustom) pixel.trackCustom(...trackCustom);
  if (trackSingle) pixel.trackSingle(pixelId, ...trackSingle);
  if (trackSingleCustom) pixel.trackSingleCustom(pixelId, ...trackSingleCustom);

  return <></>;
}

export { FacebookPixelClient };
